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

// Import landing page HTML templates
const landingPage1HTML = require("!!raw-loader!../style/landingPage1.html").default;
const landingPage2HTML = require("!!raw-loader!../style/landingPage2.html").default;
const landingPage3HTML = require("!!raw-loader!../style/landingPage3.html").default;

// Interface for matrix data
interface MatrixNode {
    value?: any; 
    children?: MatrixNode[];
    values?: any | { [id: number]: any }; 
    isDate?: boolean;
}

// CSS class constants
// Animation timing. These must stay in step with the durations in visual.less:
// .expanding-wave / .collapsing-wave. The safety timeout below is derived from
// them rather than hardcoded, so a timing change cannot silently release the
// animation lock while rows are still moving.
// Virtualization. Below THRESHOLD rows the whole body is rendered, which keeps
// ordinary reports on a simple path; above it only the scrolled-to window plus
// OVERSCAN rows above and below exist in the DOM.
// Where Power BI delivers a format string the user overrode in the report.
// valueFormatter.getFormatString() reads this; getFormatStringByColumn() reads
// column.format instead. Neither reads both, so resolveFormatString() does.
const FORMAT_STRING_PROP: powerbi.DataViewObjectPropertyIdentifier = {
    objectName: "general",
    propertyName: "formatString",
};

const VIRTUAL = {
    THRESHOLD: 150,
    OVERSCAN: 12,
    /** Fallback until a real row has been measured. */
    ESTIMATED_ROW_HEIGHT: 37,
};

/** One row in the flat model: enough to build its DOM on demand. */
interface RowEntry {
    kind: 'data' | 'blank';
    nodeId: string;
    parentId: string;
    level: number;
    node: any;
    hasChildren: boolean;
    isLevel0: boolean;
}

const ANIM = {
    EXPAND_MS: 280,
    COLLAPSE_MS: 220,
    STAGGER_MS: 22,
    /**
     * Total time the stagger may span, however many rows there are. Without a
     * cap, "collapse all" over a screenful of rows multiplies the per-row delay
     * by the row count and cascades tier by tier for seconds.
     */
    MAX_STAGGER_TOTAL_MS: 240,
    /** Per-row delay, shrunk so the whole run fits inside MAX_STAGGER_TOTAL_MS. */
    staggerFor(count: number): number {
        if (count <= 1) return 0;
        return Math.min(ANIM.STAGGER_MS, ANIM.MAX_STAGGER_TOTAL_MS / (count - 1));
    },
    /** Worst-case wall time for a staggered run over `count` rows. */
    totalMs(count: number, isExpand: boolean): number {
        const duration = isExpand ? ANIM.EXPAND_MS : ANIM.COLLAPSE_MS;
        return duration + ANIM.staggerFor(count) * Math.max(0, count - 1) + 120;
    }
};

