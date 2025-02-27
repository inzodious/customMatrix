var customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 480:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ VisualFormattingSettingsModel)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(674);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */


var FormattingSettingsCard = powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.SimpleCard */ .z.Tn;
var FormattingSettingsModel = powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.Model */ .z.Kx;
/**
 * General Settings Card
 */
class GeneralSettings extends FormattingSettingsCard {
    fontSize = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "fontSize",
        displayName: "Font Size",
        value: 10
    });
    showMeasureName = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "showMeasureName",
        displayName: "Show Measure Name",
        value: true
    });
    columnWidth = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "columnWidth",
        displayName: "Column Width",
        value: 100
    });
    enableHover = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "enableHover",
        displayName: "Enable Hover Effects",
        value: true
    });
    rowHeaderWidth = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "rowHeaderWidth",
        displayName: "Row Header Width",
        value: 200 // Default width
    });
    name = "general";
    displayName = "General";
    slices = [
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
    show = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "show",
        displayName: "Show Borders",
        value: true
    });
    color = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "color",
        displayName: "Border Color",
        value: { value: "#CCCCCC" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    width = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "width",
        displayName: "Border Width",
        value: 1
    });
    horizontalBorders = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "horizontalBorders",
        displayName: "Horizontal Borders",
        value: true
    });
    verticalBorders = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "verticalBorders",
        displayName: "Vertical Borders",
        value: true
    });
    name = "borderSettings";
    displayName = "Borders";
    slices = [
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
    color = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "color",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    fontFamily = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.TextInput */ .z.ks({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Segoe UI, sans-serif",
        placeholder: "Enter font family"
    });
    fontSize = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "fontSize",
        displayName: "Font Size",
        value: 10
    });
    bold = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "bold",
        displayName: "Bold",
        value: false
    });
    italic = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "italic",
        displayName: "Italic",
        value: false
    });
    underline = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "underline",
        displayName: "Underline",
        value: false
    });
    // Adding background settings to Font card
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    // Data Cells Font
    name = "fontFormat";
    displayName = "Values";
    slices = [
        this.color, this.fontFamily, this.fontSize,
        this.bold, this.italic, this.underline,
        this.backgroundColor
    ];
}
/**
 * Column Header Formatting Card
 */
class ColumnHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#E0E0E0" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    fontColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    bold = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "bold",
        displayName: "Bold",
        value: true
    });
    name = "columnHeaderFormat";
    displayName = "Column Headers";
    slices = [this.backgroundColor, this.fontColor, this.bold];
}
/**
 * Row Header Formatting Card
 */
class RowHeaderFormatSettings extends FormattingSettingsCard {
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#E8E8E8" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    fontColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    bold = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "bold",
        displayName: "Bold",
        value: true
    });
    name = "rowHeaderFormat";
    displayName = "Row Headers";
    slices = [this.backgroundColor, this.fontColor, this.bold];
}
/**
 * Subtotal Formatting Card
 */
class SubtotalFormatSettings extends FormattingSettingsCard {
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#F0F0F0" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    fontColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "fontColor",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    bold = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "bold",
        displayName: "Bold",
        value: true
    });
    italic = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "italic",
        displayName: "Italic",
        value: false
    });
    applyToLevel0 = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "applyToLevel0",
        displayName: "Apply to Top Level",
        value: true
    });
    name = "subtotalFormat";
    displayName = "Subtotals";
    slices = [
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
    enableBlankRows = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "enableBlankRows",
        displayName: "Add Blank Rows",
        value: false
    });
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#F0F0F0" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    height = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "height",
        displayName: "Row Height",
        value: 10
    });
    name = "blankRowSettings";
    displayName = "Blank Rows";
    slices = [
        this.enableBlankRows,
        this.backgroundColor,
        this.height
    ];
}
/**
 * Visual settings model class
 */
class VisualFormattingSettingsModel extends FormattingSettingsModel {
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


/***/ }),

/***/ 639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ getPropertyValue),
/* harmony export */   y: () => (/* binding */ getDescriptor)
/* harmony export */ });
/**
 * Build and return formatting descriptor for simple slice
 *
 * @param objectName Object name from capabilities
 * @param slice formatting simple slice
 * @returns simple slice formatting descriptor
 */
