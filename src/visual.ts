/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */
"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import { valueFormatter } from "powerbi-visuals-utils-formattingutils";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;

import { VisualFormattingSettingsModel } from "./settings";



// Interfaces for matrix data
interface MatrixNode {
    value?: any; // Make value optional to match DataViewMatrixNode
    children?: MatrixNode[];
    values?: any | { [id: number]: any }; // Support both array and indexed object format
    isDate?: boolean;
}
// CSS class constants
const CSS_CLASSES = {
    VISUAL_CONTAINER: "visual-container",
    TABLE_CONTAINER: "table-container",
    MATRIX_TABLE: "matrix-table",
    HOVER_ENABLED: "hover-enabled",
    ROW_HEADER: "row-header",
    COLUMN_HEADER: "column-header",
    DATA_CELL: "data-cell",
    SUBTOTAL_CELL: "subtotal-cell",
    LEVEL_0_ROW: "level-0-row",
    LEVEL_0_HEADER: "level-0-header",
    LEVEL_0_SUBTOTAL: "level-0-subtotal",
    BLANK_ROW: "blank-row",
    WITH_BORDERS: "with-borders",
    WITH_HORIZONTAL_BORDERS: "with-horizontal-borders",
    WITH_VERTICAL_BORDERS: "with-vertical-borders",
    SUBTOTAL_ROW: "subtotal-row",
    GRAND_TOTAL_ROW: "grand-total-row",
}

export class Visual implements IVisual {
    // DOM elements
    private target: HTMLElement;
    private tableDiv: HTMLDivElement;
    
    // State tracking
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    private host: powerbi.extensibility.visual.IVisualHost;
    private expandedRows: Map<string, boolean>;
    private lastOptions: VisualUpdateOptions;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.expandedRows = new Map<string, boolean>();
    
