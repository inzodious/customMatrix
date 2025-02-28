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

    fontFamily = new formattingSettings.TextInput({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Segoe UI, sans-serif",
        placeholder: "Enter font family"
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
        this.fontFamily,
        this.fontSize, 
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
        value: { value: "#FFFFF" },
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
 * Shared formatting options base class
 */
class BaseFormatSettings extends FormattingSettingsCard {
    color = new formattingSettings.ColorPicker({
        name: "color",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
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
    
    backgroundColor = new formattingSettings.ColorPicker({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" },
        instanceKind: powerbi.VisualEnumerationInstanceKinds.ConstantOrRule
    });

    alignment = new formattingSettings.ItemDropdown({
        name: "alignment",
        displayName: "Text Alignment",
        items: [
            { displayName: "Left", value: "left" },
            { displayName: "Center", value: "center" },
            { displayName: "Right", value: "right" }
        ],
        value: { value: "right", displayName: "Right" }
    });

    get formattingSlices(): Array<FormattingSettingsSlice> {
        return [
            this.color, 
            this.fontSize,
            this.bold, 
            this.italic, 
            this.underline,
            this.backgroundColor, 
            this.alignment
        ];
    }
}

/**
 * Values Formatting Card
 */
class FontFormatSettings extends BaseFormatSettings {
    name: string = "fontFormat";
    displayName: string = "Data Values";
    slices: Array<FormattingSettingsSlice> = this.formattingSlices;

    constructor() {
        super();
        // Default values for data values
        this.alignment.value = { value: "right", displayName: "Right" };
        this.backgroundColor.value = { value: "#FFFFFF" };
    }
}

/**
 * Column Header Formatting Card
 */
class ColumnHeaderFormatSettings extends BaseFormatSettings {
    name: string = "columnHeaderFormat";
    displayName: string = "Column Headers";
    slices: Array<FormattingSettingsSlice> = this.formattingSlices;

    constructor() {
        super();
        // Default values for column headers
        this.alignment.value = { value: "center", displayName: "Center" };
        this.backgroundColor.value = { value: "#E0E0E0" };
        this.bold.value = true;
    }
}

/**
 * Row Header Formatting Card
 */
class RowHeaderFormatSettings extends BaseFormatSettings {
    name: string = "rowHeaderFormat";
    displayName: string = "Row Headers";
    slices: Array<FormattingSettingsSlice> = this.formattingSlices;

    constructor() {
        super();
        // Default values for row headers
        this.alignment.value = { value: "left", displayName: "Left" };
        this.backgroundColor.value = { value: "#E8E8E8" };
        this.bold.value = true;
    }
}

/**
 * Subtotal Formatting Card
 */
class SubtotalFormatSettings extends BaseFormatSettings {
    name: string = "subtotalFormat";
    displayName: string = "Subtotals";
    slices: Array<FormattingSettingsSlice> = this.formattingSlices;

    constructor() {
        super();
        // Default values for subtotals
        this.alignment.value = { value: "right", displayName: "Right" };
        this.backgroundColor.value = { value: "#F0F0F0" };
        this.bold.value = true;
    }
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
 * Grand Total Settings Card
 */
class GrandTotalSettings extends BaseFormatSettings {
    show = new formattingSettings.ToggleSwitch({
        name: "show",
        displayName: "Show Grand Total",
        value: true
    });

    label = new formattingSettings.TextInput({
        name: "label",
        displayName: "Total Label",
        value: "Grand Total",
        placeholder: "Enter label for total"
    });

    name: string = "grandTotalSettings";
    displayName: string = "Grand Total";
    slices: Array<FormattingSettingsSlice> = [
        this.show,
        this.label,
        ...this.formattingSlices // Get the common formatting options
    ];

    constructor() {
        super();
        // Default values for grand total
        this.alignment.value = { value: "right", displayName: "Right" };
        this.backgroundColor.value = { value: "#EEEEEE" };
        this.bold.value = true;
    }
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
    grandTotalSettings = new GrandTotalSettings();

    cards = [
        this.generalSettings,
        this.borderSettings,
        this.fontFormatSettings,
        this.columnHeaderFormatSettings,
        this.rowHeaderFormatSettings,
        this.subtotalFormatSettings,
        this.blankRowSettings,
        this.grandTotalSettings
    ];
}