function getDescriptor(objectName, slice) {
    return {
        objectName: objectName,
        propertyName: slice.name,
        selector: slice.selector,
        altConstantValueSelector: slice.altConstantSelector,
        instanceKind: slice.instanceKind
    };
}
/**
 * Get property value from dataview objects if exists
 * Else return the default value from formatting settings object
 *
 * @param value dataview object value
 * @param defaultValue formatting settings default value
 * @returns formatting property value
 */
function getPropertyValue(slice, value, defaultValue) {
    if (value == null || (typeof value === "object" && !value.solid)) {
        return defaultValue;
    }
    if (value.solid) {
        return { value: value === null || value === void 0 ? void 0 : value.solid.color };
    }
    if ((slice === null || slice === void 0 ? void 0 : slice.type) === "Dropdown" /* visuals.FormattingComponent.Dropdown */ && slice.items) {
        const itemsArray = slice.items;
        return itemsArray.find(item => item.value == value);
    }
    return value;
}
//# sourceMappingURL=FormattingSettingsUtils.js.map

/***/ }),

/***/ 667:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export FormattingSettingsService */
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(754);

class FormattingSettingsService {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }
    /**
     * Build visual formatting settings model from metadata dataView
     *
     * @param dataViews metadata dataView object
     * @returns visual formatting settings model
     */
    populateFormattingSettingsModel(typeClass, dataView) {
        var _a, _b;
        const defaultSettings = new typeClass();
        const dataViewObjects = (_a = dataView === null || dataView === void 0 ? void 0 : dataView.metadata) === null || _a === void 0 ? void 0 : _a.objects;
        if (dataViewObjects) {
            // loop over each formatting property and set its new value if exists
            (_b = defaultSettings.cards) === null || _b === void 0 ? void 0 : _b.forEach((card) => {
                var _a;
                if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .CompositeCard */ .St)
                    (_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, card.name);
                const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .Tn ? [card] : card.groups);
                cardGroupInstances.forEach((cardGroupInstance) => {
                    var _a, _b, _c, _d;
                    // Set current top level toggle value
                    (_a = cardGroupInstance.topLevelSlice) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, card.name);
                    (_b = cardGroupInstance === null || cardGroupInstance === void 0 ? void 0 : cardGroupInstance.slices) === null || _b === void 0 ? void 0 : _b.forEach((slice) => {
                        slice === null || slice === void 0 ? void 0 : slice.setPropertiesValues(dataViewObjects, card.name);
                    });
                    (_d = (_c = cardGroupInstance === null || cardGroupInstance === void 0 ? void 0 : cardGroupInstance.container) === null || _c === void 0 ? void 0 : _c.containerItems) === null || _d === void 0 ? void 0 : _d.forEach((containerItem) => {
                        var _a;
                        (_a = containerItem === null || containerItem === void 0 ? void 0 : containerItem.slices) === null || _a === void 0 ? void 0 : _a.forEach((slice) => {
                            slice === null || slice === void 0 ? void 0 : slice.setPropertiesValues(dataViewObjects, card.name);
                        });
                    });
                });
            });
        }
        return defaultSettings;
    }
    /**
     * Build formatting model by parsing formatting settings model object
     *
     * @returns powerbi visual formatting model
     */
    buildFormattingModel(formattingSettingsModel) {
        const formattingModel = {
            cards: []
        };
        formattingSettingsModel.cards
            .filter(({ visible = true }) => visible)
            .forEach((card) => {
            var _a;
            const formattingCard = {
                displayName: (this.localizationManager && card.displayNameKey) ? this.localizationManager.getDisplayName(card.displayNameKey) : card.displayName,
                description: (this.localizationManager && card.descriptionKey) ? this.localizationManager.getDisplayName(card.descriptionKey) : card.description,
                groups: [],
                uid: card.name + "-card",
                analyticsPane: card.analyticsPane,
            };
            const objectName = card.name;
            if (card.topLevelSlice) {
                const topLevelToggleSlice = card.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
                topLevelToggleSlice.suppressDisplayName = true;
                formattingCard.topLevelToggle = topLevelToggleSlice;
            }
            (_a = card.onPreProcess) === null || _a === void 0 ? void 0 : _a.call(card);
            const isSimpleCard = card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .Tn;
            const cardGroupInstances = (isSimpleCard ?
                [card].filter(({ visible = true }) => visible) :
                card.groups.filter(({ visible = true }) => visible));
            cardGroupInstances
                .forEach((cardGroupInstance) => {
                const groupUid = cardGroupInstance.name + "-group";
                // Build formatting group for each group
                const formattingGroup = {
                    displayName: isSimpleCard ? undefined : (this.localizationManager && cardGroupInstance.displayNameKey)
                        ? this.localizationManager.getDisplayName(cardGroupInstance.displayNameKey) : cardGroupInstance.displayName,
                    description: isSimpleCard ? undefined : (this.localizationManager && cardGroupInstance.descriptionKey)
                        ? this.localizationManager.getDisplayName(cardGroupInstance.descriptionKey) : cardGroupInstance.description,
                    slices: [],
                    uid: groupUid,
                    collapsible: cardGroupInstance.collapsible,
                    delaySaveSlices: cardGroupInstance.delaySaveSlices,
                    disabled: cardGroupInstance.disabled,
                    disabledReason: cardGroupInstance.disabledReason,
                };
                formattingCard.groups.push(formattingGroup);
                // In case formatting model adds data points or top categories (Like when you modify specific visual category color).
                // these categories use same object name and property name from capabilities and the generated uid will be the same for these formatting categories properties
                // Solution => Save slice names to modify each slice uid to be unique by adding counter value to the new slice uid
                const sliceNames = {};
                // Build formatting container slice for each property
                if (cardGroupInstance.container) {
                    const container = cardGroupInstance.container;
                    const containerUid = groupUid + "-container";
                    const formattingContainer = {
                        displayName: (this.localizationManager && container.displayNameKey)
                            ? this.localizationManager.getDisplayName(container.displayNameKey) : container.displayName,
                        description: (this.localizationManager && container.descriptionKey)
                            ? this.localizationManager.getDisplayName(container.descriptionKey) : container.description,
                        containerItems: [],
                        uid: containerUid
                    };
                    container.containerItems.forEach((containerItem) => {
                        // Build formatting container item object
                        const containerIemName = containerItem.displayNameKey ? containerItem.displayNameKey : containerItem.displayName;
                        const containerItemUid = containerUid + containerIemName;
                        const formattingContainerItem = {
                            displayName: (this.localizationManager && containerItem.displayNameKey)
                                ? this.localizationManager.getDisplayName(containerItem.displayNameKey) : containerItem.displayName,
                            slices: [],
                            uid: containerItemUid
                        };
                        // Build formatting slices and add them to current formatting container item
                        this.buildFormattingSlices({ slices: containerItem.slices, objectName, sliceNames, formattingSlices: formattingContainerItem.slices });
                        formattingContainer.containerItems.push(formattingContainerItem);
                    });
                    formattingGroup.container = formattingContainer;
                }
                if (cardGroupInstance.slices) {
                    if (cardGroupInstance.topLevelSlice) {
                        const topLevelToggleSlice = cardGroupInstance.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
                        topLevelToggleSlice.suppressDisplayName = true;
                        (formattingGroup.displayName == undefined ? formattingCard : formattingGroup).topLevelToggle = topLevelToggleSlice;
                    }
                    // Build formatting slice for each property
                    this.buildFormattingSlices({ slices: cardGroupInstance.slices, objectName, sliceNames, formattingSlices: formattingGroup.slices });
                }
            });
            formattingCard.revertToDefaultDescriptors = this.getRevertToDefaultDescriptor(card);
            formattingModel.cards.push(formattingCard);
        });
        return formattingModel;
    }
    buildFormattingSlices({ slices, objectName, sliceNames, formattingSlices }) {
        // Filter slices based on their visibility
        slices === null || slices === void 0 ? void 0 : slices.filter(({ visible = true }) => visible).forEach((slice) => {
            const formattingSlice = slice === null || slice === void 0 ? void 0 : slice.getFormattingSlice(objectName, this.localizationManager);
            if (formattingSlice) {
                // Modify formatting slice uid if needed
                if (sliceNames[slice.name] === undefined) {
                    sliceNames[slice.name] = 0;
                }
                else {
                    sliceNames[slice.name]++;
                    formattingSlice.uid = `${formattingSlice.uid}-${sliceNames[slice.name]}`;
                }
                formattingSlices.push(formattingSlice);
            }
        });
    }
    getRevertToDefaultDescriptor(card) {
        var _a;
        // Proceeded slice names are saved to prevent duplicated default descriptors in case of using 
        // formatting categories & selectors, since they have the same descriptor objectName and propertyName
        const sliceNames = {};
        const revertToDefaultDescriptors = [];
        let cardSlicesDefaultDescriptors;
        let cardContainerSlicesDefaultDescriptors = [];
        // eslint-disable-next-line
        if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .CompositeCard */ .St && card.topLevelSlice)
            revertToDefaultDescriptors.push(...(_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.getRevertToDefaultDescriptor(card.name));
        const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .Tn ?
            [card].filter(({ visible = true }) => visible) :
            card.groups.filter(({ visible = true }) => visible));
        cardGroupInstances.forEach((cardGroupInstance) => {
            var _a, _b;
            cardSlicesDefaultDescriptors = this.getSlicesRevertToDefaultDescriptor(card.name, cardGroupInstance.slices, sliceNames, cardGroupInstance.topLevelSlice);
            (_b = (_a = cardGroupInstance.container) === null || _a === void 0 ? void 0 : _a.containerItems) === null || _b === void 0 ? void 0 : _b.forEach((containerItem) => {
                cardContainerSlicesDefaultDescriptors = cardContainerSlicesDefaultDescriptors.concat(this.getSlicesRevertToDefaultDescriptor(card.name, containerItem.slices, sliceNames));
            });
            revertToDefaultDescriptors.push(...cardSlicesDefaultDescriptors.concat(cardContainerSlicesDefaultDescriptors));
        });
        return revertToDefaultDescriptors;
    }
    getSlicesRevertToDefaultDescriptor(cardName, slices, sliceNames, topLevelSlice) {
        let revertToDefaultDescriptors = [];
        if (topLevelSlice) {
            sliceNames[topLevelSlice.name] = true;
            revertToDefaultDescriptors = revertToDefaultDescriptors.concat(topLevelSlice.getRevertToDefaultDescriptor(cardName));
        }
        slices === null || slices === void 0 ? void 0 : slices.forEach((slice) => {
            if (slice && !sliceNames[slice.name]) {
                sliceNames[slice.name] = true;
                revertToDefaultDescriptors = revertToDefaultDescriptors.concat(slice.getRevertToDefaultDescriptor(cardName));
            }
        });
        return revertToDefaultDescriptors;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormattingSettingsService);
