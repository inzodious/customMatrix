import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private target;
    private tableDiv;
    private formattingSettings;
    private formattingSettingsService;
    private host;
    private expandedRows;
    private lastOptions;
    constructor(options: VisualConstructorOptions);
    private createContainerElements;
    update(options: VisualUpdateOptions): void;
    private getMeasureName;
    private getNodeId;
    private initializeExpandedState;
    private isExpanded;
    private toggleExpanded;
    private createMatrixTable;
    private processColumns;
    private createTableHeader;
    private createCornerCell;
    private createColumnHeader;
    private getMeasureDynamically;
    private formatDateValue;
    private renderRowsWithSubtotals;
    private createRowHeader;
    private createToggleButton;
    private createRowLabel;
    private addSubtotalCells;
    private addDataCells;
    private addBlankRowIfNeeded;
    private formatCellValue;
    private calculateSubtotalForColumn;
    /**
 * Calculate grand totals for all columns
 */
    private calculateGrandTotals;
    /**
     * Create and append grand total row
     */
    private addGrandTotalRow;
    private formatNumber;
    private applyTableFormatting;
    private formatCellsByType;
    private applyFormatting;
    private applyGlobalBorders;
    private adjustColor;
    private renderVisualWithCurrentState;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