const CSS_CLASSES = {
    VISUAL_CONTAINER: "visual-container",
    TABLE_CONTAINER: "table-container",
    MATRIX_GRID: "matrix-grid",
    GRID_HEADER: "grid-header",
    GRID_BODY: "grid-body",
    GRID_FOOTER: "grid-footer",
    GRID_ROW: "grid-row",
    GRID_CELL: "grid-cell",
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
    private contextMenu: HTMLElement;
    
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
    
    // Context menu state
    private activeNodeId: string = null;
    private activeLevel: number = null;
    private activeCell: HTMLElement = null;
    
    // Landing page state
    private currentLandingPage: number = 1;
    private landingPageElement: HTMLElement;
    private isLandingPageOn: boolean = false;
    private landingPageRemoved: boolean = false;

    // Virtualization state. rowModel is every row in preorder; visibleRows is
    // the subset whose ancestors are all expanded. The DOM mirrors a window
    // into visibleRows, bracketed by two spacer divs that stand in for the
    // rows above and below it so the scrollbar stays honest.
    private rowModel: RowEntry[] = [];
    private visibleRows: RowEntry[] = [];
    private renderColumns: any[] = [];
    /** Format string per leaf column, aligned with `row.values[j]`. */
    private valueFormats: string[] = [];
    private gridBody: HTMLElement = null;
    private topSpacer: HTMLElement = null;
    private bottomSpacer: HTMLElement = null;
    private measuredRowHeight: number = 0;
    private windowStart: number = 0;
    private windowEnd: number = 0;
    private scrollRafPending: boolean = false;
    private onScroll: () => void = null;

    // Incremental data fetching state (restored from 6b61ebe)
    private hasMoreData: boolean = false;
    private isLoadingMore: boolean = false;
    private loadMoreButton: HTMLButtonElement;

    //=========================================================================
    // INITIALIZATION
    //=========================================================================
    
    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new FormattingSettingsService();
        this.expandedRows = new Map<string, boolean>();
        // Populate defaults so the Format pane works before any data arrives.
        // update() returns early with no data, so this is otherwise never set.
        this.formattingSettings = new VisualFormattingSettingsModel();
        this.createContainerElements();
    }

    private createContainerElements(): void {
        // Create main container
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
        this.createContextMenu();
    }

    private createContextMenu(): void {
        const contextMenu = document.createElement("div");
        contextMenu.className = "custom-context-menu";
        contextMenu.style.display = "none";
        contextMenu.style.position = "absolute";
        contextMenu.style.zIndex = "1000";
        
        // Add Copy Value option
        const copyItem = document.createElement("div");
        copyItem.className = "context-menu-item";
        copyItem.setAttribute("data-action", "copyValue");
        copyItem.textContent = "Copy Value";
        contextMenu.appendChild(copyItem);
        
        // Add separator
        const separator = document.createElement("div");
        separator.className = "context-menu-separator";
        contextMenu.appendChild(separator);
        
        // Add expand/collapse menu items
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
        
        this.target.appendChild(contextMenu);
        this.contextMenu = contextMenu;
        this.setupContextMenuEvents();
    }

    //=========================================================================
    // CORE VISUAL METHODS
    //=========================================================================

    public update(options: VisualUpdateOptions): void {
        // Check if we have data
        const hasData = options.dataViews && 
                     options.dataViews[0]?.metadata?.columns?.length > 0;
        
        if (!hasData) {
            this.showLandingPage();
            return;
        } 
        
        this.hideLandingPage();
        this.updateVisualWithData(options);
    }
    
    private updateVisualWithData(options: VisualUpdateOptions): void {
        this.lastOptions = options;
        
        // Save scroll position & expanded state before clearing
        const scrollTop = this.tableDiv?.scrollTop || 0;
        const scrollLeft = this.tableDiv?.scrollLeft || 0;
        
        if (this.expandedRows?.size > 0) {
            Visual.savedExpandedState = new Map<string, boolean>(this.expandedRows);
        }
        
        // Clear previous content
        this.tableDiv.innerHTML = '';
        
        // Validate data
        if (!options?.dataViews?.[0]) return;
        
        // Get formatting settings
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews[0]
        );
        
        try {
            const dataView = options.dataViews[0];
            this.cachedFormatString = this.getFormatString(dataView);
            
            if (!dataView.matrix) return;
            
            // Check if there's more data to load and update flags
            this.hasMoreData = !!dataView.metadata?.segment;
            if (options.operationKind === powerbi.VisualDataChangeOperationKind.Append) {
                this.isLoadingMore = false; // Reset loading flag on successful append
            }
            
            // Restore the expanded state
            if (Visual.savedExpandedState.size > 0) {
                this.expandedRows = new Map<string, boolean>(Visual.savedExpandedState);
            }
            
            const matrix = dataView.matrix;
            const measureName = this.getMeasureName(dataView);
            
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
            
            // Add "Load More" button if there's more data
            this.updateLoadMoreButton();
            
            // Restore scroll position
            this.tableDiv.scrollTop = scrollTop;
            this.tableDiv.scrollLeft = scrollLeft;
            
        } catch (error) {
            console.error("Error in update:", error);
        }
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        if (!this.formattingSettings) {
            this.formattingSettings = new VisualFormattingSettingsModel();
        }
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

    private getFormatString(dataView: DataView): string {
        const candidates: powerbi.DataViewMetadataColumn[] = [];

        const firstSource = dataView.matrix?.valueSources?.[0];
        if (firstSource) candidates.push(firstSource);

        // The measure's own metadata column, which often carries .format when
        // the value source does not.
        const valueColumn = dataView.metadata?.columns?.find(col =>
            col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
        if (valueColumn) candidates.push(valueColumn);

        // Same tiered precedence as resolveFormatString().
        for (const candidate of candidates) {
            const override = valueFormatter.getFormatString(candidate, FORMAT_STRING_PROP, true);
            if (override) return override;
        }
        for (const candidate of candidates) {
            if (candidate.format) return candidate.format;
        }
        for (const candidate of candidates) {
            const byType = valueFormatter.getFormatStringByColumn(candidate);
            if (byType) return byType;
        }

        return "#,0.00"; // Default fallback format
    }

    /**
     * Finds the metadata column that really describes a value source.
     *
     * `matrix.valueSources` entries do not always carry the model's format
     * string; the fuller record lives in `dataView.metadata.columns`. Matching
     * on queryName (falling back to displayName) recovers it.
     */
    private matchMetadataColumn(
        source: powerbi.DataViewMetadataColumn,
        dataView: DataView
    ): powerbi.DataViewMetadataColumn {
        const columns = dataView?.metadata?.columns;
        if (!source || !columns) return null;

        if (source.queryName) {
            const byQuery = columns.find(c => c.queryName === source.queryName);
            if (byQuery) return byQuery;
        }
        return columns.find(c => c.displayName === source.displayName) || null;
    }

    /**
     * Resolves one column's format string, most specific first. A measure's
     * model format can arrive in any of these depending on the model, so
     * checking only one is why a currency measure rendered as #,0.00:
     *
     *   1. objects.general.formatString on the value source  (report override;
     *      Power BI only populates it because capabilities declares it)
     *   2. .format on the value source                       (model format)
     *   3. the same two on the matching dataView.metadata.columns entry,
     *      which is often the only one carrying .format
     *   4. a type-derived default (dates, integers, years)
     */
    private resolveFormatString(
        column: powerbi.DataViewMetadataColumn,
        dataView?: DataView
    ): string {
        if (!column) return this.cachedFormatString;

        const candidates: powerbi.DataViewMetadataColumn[] = [column];
        const matched = dataView ? this.matchMetadataColumn(column, dataView) : null;
        if (matched && matched !== column) candidates.push(matched);

        // Precedence runs across ALL candidates one tier at a time, not tier by
        // tier within each candidate -- otherwise a model .format on the value
        // source would beat a report override living on the metadata column.
        for (const candidate of candidates) {
            const override = valueFormatter.getFormatString(candidate, FORMAT_STRING_PROP, true);
            if (override) return override;
        }
        for (const candidate of candidates) {
            if (candidate.format) return candidate.format;
        }
        for (const candidate of candidates) {
            const byType = valueFormatter.getFormatStringByColumn(candidate);
            if (byType) return byType;
        }

        return this.cachedFormatString;
    }

    /**
     * One format per leaf column. With several measures the leaf columns cycle
     * through them, so measure #2 no longer inherits measure #1's format.
     */
    private buildValueFormats(dataView: DataView, columnCount: number): string[] {
        const sources = dataView.matrix?.valueSources ?? [];
        const formats: string[] = [];

        for (let j = 0; j < columnCount; j++) {
            const source = sources.length ? sources[j % sources.length] : null;
            formats.push(source
                ? this.resolveFormatString(source, dataView)
                : this.cachedFormatString);
        }
        return formats;
    }

    /** Format for leaf column `j`, falling back to the cached measure format. */
    private formatForColumn(j: number): string {
        return this.valueFormats[j] || this.cachedFormatString;
    }

    private formatNumber(value: number, formatString?: string): string {
        formatString = formatString || this.cachedFormatString;
        const formatter = valueFormatter.create({ format: formatString });
        return formatter.format(value);
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

    private formatCellValue(value: any, formatString?: string): string {
        if (value === null || value === undefined) {
            return "";
        }

        if (typeof value === 'number') {
            return this.formatNumber(value, formatString);
        }
        
        if (typeof value === 'object') {
            // Extract value from object
            if ('value' in value) {
                const cellValue = value.value;
                if (typeof cellValue === 'number') {
                    return this.formatNumber(cellValue, formatString);
                }else if (cellValue === null || cellValue === undefined || 
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
        // Create the grid container. Rows are <div>s, not <tr>s, so height /
        // transform / overflow are legal on them and animations actually render.
        const table = document.createElement("div");
        table.className = CSS_CLASSES.MATRIX_GRID;
        
        this.tableDiv.appendChild(table);
        
        // Check if we have rows
        if (!matrix.rows?.root) {
            return;
        }
        
        // Process columns
        const { columns, columnFormats } = this.processColumns(matrix, measureName);
        
        // One shared track definition drives every row, which is what keeps
        // columns aligned without a table layout algorithm.
        this.applyGridTemplate(table, columns.length);
        
        // Create grid header
        this.createTableHeader(table, columns, columnFormats);
        
        // Create grid body
        const tbody = document.createElement("div");
        tbody.className = CSS_CLASSES.GRID_BODY;
        table.appendChild(tbody);
        this.gridBody = tbody;
        this.renderColumns = columns;
        this.valueFormats = this.buildValueFormats(this.lastOptions.dataViews[0], columns.length);

        // Initialize level 0 items as expanded if not already set
        if (matrix.rows.root.children) {
            matrix.rows.root.children.forEach((row) => {
                const nodeId = this.getNodeId(row, 0);
                if (!this.expandedRows.has(nodeId)) {
                    this.expandedRows.set(nodeId, true); // Level 0 default to expanded
                }
            });
        }

        // Flatten the tree, then render only the window that is on screen.
        this.rowModel = [];
        if (matrix.rows.root.children) {
            this.buildRowModel(matrix.rows.root.children, 0, "");
        }
        this.refreshRows();
        this.attachScrollListener();
        
        // Calculate grand totals
        const grandTotals = this.calculateGrandTotals(matrix, columns);
    
        // Add grand total row
        this.addGrandTotalRow(table, columns, grandTotals);
    
        // Apply all formatting
        this.applyTableFormatting(table);
        
        // Save expanded state after table creation
        Visual.savedExpandedState = new Map(this.expandedRows);
    }

    /**
     * Publishes the column tracks as a custom property on the grid container.
     * Every row (header, body, footer) inherits it, so all rows stay aligned
     * with a single source of truth instead of per-cell width styles.
     */
    private applyGridTemplate(grid: HTMLElement, columnCount: number): void {
        const general = this.formattingSettings.generalSettings;
        const rowHeaderWidth = general.rowHeaderWidth.value || 200;
        const columnWidth = general.columnWidth.value || 100;
        
        grid.style.setProperty(
            '--grid-cols',
            `${rowHeaderWidth}px repeat(${columnCount}, ${columnWidth}px)`
        );
        grid.style.setProperty('--row-header-width', `${rowHeaderWidth}px`);
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
    
    private createTableHeader(table: HTMLElement, columns: any[], columnFormats: string[]): void {
        const thead = document.createElement("div");
        thead.className = CSS_CLASSES.GRID_HEADER;
        const headerRow = document.createElement("div");
        headerRow.className = CSS_CLASSES.GRID_ROW;
        
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

    /**
     * Walks the matrix tree once and flattens it into `rowModel` in display
     * order. Builds no DOM: what is actually rendered is decided later by
     * computeVisibleRows() and renderVisibleWindow().
     */
    private buildRowModel(rows: any[], level: number = 0, parentId: string = ""): void {
        if (!rows?.length) return;

        const blankRowSettings = this.formattingSettings.blankRowSettings;
        const blankRowsOn = blankRowSettings.enableBlankRows.value;

        rows.forEach((row, rowIndex) => {
            const nodeId = parentId + this.getNodeId(row, level);

            // Default to expanded for level 0 if not explicitly set
            if (level === 0 && !this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true);
            }

            const hasChildren = row.children?.length > 0;

            this.rowModel.push({
                kind: 'data',
                nodeId,
                parentId,
                level,
                node: row,
                hasChildren,
                isLevel0: level === 0,
            });

            if (hasChildren) {
                this.buildRowModel(row.children, level + 1, nodeId);
            }

            // Separator after each level-0 group except the last.
            if (blankRowsOn && level === 0 && rowIndex < rows.length - 1) {
                this.rowModel.push({
                    kind: 'blank',
                    nodeId: nodeId + '__blank',
                    parentId: '',
                    level: 0,
                    node: null,
                    hasChildren: false,
                    isLevel0: true,
                });
            }
        });
    }

    /**
     * Narrows rowModel to the rows whose ancestors are all expanded. Because
     * the model is in preorder, one pass suffices: when a collapsed parent is
     * seen, everything deeper than it is skipped until we surface again.
     */
    private computeVisibleRows(): void {
        const visible: RowEntry[] = [];
        let hiddenBelowLevel = Number.POSITIVE_INFINITY;

        for (const entry of this.rowModel) {
            if (entry.level > hiddenBelowLevel) continue;   // inside a collapsed subtree
            hiddenBelowLevel = Number.POSITIVE_INFINITY;    // surfaced again

            visible.push(entry);

            if (entry.hasChildren && this.expandedRows.get(entry.nodeId) !== true) {
                hiddenBelowLevel = entry.level;
            }
        }

        this.visibleRows = visible;
    }

    /** Builds the DOM for one model entry. */
    private createRowElement(entry: RowEntry): HTMLElement {
        if (entry.kind === 'blank') {
            return this.createBlankRow();
        }

        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        const isExpanded = this.expandedRows.get(entry.nodeId) ?? false;

        const tr = document.createElement("div");
        tr.className = CSS_CLASSES.GRID_ROW;
        tr.setAttribute("data-node-id", entry.nodeId);
        tr.setAttribute("data-level", String(entry.level));

        if (entry.parentId) {
            tr.setAttribute("data-parent-id", entry.parentId);
        }

        if (entry.level > 0) {
            tr.classList.add("expandable-row");
        }

        if (entry.isLevel0) {
            tr.classList.add(CSS_CLASSES.LEVEL_0_ROW);
        }

        if (entry.hasChildren) {
            tr.classList.add(CSS_CLASSES.SUBTOTAL_ROW);
        }

        const rowHeader = this.createRowHeader(
            entry.node, entry.level, entry.nodeId, isExpanded, entry.isLevel0);
        tr.appendChild(rowHeader);

        if (entry.hasChildren) {
            this.addSubtotalCells(tr, entry.node, this.renderColumns, entry.isLevel0, columnWidth);
        } else if (entry.node.values) {
            this.addDataCells(tr, entry.node, this.renderColumns, columnWidth);
        }

        return tr;
    }

    /**
     * Renders the slice of visibleRows around the current scroll offset, with
     * a spacer above and below standing in for the rows that are not rendered.
     * Below VIRTUAL.THRESHOLD rows the slice is simply everything.
     */
    private renderVisibleWindow(): void {
        if (!this.gridBody) return;

        const total = this.visibleRows.length;
        const rowHeight = this.measuredRowHeight || VIRTUAL.ESTIMATED_ROW_HEIGHT;

        let start = 0;
        let end = total;

        if (total > VIRTUAL.THRESHOLD) {
            const viewport = this.tableDiv.clientHeight || 600;
            const scrollTop = this.tableDiv.scrollTop || 0;
            start = Math.max(0, Math.floor(scrollTop / rowHeight) - VIRTUAL.OVERSCAN);
            const visibleCount = Math.ceil(viewport / rowHeight) + VIRTUAL.OVERSCAN * 2;
            end = Math.min(total, start + visibleCount);
        }

        this.windowStart = start;
        this.windowEnd = end;

        // Rebuild the window. Rows carry per-cell inline formatting, so reusing
        // nodes across a scroll would mean re-running applyFormatting on each
        // anyway; replacing them keeps the bookkeeping honest.
        while (this.gridBody.firstChild) {
            this.gridBody.removeChild(this.gridBody.firstChild);
        }

        this.topSpacer = document.createElement('div');
        this.topSpacer.className = 'grid-spacer';
        this.topSpacer.style.height = `${start * rowHeight}px`;
        this.gridBody.appendChild(this.topSpacer);

        const fragment = document.createDocumentFragment();
        for (let i = start; i < end; i++) {
            fragment.appendChild(this.createRowElement(this.visibleRows[i]));
        }
        this.gridBody.appendChild(fragment);

        this.bottomSpacer = document.createElement('div');
        this.bottomSpacer.className = 'grid-spacer';
        this.bottomSpacer.style.height = `${Math.max(0, total - end) * rowHeight}px`;
        this.gridBody.appendChild(this.bottomSpacer);

        // Measure a real row once so the spacer maths stops guessing.
        if (!this.measuredRowHeight) {
            const firstRow = this.gridBody.querySelector(
                `.${CSS_CLASSES.GRID_ROW}[data-node-id]`) as HTMLElement;
            const h = firstRow ? firstRow.offsetHeight : 0;
            if (h > 0) {
                this.measuredRowHeight = h;
                if (total > VIRTUAL.THRESHOLD) {
                    this.renderVisibleWindow();   // redo with the real height
                    return;
                }
            }
        }

        // Rows built here are brand new DOM, so they carry none of the user's
        // cell formatting until it is applied. This has to happen on EVERY
        // render -- expand, collapse and scroll all land here -- or interacting
        // with the visual silently resets cells to the stylesheet default while
        // a resize (which rebuilds from scratch) keeps them formatted.
        this.formatCellsByType(this.gridBody);
    }

    /** Recomputes visibility and repaints the window. */
    private refreshRows(): void {
        this.computeVisibleRows();
        this.renderVisibleWindow();
    }

    private attachScrollListener(): void {
        if (this.onScroll) {
            this.tableDiv.removeEventListener('scroll', this.onScroll);
        }
        this.onScroll = () => {
            if (this.visibleRows.length <= VIRTUAL.THRESHOLD) return;
            if (this.scrollRafPending) return;
            this.scrollRafPending = true;
            window.requestAnimationFrame(() => {
                this.scrollRafPending = false;
                this.renderVisibleWindow();   // formats the new window itself
            });
        };
        this.tableDiv.addEventListener('scroll', this.onScroll);
    }

    //=========================================================================
    // CELL AND ELEMENT CREATION
    //=========================================================================

    private createCornerCell(): HTMLElement {
        const cornerCell = document.createElement("div");
        // Stickiness and stacking order are handled entirely in visual.less now.
        cornerCell.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.ROW_HEADER} ${CSS_CLASSES.COLUMN_HEADER} corner-cell`;

        this.applyFormatting(cornerCell, 'columnHeader');
        return cornerCell;
    }
    
    private createColumnHeader(column: any, format: string): HTMLElement {
        const th = document.createElement("div");
        th.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.COLUMN_HEADER}`;
        
        // Width comes from the grid template, not per-cell styles.
        
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
            th.textContent = this.getMeasureName(this.lastOptions.dataViews[0]);
        }
        
        return th;
    }

    private createRowHeader(
        row: MatrixNode, 
        level: number, 
        nodeId: string, 
        isExpanded: boolean,
        isLevel0: boolean
    ): HTMLElement {
        const rowHeader = document.createElement("div");
        rowHeader.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.ROW_HEADER}`;
        
        if (isLevel0) {
            rowHeader.classList.add(CSS_CLASSES.LEVEL_0_HEADER);
        }
        
        // Width comes from the grid template, not per-cell styles.
        
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
        if (isLevel0) {
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
        tr: HTMLElement, 
        row: any,
        columns: any[], 
        columnWidth: number
    ): void {
        columns.forEach((_, j) => {
            const td = document.createElement("div");
            td.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.DATA_CELL}`;
            
            // Width comes from the grid template, not per-cell styles.
            
            // Get cell value and format it with this column's format string
            const value = row.values[j];
            td.textContent = this.formatCellValue(value, this.formatForColumn(j));
            
            // Store the raw value as a data attribute
            if (value && typeof value.value === 'number') {
                td.setAttribute('data-raw-value', value.value.toString());
            }
            
            tr.appendChild(td);
        });
    }

    private addSubtotalCells(
        tr: HTMLElement, 
        row: MatrixNode, 
        columns: any[], 
        isLevel0: boolean,
        columnWidth: number
    ): void {
        columns.forEach((_, j) => {
            const td = document.createElement("div");
            td.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.DATA_CELL} ${CSS_CLASSES.SUBTOTAL_CELL}`;
            
            if (isLevel0) {
                td.classList.add(CSS_CLASSES.LEVEL_0_SUBTOTAL);
            }
            
            // Width comes from the grid template, not per-cell styles.
            
            // Calculate subtotal
            const subtotal = this.calculateSubtotalForColumn(row, j);
            
            // Only display non-zero subtotals
            td.textContent = subtotal !== 0
                ? this.formatNumber(subtotal, this.formatForColumn(j))
                : "";
            
            // Apply alignment from subtotal settings for subtotal cells
            const alignment = this.formattingSettings.subtotalFormatSettings.alignment?.value?.value;
            if (alignment !== undefined) {
                td.style.textAlign = alignment.toString();
            }
            
            tr.appendChild(td);
        });
    }

    private addGrandTotalRow(table: HTMLElement, columns: any[], totals: number[]): void {
        const settings = this.formattingSettings;
        
        // Check if grand total is enabled
        if (!settings.grandTotalSettings.show.value) {
            return;
        }
        
        // Get the footer or create one if it doesn't exist
        let tfoot = table.querySelector(`.${CSS_CLASSES.GRID_FOOTER}`) as HTMLElement;
        if (!tfoot) {
            tfoot = document.createElement('div');
            tfoot.className = CSS_CLASSES.GRID_FOOTER;
            table.appendChild(tfoot);
        } else {
            // Clear existing content
            while (tfoot.firstChild) {
                tfoot.removeChild(tfoot.firstChild);
            }
        }
        
        this.addBlankRowBeforeTotal(tfoot, columns);

        // Create the grand total row. Sticky-bottom behavior lives in visual.less.
        const tr = document.createElement('div');
        tr.className = `${CSS_CLASSES.GRID_ROW} ${CSS_CLASSES.GRAND_TOTAL_ROW}`;
        
        // Create the label cell
        const labelCell = document.createElement('div');
        labelCell.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.ROW_HEADER} grand-total-label`;
        labelCell.textContent = settings.grandTotalSettings.label.value || 'Grand Total';
        tr.appendChild(labelCell);
        
        // Create the total cells
        totals.forEach((total, i) => {
            const td = document.createElement('div');
            td.className = `${CSS_CLASSES.GRID_CELL} ${CSS_CLASSES.DATA_CELL}`;
            td.textContent = this.formatNumber(total, this.formatForColumn(i));
            tr.appendChild(td);
        });
        
        // Apply formatting to each cell in the grand total row
        const cells = tr.querySelectorAll(`.${CSS_CLASSES.GRID_CELL}`);
        cells.forEach(cell => {
            this.applyFormatting(cell as HTMLElement, 'grandTotal');
        });
        
        // Add the row to the footer
        tfoot.appendChild(tr);
    }

    /** Builds a separator row. Used by the row model and by the grand-total footer. */
    private createBlankRow(): HTMLElement {
        const blankRowSettings = this.formattingSettings.blankRowSettings;

        const blankRow = document.createElement("div");
        blankRow.className = `${CSS_CLASSES.GRID_ROW} ${CSS_CLASSES.BLANK_ROW}`;

        // Set the height if specified
        const rowHeight = blankRowSettings.height.value;
        if (rowHeight > 0) {
            blankRow.style.height = `${rowHeight}px`;
        }

        // Create a cell that spans all columns (grid equivalent of colSpan)
        const blankCell = document.createElement("div");
        blankCell.className = CSS_CLASSES.GRID_CELL;
        blankCell.style.gridColumn = "1 / -1";

        // Apply background color from settings
        const bgColor = blankRowSettings.backgroundColor.value.value;
        if (bgColor) {
            blankCell.style.backgroundColor = bgColor;
        }

        blankRow.appendChild(blankCell);
        return blankRow;
    }
    
    private addBlankRowBeforeTotal(tfoot: HTMLElement, columns: any[]): void {
        if (!this.formattingSettings.blankRowSettings.enableBlankRows.value) {
            return;
        }
        tfoot.appendChild(this.createBlankRow());
    }

    //=========================================================================
    // FORMATTING AND STYLING
    //=========================================================================

    private applyTableFormatting(table: HTMLElement): void {
        if (!this.formattingSettings) return;
        
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

    private formatCellsByType(table: HTMLElement): void {
        // Use CSS selectors to get different cell types
        const regularCells = table.querySelectorAll('.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
        const subtotalCells = table.querySelectorAll('.subtotal-cell, .level-0-subtotal');
        const regularRowHeaders = table.querySelectorAll('.grid-row:not(.subtotal-row) > .row-header:not(.column-header)');
        const subtotalRowHeaders = table.querySelectorAll('.grid-row.subtotal-row > .row-header:not(.column-header)');
        const columnHeaderCells = table.querySelectorAll('.column-header:not(.row-header)');
        const cornerCell = table.querySelector('.row-header.column-header');
    
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
        
        // Apply global font size
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
                if (type === 'grandTotal' && element.classList.contains(CSS_CLASSES.ROW_HEADER)) {
                    element.style.textAlign = 'left';
                } else {
                    element.style.textAlign = formatSettings.alignment.value.value.toString();
                }
            }
        }
    }

    private applyGlobalBorders(table: HTMLElement): void {
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
        
        // No fixHeaderBorders() here any more: borders on <div> rows survive the
        // animation, so the !important rewrite pass it existed to undo is gone.
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

        // Collapsing a node also collapses everything beneath it, so reopening
        // it does not spill a whole subtree back out at once.
        if (isExpanded) {
            for (const entry of this.descendantEntries(nodeId)) {
                this.expandedRows.set(entry.nodeId, false);
            }
        }

        // Save state
        Visual.savedExpandedState = new Map(this.expandedRows);

        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();

        let animatingRows: HTMLElement[];

        if (isExpanded) {
            // Collapsing: the rows are on screen now. Animate them out first,
            // then drop them from the model's visible set.
            animatingRows = this.renderedDescendants(nodeId);
        } else {
            // Expanding: the rows do not exist yet under virtualization, so
            // render them first and then animate what actually landed.
            this.refreshRows();
            animatingRows = this.renderedDescendants(nodeId);
        }

        // Update toggle button appearance (after any re-render, so the button
        // we touch is the one currently in the DOM).
        const toggleButton = this.tableDiv.querySelector(
            `.grid-row[data-node-id="${nodeId}"] .toggle-button`) as HTMLElement;
        if (toggleButton) {
            toggleButton.textContent = !isExpanded ? '▲' : '▼';
        }

        // Safety timeout, sized to the actual staggered run so it cannot fire
        // while rows are still animating.
        const timeout = window.setTimeout(() => {
            this.cleanupAnimation(nodeId);
        }, ANIM.totalMs(animatingRows.length, !isExpanded));

        this.animationTimeouts.set(nodeId, timeout);

        if (isExpanded) {
            this.animateCollapse(animatingRows, nodeId);
        } else {
            this.animateExpand(animatingRows, nodeId);
        }
    }

    /** Model-driven: every descendant entry of `nodeId`, at any depth. */
    private descendantEntries(nodeId: string): RowEntry[] {
        const out: RowEntry[] = [];
        const index = this.rowModel.findIndex(e => e.nodeId === nodeId);
        if (index < 0) return out;

        const rootLevel = this.rowModel[index].level;
        for (let i = index + 1; i < this.rowModel.length; i++) {
            const entry = this.rowModel[i];
            if (entry.level <= rootLevel) break;      // left the subtree
            out.push(entry);
        }
        return out;
    }

    /** The subset of `nodeId`'s direct children that are currently rendered. */
    private renderedDescendants(nodeId: string): HTMLElement[] {
        return Array.from(
            this.tableDiv.querySelectorAll(`.grid-row[data-parent-id="${nodeId}"]`)
        ) as HTMLElement[];
    }

    //=========================================================================
    // ANIMATION METHODS
    //=========================================================================

    private disableAllToggleButtons(): void {
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn: HTMLElement) => {
            btn.style.cursor = "not-allowed";
            btn.style.opacity = "0.5";
            btn.setAttribute('data-animating', 'true');
        });
    }

    private animateExpand(rows: HTMLElement[], nodeId: string): void {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        
        // Rows are <div>s now, so height / transform / overflow all apply and the
        // keyframes render as written. No border save/restore is needed: borders
        // on a div row survive the animation instead of being dropped by the
        // table layout, which is what fixHeaderBorders() used to paper over.
        rows.forEach(row => {
            row.classList.remove('collapsed', 'collapsing-wave');
            // Measure the natural height to animate toward.
            row.style.setProperty('--row-height', `${row.scrollHeight}px`);
        });
        
        // Force a reflow
        void rows[0].offsetHeight;
        
        // Apply animation with staggered delay
        const stagger = ANIM.staggerFor(rows.length);
        rows.forEach((row, index) => {
            row.style.animationDelay = `${index * stagger}ms`;
            row.classList.add('expanding-wave');
        });
        
        // Listen for animation end on the last row
        const lastRow = rows[rows.length - 1];
        lastRow.addEventListener('animationend', () => {
            rows.forEach(row => {
                row.classList.remove('expanding-wave');
                row.style.animationDelay = '';
                row.style.removeProperty('--row-height');
            });

            this.cleanupAnimation(nodeId);
        }, { once: true });
    }
    
    private animateCollapse(rows: HTMLElement[], nodeId: string): void {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        
        // Capture the current height so the collapse keyframe has somewhere to
        // animate from. See animateExpand for why no border bookkeeping is needed.
        rows.forEach(row => {
            row.classList.remove('expanding-wave', 'collapsed');
            row.style.setProperty('--row-height', `${row.offsetHeight}px`);
        });
        
        // Force a reflow
        void rows[0].offsetHeight;
        
        // Apply animation with staggered delay (reversed for collapse)
        const stagger = ANIM.staggerFor(rows.length);
        rows.slice().reverse().forEach((row, index) => {
            row.style.animationDelay = `${index * stagger}ms`;
            row.classList.add('collapsing-wave');
        });
        
        // Listen for animation end
        const lastRow = rows[0]; // First row will be the last to collapse
        lastRow.addEventListener('animationend', () => {
            // Hide rows after animation
            rows.forEach(row => {
                row.classList.remove('collapsing-wave');
                row.classList.add('collapsed');
                row.style.animationDelay = '';
                row.style.removeProperty('--row-height');
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

        // Repaint from the model. After a collapse this is what actually drops
        // the hidden rows out of the DOM.
        this.refreshRows();
        
        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });
        
        // Visibility now comes from the row model, which refreshRows() has
        // already repainted, so there is no DOM bookkeeping left to do here.
        Visual.savedExpandedState = new Map(this.expandedRows);
    }

    //=========================================================================
    // CONTEXT MENU HANDLING
    //=========================================================================

    private setupContextMenuEvents(): void {
        // Prevent default context menu on the table
        this.tableDiv.addEventListener('contextmenu', (e: MouseEvent) => {
            e.preventDefault();
            
            // Hide any visible context menu
            this.contextMenu.style.display = 'none';
            
            // Find the clicked cell
            const target = e.target as HTMLElement;
            const cell = target.closest('.grid-cell') as HTMLElement;
            
            if (cell) {
                // Store the active cell
                this.activeCell = cell;
                
                // Get row info for expand/collapse
                const row = cell.closest('.grid-row') as HTMLElement;
                if (row) {
                    this.activeNodeId = row.getAttribute('data-node-id');
                    this.activeLevel = parseInt(row.getAttribute('data-level') || '0', 10);
                }
                
                // Show context menu at mouse position
                this.contextMenu.style.left = `${e.pageX}px`;
                this.contextMenu.style.top = `${e.pageY}px`;
                this.contextMenu.style.display = 'block';
            }
        });
        
        // Handle clicks on menu items
        this.contextMenu.addEventListener('click', (e: MouseEvent) => {
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
                this.contextMenu.style.display = 'none';
            }
        });
        
        // Hide menu when clicking elsewhere
        document.addEventListener('click', () => {
            this.contextMenu.style.display = 'none';
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
            textArea.style.position = 'absolute';
            textArea.style.left = '0';
            textArea.style.top = '0';
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const successful = document.execCommand('copy');
            
            if (successful) {
                this.showToast('Copied to clipboard');
            } else {
                this.showToast('Copy failed - try again');
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

    private handleContextMenuAction(action: string, nodeId: string, level: number): void {
        if (!nodeId) return;
        
        // Prevent multiple animations running at once
        if (this.animatingNodes.size > 0) return;
        
        switch (action) {
            case 'expandThis':
                if (!this.expandedRows.get(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
                
            case 'collapseThis':
                if (this.expandedRows.get(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
                
            case 'expandLevel':
                this.batchExpandCollapseByLevel(level, true);
                break;
                
            case 'collapseLevel':
                this.batchExpandCollapseByLevel(level, false);
                break;
                
            case 'expandAll':
                this.batchExpandCollapseAll(true);
                break;
                
            case 'collapseAll':
                this.batchExpandCollapseAll(false);
                break;
        }
    }

    private batchExpandCollapseByLevel(level: number, expand: boolean): void {
        const targets = this.rowModel.filter(e =>
            e.kind === 'data' && e.hasChildren && e.level === level &&
            this.expandedRows.get(e.nodeId) !== expand);

        this.processBatchExpansion(`level_${level}_${expand ? 'expand' : 'collapse'}`, targets, expand);
    }

    private batchExpandCollapseAll(expand: boolean): void {
        const targets = this.rowModel.filter(e =>
            e.kind === 'data' && e.hasChildren &&
            this.expandedRows.get(e.nodeId) !== expand);

        // Shallowest first when expanding, deepest first when collapsing, so
        // the wave reads outward / inward rather than at random.
        targets.sort((a, b) => expand ? a.level - b.level : b.level - a.level);

        this.processBatchExpansion(`all_${expand ? 'expand' : 'collapse'}`, targets, expand);
    }

    /**
     * Applies an expand/collapse to many nodes at once. State is updated on the
     * model first, the window is repainted, and only the rows that actually
     * landed in the DOM get animated -- under virtualization most will not be
     * on screen, and animating rows nobody can see is wasted work.
     */
    private processBatchExpansion(batchId: string, targets: RowEntry[], expand: boolean): void {
        if (targets.length === 0) return;

        this.disableAllToggleButtons();
        this.animatingNodes.add(batchId);

        // Update state for every target.
        for (const entry of targets) {
            this.expandedRows.set(entry.nodeId, expand);
        }
        Visual.savedExpandedState = new Map(this.expandedRows);

        if (expand) {
            // Rows must exist before they can be animated in.
            this.refreshRows();
        }

        // Animate whatever is on screen beneath the affected nodes.
        const onScreen: HTMLElement[] = [];
        for (const entry of targets) {
            onScreen.push(...this.renderedDescendants(entry.nodeId));
        }
        this.animateRowsBatch(onScreen, expand);

        const timeout = window.setTimeout(() => {
            this.cleanupBatchAnimation(batchId, onScreen, expand);
        }, ANIM.totalMs(onScreen.length, expand));

        this.animationTimeouts.set(batchId, timeout);
    }

    private animateRowsBatch(rows: HTMLElement[], isExpand: boolean): void {
        if (rows.length === 0) return;

        const stagger = ANIM.staggerFor(rows.length);

        if (isExpand) {
            // As in animateExpand, the keyframes own height/opacity/transform
            // now that rows are divs.
            rows.forEach(row => {
                row.classList.remove('collapsed', 'collapsing-wave');
                row.style.setProperty('--row-height', `${row.scrollHeight}px`);
            });

            void rows[0].offsetHeight;   // force a reflow

            rows.forEach((row, index) => {
                row.style.animationDelay = `${index * stagger}ms`;
                row.classList.add('expanding-wave');
            });
        } else {
            rows.forEach(row => {
                row.classList.remove('expanding-wave', 'collapsed');
                row.style.setProperty('--row-height', `${row.offsetHeight}px`);
            });

            void rows[0].offsetHeight;   // force a reflow

            rows.slice().reverse().forEach((row, index) => {
                row.style.animationDelay = `${index * stagger}ms`;
                row.classList.add('collapsing-wave');
            });
        }
    }

    private cleanupBatchAnimation(batchId: string, rows: HTMLElement[], wasExpanding: boolean): void {
        const timeout = this.animationTimeouts.get(batchId);
        if (timeout) {
            window.clearTimeout(timeout);
            this.animationTimeouts.delete(batchId);
        }

        this.animatingNodes.delete(batchId);

        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn as HTMLElement;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });

        rows.forEach(row => {
            row.classList.remove('expanding-wave', 'collapsing-wave');
            row.style.animationDelay = '';
            row.style.removeProperty('--row-height');
        });

        // Repaint from the model; after a collapse this is what removes the
        // hidden rows from the DOM.
        this.refreshRows();
        Visual.savedExpandedState = new Map(this.expandedRows);
    }

    //=========================================================================
    // HELPER METHODS
    //=========================================================================



    //=========================================================================
    // LANDING PAGE METHODS
    //=========================================================================

    private showLandingPage(): void {
        if (this.isLandingPageOn) return;
        
        // Clear existing content
        this.target.innerHTML = '';
        
        // Create container for landing page
        const container = document.createElement('div');
        container.className = 'landing-page-container';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.background = '#13141a';
        
        // Insert the HTML
        container.innerHTML = this.getLandingPageHTML();
        
        // Store reference and add to DOM
        this.landingPageElement = container;
        this.target.appendChild(container);
        
        // Add event listeners for navigation
        this.setupLandingPageNavigation();
        
        this.isLandingPageOn = true;
    }
    
    private hideLandingPage(): void {
        if (!this.isLandingPageOn) return;
        
        // Remove landing page
        if (this.landingPageElement?.parentNode) {
            this.landingPageElement.parentNode.removeChild(this.landingPageElement);
        }
        
        this.isLandingPageOn = false;
        this.landingPageRemoved = true;
        
        // Reset to first page for next time
        this.currentLandingPage = 1;
        
        // Create container elements for the visual
        this.createContainerElements();
    }

    private getLandingPageHTML(): string {
        switch (this.currentLandingPage) {
            case 1: return landingPage1HTML;
            case 2: return landingPage2HTML;
            case 3: return landingPage3HTML;
            default: return landingPage1HTML;
        }
    }
    
    private setupLandingPageNavigation(): void {
        const nextButtons = this.landingPageElement.querySelectorAll('[data-action="next"]');
        const backButtons = this.landingPageElement.querySelectorAll('[data-action="back"]');
        const finishButton = this.landingPageElement.querySelector('[data-action="finish"]');
        
        // Next button handler
        nextButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentLandingPage < 3) {
                    this.transitionToPage(this.currentLandingPage + 1);
                }
            });
        });
        
        // Back button handler
        backButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.currentLandingPage > 1) {
                    this.transitionToPage(this.currentLandingPage - 1);
                }
            });
        });
        
        // Finish button handler
        if (finishButton) {
            finishButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.fadeOutAndHideLandingPage();
            });
        }
    }
    
    private transitionToPage(newPageNumber: number): void {
        // Get container element
        const container = this.landingPageElement.querySelector('.container') as HTMLElement;
        if (!container) return;
        
        // Apply fade-out class
        container.classList.add('fade-out');
        
        // Wait for animation to complete before changing page
        setTimeout(() => {
            // Update the current page
            this.currentLandingPage = newPageNumber;
            
            // Create new container with updated content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.getLandingPageHTML();
            
            // Replace the old content
            this.landingPageElement.innerHTML = '';
            while (tempDiv.firstChild) {
                this.landingPageElement.appendChild(tempDiv.firstChild);
            }
            
            // Set up navigation for the new page
            this.setupLandingPageNavigation();
            
            // Force a reflow before removing the fade-out class
            const newContainer = this.landingPageElement.querySelector('.container') as HTMLElement;
            if (newContainer) {
                void newContainer.offsetHeight;
                newContainer.classList.remove('fade-out');
            }
        }, 500); // Match to CSS transition duration
    }
    
    private fadeOutAndHideLandingPage(): void {
        // Get container element
        const container = this.landingPageElement.querySelector('.container') as HTMLElement;
        if (!container) {
            this.hideLandingPage();
            return;
        }
        
        // Apply fade-out class
        container.classList.add('fade-out');
        
        // Wait for animation to complete before hiding
        setTimeout(() => {
            this.hideLandingPage();
        }, 500); // Match to CSS transition duration
    }

    //=========================================================================
    // INCREMENTAL DATA FETCHING
    //=========================================================================

    // Method to update the Load More button
    private updateLoadMoreButton(): void {
        // Remove existing button if any
        const existingButton = this.tableDiv.querySelector('.load-more-button');
        if (existingButton) {
            existingButton.remove();
        }
        
        // Add button if there's more data
        if (this.hasMoreData) {
            const loadMoreButton = document.createElement('button');
            loadMoreButton.className = 'load-more-button';
            loadMoreButton.textContent = 'Load More Data';
            loadMoreButton.style.position = 'sticky';
            loadMoreButton.style.bottom = '0';
            loadMoreButton.style.left = '0';
            loadMoreButton.style.width = '100%';
            loadMoreButton.style.padding = '10px';
            loadMoreButton.style.backgroundColor = '#0078d4';
            loadMoreButton.style.color = 'white';
            loadMoreButton.style.border = 'none';
            loadMoreButton.style.cursor = 'pointer';
            loadMoreButton.style.marginTop = '10px';
            loadMoreButton.style.zIndex = '100';
            loadMoreButton.style.textAlign = 'center';
            loadMoreButton.style.fontFamily = this.formattingSettings.generalSettings.fontFamily.value;
            
            // Disable button if already loading
            if (this.isLoadingMore) {
                loadMoreButton.disabled = true;
                loadMoreButton.textContent = 'Loading...';
                loadMoreButton.style.backgroundColor = '#cccccc';
            }
            
            loadMoreButton.addEventListener('click', () => {
                this.loadMoreData();
            });
            
            this.tableDiv.appendChild(loadMoreButton);
            this.loadMoreButton = loadMoreButton;
        }
    }

    // Method to load more data
    private loadMoreData(): void {
        if (this.hasMoreData && !this.isLoadingMore) {
            this.isLoadingMore = true;
            
            // Update button state
            if (this.loadMoreButton) {
                this.loadMoreButton.disabled = true;
                this.loadMoreButton.textContent = 'Loading...';
                this.loadMoreButton.style.backgroundColor = '#cccccc';
            }
            
            // Call fetchMoreData with aggregateSegments=true
            const success = this.host.fetchMoreData(true);
            
            if (!success) {
                // Handle the case where fetching more data failed
                console.error("Failed to fetch more data - might have hit memory limits");
                this.isLoadingMore = false;
                
                // Update button state
                if (this.loadMoreButton) {
                    this.loadMoreButton.textContent = 'Failed to load more (memory limit)';
                    this.loadMoreButton.style.backgroundColor = '#ff0000';
                }
            }
        }
    }
}