//# sourceMappingURL=FormattingSettingsService.js.map

/***/ }),

/***/ 674:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* reexport safe */ _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__.A),
/* harmony export */   z: () => (/* reexport module object */ _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(754);
/* harmony import */ var _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(667);



//# sourceMappingURL=index.js.map

/***/ }),

/***/ 754:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Kx: () => (/* binding */ Model),
/* harmony export */   St: () => (/* binding */ CompositeCard),
/* harmony export */   Tn: () => (/* binding */ SimpleCard),
/* harmony export */   iB: () => (/* binding */ NumUpDown),
/* harmony export */   jF: () => (/* binding */ ToggleSwitch),
/* harmony export */   ks: () => (/* binding */ TextInput),
/* harmony export */   sk: () => (/* binding */ ColorPicker)
/* harmony export */ });
/* unused harmony exports CardGroupEntity, Group, SimpleSlice, AlignmentGroup, Slider, DatePicker, ItemDropdown, AutoDropdown, DurationPicker, ErrorRangeControl, FieldPicker, ItemFlagsSelection, AutoFlagsSelection, TextArea, FontPicker, GradientBar, ImageUpload, ListEditor, ReadOnlyText, ShapeMapSelector, CompositeSlice, FontControl, MarginPadding, Container, ContainerItem */
/* harmony import */ var _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(639);
/**
 * Powerbi utils components classes for custom visual formatting pane objects
 *
 */

