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
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
import DataView = powerbi.DataView;
import VisualEnumerationInstanceKinds = powerbi.VisualEnumerationInstanceKinds;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private tableDiv: HTMLDivElement;
    private updateCount: number;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;
    // Store the host reference
    private host: powerbi.extensibility.visual.IVisualHost;
    // Track expanded state
    private expandedRows: Map<string, boolean>;
    // Store the last options for re-rendering
    private lastOptions: VisualUpdateOptions;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.updateCount = 0;
        this.expandedRows = new Map<string, boolean>();

        // Create main container div
        const container = document.createElement("div");
        container.className = "visual-container";
        this.target.appendChild(container);
        
        // Create table container
        this.tableDiv = document.createElement("div");
        this.tableDiv.className = "table-container";
        container.appendChild(this.tableDiv);
    }

    public update(options: VisualUpdateOptions): void {
        // Store the complete options object for later re-renders
        this.lastOptions = options;
        
        // Clear any previous content
        this.tableDiv.innerHTML = "";
        
        // Get formatting settings
        if (options && options.dataViews && options.dataViews[0]) {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
                VisualFormattingSettingsModel,
                options.dataViews[0]
            );
        } else {
            return; // No data to display
        }
        
        try {
            // Check if we have data
            if (!options || !options.dataViews || !options.dataViews[0]) {
                return;
            }
            
            const dataView = options.dataViews[0];
            
            // Check if we have matrix data
            if (!dataView.matrix) {
                return;
            }
            
            const matrix = dataView.matrix;
            
            // Get measure name
            const measureName = this.getMeasureName(dataView);
            
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
            
        } catch (error) {
            console.error("Error in update:", error);
        }
    }
    
    private getMeasureName(dataView: DataView): string {
        // Try to get from matrix valueSources
        if (dataView.matrix && dataView.matrix.valueSources && dataView.matrix.valueSources.length > 0) {
            const valueSource = dataView.matrix.valueSources[0];
            if (valueSource.displayName) {
                return valueSource.displayName;
            }
        }
        
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata && dataView.metadata.columns) {
            const valueColumn = dataView.metadata.columns.find(col => 
                col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
                
            if (valueColumn && valueColumn.displayName) {
                return valueColumn.displayName;
            }
        }
        
        // Default fallback
        return "Amount";
    }
    
    // Generate a unique ID for tracking expanded state
    private getNodeId(node: any, level: number): string {
        const value = node.value !== null && node.value !== undefined ? String(node.value) : "null";
        return `level_${level}_${value}`;
    }
    
    // Check if a node is expanded
    private isExpanded(nodeId: string): boolean {
        return this.expandedRows.get(nodeId) === true;
    }
    
    // Toggle expanded state of a node
    private toggleExpanded(nodeId: string): void {
        this.expandedRows.set(nodeId, !this.isExpanded(nodeId));
    }
    
    // Format a date value according to the format string
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
    
    // Calculate subtotals for a parent node for a specific column index
    private calculateSubtotalForColumn(parentNode: any, columnIndex: number): number {
        if (!parentNode || !parentNode.children || parentNode.children.length === 0) {
            return 0;
        }
        
        let total = 0;
        
        for (const child of parentNode.children) {
            // Access the value for the specific column
            if (child.values && child.values[columnIndex] && 
                child.values[columnIndex].value !== null && 
                child.values[columnIndex].value !== undefined &&
                typeof child.values[columnIndex].value === 'number') {
                total += child.values[columnIndex].value;
            }
        }
        
        return total;
    }
    
    // Apply global border settings to all cells
    private applyGlobalBorders(table: HTMLTableElement): void {
        const borderSettings = this.formattingSettings.borderSettings;
        
        if (!borderSettings || !borderSettings.show.value) {
            // If borders are turned off, remove all borders
            table.classList.remove('with-borders');
            table.classList.remove('with-horizontal-borders');
            table.classList.remove('with-vertical-borders');
            return;
        }
        
        // Get border color and width
        const borderColor = borderSettings.color.value.value;
        const borderWidth = borderSettings.width.value;
        const showHorizontal = borderSettings.horizontalBorders.value;
        const showVertical = borderSettings.verticalBorders.value;
        
        // Set base border style
        const borderStyle = `${borderWidth}px solid ${borderColor}`;
        
        // Add classes based on which borders are enabled
        table.classList.add('with-borders');
        
        if (showHorizontal) {
            table.classList.add('with-horizontal-borders');
        } else {
            table.classList.remove('with-horizontal-borders');
        }
        
        if (showVertical) {
            table.classList.add('with-vertical-borders');
        } else {
            table.classList.remove('with-vertical-borders');
        }
        
        // Set CSS variables for border styling
        table.style.setProperty('--border-color', borderColor);
        table.style.setProperty('--border-width', `${borderWidth}px`);
        table.style.setProperty('--border-style', 'solid');
    }
    
    // Initialize expanded state for new nodes
    private initializeExpandedState(rows: any[], level: number, parentId: string): void {
        if (!rows) return;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const nodeId = parentId + this.getNodeId(row, level);
            
            // Set to expanded if not already set (default to expanded)
            if (!this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true); // Default to expanded
            }
            
            // Initialize children recursively
            if (row.children && row.children.length > 0) {
                this.initializeExpandedState(row.children, level + 1, nodeId);
            }
        }
    }
    
    private createMatrixTable(matrix: powerbi.DataViewMatrix, measureName: string): void {
        // Create table
        const table = document.createElement("table");
        table.className = "matrix-table";
        
        // Set hover effects based on settings
        if (this.formattingSettings.generalSettings.enableHover.value) {
            table.classList.add("hover-enabled");
        }
        
        this.tableDiv.appendChild(table);
        
        // Check if we have rows
        if (!matrix.rows || !matrix.rows.root) {
            return;
        }
        
        let columns: any[] = [];
        let columnFormats: string[] = [];
        
        if (matrix.columns && matrix.columns.root && matrix.columns.root.children) {
            columns = matrix.columns.root.children;
            
            // Extract column formats if columns are dates
            if (matrix.columns.levels && matrix.columns.levels.length > 0 && 
                matrix.columns.levels[0].sources && matrix.columns.levels[0].sources.length > 0) {
                const columnSource = matrix.columns.levels[0].sources[0];
                if (columnSource.format) {
                    // Use the same format for all columns if they come from the same source
                    columnFormats = columns.map(() => columnSource.format);
                }
            }
        } else {
            // If no columns, create a single column for the measure
            columns = [{ value: null }]; // Empty column header
            columnFormats = [""];
        }
        
        // Get column width setting
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        
        // Create header row
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        
        // Add corner cell that stays fixed when scrolling in both directions
        const cornerCell = document.createElement("th");
        cornerCell.className = "matrix-corner-cell column-header row-header";
        
        // Apply column header formatting to corner cell
        this.applyColumnHeaderFormatting(cornerCell);
        headerRow.appendChild(cornerCell);
        
        // Add column headers
        for (let i = 0; i < columns.length; i++) {
            const th = document.createElement("th");
            th.className = "column-header";
            
            // Apply column width
            if (columnWidth) {
                th.style.minWidth = `${columnWidth}px`;
                th.style.width = `${columnWidth}px`;
            }
            
            // Apply column header formatting
            this.applyColumnHeaderFormatting(th);
            
            // Set header text
            const column = columns[i];
            if (column.value !== null && column.value !== undefined) {
                // Format date headers properly
                if (column.isDate || (typeof column.value === 'object' && column.value.epochTimeStamp)) {
                    th.textContent = this.formatDateValue(column.value, columnFormats[i] || "d");
                } else {
                    th.textContent = String(column.value);
                }
            } else if (this.formattingSettings.generalSettings.showMeasureName.value) {
                // Use measure name if column is empty and showMeasureName is true
                th.textContent = measureName;
            } else {
                th.textContent = "";
            }
            
            headerRow.appendChild(th);
        }
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create table body
        const tbody = document.createElement("tbody");
        table.appendChild(tbody);
        
        // Initialize all new rows to expanded state if not already set
        if (matrix.rows.root.children) {
            this.initializeExpandedState(matrix.rows.root.children, 0, "");
        }
        
        // Render rows recursively with subtotals
        if (matrix.rows.root.children) {
            this.renderRowsWithSubtotals(table, matrix.rows.root.children, columns, 0, "");
        }
        
        // Apply formatting
        this.applyFormatting(table);
        
        // Apply global border settings
        this.applyGlobalBorders(table);
    }
    
    // Recursive function to render rows with subtotals
    private renderRowsWithSubtotals(
        table: HTMLTableElement, 
        rows: any[], 
        columns: any[], 
        level: number = 0, 
        parentId: string = ""
    ): void {
        if (!rows || rows.length === 0) return;
        
        const tbody = table.querySelector('tbody') as HTMLTableSectionElement;
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        const applySubtotalToLevel0 = this.formattingSettings.subtotalFormatSettings.applyToLevel0.value;
        
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const nodeId = parentId + this.getNodeId(row, level);
            const isExpanded = this.isExpanded(nodeId);
            const isLevel0 = level === 0;
            
            // Create row
            const tr = document.createElement("tr");
            tr.setAttribute("data-node-id", nodeId);
            tr.setAttribute("data-level", String(level));
            
            if (isLevel0) {
                tr.classList.add("level-0-row");
            }
            
            // Add row header with appropriate indentation
            const rowHeader = document.createElement("th");
            rowHeader.className = "row-header";
            
            if (isLevel0) {
                rowHeader.classList.add("level-0-header");
            }
            
            // Apply row header width
            const rowHeaderWidth = this.formattingSettings.generalSettings.rowHeaderWidth.value;
            if (rowHeaderWidth) {
                rowHeader.style.minWidth = `${rowHeaderWidth}px`;
                rowHeader.style.width = `${rowHeaderWidth}px`;
            }
            // Create header content with indentation and toggle if needed
            const headerContent = document.createElement("div");
            headerContent.className = "row-header-content";
            headerContent.style.marginLeft = `${level * 20}px`;
            
            // Add toggle button if has children
            if (row.children && row.children.length > 0) {
                const toggleButton = document.createElement("span");
                toggleButton.className = "toggle-button";
                toggleButton.textContent = isExpanded ? "▼" : "►";
                toggleButton.onclick = (event) => {
                    event.stopPropagation();
                    // Toggle the expanded state
                    this.toggleExpanded(nodeId);
                    // Use our improved rendering method
                    this.renderVisualWithCurrentState();
                };
                headerContent.appendChild(toggleButton);
            } else {
                // Add a spacer for better alignment
                const spacer = document.createElement("span");
                spacer.className = "toggle-spacer";
                spacer.textContent = "  ";
                headerContent.appendChild(spacer);
            }
            
            // Add the actual row label
            const label = document.createElement("span");
            // Format date row headers properly
            if (row.isDate || (typeof row.value === 'object' && row.value.epochTimeStamp)) {
                label.textContent = this.formatDateValue(row.value);
            } else {
                label.textContent = row.value !== null && row.value !== undefined ? String(row.value) : "";
            }
            
            headerContent.appendChild(label);
            rowHeader.appendChild(headerContent);
            
            // Apply row header formatting - different for Level 0 if setting enabled
            if (isLevel0 && applySubtotalToLevel0) {
                this.applyLevel0HeaderFormatting(rowHeader);
            } else {
                this.applyRowHeaderFormatting(rowHeader);
            }
            
            tr.appendChild(rowHeader);
            
            // Add data cells 
            if (row.children && row.children.length > 0) {
                // Calculate and display subtotals for each column
                for (let j = 0; j < columns.length; j++) {
                    const td = document.createElement("td");
                    td.className = "data-cell subtotal-cell";
                    
                    if (isLevel0) {
                        td.classList.add("level-0-subtotal");
                    }
                    
                    // Apply column width to cells
                    if (columnWidth) {
                        td.style.minWidth = `${columnWidth}px`;
                        td.style.width = `${columnWidth}px`;
                    }
                    
                    // Calculate subtotal for this specific column
                    const subtotal = this.calculateSubtotalForColumn(row, j);
                    
                    // Only display the subtotal if it's not zero
                    if (subtotal !== 0) {
                        td.textContent = this.formatNumber(subtotal);
                    } else {
                        td.textContent = "";
                    }
                    
                    tr.appendChild(td);
                }
            } else if (row.values) {
                // Regular data cells
                for (let j = 0; j < columns.length; j++) {
                    const td = document.createElement("td");
                    td.className = "data-cell";
                    
                    // Apply column width to cells
                    if (columnWidth) {
                        td.style.minWidth = `${columnWidth}px`;
                        td.style.width = `${columnWidth}px`;
                    }
                    
                    // Get cell value
                    const value = row.values[j];
                    
                    if (value !== null && value !== undefined) {
                        if (typeof value === 'number') {
                            td.textContent = this.formatNumber(value);
                        } else if (typeof value === 'object') {
                            // Extract value from object
                            if ('value' in value) {
                                const cellValue = value.value;
                                if (typeof cellValue === 'number') {
                                    td.textContent = this.formatNumber(cellValue);
                                } else if (cellValue === null || cellValue === undefined || 
                                          (typeof cellValue === 'object' && Object.keys(cellValue).length === 0)) {
                                    // Handle empty objects
                                    td.textContent = "";
                                } else {
                                    td.textContent = String(cellValue);
                                }
                            } else if (Object.keys(value).length === 0) {
                                // Handle empty objects
                                td.textContent = "";
                            } else {
                                td.textContent = JSON.stringify(value);
                            }
                        } else {
                            td.textContent = String(value);
                        }
                    } else {
                        td.textContent = "";
                    }
                    
                    tr.appendChild(td);
                }
            }
            
            tbody.appendChild(tr);
            
            // If this node has children and is expanded, render its children
            if (row.children && row.children.length > 0 && isExpanded) {
                this.renderRowsWithSubtotals(table, row.children, columns, level + 1, nodeId);
            }
            
            // If this is the last row at the bottom level, add a blank row if enabled
            if ((!row.children || row.children.length === 0) && 
                i === rows.length - 1 && 
                this.formattingSettings.blankRowSettings.enableBlankRows.value) {
                
                // Create blank row
                const blankRow = document.createElement("tr");
                blankRow.className = "blank-row";
                
                // Set the height if specified
                const rowHeight = this.formattingSettings.blankRowSettings.height.value;
                if (rowHeight > 0) {
                    blankRow.style.height = `${rowHeight}px`;
                }
                
                // Create a cell that spans all columns
                const blankCell = document.createElement("td");
                blankCell.colSpan = columns.length + 1; // +1 for row header column
                
                // Apply background color from settings
                const bgColor = this.formattingSettings.blankRowSettings.backgroundColor.value.value;
                if (bgColor) {
                    blankCell.style.backgroundColor = bgColor;
                }
                
                // Add the cell to the row and the row to the table
                blankRow.appendChild(blankCell);
                tbody.appendChild(blankRow);
            }
        }
    }
    
    private formatNumber(value: number): string {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
    
    private applyColumnHeaderFormatting(headerCell: HTMLTableCellElement): void {
        if (!this.formattingSettings) return;
        
        const headerFormat = this.formattingSettings.columnHeaderFormatSettings;
        
        // Apply background color
        if (headerFormat.backgroundColor.value.value) {
            headerCell.style.backgroundColor = headerFormat.backgroundColor.value.value;
        }
        
        // Apply font color
        if (headerFormat.fontColor.value.value) {
            headerCell.style.color = headerFormat.fontColor.value.value;
        }
        
        // Apply font weight
        if (headerFormat.bold.value) {
            headerCell.style.fontWeight = 'bold';
        } else {
            headerCell.style.fontWeight = 'normal';
        }
    }
    
    /**
     * Apply formatting to row headers
     */
    private applyRowHeaderFormatting(headerCell: HTMLTableCellElement): void {
        if (!this.formattingSettings) return;
        
        const headerFormat = this.formattingSettings.rowHeaderFormatSettings;
        
        // Apply background color
        if (headerFormat.backgroundColor.value.value) {
            headerCell.style.backgroundColor = headerFormat.backgroundColor.value.value;
        }
        
        // Apply font color
        if (headerFormat.fontColor.value.value) {
            headerCell.style.color = headerFormat.fontColor.value.value;
        }
        
        // Apply font weight
        if (headerFormat.bold.value) {
            headerCell.style.fontWeight = 'bold';
        } else {
            headerCell.style.fontWeight = 'normal';
        }
    }
    
    /**
     * Apply subtotal formatting to Level 0 row headers
     */
    private applyLevel0HeaderFormatting(headerCell: HTMLTableCellElement): void {
        if (!this.formattingSettings) return;
        
        const subtotalFormat = this.formattingSettings.subtotalFormatSettings;
        
        // Apply background color
        if (subtotalFormat.backgroundColor.value.value) {
            headerCell.style.backgroundColor = subtotalFormat.backgroundColor.value.value;
        }
        
        // Apply font color
        if (subtotalFormat.fontColor.value.value) {
            headerCell.style.color = subtotalFormat.fontColor.value.value;
        }
        
        // Apply font styling
        if (subtotalFormat.bold.value) {
            headerCell.style.fontWeight = 'bold';
        } else {
            headerCell.style.fontWeight = 'normal';
        }
        
        if (subtotalFormat.italic.value) {
            headerCell.style.fontStyle = 'italic';
        } else {
            headerCell.style.fontStyle = 'normal';
        }
    }
    
    private applyFormatting(table: HTMLTableElement): void {
        if (!this.formattingSettings) {
            return;
        }
        
        try {
            // Get settings
            const general = this.formattingSettings.generalSettings;
            const font = this.formattingSettings.fontFormatSettings;
            const subtotalFormat = this.formattingSettings.subtotalFormatSettings;
            const applySubtotalToLevel0 = subtotalFormat.applyToLevel0.value;
            
            // Apply general font size to table
            table.style.fontSize = `${general.fontSize.value}pt`;
            
            // Apply font family
            if (font.fontFamily.value) {
                table.style.fontFamily = font.fontFamily.value;
            }
            
            // Get all data cells by type
            const regularCells = table.querySelectorAll('td.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
            const subtotalCells = table.querySelectorAll('td.subtotal-cell:not(.level-0-subtotal)');
            const level0Cells = table.querySelectorAll('td.level-0-subtotal');
            
            // Apply formatting to regular cells
            regularCells.forEach((cell: HTMLTableCellElement) => {
                this.applyDataCellFormatting(cell, font, false, false);
            });
            
            // Apply formatting to subtotal cells with explicit styling
            subtotalCells.forEach((cell: HTMLTableCellElement) => {
                this.applyDataCellFormatting(cell, font, true, false);
            });
            
            // Apply separate formatting to level 0 cells if the setting is enabled
            level0Cells.forEach((cell: HTMLTableCellElement) => {
                if (applySubtotalToLevel0) {
                    this.applySubtotalCellFormatting(cell);
                } else {
                    this.applyDataCellFormatting(cell, font, true, false);
                }
            });
            
        } catch (error) {
            console.error("Error applying formatting:", error);
        }
    }
    
    // Helper function to apply data cell formatting
    private applyDataCellFormatting(
        cell: HTMLTableCellElement, 
        font: any, 
        isSubtotal: boolean, 
        isLevel0: boolean
    ): void {
        // Font color
        if (font.color.value.value) {
            cell.style.color = font.color.value.value;
        }
        
        // Font style
        if (isSubtotal || font.bold.value) {
            cell.style.fontWeight = 'bold';
        }
        
        if (font.italic.value) {
            cell.style.fontStyle = 'italic';
        }
        
        if (font.underline.value) {
            cell.style.textDecoration = 'underline';
        }
        
        // Background color
        if (font.backgroundColor.value.value) {
            if (isSubtotal) {
                // Use a slightly different background for subtotals
                const subtotalBg = this.adjustColor(font.backgroundColor.value.value, -10);
                cell.style.backgroundColor = subtotalBg;
            } else {
                cell.style.backgroundColor = font.backgroundColor.value.value;
            }
        }
    }
    
    // Apply formatting from subtotal settings to level 0 cells
    private applySubtotalCellFormatting(cell: HTMLTableCellElement): void {
        if (!this.formattingSettings) return;
        
        const subtotalFormat = this.formattingSettings.subtotalFormatSettings;
        
        // Font color
        if (subtotalFormat.fontColor.value.value) {
            cell.style.color = subtotalFormat.fontColor.value.value;
        }
        
        // Font style
        if (subtotalFormat.bold.value) {
            cell.style.fontWeight = 'bold';
        }
        
        if (subtotalFormat.italic.value) {
            cell.style.fontStyle = 'italic';
        }
        
        // Background color
        if (subtotalFormat.backgroundColor.value.value) {
            cell.style.backgroundColor = subtotalFormat.backgroundColor.value.value;
        }
    }
    
    // Helper function to adjust color brightness
    private adjustColor(color: string, amount: number): string {
        // Handle empty or invalid colors
        if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
            return color;
        }
        
        try {
            // Default to a light gray if we can't parse the color
            let defaultColor = '#f0f0f0';
            
            // Convert hex to RGB
            let hex = color;
            if (hex.startsWith('#')) {
                hex = hex.slice(1);
            }
            
            // If not a proper hex color, return a default slightly darker color
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
            // Return a default color if there's an error
            console.error("Error adjusting color:", error);
            return amount < 0 ? '#e0e0e0' : '#f5f5f5';
        }
    }
    
    // Helper method for controlled re-rendering of the visual
    private renderVisualWithCurrentState(): void {
        // Use a small timeout to ensure DOM updates
        setTimeout(() => {
            if (this.lastOptions) {
                try {
                    // Store current scroll position to restore after rebuild
                    const scrollTop = this.tableDiv.scrollTop;
                    const scrollLeft = this.tableDiv.scrollLeft;
                    
                    // Clear current content
                    this.tableDiv.innerHTML = "";
                    
                    // Check if we have data
                    if (!this.lastOptions || !this.lastOptions.dataViews || !this.lastOptions.dataViews[0]) {
                        return;
                    }
                    
                    const dataView = this.lastOptions.dataViews[0];
                    
                    // Check if we have matrix data
                    if (!dataView.matrix) {
                        return;
                    }
                    
                    const matrix = dataView.matrix;
                    
                    // Get measure name
                    const measureName = this.getMeasureName(dataView);
                    
                    // Rebuild the matrix table
                    this.createMatrixTable(matrix, measureName);
                    
                    // Restore scroll position
                    this.tableDiv.scrollTop = scrollTop;
                    this.tableDiv.scrollLeft = scrollLeft;
                    
                } catch (error) {
                    console.error("Error in visual re-render:", error);
                }
            }
        }, 10); // Small delay to ensure DOM updates first
    }
    
    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}