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

import { landingPageHTML } from "../style/landingPage1";

// Interfaces for matrix data
interface MatrixNode {
    value?: any; 
    children?: MatrixNode[];
    values?: any | { [id: number]: any }; 
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
    private animatingNodes: Set<string> = new Set();
    private animationTimeouts: Map<string, number> = new Map();
    private cachedFormatString: string = "#,0.00";
    private static savedExpandedState: Map<string, boolean> = new Map<string, boolean>();
    private isLandingPageOn: boolean = false;
    private landingPageRemoved: boolean = false;
    private landingPageElement: HTMLElement;

    //=========================================================================
    // INITIALIZATION
    //=========================================================================
    
    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        
        this.expandedRows = new Map<string, boolean>();

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
    
        // Create context menu
        const contextMenu = document.createElement("div");
        contextMenu.className = "custom-context-menu";
        contextMenu.style.display = "none";
        contextMenu.style.position = "absolute";
        contextMenu.style.zIndex = "1000";
        
        // Add the Copy Value option first
        const copyItem = document.createElement("div");
        copyItem.className = "context-menu-item";
        copyItem.setAttribute("data-action", "copyValue");
        copyItem.textContent = "Copy Value";
        contextMenu.appendChild(copyItem);
        
        // Add separator
        const separator = document.createElement("div");
        separator.className = "context-menu-separator";
        contextMenu.appendChild(separator);
        
        // Add menu items for expand/collapse
        const menuItems = [
            { id: "expandThis", text: "Expand this item" },
            { id: "collapseThis", text: "Collapse this item" },
            { id: "expandLevel", text: "Expand all at this level" },
            { id: "collapseLevel", text: "Collapse all at this level" },
            { id: "expandAll", text: "Expand all" },
            { id: "collapseAll", text: "Collapse all" }
        ];
        
        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.className = "context-menu-item";
            menuItem.setAttribute("data-action", item.id);
            menuItem.textContent = item.text;
            contextMenu.appendChild(menuItem);
        });
        
        // Add the context menu to the DOM once
        this.target.appendChild(contextMenu);
        this.contextMenu = contextMenu;
        
        // Add event listeners for context menu
        this.setupContextMenuEvents();
    }

    private handleLandingPage(options: VisualUpdateOptions): void {
        // Show landing page if no data views or empty data
        if (!options.dataViews || !options.dataViews[0]?.metadata?.columns?.length) {
            if (!this.isLandingPageOn) {
                this.isLandingPageOn = true;
                
                // Clear previous content
                while (this.target.firstChild) {
                    this.target.removeChild(this.target.firstChild);
                }
                
                // Create landing page
                const landingPageHTML = this.getLandingPageHTML();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = landingPageHTML;
                
                // Add landing page to the DOM
                this.landingPageElement = tempDiv.firstChild as HTMLElement;
                this.target.appendChild(this.landingPageElement);
                
                // Add event listener to the continue button
                const continueButton = this.landingPageElement.querySelector('.continue-button');
                if (continueButton) {
                    continueButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Remove landing page
                        if (this.landingPageElement && this.landingPageElement.parentNode) {
                            this.landingPageElement.parentNode.removeChild(this.landingPageElement);
                            this.isLandingPageOn = false;
                            this.landingPageRemoved = true;
                            this.createContainerElements();
                        }
                    });
                }
            }
        } else {
            // Remove landing page if we have data
            if (this.isLandingPageOn && !this.landingPageRemoved) {
                this.landingPageRemoved = true;
                if (this.landingPageElement && this.landingPageElement.parentNode) {
                    this.landingPageElement.parentNode.removeChild(this.landingPageElement);
                }
                
                // Recreate the container elements for the actual visual
                this.createContainerElements();
            }
        }
        
    }

    // Add method to get the landing page HTML content
    private getLandingPageHTML(): string {
        return landingPageHTML;
    }

    //=========================================================================
    // CORE VISUAL METHODS
    //=========================================================================

    //=========================================================================
