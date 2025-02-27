/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */

"use strict";

import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import powerbi from "powerbi-visuals-api";

import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;

/**
 * General Settings Card
 */
class GeneralSettings extends FormattingSettingsCard {
    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 10
    });

    showMeasureName = new formattingSettings.ToggleSwitch({
        name: "showMeasureName",
        displayName: "Show Measure Name",
        value: true
    });
    
    columnWidth = new formattingSettings.NumUpDown({
        name: "columnWidth",
        displayName: "Column Width",
        value: 100
    });
    
    enableHover = new formattingSettings.ToggleSwitch({
        name: "enableHover",
        displayName: "Enable Hover Effects",
        value: true
    });

    rowHeaderWidth = new formattingSettings.NumUpDown({
        name: "rowHeaderWidth",
        displayName: "Row Header Width",
        value: 200 // Default width
    });

    name: string = "general";
    displayName: string = "General";
    slices: Array<FormattingSettingsSlice> = [
        this.fontSize, 
        this.showMeasureName, 
        this.columnWidth, 
        this.rowHeaderWidth,
        this.enableHover
];
}

/**
 * Border Settings Card
 */
class BorderSettings extends FormattingSettingsCard {
    show = new formattingSettings.ToggleSwitch({
        name: "show",
        displayName: "Show Borders",
        value: true
    });

    color = new formattingSettings.ColorPicker({
        name: "color",
        displayName: "Border Color",
        value: { value: "#CCCCCC" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    width = new formattingSettings.NumUpDown({
        name: "width",
        displayName: "Border Width",
        value: 1
    });

    horizontalBorders = new formattingSettings.ToggleSwitch({
        name: "horizontalBorders",
        displayName: "Horizontal Borders",
        value: true
    });

    verticalBorders = new formattingSettings.ToggleSwitch({
        name: "verticalBorders",
        displayName: "Vertical Borders",
        value: true
    });

    name: string = "borderSettings";
    displayName: string = "Borders";
    slices: Array<FormattingSettingsSlice> = [
        this.show, 
        this.color, 
        this.width, 
        this.horizontalBorders, 
        this.verticalBorders
    ];
}

/**
 * Font Formatting Card
 */
class FontFormatSettings extends FormattingSettingsCard {
    color = new formattingSettings.ColorPicker({
        name: "color",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    fontFamily = new formattingSettings.TextInput({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Segoe UI, sans-serif",
        placeholder: "Enter font family"
    });

    fontSize = new formattingSettings.NumUpDown({
        name: "fontSize",
        displayName: "Font Size",
        value: 10
    });

    bold = new formattingSettings.ToggleSwitch({
        name: "bold",
        displayName: "Bold",
        value: false
    });

    italic = new formattingSettings.ToggleSwitch({
        name: "italic",
        displayName: "Italic",
        value: false
    });

    underline = new formattingSettings.ToggleSwitch({
        name: "underline",
        displayName: "Underline",
        value: false
    });
    
    // Adding background settings to Font card
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    // Data Cells Font
    name: string = "fontFormat";
    displayName: string = "Values";
    slices: Array<FormattingSettingsSlice> = [
        this.color, this.fontFamily, this.fontSize,
        this.bold, this.italic, this.underline,
        this.backgroundColor
    ];
}

/**
 * Column Header Formatting Card
 */
class ColumnHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#E0E0E0" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });
    
    bold = new formattingSettings.ToggleSwitch({
        name: "bold",
        displayName: "Bold",
        value: true
    });

    name: string = "columnHeaderFormat";
    displayName: string = "Column Headers";
    slices: Array<FormattingSettingsSlice> = [this.backgroundColor, this.fontColor, this.bold];
}

/**
 * Row Header Formatting Card
 */
class RowHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#E8E8E8" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });
    
    bold = new formattingSettings.ToggleSwitch({
        name: "bold",
        displayName: "Bold",
        value: true
    });

    name: string = "rowHeaderFormat";
    displayName: string = "Row Headers";
    slices: Array<FormattingSettingsSlice> = [this.backgroundColor, this.fontColor, this.bold];
}

/**
 * Subtotal Formatting Card
 */
class SubtotalFormatSettings extends FormattingSettingsCard {
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#F0F0F0" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    fontColor = new formattingSettings.ColorPicker({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });
    
    bold = new formattingSettings.ToggleSwitch({
        name: "bold",
        displayName: "Bold",
        value: true
    });
    
    italic = new formattingSettings.ToggleSwitch({
        name: "italic",
        displayName: "Italic",
        value: false
    });

    applyToLevel0 = new formattingSettings.ToggleSwitch({
        name: "applyToLevel0",
        displayName: "Apply to Top Level",
        value: true
    });

    name: string = "subtotalFormat";
    displayName: string = "Subtotals";
    slices: Array<FormattingSettingsSlice> = [
        this.backgroundColor, 
        this.fontColor, 
        this.bold, 
        this.italic,
        this.applyToLevel0
    ];
}

/**
 * Blank Rows Settings Card
 */
class BlankRowSettings extends FormattingSettingsCard {
    enableBlankRows = new formattingSettings.ToggleSwitch({
        name: "enableBlankRows",
        displayName: "Add Blank Rows",
        value: false
    });

    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#F0F0F0" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    height = new formattingSettings.NumUpDown({
        name: "height",
        displayName: "Row Height",
        value: 10
    });

    name: string = "blankRowSettings";
    displayName: string = "Blank Rows";
    slices: Array<FormattingSettingsSlice> = [
        this.enableBlankRows,
        this.backgroundColor,
        this.height
    ];
}

/**
 * Visual settings model class
 */
export class VisualFormattingSettingsModel extends FormattingSettingsModel {
    // Create formatting settings model formatting cards
    generalSettings = new GeneralSettings();
    borderSettings = new BorderSettings();
    fontFormatSettings = new FontFormatSettings();
    columnHeaderFormatSettings = new ColumnHeaderFormatSettings();
    rowHeaderFormatSettings = new RowHeaderFormatSettings();
    subtotalFormatSettings = new SubtotalFormatSettings();
    blankRowSettings = new BlankRowSettings();

    cards = [
        this.generalSettings,
        this.borderSettings,
        this.fontFormatSettings,
        this.columnHeaderFormatSettings,
        this.rowHeaderFormatSettings,
        this.subtotalFormatSettings,
        this.blankRowSettings
    ];
}