class NamedEntity {
}
class CardGroupEntity extends NamedEntity {
}
class Model {
}
/** CompositeCard is use to populate a card into the formatting pane with multiple groups */
class CompositeCard extends NamedEntity {
}
class Group extends CardGroupEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
/** SimpleCard is use to populate a card into the formatting pane in a single group */
class SimpleCard extends CardGroupEntity {
}
class SimpleSlice extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
    getFormattingSlice(objectName, localizationManager) {
        const controlType = this.type;
        const propertyName = this.name;
        const sliceDisplayName = (localizationManager && this.displayNameKey) ? localizationManager.getDisplayName(this.displayNameKey) : this.displayName;
        const sliceDescription = (localizationManager && this.descriptionKey) ? localizationManager.getDisplayName(this.descriptionKey) : this.description;
        const componentDisplayName = {
            displayName: sliceDisplayName,
            description: sliceDescription,
            uid: objectName + '-' + propertyName,
        };
        return Object.assign(Object.assign({}, componentDisplayName), { control: {
                type: controlType,
                properties: this.getFormattingComponent(objectName, localizationManager)
            } });
    }
    // eslint-disable-next-line
    getFormattingComponent(objectName, localizationManager) {
        return {
            descriptor: _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getDescriptor */ .y(objectName, this),
            value: this.value,
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return [{
                objectName: objectName,
                propertyName: this.name
            }];
    }
    setPropertiesValues(dataViewObjects, objectName) {
        var _a;
        const newValue = (_a = dataViewObjects === null || dataViewObjects === void 0 ? void 0 : dataViewObjects[objectName]) === null || _a === void 0 ? void 0 : _a[this.name];
        this.value = _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getPropertyValue */ .D(this, newValue, this.value);
    }
}
class AlignmentGroup extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "AlignmentGroup" /* visuals.FormattingComponent.AlignmentGroup */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { mode: this.mode, supportsNoSelection: this.supportsNoSelection });
    }
}
class ToggleSwitch extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ToggleSwitch" /* visuals.FormattingComponent.ToggleSwitch */;
    }
}
class ColorPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ColorPicker" /* visuals.FormattingComponent.ColorPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { defaultColor: this.defaultColor, isNoFillItemSupported: this.isNoFillItemSupported });
    }
}
class NumUpDown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "NumUpDown" /* visuals.FormattingComponent.NumUpDown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { options: this.options });
    }
}
class Slider extends NumUpDown {
    constructor() {
        super(...arguments);
        this.type = "Slider" /* visuals.FormattingComponent.Slider */;
    }
}
class DatePicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "DatePicker" /* visuals.FormattingComponent.DatePicker */;
    }
    getFormattingComponent(objectName, localizationManager) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { placeholder: (localizationManager && this.placeholderKey) ? localizationManager.getDisplayName(this.placeholderKey) : this.placeholder, validators: this.validators });
    }
}
class ItemDropdown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "Dropdown" /* visuals.FormattingComponent.Dropdown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { items: this.items });
    }
}
class AutoDropdown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "Dropdown" /* visuals.FormattingComponent.Dropdown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { mergeValues: this.mergeValues, filterValues: this.filterValues });
    }
}
class DurationPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "DurationPicker" /* visuals.FormattingComponent.DurationPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class ErrorRangeControl extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ErrorRangeControl" /* visuals.FormattingComponent.ErrorRangeControl */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class FieldPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "FieldPicker" /* visuals.FormattingComponent.FieldPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators, allowMultipleValues: this.allowMultipleValues });
    }
}
class ItemFlagsSelection extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "FlagsSelection" /* visuals.FormattingComponent.FlagsSelection */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { items: this.items });
    }
}
class AutoFlagsSelection extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "FlagsSelection" /* visuals.FormattingComponent.FlagsSelection */;
    }
}
class TextInput extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "TextInput" /* visuals.FormattingComponent.TextInput */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { placeholder: this.placeholder });
    }
}
class TextArea extends TextInput {
    constructor() {
        super(...arguments);
        this.type = "TextArea" /* visuals.FormattingComponent.TextArea */;
    }
}
class FontPicker extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "FontPicker" /* visuals.FormattingComponent.FontPicker */;
    }
}
class GradientBar extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "GradientBar" /* visuals.FormattingComponent.GradientBar */;
    }
}
class ImageUpload extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ImageUpload" /* visuals.FormattingComponent.ImageUpload */;
    }
}
class ListEditor extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ListEditor" /* visuals.FormattingComponent.ListEditor */;
    }
}
class ReadOnlyText extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ReadOnlyText" /* visuals.FormattingComponent.ReadOnlyText */;
    }
}
class ShapeMapSelector extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ShapeMapSelector" /* visuals.FormattingComponent.ShapeMapSelector */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { isAzMapReferenceSelector: this.isAzMapReferenceSelector });
    }
}
class CompositeSlice extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
    getFormattingSlice(objectName, localizationManager) {
        const controlType = this.type;
        const propertyName = this.name;
        const componentDisplayName = {
            displayName: (localizationManager && this.displayNameKey) ? localizationManager.getDisplayName(this.displayNameKey) : this.displayName,
            description: (localizationManager && this.descriptionKey) ? localizationManager.getDisplayName(this.descriptionKey) : this.description,
            uid: objectName + '-' + propertyName,
        };
        return Object.assign(Object.assign({}, componentDisplayName), { control: {
                type: controlType,
                properties: this.getFormattingComponent(objectName)
            } });
    }
}
class FontControl extends CompositeSlice {
    constructor(object) {
        super(object);
        this.type = "FontControl" /* visuals.FormattingComponent.FontControl */;
    }
    getFormattingComponent(objectName) {
        var _a, _b, _c;
        return {
            fontFamily: this.fontFamily.getFormattingComponent(objectName),
            fontSize: this.fontSize.getFormattingComponent(objectName),
            bold: (_a = this.bold) === null || _a === void 0 ? void 0 : _a.getFormattingComponent(objectName),
            italic: (_b = this.italic) === null || _b === void 0 ? void 0 : _b.getFormattingComponent(objectName),
            underline: (_c = this.underline) === null || _c === void 0 ? void 0 : _c.getFormattingComponent(objectName)
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return this.fontFamily.getRevertToDefaultDescriptor(objectName)
            .concat(this.fontSize.getRevertToDefaultDescriptor(objectName))
            .concat(this.bold ? this.bold.getRevertToDefaultDescriptor(objectName) : [])
            .concat(this.italic ? this.italic.getRevertToDefaultDescriptor(objectName) : [])
            .concat(this.underline ? this.underline.getRevertToDefaultDescriptor(objectName) : []);
    }
    setPropertiesValues(dataViewObjects, objectName) {
        var _a, _b, _c;
        this.fontFamily.setPropertiesValues(dataViewObjects, objectName);
        this.fontSize.setPropertiesValues(dataViewObjects, objectName);
        (_a = this.bold) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, objectName);
        (_b = this.italic) === null || _b === void 0 ? void 0 : _b.setPropertiesValues(dataViewObjects, objectName);
        (_c = this.underline) === null || _c === void 0 ? void 0 : _c.setPropertiesValues(dataViewObjects, objectName);
    }
}
class MarginPadding extends CompositeSlice {
    constructor(object) {
        super(object);
        this.type = "MarginPadding" /* visuals.FormattingComponent.MarginPadding */;
    }
    getFormattingComponent(objectName) {
        return {
            left: this.left.getFormattingComponent(objectName),
            right: this.right.getFormattingComponent(objectName),
            top: this.top.getFormattingComponent(objectName),
            bottom: this.bottom.getFormattingComponent(objectName)
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return this.left.getRevertToDefaultDescriptor(objectName)
            .concat(this.right.getRevertToDefaultDescriptor(objectName))
            .concat(this.top.getRevertToDefaultDescriptor(objectName))
            .concat(this.bottom.getRevertToDefaultDescriptor(objectName));
    }
    setPropertiesValues(dataViewObjects, objectName) {
        this.left.setPropertiesValues(dataViewObjects, objectName);
        this.right.setPropertiesValues(dataViewObjects, objectName);
        this.top.setPropertiesValues(dataViewObjects, objectName);
        this.bottom.setPropertiesValues(dataViewObjects, objectName);
    }
}
class Container extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
class ContainerItem extends (/* unused pure expression or super */ null && (NamedEntity)) {
}
//# sourceMappingURL=FormattingSettingsComponents.js.map

/***/ }),

