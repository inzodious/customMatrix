import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";
import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;
export declare class Visual implements IVisual {
    private target;
    private tableDiv;
    private updateCount;
    private formattingSettings;
    private formattingSettingsService;
    private host;
    private expandedRows;
    private lastOptions;
    constructor(options: VisualConstructorOptions);
    update(options: VisualUpdateOptions): void;
    private getMeasureName;
    private getNodeId;
    private isExpanded;
    private toggleExpanded;
    private formatDateValue;
    private calculateSubtotalForColumn;
    private applyGlobalBorders;
    private createMatrixTable;
    private initializeExpandedState;
    private renderRowsWithSubtotals;
    private formatNumber;
    private applyColumnHeaderFormatting;
    /**
     * Apply formatting to row headers
     */
    private applyRowHeaderFormatting;
    /**
     * Apply subtotal formatting to Level 0 row headers
     */
    private applyLevel0HeaderFormatting;
    private applyFormatting;
    private applyDataCellFormatting;
    private applySubtotalCellFormatting;
    private adjustColor;
    private renderVisualWithCurrentState;
    getFormattingModel(): powerbi.visuals.FormattingModel;
}
