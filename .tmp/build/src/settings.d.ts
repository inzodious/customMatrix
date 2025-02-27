import { formattingSettings } from "powerbi-visuals-utils-formattingmodel";
import FormattingSettingsCard = formattingSettings.SimpleCard;
import FormattingSettingsSlice = formattingSettings.Slice;
import FormattingSettingsModel = formattingSettings.Model;
/**
 * General Settings Card
 */
declare class GeneralSettings extends FormattingSettingsCard {
    fontSize: formattingSettings.NumUpDown;
    showMeasureName: formattingSettings.ToggleSwitch;
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
 * Font Formatting Card
 */
declare class FontFormatSettings extends FormattingSettingsCard {
    color: formattingSettings.ColorPicker;
    fontFamily: formattingSettings.TextInput;
    fontSize: formattingSettings.NumUpDown;
    bold: formattingSettings.ToggleSwitch;
    italic: formattingSettings.ToggleSwitch;
    underline: formattingSettings.ToggleSwitch;
    backgroundColor: formattingSettings.ColorPicker;
    dataAlignment: formattingSettings.ItemDropdown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Column Header Formatting Card
 */
declare class ColumnHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor: formattingSettings.ColorPicker;
    fontColor: formattingSettings.ColorPicker;
    bold: formattingSettings.ToggleSwitch;
    alignment: formattingSettings.ItemDropdown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Row Header Formatting Card
 */
declare class RowHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor: formattingSettings.ColorPicker;
    fontColor: formattingSettings.ColorPicker;
    bold: formattingSettings.ToggleSwitch;
    alignment: formattingSettings.ItemDropdown;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
}
/**
 * Subtotal Formatting Card
 */
declare class SubtotalFormatSettings extends FormattingSettingsCard {
    backgroundColor: formattingSettings.ColorPicker;
    fontColor: formattingSettings.ColorPicker;
    bold: formattingSettings.ToggleSwitch;
    italic: formattingSettings.ToggleSwitch;
    applyToLevel0: formattingSettings.ToggleSwitch;
    name: string;
    displayName: string;
    slices: Array<FormattingSettingsSlice>;
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
    cards: (GeneralSettings | BorderSettings | FontFormatSettings | ColumnHeaderFormatSettings | RowHeaderFormatSettings | SubtotalFormatSettings | BlankRowSettings)[];
}
export {};
