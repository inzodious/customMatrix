import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * General Settings Card
 */
declare class GeneralSettings extends FormattingSettingsCard {
    fontSize: formattingSettings.NumUpDown;
    fontFamily: formattingSettings.TextInput;
    columnWidth: formattingSettings.NumUpDown;
    enableHover: formattingSettings.ToggleSwitch;
    rowHeaderWidth: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Border Settings Card
 */
declare class BorderSettings extends FormattingSettingsCard {
    show: formattingSettings.ToggleSwitch;
    color: formattingSettings.ColorPicker;
    width: formattingSettings.NumUpDown;
    horizontalBorders: formattingSettings.ToggleSwitch;
    verticalBorders: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Shared formatting options base class
 */
declare class BaseFormatSettings extends FormattingSettingsCard {
    color: formattingSettings.ColorPicker;
    fontSize: formattingSettings.NumUpDown;
    bold: formattingSettings.ToggleSwitch;
    italic: formattingSettings.ToggleSwitch;
    underline: formattingSettings.ToggleSwitch;
    backgroundColor: formattingSettings.ColorPicker;
    alignment: formattingSettings.ItemDropdown;
    get formattingSlices(): Array<FormattingSettingsSlice>;
}
/**
 * Values Formatting Card
 */
declare class FontFormatSettings extends BaseFormatSettings {
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
    constructor();
}
/**
 * Column Header Formatting Card
 */
declare class ColumnHeaderFormatSettings extends BaseFormatSettings {
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
    constructor();
}
/**
 * Row Header Formatting Card
 */
declare class RowHeaderFormatSettings extends BaseFormatSettings {
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
    constructor();
}
/**
 * Subtotal Formatting Card
 */
declare class SubtotalFormatSettings extends BaseFormatSettings {
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
    constructor();
}
/**
 * Blank Rows Settings Card
 */
declare class BlankRowSettings extends FormattingSettingsCard {
    enableBlankRows: formattingSettings.ToggleSwitch;
    backgroundColor: formattingSettings.ColorPicker;
    height: formattingSettings.NumUpDown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Grand Total Settings Card
 */
declare class GrandTotalSettings extends BaseFormatSettings {
    show: formattingSettings.ToggleSwitch;
    label: formattingSettings.TextInput;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
    constructor();
}
/**
 * Visual settings model class
 */
export declare class VisualFormattingSettingsModel extends FormattingSettingsModel {
    generalSettings: GeneralSettings;
    borderSettings: BorderSettings;
    fontFormatSettings: FontFormatSettings;
    columnHeaderFormatSettings: ColumnHeaderFormatSettings;
    rowHeaderFormatSettings: RowHeaderFormatSettings;
    subtotalFormatSettings: SubtotalFormatSettings;
    blankRowSettings: BlankRowSettings;
    grandTotalSettings: GrandTotalSettings;
    cards: (GeneralSettings | BorderSettings | FontFormatSettings | ColumnHeaderFormatSettings | RowHeaderFormatSettings | SubtotalFormatSettings | BlankRowSettings | GrandTotalSettings)[];
}
export {};