        // Create container elements
        this.createContainerElements();
    }

    private createContainerElements(): void {
        // Create main container div
        const container = document.createElement("div");
        container.className = CSS_CLASSES.VISUAL_CONTAINER;
        container.style.overflow = "hidden";
        this.target.appendChild(container);
        
        // Create table container
        this.tableDiv = document.createElement("div");
        this.tableDiv.className = CSS_CLASSES.TABLE_CONTAINER;
        this.tableDiv.style.overflow = "auto";
        this.tableDiv.style.position = "relative";
        container.appendChild(this.tableDiv);
    }

    public update(options: VisualUpdateOptions): void {
        // Store options for later re-renders
        this.lastOptions = options;
        
        // Clear previous content
        this.tableDiv.innerHTML = "";
        
        // Get formatting settings
        if (!options?.dataViews?.[0]) {
            return; // No data to display
        }
        
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews[0]
        );
        
        try {
            const dataView = options.dataViews[0];
            // Get and cache the format string
            this.cachedFormatString = this.getFormatString(dataView);
            
            // Check if we have matrix data
            if (!dataView.matrix) {
                return;
            }
            
            const matrix = dataView.matrix;
            const measureName = this.getMeasureName(dataView);
            
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
            
        } catch (error) {
            console.error("Error in update:", error);
        }
    }
    
    // Helper methods for data extraction
    private getMeasureName(dataView: DataView): string {
        // Try to get from matrix valueSources
        if (dataView.matrix?.valueSources?.[0]?.displayName) {
            return dataView.matrix.valueSources[0].displayName;
        }
        
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata?.columns) {
            const valueColumn = dataView.metadata.columns.find(col => 
                col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
                
            if (valueColumn?.displayName) {
                return valueColumn.displayName;
            }
        }
        
        return "Amount"; // Default fallback
    }

    private getFormatString(dataView: DataView): string {
        // Try to get from matrix valueSources
        if (dataView.matrix?.valueSources?.[0]?.format) {
            return dataView.matrix.valueSources[0].format;
        }
        
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata?.columns) {
            const valueColumn = dataView.metadata.columns.find(col => 
                col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
                
            if (valueColumn?.format) {
                return valueColumn.format;
            }
        }
        
        return "#,0.00"; // Default fallback format
    }

    // Generate unique ID for tracking expanded state
    private getNodeId(node: any, level: number): string {
        const value = node.value !== null && node.value !== undefined ? String(node.value) : "null";
        return `level_${level}_${value}`;
    }
    
    // Initialize expanded state for all rows
    private initializeExpandedState(rows: any[], level: number, parentId: string): void {
        if (!rows) return;
        
        for (const row of rows) {
            const nodeId = parentId + this.getNodeId(row, level);
            
            // Set to expanded if not already set (default to expanded)
            if (!this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true);
            }
            
            // Initialize children recursively
            if (row.children?.length > 0) {
                this.initializeExpandedState(row.children, level + 1, nodeId);
            }
        }
    }
    
    // Check if a node is expanded
    private isExpanded(nodeId: string): boolean {
        return this.expandedRows.get(nodeId) === true;
    }
    
    // Toggle expanded state of a node
    private toggleExpanded(nodeId: string): void {
        const isExpanded = this.isExpanded(nodeId);
        this.expandedRows.set(nodeId, !isExpanded);
        
        // Get all child rows associated with this node
        const childRows = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
        
        // Apply animations with staggered delays for wave effect
        childRows.forEach((row: HTMLElement, index: number) => {
            const rowHeight = row.offsetHeight;
            row.style.setProperty('--row-height', `${rowHeight}px`);
            
            // Calculate a staggered delay based on the row index (creates wave effect)
            const delay = index * 40; // 40ms delay between each row
            row.style.animationDelay = `${delay}ms`;
            
            if (isExpanded) {
                // Collapsing
                row.classList.add('collapsing-wave');
                row.addEventListener('animationend', () => {
                    row.classList.add('collapsed');
                    row.classList.remove('collapsing-wave');
                    row.style.animationDelay = '0ms';
                }, { once: true });
            } else {
                // Expanding
                row.classList.remove('collapsed');
                row.classList.add('expanding-wave');
                row.addEventListener('animationend', () => {
                    row.classList.remove('expanding-wave');
                    row.style.animationDelay = '0ms';
                }, { once: true });
            }
        });
    }
    
    // Main table creation method
    private createMatrixTable(matrix: powerbi.DataViewMatrix, measureName: string): void {
        // Create table
        const table = document.createElement("table");
        table.className = CSS_CLASSES.MATRIX_TABLE;
        
        // Set hover effects based on settings
        if (this.formattingSettings.generalSettings.enableHover.value) {
            table.classList.add(CSS_CLASSES.HOVER_ENABLED);
        }
        
        this.tableDiv.appendChild(table);
        
        // Check if we have rows
        if (!matrix.rows?.root) {
            return;
        }
        
        // Process columns
        const { columns, columnFormats } = this.processColumns(matrix, measureName);
        
        // Create table header
        this.createTableHeader(table, columns, columnFormats);
        
        // Create table body
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        
        // Initialize all new rows to expanded state
        if (matrix.rows.root.children) {
            this.initializeExpandedState(matrix.rows.root.children, 0, "");
        }
        
        // Render rows recursively with subtotals
        if (matrix.rows.root.children) {
            this.renderRowsWithSubtotals(table, matrix.rows.root.children, columns, 0, "");
        }
        
        // Calculate grand totals
        const grandTotals = this.calculateGrandTotals(matrix, columns);

        // Add grand total row
        this.addGrandTotalRow(table, columns, grandTotals);

        // Apply all formatting
        this.applyTableFormatting(table);
    }
    
    // Process columns data
    private processColumns(matrix: powerbi.DataViewMatrix, measureName: string): { columns: any[], columnFormats: string[] } {
        let columns: any[] = [];
        let columnFormats: string[] = [];
        
        if (matrix.columns?.root?.children) {
            columns = matrix.columns.root.children;
            
            // Extract column formats if columns are dates
            if (matrix.columns.levels?.[0]?.sources?.[0]?.format) {
                const columnSource = matrix.columns.levels[0].sources[0];
                // Use the same format for all columns if they come from the same source
                columnFormats = columns.map(() => columnSource.format);
            }
        } else {
            // If no columns, create a single column for the measure
            columns = [{ value: null }]; // Empty column header
            columnFormats = [""];
        }
        
        return { columns, columnFormats };
    }
    
    // Create table header
    private createTableHeader(table: HTMLTableElement, columns: any[], columnFormats: string[]): void {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        // Add corner cell
        const cornerCell = this.createCornerCell();
        headerRow.appendChild(cornerCell);
        
        // Add column headers
        for (let i = 0; i < columns.length; i++) {
            const columnHeader = this.createColumnHeader(columns[i], columnFormats[i]);
            headerRow.appendChild(columnHeader);
        }
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }
    
    // Create corner cell (top-left)
    private createCornerCell(): HTMLTableHeaderCellElement {
        const cornerCell = document.createElement("th");
        cornerCell.className = `${CSS_CLASSES.ROW_HEADER} ${CSS_CLASSES.COLUMN_HEADER}`;
        cornerCell.setAttribute("style", 
            "position: sticky !important; " + 
            "top: 0 !important; " + 
            "left: 0 !important; " + 
            "z-index: 1000 !important; " + 
            "background-color: #e0e0e0;"
        );

        this.applyFormatting(cornerCell, 'columnHeader');
        return cornerCell;
    }
    
    // Create column header cell
    private createColumnHeader(column: any, format: string): HTMLTableHeaderCellElement {
        const th = document.createElement("th");
        th.className = CSS_CLASSES.COLUMN_HEADER;
        
        // Apply column width
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        if (columnWidth) {
            th.style.minWidth = `${columnWidth}px`;
            th.style.width = `${columnWidth}px`;
        }
        
        // Apply formatting
        this.applyFormatting(th, 'columnHeader');
        
        // Set header text
        if (column.value !== null && column.value !== undefined) {
            // Format date headers properly
            if (column.isDate || (typeof column.value === 'object' && column.value.epochTimeStamp)) {
                th.textContent = this.formatDateValue(column.value, format || "d");
            } else {
                th.textContent = String(column.value);
            }
        } else {
            th.textContent = this.getMeasureDynamically();
        }
        
        return th;
    }
    
    // Helper method to get measure dynamically
    private getMeasureDynamically(): string {
        if (!this.lastOptions?.dataViews?.[0]) return "Amount";
        return this.getMeasureName(this.lastOptions.dataViews[0]);
    }
    
    // Format a date value
    private formatDateValue(value: any, format: string = "M/d/yyyy"): string {
        if (!value) return "";
        
        try {
            // Handle date objects stored in an object with epochTimeStamp
            if (typeof value === 'object' && value.epochTimeStamp) {
                const date = new Date(value.epochTimeStamp);
                
                // Default simple format if no format specified
                if (!format || format === "d") {
                    return date.toLocaleDateString();
                }
                
                // Extract date components
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const year = date.getFullYear();
                
                // Replace format tokens with actual values
                let formattedDate = format;
                formattedDate = formattedDate.replace(/M+/g, month.toString().padStart(2, '0'));
                formattedDate = formattedDate.replace(/d+/g, day.toString().padStart(2, '0'));
                formattedDate = formattedDate.replace(/yyyy/g, year.toString());
                formattedDate = formattedDate.replace(/yy/g, year.toString().slice(-2));
                
                return formattedDate;
            }
            
            // Handle native Date objects
            if (value instanceof Date) {
                return value.toLocaleDateString();
            }
            
            return String(value);
        } catch (error) {
            console.error("Error formatting date:", error);
            return String(value);
        }
    }
    
    // Recursive function to render rows with subtotals
    private renderRowsWithSubtotals(
        table: HTMLTableElement, 
        rows: any[], 
        columns: any[], 
        level: number = 0, 
        parentId: string = ""
    ): void {
        if (!rows?.length) return;
        
        const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        const applySubtotalToLevel0 = true;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const nodeId = parentId + this.getNodeId(row, level);
            const isExpanded = this.isExpanded(nodeId);
            const isLevel0 = level === 0;
            
            // Create row
            const tr = document.createElement("tr");
            tr.setAttribute("data-node-id", nodeId);
            tr.setAttribute("data-level", String(level));
            
            // Important: Set parent-id attribute for animation targeting
            if (parentId) {
                tr.setAttribute("data-parent-id", parentId);
            }
            
            // Add expandable-row class if this is a child row
            if (level > 0) {
                tr.classList.add("expandable-row");
                
                // Apply collapsed class based on parent's expanded state
                if (!isExpanded) {
                    tr.classList.add("collapsed");
                }
            }
            
            if (isLevel0) {
                tr.classList.add(CSS_CLASSES.LEVEL_0_ROW);
            }
            
            if (row.children?.length > 0) {
                tr.classList.add(CSS_CLASSES.SUBTOTAL_ROW);
            }

            // Add row header - always apply subtotal formatting to level0
            const rowHeader = this.createRowHeader(row, level, nodeId, isExpanded, isLevel0, true);
            tr.appendChild(rowHeader);
            
            // Add data cells
            if (row.children?.length > 0) {
                // Create subtotal cells
                this.addSubtotalCells(tr, row, columns, isLevel0, columnWidth);
            } else if (row.values) {
                // Create regular data cells
                this.addDataCells(tr, row as any, columns, columnWidth);
            }
            
            tbody.appendChild(tr);
            
            // If this node has children and is expanded, render its children
            if (row.children?.length > 0 && isExpanded) {
                this.renderRowsWithSubtotals(table, row.children, columns, level + 1, nodeId);
            }
            
            // Add blank row if needed
            this.addBlankRowIfNeeded(tbody, columns, i, rows.length, row, level);
        }
    }
    
    

    // Create a row header
    private createRowHeader(
        row: MatrixNode, 
        level: number, 
        nodeId: string, 
        isExpanded: boolean,
        isLevel0: boolean,
        applySubtotalToLevel0: boolean
    ): HTMLTableHeaderCellElement {
        const rowHeader = document.createElement("th");
        rowHeader.className = CSS_CLASSES.ROW_HEADER;
        
        if (isLevel0) {
            rowHeader.classList.add(CSS_CLASSES.LEVEL_0_HEADER);
        }
        
        // Apply row header width
        const rowHeaderWidth = this.formattingSettings.generalSettings.rowHeaderWidth.value;
        if (rowHeaderWidth) {
            rowHeader.style.minWidth = `${rowHeaderWidth}px`;
            rowHeader.style.width = `${rowHeaderWidth}px`;
        }
        
        // Create header content
        const headerContent = document.createElement("div");
        headerContent.className = "row-header-content";
        headerContent.style.marginLeft = `${level * 20}px`;
        headerContent.style.display = "flex";
        headerContent.style.alignItems = "center";

        // Add toggle button or spacer
        if (row.children?.length > 0) {
            const toggleButton = this.createToggleButton(nodeId, isExpanded);
            headerContent.appendChild(toggleButton);
        } else {
            // Add spacer for better alignment
            const spacer = document.createElement("span");
            spacer.className = "toggle-spacer";
            spacer.textContent = "  ";
            spacer.style.flexShrink = "0";
            headerContent.appendChild(spacer);
        }
        
        // Add the row label
        const label = this.createRowLabel(row);
        headerContent.appendChild(label);
        rowHeader.appendChild(headerContent);
        
        // Apply formatting based on level
        if (isLevel0 && applySubtotalToLevel0) {
            this.applyFormatting(rowHeader, 'subtotal');
        } else {
            this.applyFormatting(rowHeader, 'rowHeader');
        }
        
        return rowHeader;
    }
    
    // Create toggle button for expanding/collapsing rows
    private createToggleButton(nodeId: string, isExpanded: boolean): HTMLSpanElement {
        const toggleButton = document.createElement("span");
        toggleButton.className = "toggle-button";
        toggleButton.textContent = isExpanded ? "▼" : "►";
        toggleButton.style.flexShrink = "0";
        toggleButton.style.transition = "transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        toggleButton.style.display = "inline-block";
        
        if (isExpanded) {
            toggleButton.style.transform = "rotate(0deg)";
        } else {
            toggleButton.style.transform = "rotate(-90deg)";
        }
        
        toggleButton.onclick = (event) => {
            event.stopPropagation();
            
            // Animate the toggle button with a bouncy effect
            if (this.isExpanded(nodeId)) {
                toggleButton.style.transform = "rotate(-90deg)";
                setTimeout(() => toggleButton.textContent = "►", 150);
            } else {
                toggleButton.style.transform = "rotate(0deg)";
                setTimeout(() => toggleButton.textContent = "▼", 150);
            }
            
            this.toggleExpanded(nodeId);
        };
        
        return toggleButton;
    }
    
    // Create row label element
    private createRowLabel(row: MatrixNode): HTMLSpanElement {
        const label = document.createElement("span");
        label.className = "row-label";
        label.style.width = "100%";

        // Format date row headers properly
        if (row.isDate || (typeof row.value === 'object' && row.value.epochTimeStamp)) {
            label.textContent = this.formatDateValue(row.value);
        } else {
            label.textContent = row.value !== null && row.value !== undefined ? String(row.value) : "";
        }

        // Apply alignment
        const alignment = this.formattingSettings.rowHeaderFormatSettings.alignment?.value?.value;
        if (alignment) {
            label.style.textAlign = String(alignment);
            label.style.display = "block";
        }

        return label;
    }
    
    // Add subtotal cells to a row
    private addSubtotalCells(
        tr: HTMLTableRowElement, 
        row: MatrixNode, 
        columns: any[], 
        isLevel0: boolean,
        columnWidth: number
    ): void {
        for (let j = 0; j < columns.length; j++) {
            const td = document.createElement("td");
            td.className = `${CSS_CLASSES.DATA_CELL} ${CSS_CLASSES.SUBTOTAL_CELL}`;
            
            if (isLevel0) {
                td.classList.add(CSS_CLASSES.LEVEL_0_SUBTOTAL);
            }
            
            // Apply column width
            if (columnWidth) {
                td.style.minWidth = `${columnWidth}px`;
                td.style.width = `${columnWidth}px`;
            }
            
            // Calculate subtotal
            const subtotal = this.calculateSubtotalForColumn(row, j);
            
            // Only display non-zero subtotals
            td.textContent = subtotal !== 0 ? this.formatNumber(subtotal) : "";
            
            // Apply alignment from subtotal settings for subtotal cells
            const alignment = this.formattingSettings.subtotalFormatSettings.alignment?.value?.value;
            if (alignment !== undefined) {
                td.style.textAlign = alignment.toString();
            }
            
            tr.appendChild(td);
        }
    }
    
    // Add regular data cells to a row
    private addDataCells(
        tr: HTMLTableRowElement, 
        row: any, // Use any to handle both types
        columns: any[], 
        columnWidth: number
    ): void {
        for (let j = 0; j < columns.length; j++) {
            const td = document.createElement("td");
            td.className = CSS_CLASSES.DATA_CELL;
            
            // Apply column width
            if (columnWidth) {
                td.style.minWidth = `${columnWidth}px`;
                td.style.width = `${columnWidth}px`;
            }
            
            // Get cell value and format it
            const value = row.values[j];
            td.textContent = this.formatCellValue(value);
            
            tr.appendChild(td);
        }
    }
    
    // Add blank row if settings indicate one is needed
    private addBlankRowIfNeeded(
        tbody: HTMLTableSectionElement, 
        columns: any[], 
        currentIndex: number, 
        totalRows: number, 
        currentRow: MatrixNode,
        level: number
    ): void {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        
        // Only add blank rows if the setting is enabled
        if (!blankRowSettings.enableBlankRows.value) {
            return;
        }
        
        // Add blank row after each top-level item (level 0) except the last one
        if (level === 0 && currentIndex < totalRows - 1) {
            // Create blank row
            const blankRow = document.createElement("tr");
            blankRow.className = CSS_CLASSES.BLANK_ROW;
            
            // Set the height if specified
            const rowHeight = blankRowSettings.height.value;
            if (rowHeight > 0) {
                blankRow.style.height = `${rowHeight}px`;
            }
            
            // Create a cell that spans all columns
            const blankCell = document.createElement("td");
            blankCell.colSpan = columns.length + 1; // +1 for row header column
            
            // Apply background color from settings
            const bgColor = blankRowSettings.backgroundColor.value.value;
            if (bgColor) {
                blankCell.style.backgroundColor = bgColor;
            }
            
            // Add the cell to the row and the row to the table
            blankRow.appendChild(blankCell);
            tbody.appendChild(blankRow);
        }
    }
    
    private addBlankRowBeforeTotal(tfoot: HTMLTableSectionElement, columns: any[]): void {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        
        // Only add blank row if the setting is enabled
        if (!blankRowSettings.enableBlankRows.value) {
            return;
        }
        
        // Create blank row
        const blankRow = document.createElement("tr");
        blankRow.className = CSS_CLASSES.BLANK_ROW;
        
        // Set the height if specified
        const rowHeight = blankRowSettings.height.value;
        if (rowHeight > 0) {
            blankRow.style.height = `${rowHeight}px`;
        }
        
        // Create a cell that spans all columns
        const blankCell = document.createElement("td");
        blankCell.colSpan = columns.length + 1; // +1 for row header column
        
        // Apply background color from settings
        const bgColor = blankRowSettings.backgroundColor.value.value;
        if (bgColor) {
            blankCell.style.backgroundColor = bgColor;
        }
        
        // Add the cell to the row and the row to the table footer
        blankRow.appendChild(blankCell);
        tfoot.appendChild(blankRow);
    }

    // Format cell value based on type
    private formatCellValue(value: any): string {
        if (value === null || value === undefined) {
            return "";
        }
        
        if (typeof value === 'number') {
            return this.formatNumber(value);
        }
        
        if (typeof value === 'object') {
            // Extract value from object
            if ('value' in value) {
                const cellValue = value.value;
                if (typeof cellValue === 'number') {
                    return this.formatNumber(cellValue);
                } else if (cellValue === null || cellValue === undefined || 
                        (typeof cellValue === 'object' && Object.keys(cellValue).length === 0)) {
                    return "";
                } else {
                    return String(cellValue);
                }
            } else if (Object.keys(value).length === 0) {
                return "";
            } else {
                return JSON.stringify(value);
            }
        }
        
        return String(value);
    }
    
    // Calculate subtotal for a parent node and column
    private calculateSubtotalForColumn(parentNode: any, columnIndex: number): number {
        if (!parentNode?.children?.length) {
            return 0;
        }
        
        let total = 0;
        
        for (const child of parentNode.children) {
            if (child.children?.length > 0) {
                // Recursively get subtotals from children
                total += this.calculateSubtotalForColumn(child, columnIndex);
            } else {
                // Leaf node with values
                if (child.values?.[columnIndex]?.value !== null && 
                    child.values[columnIndex]?.value !== undefined &&
                    typeof child.values[columnIndex].value === 'number') {
                    total += child.values[columnIndex].value;
                }
            }
        }
        
        return total;
    }
        /**
     * Calculate grand totals for all columns
     */
    private calculateGrandTotals(matrix: powerbi.DataViewMatrix, columns: any[]): number[] {
        const totals: number[] = new Array(columns.length).fill(0);
        
        // If no rows, return zeros
        if (!matrix.rows?.root?.children) {
            return totals;
        }
        
        // Function to recursively process all leaf nodes
        const processNode = (node: any, level: number) => {
            if (node.children && node.children.length > 0) {
                // Process children recursively
                for (const child of node.children) {
                    processNode(child, level + 1);
                }
            } else if (node.values) {
                // This is a leaf node with values
                for (let i = 0; i < columns.length; i++) {
                    if (node.values[i]?.value !== null && 
                        node.values[i]?.value !== undefined &&
                        typeof node.values[i].value === 'number') {
                        totals[i] += node.values[i].value;
                    }
                }
            }
        };
        
        // Process all rows starting from the root
        for (const row of matrix.rows.root.children) {
            processNode(row, 0);
        }
        
        return totals;
    }

    /**
     * Create and append grand total row
     */
    private addGrandTotalRow(table: HTMLTableElement, columns: any[], totals: number[]): void {
        const settings = this.formattingSettings;
        
        // Check if grand total is enabled
        if (!settings.grandTotalSettings.show.value) {
            return;
        }
        
        // Get the footer or create one if it doesn't exist
        let tfoot = table.querySelector('tfoot');
        if (!tfoot) {
            tfoot = document.createElement('tfoot');
            table.appendChild(tfoot);
        } else {
            // Clear existing content
            tfoot.innerHTML = '';
        }
        
        this.addBlankRowBeforeTotal(tfoot, columns);

        // Create the grand total row
        const tr = document.createElement('tr');
        tr.className = CSS_CLASSES.GRAND_TOTAL_ROW;
        
        // Set the row to be sticky to the bottom
        tr.style.position = 'sticky';
        tr.style.bottom = '0';
        tr.style.zIndex = '5';
        
        // Create the label cell
        const labelCell = document.createElement('th');
        labelCell.textContent = settings.grandTotalSettings.label.value || 'Grand Total';
        labelCell.style.position = 'sticky';
        labelCell.style.left = '0';
        labelCell.style.zIndex = '6'; // Higher than the row to ensure it stays on top
        tr.appendChild(labelCell);
        
        // Create the total cells
        for (let i = 0; i < columns.length; i++) {
            const td = document.createElement('td');
            td.textContent = this.formatNumber(totals[i]);
            tr.appendChild(td);
        }
        
        // Apply formatting to each cell in the grand total row
        const cells = tr.querySelectorAll('th, td');
        cells.forEach(cell => {
            this.applyFormatting(cell as HTMLElement, 'grandTotal');
        });
        
        // Add the row to the footer
        tfoot.appendChild(tr);
    }
    
    private cachedFormatString: string = "#,0.00";

    // Format number with locale and decimal places
    private formatNumber(value: number, formatString?: string): string {
        if (!formatString) {
            formatString = this.cachedFormatString;
        }
        
        const formatter = valueFormatter.create({
            format: formatString
        });
        
        return formatter.format(value);
    }
    
    // Apply all formatting to the table
    private applyTableFormatting(table: HTMLTableElement): void {
        if (!this.formattingSettings) {
            return;
        }
        
        try {
            // Apply general font size to table
            const fontSize = this.formattingSettings.generalSettings.fontSize.value;
            table.style.fontSize = `${fontSize}pt`;
            
            // Apply font family
            const fontFamily = this.formattingSettings.generalSettings.fontFamily.value;
            if (fontFamily) {
                table.style.fontFamily = fontFamily;
            }
            
            // Apply formatting to different cell types
            this.formatCellsByType(table);
            
            // Apply global border settings
            this.applyGlobalBorders(table);
            
        } catch (error) {
            console.error("Error applying formatting:", error);
        }
    }
    
    // Format cells by type (data, subtotal, etc.)
    private formatCellsByType(table: HTMLTableElement): void {
        // Format by cell type using CSS selectors
        const regularCells = table.querySelectorAll('td.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
        const subtotalCells = table.querySelectorAll('td.subtotal-cell, td.level-0-subtotal');
        const regularRowHeaders = table.querySelectorAll('tr:not(.subtotal-row) > th.row-header');
        const subtotalRowHeaders = table.querySelectorAll('tr.subtotal-row > th.row-header');
        const columnHeaderCells = table.querySelectorAll('th.column-header:not(.row-header)');
        const cornerCell = table.querySelector('th.row-header.column-header');
    
        // Apply formatting to each cell type
        regularCells.forEach((cell: HTMLTableCellElement) => {
            this.applyFormatting(cell, 'data');
        });
        
        subtotalCells.forEach((cell: HTMLTableCellElement) => {
            this.applyFormatting(cell, 'subtotal');
        });
        
        regularRowHeaders.forEach((cell: HTMLTableCellElement) => {
            this.applyFormatting(cell, 'rowHeader');
        });
        
        subtotalRowHeaders.forEach((cell: HTMLTableCellElement) => {
            this.applyFormatting(cell, 'subtotal');
        });
        
        columnHeaderCells.forEach((cell: HTMLTableCellElement) => {
            this.applyFormatting(cell, 'columnHeader');
        });
        
        if (cornerCell) {
            this.applyFormatting(cornerCell as HTMLTableCellElement, 'columnHeader');
        }
    }
    
    // Apply formatting to a specific element based on its type
    private applyFormatting(
        element: HTMLElement, 
        type: 'data' | 'rowHeader' | 'columnHeader' | 'subtotal' | 'grandTotal',
        isSubtotal: boolean = false
    ): void {
        const settings = this.formattingSettings;
        if (!settings) return;
        
        // Apply global font family from general settings
        const globalFontFamily = settings.generalSettings.fontFamily.value;
        if (globalFontFamily) {
            element.style.fontFamily = globalFontFamily;
        }
        
        // If this is a subtotal, override the type
        if (isSubtotal) {
            type = 'subtotal';
        }
        
        switch (type) {
            case 'data':
                const font = settings.fontFormatSettings;
                
                // Font color
                if (font.color?.value?.value) {
                    element.style.color = font.color.value.value;
                }
                
                // Font size
                if (font.fontSize?.value) {
                    element.style.fontSize = `${font.fontSize.value}pt`;
                }
                
                // Font styling
                if (font.bold?.value) {
                    element.style.fontWeight = 'bold';
                } else {
                    element.style.fontWeight = 'normal';
                }
                
                if (font.italic?.value) {
                    element.style.fontStyle = 'italic';
                } else {
                    element.style.fontStyle = 'normal';
                }
                
                if (font.underline?.value) {
                    element.style.textDecoration = 'underline';
                } else {
                    element.style.textDecoration = 'none';
                }
                
                // Background color
                if (font.backgroundColor?.value?.value) {
                    element.style.backgroundColor = font.backgroundColor.value.value;
                }

                // Alignment
                if (font.alignment?.value?.value !== undefined) {
                    element.style.textAlign = font.alignment.value.value.toString();
                }
                break;
                
            case 'rowHeader':
                const rowFormat = settings.rowHeaderFormatSettings;
                
                // Font color
                if (rowFormat.color?.value?.value) {
                    element.style.color = rowFormat.color.value.value;
                }
                
                // Font size
                if (rowFormat.fontSize?.value) {
                    element.style.fontSize = `${rowFormat.fontSize.value}pt`;
                }
                
                // Background color
                if (rowFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = rowFormat.backgroundColor.value.value;
                }
                
                // Font styling
                if (rowFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                } else {
                    element.style.fontWeight = 'normal';
                }
                
                if (rowFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                } else {
                    element.style.fontStyle = 'normal';
                }
                
                if (rowFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                } else {
                    element.style.textDecoration = 'none';
                }

                // Alignment
                if (rowFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = rowFormat.alignment.value.value.toString();
                }
                break;
                
            case 'columnHeader':
                const headerFormat = settings.columnHeaderFormatSettings;
                
                // Font color
                if (headerFormat.color?.value?.value) {
                    element.style.color = headerFormat.color.value.value;
                }
                
                // Font size
                if (headerFormat.fontSize?.value) {
                    element.style.fontSize = `${headerFormat.fontSize.value}pt`;
                }
                
                // Background color
                if (headerFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = headerFormat.backgroundColor.value.value;
                }
                
                // Font styling
                if (headerFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                } else {
                    element.style.fontWeight = 'normal';
                }
                
                if (headerFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                } else {
                    element.style.fontStyle = 'normal';
                }
                
                if (headerFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                } else {
                    element.style.textDecoration = 'none';
                }

                // Alignment
                if (headerFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = headerFormat.alignment.value.value.toString();
                }
                break;
                
            case 'subtotal':
                const subtotalFormat = settings.subtotalFormatSettings;
                
                // Font color
                if (subtotalFormat.color?.value?.value) {
                    element.style.color = subtotalFormat.color.value.value;
                }
                
                // Font size
                if (subtotalFormat.fontSize?.value) {
                    element.style.fontSize = `${subtotalFormat.fontSize.value}pt`;
                }
                
                // Background color
                if (subtotalFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = subtotalFormat.backgroundColor.value.value;
                }
                
                // Font styling
                if (subtotalFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                } else {
                    element.style.fontWeight = 'normal';
                }
                
                if (subtotalFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                } else {
                    element.style.fontStyle = 'normal';
                }
                
                if (subtotalFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                } else {
                    element.style.textDecoration = 'none';
                }
                
                // Alignment
                if (subtotalFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = subtotalFormat.alignment.value.value.toString();
                }
                break;
            case 'grandTotal':
                const grandTotalFormat = settings.grandTotalSettings;
                
                // Font color
                if (grandTotalFormat.color?.value?.value) {
                    element.style.color = grandTotalFormat.color.value.value;
                }
                
                // Font size
                if (grandTotalFormat.fontSize?.value) {
                    element.style.fontSize = `${grandTotalFormat.fontSize.value}pt`;
                }
                
                // Background color
                if (grandTotalFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = grandTotalFormat.backgroundColor.value.value;
                }
                
                // Font styling
                if (grandTotalFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                } else {
                    element.style.fontWeight = 'normal';
                }
                
                if (grandTotalFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                } else {
                    element.style.fontStyle = 'normal';
                }
                
                if (grandTotalFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                } else {
                    element.style.textDecoration = 'none';
                }
                
                // Apply alignment to the data cells, but not the label
                if (element.tagName === 'TD' && grandTotalFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = grandTotalFormat.alignment.value.value.toString();
                } else if (element.tagName === 'TH') {
                    // The label cell should align left
                    element.style.textAlign = 'left';
                }
                break;
        }
    }
    
    // Apply border settings to the table
    private applyGlobalBorders(table: HTMLTableElement): void {
        const borderSettings = this.formattingSettings.borderSettings;
        
        if (!borderSettings?.show?.value) {
            // If borders are turned off, remove all border classes
            table.classList.remove(CSS_CLASSES.WITH_BORDERS);
            table.classList.remove(CSS_CLASSES.WITH_HORIZONTAL_BORDERS);
            table.classList.remove(CSS_CLASSES.WITH_VERTICAL_BORDERS);
            return;
        }
        
        // Get border properties
        const borderColor = borderSettings.color.value.value;
        const borderWidth = borderSettings.width.value;
        const showHorizontal = borderSettings.horizontalBorders.value;
        const showVertical = borderSettings.verticalBorders.value;
        
        // Add classes based on which borders are enabled
        table.classList.add(CSS_CLASSES.WITH_BORDERS);
        
        if (showHorizontal) {
            table.classList.add(CSS_CLASSES.WITH_HORIZONTAL_BORDERS);
        } else {
            table.classList.remove(CSS_CLASSES.WITH_HORIZONTAL_BORDERS);
        }
        
        if (showVertical) {
            table.classList.add(CSS_CLASSES.WITH_VERTICAL_BORDERS);
        } else {
            table.classList.remove(CSS_CLASSES.WITH_VERTICAL_BORDERS);
        }
        
        // Set CSS variables for border styling
        table.style.setProperty('--border-color', borderColor);
        table.style.setProperty('--border-width', `${borderWidth}px`);
        table.style.setProperty('--border-style', 'solid');
        
        // Add this block to enforce consistent borders on sticky headers
        if (borderSettings.show.value) {
            // Force consistent border width on sticky headers
            const rowHeaders = table.querySelectorAll('th.row-header');
            rowHeaders.forEach(header => {
                if (showVertical) {
                    (header as HTMLElement).style.borderRightWidth = `${borderWidth}px`;
                    (header as HTMLElement).style.borderLeftWidth = `${borderWidth}px`;
                }
                if (showHorizontal) {
                    (header as HTMLElement).style.borderTopWidth = `${borderWidth}px`;
                    (header as HTMLElement).style.borderBottomWidth = `${borderWidth}px`;
                }
                (header as HTMLElement).style.borderColor = borderColor;
                (header as HTMLElement).style.borderStyle = 'solid';
            });
        }
    }
    
    // Helper method to adjust color brightness
    private adjustColor(color: string, amount: number): string {
        // Handle empty or invalid colors
        if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
            return color;
        }
        
        try {
            // Convert hex to RGB
            let hex = color;
            if (hex.startsWith('#')) {
                hex = hex.slice(1);
            }
            
            // If not a proper hex color, return a default color
            if (!/^[0-9A-Fa-f]{3}$|^[0-9A-Fa-f]{6}$/.test(hex)) {
                return amount < 0 ? '#e0e0e0' : '#f5f5f5';
            }
            
            // Parse hex to RGB
            let r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
            let g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
            let b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
            
            // Adjust color
            r = Math.max(0, Math.min(255, r + amount));
            g = Math.max(0, Math.min(255, g + amount));
            b = Math.max(0, Math.min(255, b + amount));
            
            // Convert back to hex
            return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        } catch (error) {
            console.error("Error adjusting color:", error);
            return amount < 0 ? '#e0e0e0' : '#f5f5f5';
        }
    }
    
    // Optimized re-rendering when toggling rows
    private renderVisualWithCurrentState(): void {
        // Use a small timeout to ensure DOM updates
        setTimeout(() => {
            if (this.lastOptions) {
                try {
                    // Store current scroll position
                    const scrollTop = this.tableDiv.scrollTop;
                    const scrollLeft = this.tableDiv.scrollLeft;
                    
                    // Clear and rebuild the table
                    this.tableDiv.innerHTML = "";
                    
                    const dataView = this.lastOptions?.dataViews?.[0];
                    if (!dataView?.matrix) return;
                    
                    // Get measure name and rebuild the table
                    const measureName = this.getMeasureName(dataView);
                    this.createMatrixTable(dataView.matrix, measureName);
                    
                    // Restore scroll position
                    this.tableDiv.scrollTop = scrollTop;
                    this.tableDiv.scrollLeft = scrollLeft;
                    
                } catch (error) {
                    console.error("Error in visual re-render:", error);
                }
            }
        }, 10);
    }
    
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}