/***/ 849:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ Visual)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(674);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(480);
/*
 *  Power BI Visual CLI
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 */




class Visual {
    target;
    tableDiv;
    updateCount;
    formattingSettings;
    formattingSettingsService;
    // Store the host reference
    host;
    // Track expanded state
    expandedRows;
    // Store the last options for re-rendering
    lastOptions;
    constructor(options) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .FormattingSettingsService */ .O();
        this.updateCount = 0;
        this.expandedRows = new Map();
        // Create main container div
        const container = document.createElement("div");
        container.className = "visual-container";
        this.target.appendChild(container);
        // Create table container
        this.tableDiv = document.createElement("div");
        this.tableDiv.className = "table-container";
        container.appendChild(this.tableDiv);
    }
    update(options) {
        // Store the complete options object for later re-renders
        this.lastOptions = options;
        // Clear any previous content
        this.tableDiv.innerHTML = "";
        // Get formatting settings
        if (options && options.dataViews && options.dataViews[0]) {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(_settings__WEBPACK_IMPORTED_MODULE_1__/* .VisualFormattingSettingsModel */ .S, options.dataViews[0]);
        }
        else {
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
        }
        catch (error) {
            console.error("Error in update:", error);
        }
    }
    getMeasureName(dataView) {
        // Try to get from matrix valueSources
        if (dataView.matrix && dataView.matrix.valueSources && dataView.matrix.valueSources.length > 0) {
            const valueSource = dataView.matrix.valueSources[0];
            if (valueSource.displayName) {
                return valueSource.displayName;
            }
        }
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata && dataView.metadata.columns) {
            const valueColumn = dataView.metadata.columns.find(col => col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
            if (valueColumn && valueColumn.displayName) {
                return valueColumn.displayName;
            }
        }
        // Default fallback
        return "Amount";
    }
    // Generate a unique ID for tracking expanded state
    getNodeId(node, level) {
        const value = node.value !== null && node.value !== undefined ? String(node.value) : "null";
        return `level_${level}_${value}`;
    }
    // Check if a node is expanded
    isExpanded(nodeId) {
        return this.expandedRows.get(nodeId) === true;
    }
    // Toggle expanded state of a node
    toggleExpanded(nodeId) {
        this.expandedRows.set(nodeId, !this.isExpanded(nodeId));
    }
    // Format a date value according to the format string
    formatDateValue(value, format = "M/d/yyyy") {
        if (!value)
            return "";
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
        }
        catch (error) {
            console.error("Error formatting date:", error);
            return String(value);
        }
    }
    // Calculate subtotals for a parent node for a specific column index
    calculateSubtotalForColumn(parentNode, columnIndex) {
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
    applyGlobalBorders(table) {
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
        }
        else {
            table.classList.remove('with-horizontal-borders');
        }
        if (showVertical) {
            table.classList.add('with-vertical-borders');
        }
        else {
            table.classList.remove('with-vertical-borders');
        }
        // Set CSS variables for border styling
        table.style.setProperty('--border-color', borderColor);
        table.style.setProperty('--border-width', `${borderWidth}px`);
        table.style.setProperty('--border-style', 'solid');
    }
    // Initialize expanded state for new nodes
    initializeExpandedState(rows, level, parentId) {
        if (!rows)
            return;
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
    createMatrixTable(matrix, measureName) {
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
        let columns = [];
        let columnFormats = [];
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
        }
        else {
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
                }
                else {
                    th.textContent = String(column.value);
                }
            }
            else if (this.formattingSettings.generalSettings.showMeasureName.value) {
                // Use measure name if column is empty and showMeasureName is true
                th.textContent = measureName;
            }
            else {
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
    renderRowsWithSubtotals(table, rows, columns, level = 0, parentId = "") {
        if (!rows || rows.length === 0)
            return;
        const tbody = table.querySelector('tbody');
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
            }
            else {
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
            }
            else {
                label.textContent = row.value !== null && row.value !== undefined ? String(row.value) : "";
            }
            headerContent.appendChild(label);
            rowHeader.appendChild(headerContent);
            // Apply row header formatting - different for Level 0 if setting enabled
            if (isLevel0 && applySubtotalToLevel0) {
                this.applyLevel0HeaderFormatting(rowHeader);
            }
            else {
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
                    }
                    else {
                        td.textContent = "";
                    }
                    tr.appendChild(td);
                }
            }
            else if (row.values) {
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
                        }
                        else if (typeof value === 'object') {
                            // Extract value from object
                            if ('value' in value) {
                                const cellValue = value.value;
                                if (typeof cellValue === 'number') {
                                    td.textContent = this.formatNumber(cellValue);
                                }
                                else if (cellValue === null || cellValue === undefined ||
                                    (typeof cellValue === 'object' && Object.keys(cellValue).length === 0)) {
                                    // Handle empty objects
                                    td.textContent = "";
                                }
                                else {
                                    td.textContent = String(cellValue);
                                }
                            }
                            else if (Object.keys(value).length === 0) {
                                // Handle empty objects
                                td.textContent = "";
                            }
                            else {
                                td.textContent = JSON.stringify(value);
                            }
                        }
                        else {
                            td.textContent = String(value);
                        }
                    }
                    else {
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
    formatNumber(value) {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
    applyColumnHeaderFormatting(headerCell) {
        if (!this.formattingSettings)
            return;
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
        }
        else {
            headerCell.style.fontWeight = 'normal';
        }
    }
    /**
     * Apply formatting to row headers
     */
    applyRowHeaderFormatting(headerCell) {
        if (!this.formattingSettings)
            return;
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
        }
        else {
            headerCell.style.fontWeight = 'normal';
        }
    }
    /**
     * Apply subtotal formatting to Level 0 row headers
     */
    applyLevel0HeaderFormatting(headerCell) {
        if (!this.formattingSettings)
            return;
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
        }
        else {
            headerCell.style.fontWeight = 'normal';
        }
        if (subtotalFormat.italic.value) {
            headerCell.style.fontStyle = 'italic';
        }
        else {
            headerCell.style.fontStyle = 'normal';
        }
    }
    applyFormatting(table) {
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
            regularCells.forEach((cell) => {
                this.applyDataCellFormatting(cell, font, false, false);
            });
            // Apply formatting to subtotal cells with explicit styling
            subtotalCells.forEach((cell) => {
                this.applyDataCellFormatting(cell, font, true, false);
            });
            // Apply separate formatting to level 0 cells if the setting is enabled
            level0Cells.forEach((cell) => {
                if (applySubtotalToLevel0) {
                    this.applySubtotalCellFormatting(cell);
                }
                else {
                    this.applyDataCellFormatting(cell, font, true, false);
                }
            });
        }
        catch (error) {
            console.error("Error applying formatting:", error);
        }
    }
    // Helper function to apply data cell formatting
    applyDataCellFormatting(cell, font, isSubtotal, isLevel0) {
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
            }
            else {
                cell.style.backgroundColor = font.backgroundColor.value.value;
            }
        }
    }
    // Apply formatting from subtotal settings to level 0 cells
    applySubtotalCellFormatting(cell) {
        if (!this.formattingSettings)
            return;
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
    adjustColor(color, amount) {
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
        }
        catch (error) {
            // Return a default color if there's an error
            console.error("Error adjusting color:", error);
            return amount < 0 ? '#e0e0e0' : '#f5f5f5';
        }
    }
    // Helper method for controlled re-rendering of the visual
    renderVisualWithCurrentState() {
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
                }
                catch (error) {
                    console.error("Error in visual re-render:", error);
                }
            }
        }, 10); // Small delay to ensure DOM updates first
    }
    getFormattingModel() {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it declares 'customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG' on top-level, which conflicts with the current library output.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (visualPlugin)
/* harmony export */ });
/* harmony import */ var visualPlugin_src_visual_WEBPACK_IMPORTED_MODULE_0_ = __webpack_require__(849);

var visualPlugin_powerbiKey = "powerbi";
var visualPlugin_powerbi = window[visualPlugin_powerbiKey];
var visualPlugin_customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG = {
    name: 'customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG',
    displayName: 'CustomMatrix',
    class: 'Visual',
    apiVersion: '5.3.0',
    create: (options) => {
        if (visualPlugin_src_visual_WEBPACK_IMPORTED_MODULE_0_/* .Visual */ .b) {
            return new visualPlugin_src_visual_WEBPACK_IMPORTED_MODULE_0_/* .Visual */ .b(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId, options, initialState) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof visualPlugin_powerbi !== "undefined") {
    visualPlugin_powerbi.visuals = visualPlugin_powerbi.visuals || {};
    visualPlugin_powerbi.visuals.plugins = visualPlugin_powerbi.visuals.plugins || {};
    visualPlugin_powerbi.visuals.plugins["customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG"] = visualPlugin_customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG;
}
/* harmony default export */ const visualPlugin = (visualPlugin_customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG);

})();

customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=https://localhost:8080/assets/visual.js.map