// CORE VISUAL METHODS
//=========================================================================

    public update(options: VisualUpdateOptions): void {
        console.log("Update called, checking for data...");
        
        // Check if we have data
        const hasData = options.dataViews && 
                    options.dataViews[0] && 
                    options.dataViews[0].metadata && 
                    options.dataViews[0].metadata.columns && 
                    options.dataViews[0].metadata.columns.length > 0;
        
        console.log("Has data:", hasData);
        
        if (!hasData) {
            console.log("No data, showing landing page");
            // Show landing page
            this.showLandingPage();
            return; // Exit early - nothing else to do when showing landing page
        } 
        
        // If we get here, we have data
        console.log("Has data, showing visual");
        // Hide landing page if it exists
        this.hideLandingPage();
        
        // Regular update logic
        this.lastOptions = options;
        
        // Save scroll position
        const scrollTop = this.tableDiv?.scrollTop || 0;
        const scrollLeft = this.tableDiv?.scrollLeft || 0;
        
        // Save current expanded state before clearing
        if (this.expandedRows?.size > 0) {
            Visual.savedExpandedState = new Map<string, boolean>(this.expandedRows);
        }
        
        // Clear previous content
        while (this.tableDiv.firstChild) {
            this.tableDiv.removeChild(this.tableDiv.firstChild);
        }
        
        // Validate data
        if (!options?.dataViews?.[0]) return;
        
        // Get formatting settings
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews[0]
        );
        
        try {
            const dataView = options.dataViews[0];
            // Cache the format string
            this.cachedFormatString = this.getFormatString(dataView);
            
            // Check if we have matrix data
            if (!dataView.matrix) return;
            
            // Restore the expanded state from the static property
            if (Visual.savedExpandedState.size > 0) {
                this.expandedRows = new Map<string, boolean>(Visual.savedExpandedState);
            }
            
            const matrix = dataView.matrix;
            const measureName = this.getMeasureName(dataView);
            
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
            
            // Restore scroll position
            this.tableDiv.scrollTop = scrollTop;
            this.tableDiv.scrollLeft = scrollLeft;
            
        } catch (error) {
            console.error("Error in update:", error);
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }

    //=========================================================================
    // DATA PROCESSING
    //=========================================================================

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

    private getMeasureDynamically(): string {
        if (!this.lastOptions?.dataViews?.[0]) return "Amount";
        return this.getMeasureName(this.lastOptions.dataViews[0]);
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
    
    private formatNumber(value: number, formatString?: string): string {
        formatString = formatString || this.cachedFormatString;
        const formatter = valueFormatter.create({ format: formatString });
        return formatter.format(value);
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
    
    private calculateGrandTotals(matrix: powerbi.DataViewMatrix, columns: any[]): number[] {
        const totals: number[] = new Array(columns.length).fill(0);
        
        // If no rows, return zeros
        if (!matrix.rows?.root?.children) {
            return totals;
        }
        
        // Function to recursively process all leaf nodes
        const processNode = (node: any) => {
            if (node.children && node.children.length > 0) {
                // Process children recursively
                for (const child of node.children) {
                    processNode(child);
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
            processNode(row);
        }
        
        return totals;
    }

    //=========================================================================
    // TABLE CREATION AND RENDERING
    //=========================================================================

    private createMatrixTable(matrix: powerbi.DataViewMatrix, measureName: string): void {
        // Create table
        const table = document.createElement("table");
        table.className = CSS_CLASSES.MATRIX_TABLE;
        
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
        
        // Use saved expanded state if we have it
        if (Visual.savedExpandedState.size > 0) {
            this.expandedRows = new Map(Visual.savedExpandedState);
        }
        
        // Initialize level 0 items as expanded if not already set
        if (matrix.rows.root.children) {
            matrix.rows.root.children.forEach((row, idx) => {
                const nodeId = this.getNodeId(row, 0);
                if (!this.expandedRows.has(nodeId)) {
                    this.expandedRows.set(nodeId, true); // Level 0 default to expanded
                }
            });
        }
        
        // Render rows with current expanded state
        if (matrix.rows.root.children) {
            this.renderRowsWithSubtotals(table, matrix.rows.root.children, columns, 0, "");
        }
        
        // Calculate grand totals
        const grandTotals = this.calculateGrandTotals(matrix, columns);
    
        // Add grand total row
        this.addGrandTotalRow(table, columns, grandTotals);
    
        // Apply all formatting
        this.applyTableFormatting(table);
        
        // Save expanded state after table creation
        Visual.savedExpandedState = new Map(this.expandedRows);
    }

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
    
    private createTableHeader(table: HTMLTableElement, columns: any[], columnFormats: string[]): void {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        // Add corner cell
        const cornerCell = this.createCornerCell();
        headerRow.appendChild(cornerCell);
        
        // Add column headers
        columns.forEach((column, index) => {
            const columnHeader = this.createColumnHeader(column, columnFormats[index]);
            headerRow.appendChild(columnHeader);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }

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
        
        rows.forEach((row, rowIndex) => {
            const nodeId = parentId + this.getNodeId(row, level);
            
            // Default to expanded for level 0 if not explicitly set
            if (level === 0 && !this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true);
            }
            
            // Get expanded state from our map, default to false for non-level-0
            const isExpanded = this.expandedRows.get(nodeId) ?? false;
            const isLevel0 = level === 0;
            
            // Create the table row
            const tr = document.createElement("tr");
            tr.setAttribute("data-node-id", nodeId);
            tr.setAttribute("data-level", String(level));
            
            if (parentId) {
                tr.setAttribute("data-parent-id", parentId);
            }
            
            if (level > 0) {
                tr.classList.add("expandable-row");
                
                // Check if parent is expanded
                const parentExpanded = this.expandedRows.get(parentId) ?? false;
                
                // Hide this row if parent is collapsed OR this level is not expanded by default
                if (!parentExpanded) {
                    tr.classList.add("collapsed");
                }
            }
            
            if (isLevel0) {
                tr.classList.add(CSS_CLASSES.LEVEL_0_ROW);
            }
            
            if (row.children?.length > 0) {
                tr.classList.add(CSS_CLASSES.SUBTOTAL_ROW);
            }
            
            // Add row header
            const rowHeader = this.createRowHeader(row, level, nodeId, isExpanded, isLevel0, true);
            tr.appendChild(rowHeader);
            
            // Add data cells
            if (row.children?.length > 0) {
                this.addSubtotalCells(tr, row, columns, isLevel0, columnWidth);
            } else if (row.values) {
                this.addDataCells(tr, row, columns, columnWidth);
            }
            
            tbody.appendChild(tr);
            
            // If this node has children, always render them
            if (row.children?.length > 0) {
                // Set initial collapsed state for children based on parent
                if (!isExpanded) {
                    this.setChildrenCollapsed(nodeId, row.children, level + 1);
                }
                
                this.renderRowsWithSubtotals(table, row.children, columns, level + 1, nodeId);
            }
            
            // Add blank row if needed
            this.addBlankRowIfNeeded(tbody, columns, rowIndex, rows.length, row, level);
        });
    }

    //=========================================================================
    // CELL AND ELEMENT CREATION
    //=========================================================================

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
            // Use the actual expanded state from the map, not the parameter
            const actualIsExpanded = this.expandedRows.get(nodeId) === true;
            const toggleButton = this.createToggleButton(nodeId, actualIsExpanded);
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

    private createToggleButton(nodeId: string, isExpanded: boolean): HTMLSpanElement {
        const toggleButton = document.createElement("span");
        toggleButton.className = "toggle-button";
        
        // Use Unicode characters instead of icon classes
        toggleButton.textContent = isExpanded ? '▲' : '▼';
        
        toggleButton.style.cursor = "pointer";
        
        toggleButton.onclick = (event) => {
            event.stopPropagation();
            
            if (!toggleButton.hasAttribute('data-animating')) {
                this.toggleExpanded(nodeId);
            }
        };
        
        return toggleButton;
    }

    private addDataCells(
        tr: HTMLTableRowElement, 
        row: any,
        columns: any[], 
        columnWidth: number
    ): void {
        columns.forEach((_, j) => {
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
            
            // Store the raw value as a data attribute
            if (value && typeof value.value === 'number') {
                td.setAttribute('data-raw-value', value.value.toString());
            }
            
            tr.appendChild(td);
        });
    }

    private addSubtotalCells(
        tr: HTMLTableRowElement, 
        row: MatrixNode, 
        columns: any[], 
        isLevel0: boolean,
        columnWidth: number
    ): void {
        columns.forEach((_, j) => {
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
        });
    }

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
            while (tfoot.firstChild) {
                tfoot.removeChild(tfoot.firstChild);
              }
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
        totals.forEach((total, i) => {
            const td = document.createElement('td');
            td.textContent = this.formatNumber(total);
            tr.appendChild(td);
        });
        
        // Apply formatting to each cell in the grand total row
        const cells = tr.querySelectorAll('th, td');
        cells.forEach(cell => {
            this.applyFormatting(cell as HTMLElement, 'grandTotal');
        });
        
        // Add the row to the footer
        tfoot.appendChild(tr);
    }

    private addBlankRowIfNeeded(
        tbody: HTMLTableSectionElement, 
        columns: any[], 
        currentIndex: number, 
        totalRows: number, 
        currentRow: MatrixNode,
        level: number
    ): void {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        
        // Only add blank rows if the setting is enabled and this is a level 0 row (not the last one)
        if (!blankRowSettings.enableBlankRows.value || level !== 0 || currentIndex >= totalRows - 1) {
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
        
        // Add the cell to the row and the row to the table
        blankRow.appendChild(blankCell);
        tbody.appendChild(blankRow);
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

    //=========================================================================
    // FORMATTING AND STYLING
    //=========================================================================

    private applyTableFormatting(table: HTMLTableElement): void {
        if (!this.formattingSettings) {
            return;
        }
        
        try {
            
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

    private formatCellsByType(table: HTMLTableElement): void {
        // Use CSS selectors to get different cell types
        const regularCells = table.querySelectorAll('td.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
        const subtotalCells = table.querySelectorAll('td.subtotal-cell, td.level-0-subtotal');
        const regularRowHeaders = table.querySelectorAll('tr:not(.subtotal-row) > th.row-header');
        const subtotalRowHeaders = table.querySelectorAll('tr.subtotal-row > th.row-header');
        const columnHeaderCells = table.querySelectorAll('th.column-header:not(.row-header)');
        const cornerCell = table.querySelector('th.row-header.column-header');
    
        // Apply formatting to each cell type
        regularCells.forEach(cell => this.applyFormatting(cell as HTMLElement, 'data'));
        subtotalCells.forEach(cell => this.applyFormatting(cell as HTMLElement, 'subtotal'));
        regularRowHeaders.forEach(cell => this.applyFormatting(cell as HTMLElement, 'rowHeader'));
        subtotalRowHeaders.forEach(cell => this.applyFormatting(cell as HTMLElement, 'subtotal'));
        columnHeaderCells.forEach(cell => this.applyFormatting(cell as HTMLElement, 'columnHeader'));
        
        if (cornerCell) {
            this.applyFormatting(cornerCell as HTMLElement, 'columnHeader');
        }
    }

    private applyFormatting(
        element: HTMLElement, 
        type: 'data' | 'rowHeader' | 'columnHeader' | 'subtotal' | 'grandTotal'
    ): void {
        const settings = this.formattingSettings;
        if (!settings) return;
        
        // Common properties to format
        const props = [
            'color', 
            'fontSize', 
            'backgroundColor', 
            'bold', 
            'italic', 
            'underline', 
            'alignment'
        ];
        
        // Get the appropriate formatting settings based on type
        let formatSettings;
        switch (type) {
            case 'data': formatSettings = settings.fontFormatSettings; break;
            case 'rowHeader': formatSettings = settings.rowHeaderFormatSettings; break;
            case 'columnHeader': formatSettings = settings.columnHeaderFormatSettings; break;
            case 'subtotal': formatSettings = settings.subtotalFormatSettings; break;
            case 'grandTotal': formatSettings = settings.grandTotalSettings; break;
        }
        
        // Apply global font family
        const globalFontFamily = settings.generalSettings.fontFamily.value;
        if (globalFontFamily) {
            element.style.fontFamily = globalFontFamily;
        }
        
        // Apply global font size (new code)
        const globalFontSize = settings.generalSettings.fontSize.value;
        if (globalFontSize) {
            element.style.fontSize = `${globalFontSize}pt`;
        }
        
        // Apply each property if it exists
        if (formatSettings) {
            // Color
            if (formatSettings.color?.value?.value) {
                element.style.color = formatSettings.color.value.value;
            }
            
            // Font size - only apply if global size is not set
            if (!globalFontSize && formatSettings.fontSize?.value) {
                element.style.fontSize = `${formatSettings.fontSize.value}pt`;
            }
            
            // Background color
            if (formatSettings.backgroundColor?.value?.value) {
                element.style.backgroundColor = formatSettings.backgroundColor.value.value;
            }
            
            // Font styling
            element.style.fontWeight = formatSettings.bold?.value ? 'bold' : 'normal';
            element.style.fontStyle = formatSettings.italic?.value ? 'italic' : 'normal';
            element.style.textDecoration = formatSettings.underline?.value ? 'underline' : 'none';
            
            // Alignment - special handling for grand total labels
            if (formatSettings.alignment?.value?.value !== undefined) {
                // Special handling for grand total label cell
                if (type === 'grandTotal' && element.tagName === 'TH') {
                    element.style.textAlign = 'left';
                } else {
                    element.style.textAlign = formatSettings.alignment.value.value.toString();
                }
            }
        }
    }

    private applyGlobalBorders(table: HTMLTableElement): void {
        const borderSettings = this.formattingSettings.borderSettings;
        
        if (!borderSettings?.show?.value) {
            // If borders are turned off, remove all border classes
            table.classList.remove(CSS_CLASSES.WITH_BORDERS, 
                CSS_CLASSES.WITH_HORIZONTAL_BORDERS, 
                CSS_CLASSES.WITH_VERTICAL_BORDERS);
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
        
        // Fix consistent borders on sticky headers
        if (borderSettings.show.value) {
            const rowHeaders = table.querySelectorAll('th.row-header');
            rowHeaders.forEach(header => {
                const headerEl = header as HTMLElement;
                
                if (showVertical) {
                    headerEl.style.borderRightWidth = `${borderWidth}px`;
                    headerEl.style.borderLeftWidth = `${borderWidth}px`;
                }
                if (showHorizontal) {
                    headerEl.style.borderTopWidth = `${borderWidth}px`;
                    headerEl.style.borderBottomWidth = `${borderWidth}px`;
                }
                headerEl.style.borderColor = borderColor;
                headerEl.style.borderStyle = 'solid';
            });
        }
    }

    //=========================================================================
    // EXPAND/COLLAPSE FUNCTIONALITY
    //=========================================================================

    private getNodeId(node: any, level: number): string {
        let value;
        
        // Ensure we have a consistent string representation
        if (node.value !== null && node.value !== undefined) {
            // For date values, get a consistent string representation
            if (node.value instanceof Date || 
                (typeof node.value === 'object' && node.value.epochTimeStamp)) {
                // Convert date to consistent string format
                const dateValue = node.value instanceof Date ? 
                    node.value : new Date(node.value.epochTimeStamp);
                    
                value = dateValue.toISOString();
            } else {
                value = String(node.value);
            }
        } else {
            value = "null";
        }
        
        // Create a consistent node ID
        return `level_${level}_${value}`;
    }

    private isExpanded(nodeId: string): boolean {
        return this.expandedRows.get(nodeId) === true;
    }

    private initializeDefaultExpandedState(rows: any[], level: number, parentId: string): void {
        if (!rows) return;
        
        for (const row of rows) {
            const nodeId = parentId + this.getNodeId(row, level);
            
            // Default: expand level 0, collapse others
            const defaultExpanded = level === 0;
            this.expandedRows.set(nodeId, defaultExpanded);
            
            // Always recursively process children
            if (row.children?.length > 0) {
                this.initializeDefaultExpandedState(row.children, level + 1, nodeId);
            }
        }
        
        // Save to static property
        Visual.savedExpandedState = new Map<string, boolean>(this.expandedRows);
    }

    // Toggle expanded state of a node
    private toggleExpanded(nodeId: string): void {
        // Prevent action if this node is currently animating
        if (this.animatingNodes.has(nodeId) || this.animatingNodes.size > 0) {
            return;
        }
        
        // Mark this node as animating
        this.animatingNodes.add(nodeId);
        
        // Get current expanded state and update it
        const isExpanded = this.expandedRows.get(nodeId) ?? false;
        this.expandedRows.set(nodeId, !isExpanded);
        
        // Get direct children for animation
        const directChildren = Array.from(
            this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
        ) as HTMLElement[];
        
        // Update toggle button appearance immediately
        const toggleButton = this.tableDiv.querySelector(`tr[data-node-id="${nodeId}"] .toggle-button`) as HTMLElement;
        if (toggleButton) {
            // Toggle the text content based on the NEW state
            const newExpandedState = !isExpanded;
            toggleButton.textContent = newExpandedState ? '▲' : '▼';
        }
        
        // Save state to static property for persistence
        Visual.savedExpandedState = new Map(this.expandedRows);
        
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        
        // Set safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupAnimation(nodeId);
        }, 500);
        
        this.animationTimeouts.set(nodeId, timeout);
        
        if (isExpanded) {
            // COLLAPSING
            this.animateCollapse(directChildren, nodeId);
        } else {
            // EXPANDING
            this.animateExpand(directChildren, nodeId);
        }
    }

    private contextMenu: HTMLElement;
    private activeNodeId: string = null;
    private activeLevel: number = null;
    private activeCell: HTMLElement = null;

    private setupContextMenuEvents(): void {
        const tableDiv = this.tableDiv;
        const contextMenu = this.contextMenu;
        
        // Prevent default context menu on the table
        tableDiv.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            
            // Hide any visible context menu
            contextMenu.style.display = 'none';
            
            // Find the clicked cell
            const target = e.target as HTMLElement;
            const cell = target.closest('td, th') as HTMLElement;
            
            if (cell) {
                // Store the active cell
                this.activeCell = cell;
                
                // Get row info for expand/collapse
                const row = cell.closest('tr') as HTMLElement;
                if (row) {
                    this.activeNodeId = row.getAttribute('data-node-id');
                    this.activeLevel = parseInt(row.getAttribute('data-level') || '0', 10);
                }
                
                // Show context menu at mouse position
                contextMenu.style.left = `${e.pageX}px`;
                contextMenu.style.top = `${e.pageY}px`;
                contextMenu.style.display = 'block';
            }
        });
        
        // Handle clicks on menu items
        contextMenu.addEventListener('click', (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            if (target.classList.contains('context-menu-item')) {
                const action = target.getAttribute('data-action');
                
                if (action === 'copyValue') {
                    this.copyValueToClipboard();
                } else if (this.activeNodeId) {
                    // Handle expand/collapse actions
                    this.handleContextMenuAction(action, this.activeNodeId, this.activeLevel);
                }
                
                // Hide menu after action
                contextMenu.style.display = 'none';
            }
        });
        
        // Hide menu when clicking elsewhere
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });
    }

    private copyValueToClipboard(): void {
        if (!this.activeCell) return;
        
        // Check if we have a raw numeric value
        let textToCopy = '';
        const rawValue = this.activeCell.getAttribute('data-raw-value');
        
        if (rawValue !== null) {
            // We have a raw number value, use it
            textToCopy = rawValue;
        } else {
            // Otherwise use the formatted text
            textToCopy = this.activeCell.textContent || '';
        }
        
        try {
            // Create a temporary textarea element that's properly visible/focused
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            
            // Same positioning code as before...
            textArea.style.position = 'absolute';
            textArea.style.left = '0';
            textArea.style.top = '0';
            // ... rest of the styling
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            
            if (successful) {
                this.showToast('Clipboard secured! Mission accomplished.');
            } else {
                this.showToast('Copy failed—clipboard said "not today." Try again!');
            }            
            
            document.body.removeChild(textArea);
        } catch (err) {
            this.showToast('Copy failed - browser restriction');
            console.error('Copy failed:', err);
        }
    }
    
    private showToast(message: string): void {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(0,0,0,0.7)';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '4px';
        toast.style.zIndex = '2000';
        toast.style.transition = 'opacity 0.3s';
        
        document.body.appendChild(toast);
        
        // Remove toast after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    //=========================================================================
    // ANIMATION METHODS
    //=========================================================================

    private disableAllToggleButtons(): void {
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn: HTMLElement) => {
            btn.style.cursor = "copy";
            btn.style.opacity = "0.5";
            btn.setAttribute('data-animating', 'true');
        });
    }

    private animateExpand(rows: HTMLElement[], nodeId: string): void {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        
        // Prepare rows for animation
        rows.forEach(row => {
            // Setup for animation
            row.classList.remove('collapsed', 'collapsing-wave');
            row.style.height = '0';
            row.style.opacity = '0';
            row.style.overflow = 'hidden';
            row.style.transformOrigin = 'top';
            row.style.transform = 'scaleY(0.3)'; // Starting transform
            
            // Set target height
            const naturalHeight = row.scrollHeight;
            row.style.setProperty('--row-height', `${naturalHeight}px`);
        });
        
        // Force a reflow
        void rows[0].offsetHeight;
        
        // Apply animation with more pronounced staggered delay
        rows.forEach((row, index) => {
            // Increase delay between rows (from 20ms to 50ms)
            row.style.animationDelay = `${index * 50}ms`;
            row.classList.add('expanding-wave');
        });
        
        // Listen for animation end on the last row
        const lastRow = rows[rows.length - 1];
        lastRow.addEventListener('animationend', () => {
            // Cleanup all styling
            rows.forEach(row => {
                row.classList.remove('expanding-wave');
                row.style.animationDelay = '';
                row.style.height = '';
                row.style.opacity = '';
                row.style.overflow = '';
                row.style.transform = '';
            });
            
            this.cleanupAnimation(nodeId);
        }, { once: true });
    }

    private animateCollapse(rows: HTMLElement[], nodeId: string): void {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        
        // Prepare rows for animation
        rows.forEach(row => {
            row.classList.remove('expanding-wave', 'collapsed');
            row.style.transformOrigin = 'top';
            
            // Set initial state
            const rowHeight = row.offsetHeight;
            row.style.setProperty('--row-height', `${rowHeight}px`);
            row.style.overflow = 'hidden';
            
            // Force reflow
            void row.offsetHeight;
        });
        
        // Apply animation with more pronounced staggered delay
        // Reverse the order for collapse, so items collapse from bottom to top
        rows.slice().reverse().forEach((row, index) => {
            row.style.animationDelay = `${index * 50}ms`;
            row.classList.add('collapsing-wave');
        });
        
        // Listen for animation end
        const lastRow = rows[0]; // First row will be the last to collapse with our reversed order
        lastRow.addEventListener('animationend', () => {
            // Hide rows after animation
            rows.forEach(row => {
                row.classList.remove('collapsing-wave');
                row.classList.add('collapsed');
                row.style.animationDelay = '';
                row.style.transform = '';
            });
            
            this.cleanupAnimation(nodeId);
        }, { once: true });
    }

    private cleanupAnimation(nodeId: string): void {
        // Clear timeout
        const timeout = this.animationTimeouts.get(nodeId);
        if (timeout) {
            window.clearTimeout(timeout);
            this.animationTimeouts.delete(nodeId);
        }
        
        // Remove from animating set
        this.animatingNodes.delete(nodeId);
        
        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });
        
        // Get current expanded state
        const isExpanded = this.expandedRows.get(nodeId) ?? false;
        
        // Make sure all direct children have the correct visibility
        const directChildren = Array.from(
            this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
        ) as HTMLElement[];
        
        directChildren.forEach(child => {
            if (isExpanded) {
                child.classList.remove('collapsed');
            } else {
                child.classList.add('collapsed');
            }
        });
        
        // If this was a collapse, also collapse all descendants
        if (!isExpanded) {
            // Mark all descendants as collapsed in the state
            const allDescendants = this.findAllDescendants(nodeId);
            allDescendants.forEach(row => {
                const rowId = row.getAttribute('data-node-id');
                if (rowId) {
                    // Update the UI
                    row.classList.add('collapsed');
                    
                    // Update toggle button
                    const childToggle = row.querySelector('.toggle-button') as HTMLElement;
                    if (childToggle) {
                        childToggle.textContent = "▲"; // Collapsed state
                    }
                    
                    // Update state
                    this.expandedRows.set(rowId, false);
                }
            });
        }
        
        // Save final state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }

    //=========================================================================
    // HELPER METHODS
    //=========================================================================

    private findAllDescendants(nodeId: string): HTMLElement[] {
        const allRows = Array.from(this.tableDiv.querySelectorAll('tr[data-node-id]')) as HTMLElement[];
        const allDescendants: HTMLElement[] = [];
        
        // Helper function to recursively find descendants
        const findDescendants = (id: string): void => {
            const children = allRows.filter(row => row.getAttribute('data-parent-id') === id);
            
            children.forEach(child => {
                allDescendants.push(child);
                const childId = child.getAttribute('data-node-id');
                if (childId) {
                    findDescendants(childId);
                }
            });
        };
        
        findDescendants(nodeId);
        return allDescendants;
    }

    private getAllDescendants(nodeId: string): HTMLElement[] {
        const allRows = Array.from(this.tableDiv.querySelectorAll('tr[data-node-id]')) as HTMLElement[];
        const descendants: HTMLElement[] = [];
        
        // Get direct children
        const directChildren = allRows.filter(row => 
            row.getAttribute('data-parent-id') === nodeId
        );
        
        descendants.push(...directChildren);
        
        // Recursively add their descendants
        directChildren.forEach(child => {
            const childId = child.getAttribute('data-node-id');
            if (childId) {
                descendants.push(...this.getAllDescendants(childId));
            }
        });
        
        return descendants;
    }

    private setChildrenCollapsed(parentId: string, children: any[], level: number): void {
        if (!children) return;
        
        for (const child of children) {
            const childId = parentId + this.getNodeId(child, level);
            this.expandedRows.set(childId, false);
            
            if (child.children?.length > 0) {
                this.setChildrenCollapsed(childId, child.children, level + 1);
            }
        }
    }

    private handleContextMenuAction(action: string, nodeId: string, level: number): void {
        if (!nodeId) return;
        
        // Prevent multiple animations running at once
        if (this.animatingNodes.size > 0) return;
        
        switch (action) {
            case 'expandThis':
                // Expand just this item if it's collapsed
                if (!this.isExpanded(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
                
            case 'collapseThis':
                // Collapse just this item if it's expanded
                if (this.isExpanded(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
                
            case 'expandLevel':
                // Expand all nodes at this level
                this.animateExpandCollapseLevel(level, true);
                break;
                
            case 'collapseLevel':
                // Collapse all nodes at this level
                this.animateExpandCollapseLevel(level, false);
                break;
                
            case 'expandAll':
                // Expand all nodes
                this.animateExpandCollapseAll(true);
                break;
                
            case 'collapseAll':
                // Collapse all nodes
                this.animateExpandCollapseAll(false);
                break;
        }
    }

    private animateExpandCollapseLevel(level: number, expand: boolean): void {
        // Find all rows at the specified level that have children (i.e., toggle buttons)
        const levelRows = Array.from(
            this.tableDiv.querySelectorAll(`tr[data-level="${level}"] .toggle-button`)
        ).map(btn => (btn as HTMLElement).closest('tr')) as HTMLElement[];
        
        // Filter to only rows that need to change state (not already in desired state)
        const rowsToChange = levelRows.filter(row => {
            if (!row) return false;
            const nodeId = row.getAttribute('data-node-id');
            return nodeId && this.expandedRows.get(nodeId) !== expand;
        });
        
        if (rowsToChange.length === 0) return;
        
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        
        // Track animation state
        const batchId = `level_${level}_${expand ? 'expand' : 'collapse'}_batch`;
        this.animatingNodes.add(batchId);
        
        // Set a safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
        }, 1000);
        this.animationTimeouts.set(batchId, timeout);
        
        // Process each row with small delays between them to create wave effect
        rowsToChange.forEach((row, index) => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId) return;
            
            // Update toggle button appearance immediately
            const toggleButton = row.querySelector('.toggle-button') as HTMLElement;
            if (toggleButton) {
                toggleButton.textContent = expand ? '▲' : '▼';
            }
            
            // Update the state in our map
            this.expandedRows.set(nodeId, expand);
            
            // Wait a small amount of time before processing each row
            setTimeout(() => {
                const directChildren = Array.from(
                    this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
                ) as HTMLElement[];
                
                if (expand) {
                    // Animate expansion
                    this.animateRowsWithoutCleanup(directChildren, expand);
                } else {
                    // Animate collapse
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                
                // If this is the last row, set up cleanup
                if (index === rowsToChange.length - 1) {
                    const lastChildren = directChildren[directChildren.length - 1];
                    if (lastChildren) {
                        lastChildren.addEventListener('animationend', () => {
                            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
                        }, { once: true });
                    }
                }
            }, index * 60); // Slightly longer delay between parent rows
        });
        
        // Save expanded state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    
    // New method for animated expand/collapse all
    private animateExpandCollapseAll(expand: boolean): void {
        // Get all rows with toggle buttons (rows that can be expanded/collapsed)
        const allToggleRows = Array.from(
            this.tableDiv.querySelectorAll('tr .toggle-button')
        ).map(btn => (btn as HTMLElement).closest('tr')) as HTMLElement[];
        
        // Filter to only rows that need to change state
        const rowsToChange = allToggleRows.filter(row => {
            if (!row) return false;
            const nodeId = row.getAttribute('data-node-id');
            return nodeId && this.expandedRows.get(nodeId) !== expand;
        });
        
        if (rowsToChange.length === 0) return;
        
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        
        // Track animation state
        const batchId = `all_${expand ? 'expand' : 'collapse'}_batch`;
        this.animatingNodes.add(batchId);
        
        // Set a safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
        }, 2000);
        this.animationTimeouts.set(batchId, timeout);
        
        // Sort rows by level for better animation (top-to-bottom for expand, bottom-to-top for collapse)
        rowsToChange.sort((a, b) => {
            const levelA = parseInt(a.getAttribute('data-level') || '0', 10);
            const levelB = parseInt(b.getAttribute('data-level') || '0', 10);
            return expand ? levelA - levelB : levelB - levelA;
        });
        
        // Process each row with small delays between them
        rowsToChange.forEach((row, index) => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId) return;
            
            // Update toggle button appearance
            const toggleButton = row.querySelector('.toggle-button') as HTMLElement;
            if (toggleButton) {
                toggleButton.textContent = expand ? '▲' : '▼';
            }
            
            // Update the state in our map
            this.expandedRows.set(nodeId, expand);
            
            // Wait a small amount of time before processing each row
            setTimeout(() => {
                const directChildren = Array.from(
                    this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
                ) as HTMLElement[];
                
                if (expand) {
                    // Animate expansion
                    this.animateRowsWithoutCleanup(directChildren, expand);
                } else {
                    // Animate collapse
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                
                // If this is the last row, set up cleanup
                if (index === rowsToChange.length - 1) {
                    const lastChildren = directChildren[directChildren.length - 1];
                    if (lastChildren) {
                        lastChildren.addEventListener('animationend', () => {
                            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
                        }, { once: true });
                    }
                }
            }, index * 40); // Slightly smaller delay to keep total animation time reasonable
        });
        
        // Save expanded state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    
    // Helper method to animate rows without immediate cleanup
    private animateRowsWithoutCleanup(rows: HTMLElement[], isExpand: boolean): void {
        if (rows.length === 0) return;
        
        if (isExpand) {
            // Prepare rows for expand animation
            rows.forEach(row => {
                row.classList.remove('collapsed', 'collapsing-wave');
                row.style.height = '0';
                row.style.opacity = '0';
                row.style.overflow = 'hidden';
                row.style.transformOrigin = 'top';
                row.style.transform = 'scaleY(0.3)';
                
                const naturalHeight = row.scrollHeight;
                row.style.setProperty('--row-height', `${naturalHeight}px`);
            });
            
            // Force a reflow
            void rows[0].offsetHeight;
            
            // Apply animation with staggered delay
            rows.forEach((row, index) => {
                row.style.animationDelay = `${index * 50}ms`;
                row.classList.add('expanding-wave');
            });
        } else {
            // Prepare rows for collapse animation
            rows.forEach(row => {
                row.classList.remove('expanding-wave', 'collapsed');
                row.style.transformOrigin = 'top';
                
                const rowHeight = row.offsetHeight;
                row.style.setProperty('--row-height', `${rowHeight}px`);
                row.style.overflow = 'hidden';
            });
            
            // Force a reflow
            void rows[0].offsetHeight;
            
            // Apply animation with staggered delay (reversed for collapse)
            rows.slice().reverse().forEach((row, index) => {
                row.style.animationDelay = `${index * 50}ms`;
                row.classList.add('collapsing-wave');
            });
        }
    }
    
    // Cleanup for batch operations
    private cleanupBatchAnimation(batchId: string, rows: HTMLElement[], wasExpanding: boolean): void {
        // Clear timeout
        const timeout = this.animationTimeouts.get(batchId);
        if (timeout) {
            window.clearTimeout(timeout);
            this.animationTimeouts.delete(batchId);
        }
        
        // Remove from animating set
        this.animatingNodes.delete(batchId);
        
        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });
        
        // Clean up all rows
        rows.forEach(row => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId) return;
            
            // Get direct children
            const directChildren = Array.from(
                this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
            ) as HTMLElement[];
            
            // Remove animation classes and reset styles
            directChildren.forEach(child => {
                child.classList.remove('expanding-wave', 'collapsing-wave');
                child.style.animationDelay = '';
                child.style.height = '';
                child.style.opacity = '';
                child.style.overflow = '';
                child.style.transform = '';
                
                // Set final class based on expanded state
                if (wasExpanding) {
                    child.classList.remove('collapsed');
                } else {
                    child.classList.add('collapsed');
                }
            });
        });
        
        // Call updateExpandedState to ensure UI is consistent
        this.updateExpandedState();
        
        // Save final state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    
    private updateExpandedState(): void {
        // This function updates the UI to reflect the current expanded state
        const allRows = Array.from(
            this.tableDiv.querySelectorAll('tr[data-node-id]')
        ) as HTMLElement[];
        
        allRows.forEach(row => {
            const nodeId = row.getAttribute('data-node-id');
            const parentId = row.getAttribute('data-parent-id');
            
            if (nodeId) {
                // For non-root elements, check if parent is expanded
                if (parentId) {
                    const parentExpanded = this.expandedRows.get(parentId) === true;
                    
                    if (!parentExpanded) {
                        // If parent is collapsed, hide this row
                        row.classList.add('collapsed');
                    } else {
                        // If parent is expanded, show/hide based on this row's state
                        const isExpanded = this.expandedRows.get(nodeId) === true;
                        
                        // Only check direct children
                        const directChildren = Array.from(
                            this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
                        ) as HTMLElement[];
                        
                        directChildren.forEach(child => {
                            if (isExpanded) {
                                child.classList.remove('collapsed');
                            } else {
                                child.classList.add('collapsed');
                            }
                        });
                    }
                } else {
                    // Root level elements - just check their own state
                    const isExpanded = this.expandedRows.get(nodeId) === true;
                    
                    // Update direct children
                    const directChildren = Array.from(
                        this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`)
                    ) as HTMLElement[];
                    
                    directChildren.forEach(child => {
                        if (isExpanded) {
                            child.classList.remove('collapsed');
                        } else {
                            child.classList.add('collapsed');
                        }
                    });
                }
            }
        });
    }

    private showLandingPage(): void {
        console.log("Showing landing page");
        
        // Clear existing content
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild);
        }
        
        // Create container for landing page
        const container = document.createElement('div');
        container.className = 'landing-page-container';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.background = '#13141a'; // Dark background from your HTML
        
        // Insert the HTML
        container.innerHTML = landingPageHTML;
        
        // Store reference and add to DOM
        this.landingPageElement = container;
        this.target.appendChild(container);
        
        console.log("Landing page added to DOM");
        
        // Add event listener to the continue button
        const continueButton = this.landingPageElement.querySelector('.continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLandingPage();
            });
        }
        
        this.isLandingPageOn = true;
    }
    
    private hideLandingPage(): void {
        if (this.isLandingPageOn && this.landingPageElement) {
            console.log("Hiding landing page");
            
            // Remove landing page
            if (this.landingPageElement.parentNode) {
                this.landingPageElement.parentNode.removeChild(this.landingPageElement);
            }
            
            this.isLandingPageOn = false;
            
            // Create container elements for the visual
            this.createContainerElements();
        }
    }
}