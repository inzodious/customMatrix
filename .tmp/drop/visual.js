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
    fontFamily = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.TextInput */ .z.ks({
        name: "fontFamily",
        displayName: "Font Family",
        value: "Segoe UI, sans-serif",
        placeholder: "Enter font family"
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
        this.fontFamily,
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
        value: { value: "#FFFFF" },
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
 * Shared formatting options base class
 */
class BaseFormatSettings extends FormattingSettingsCard {
    color = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "color",
        displayName: "Font Color",
        value: { value: "#000000" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
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
    backgroundColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ColorPicker */ .z.sk({
        name: "backgroundColor",
        displayName: "Background Color",
        value: { value: "#FFFFFF" },
        instanceKind: 3 /* powerbi.VisualEnumerationInstanceKinds.ConstantOrRule */
    });
    alignment = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ItemDropdown */ .z.PA({
        name: "alignment",
        displayName: "Text Alignment",
        items: [
            { displayName: "Left", value: "left" },
            { displayName: "Center", value: "center" },
            { displayName: "Right", value: "right" }
        ],
        value: { value: "right", displayName: "Right" }
    });
    get formattingSlices() {
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
    name = "fontFormat";
    displayName = "Data Values";
    slices = this.formattingSlices;
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
    name = "columnHeaderFormat";
    displayName = "Column Headers";
    slices = this.formattingSlices;
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
    name = "rowHeaderFormat";
    displayName = "Row Headers";
    slices = this.formattingSlices;
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
    name = "subtotalFormat";
    displayName = "Subtotals";
    slices = this.formattingSlices;
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
 * Grand Total Settings Card
 */
class GrandTotalSettings extends BaseFormatSettings {
    show = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.ToggleSwitch */ .z.jF({
        name: "show",
        displayName: "Show Grand Total",
        value: true
    });
    label = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.TextInput */ .z.ks({
        name: "label",
        displayName: "Total Label",
        value: "Grand Total",
        placeholder: "Enter label for total"
    });
    name = "grandTotalSettings";
    displayName = "Grand Total";
    slices = [
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
class VisualFormattingSettingsModel extends FormattingSettingsModel {
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
/* harmony export */   PA: () => (/* binding */ ItemDropdown),
/* harmony export */   St: () => (/* binding */ CompositeCard),
/* harmony export */   Tn: () => (/* binding */ SimpleCard),
/* harmony export */   iB: () => (/* binding */ NumUpDown),
/* harmony export */   jF: () => (/* binding */ ToggleSwitch),
/* harmony export */   ks: () => (/* binding */ TextInput),
/* harmony export */   sk: () => (/* binding */ ColorPicker)
/* harmony export */ });
/* unused harmony exports CardGroupEntity, Group, SimpleSlice, AlignmentGroup, Slider, DatePicker, AutoDropdown, DurationPicker, ErrorRangeControl, FieldPicker, ItemFlagsSelection, AutoFlagsSelection, TextArea, FontPicker, GradientBar, ImageUpload, ListEditor, ReadOnlyText, ShapeMapSelector, CompositeSlice, FontControl, MarginPadding, Container, ContainerItem */
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
};
class Visual {
    // DOM elements
    target;
    tableDiv;
    // State tracking
    formattingSettings;
    formattingSettingsService;
    host;
    expandedRows;
    lastOptions;
    constructor(options) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .FormattingSettingsService */ .O();
        this.expandedRows = new Map();
        // Create container elements
        this.createContainerElements();
    }
    createContainerElements() {
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
    }
    update(options) {
        // Store options for later re-renders
        this.lastOptions = options;
        // Clear previous content
        this.tableDiv.innerHTML = "";
        // Get formatting settings
        if (!options?.dataViews?.[0]) {
            return; // No data to display
        }
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(_settings__WEBPACK_IMPORTED_MODULE_1__/* .VisualFormattingSettingsModel */ .S, options.dataViews[0]);
        try {
            const dataView = options.dataViews[0];
            // Check if we have matrix data
            if (!dataView.matrix) {
                return;
            }
            const matrix = dataView.matrix;
            const measureName = this.getMeasureName(dataView);
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
        }
        catch (error) {
            console.error("Error in update:", error);
        }
    }
    // Helper methods for data extraction
    getMeasureName(dataView) {
        // Try to get from matrix valueSources
        if (dataView.matrix?.valueSources?.[0]?.displayName) {
            return dataView.matrix.valueSources[0].displayName;
        }
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata?.columns) {
            const valueColumn = dataView.metadata.columns.find(col => col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
            if (valueColumn?.displayName) {
                return valueColumn.displayName;
            }
        }
        return "Amount"; // Default fallback
    }
    // Generate unique ID for tracking expanded state
    getNodeId(node, level) {
        const value = node.value !== null && node.value !== undefined ? String(node.value) : "null";
        return `level_${level}_${value}`;
    }
    // Initialize expanded state for all rows
    initializeExpandedState(rows, level, parentId) {
        if (!rows)
            return;
        for (const row of rows) {
            const nodeId = parentId + this.getNodeId(row, level);
            // Set to expanded if not already set (default to expanded)
            if (!this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true);
            }
            // Initialize children recursively
            if (row.children?.length > 0) {
                this.initializeExpandedState(row.children, level + 1, nodeId);
            }
        }
    }
    // Check if a node is expanded
    isExpanded(nodeId) {
        return this.expandedRows.get(nodeId) === true;
    }
    // Toggle expanded state of a node
    toggleExpanded(nodeId) {
        this.expandedRows.set(nodeId, !this.isExpanded(nodeId));
    }
    // Main table creation method
    createMatrixTable(matrix, measureName) {
        // Create table
        const table = document.createElement("table");
        table.className = CSS_CLASSES.MATRIX_TABLE;
        // Set hover effects based on settings
        if (this.formattingSettings.generalSettings.enableHover.value) {
            table.classList.add(CSS_CLASSES.HOVER_ENABLED);
        }
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
        // Initialize all new rows to expanded state
        if (matrix.rows.root.children) {
            this.initializeExpandedState(matrix.rows.root.children, 0, "");
        }
        // Render rows recursively with subtotals
        if (matrix.rows.root.children) {
            this.renderRowsWithSubtotals(table, matrix.rows.root.children, columns, 0, "");
        }
        // Calculate grand totals
        const grandTotals = this.calculateGrandTotals(matrix, columns);
        // Add grand total row
        this.addGrandTotalRow(table, columns, grandTotals);
        // Apply all formatting
        this.applyTableFormatting(table);
    }
    // Process columns data
    processColumns(matrix, measureName) {
        let columns = [];
        let columnFormats = [];
        if (matrix.columns?.root?.children) {
            columns = matrix.columns.root.children;
            // Extract column formats if columns are dates
            if (matrix.columns.levels?.[0]?.sources?.[0]?.format) {
                const columnSource = matrix.columns.levels[0].sources[0];
                // Use the same format for all columns if they come from the same source
                columnFormats = columns.map(() => columnSource.format);
            }
        }
        else {
            // If no columns, create a single column for the measure
            columns = [{ value: null }]; // Empty column header
            columnFormats = [""];
        }
        return { columns, columnFormats };
    }
    // Create table header
    createTableHeader(table, columns, columnFormats) {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
        // Add corner cell
        const cornerCell = this.createCornerCell();
        headerRow.appendChild(cornerCell);
        // Add column headers
        for (let i = 0; i < columns.length; i++) {
            const columnHeader = this.createColumnHeader(columns[i], columnFormats[i]);
            headerRow.appendChild(columnHeader);
        }
        thead.appendChild(headerRow);
        table.appendChild(thead);
    }
    // Create corner cell (top-left)
    createCornerCell() {
        const cornerCell = document.createElement("th");
        cornerCell.className = `${CSS_CLASSES.ROW_HEADER} ${CSS_CLASSES.COLUMN_HEADER}`;
        cornerCell.setAttribute("style", "position: sticky !important; " +
            "top: 0 !important; " +
            "left: 0 !important; " +
            "z-index: 1000 !important; " +
            "background-color: #e0e0e0;");
        this.applyFormatting(cornerCell, 'columnHeader');
        return cornerCell;
    }
    // Create column header cell
    createColumnHeader(column, format) {
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
            }
            else {
                th.textContent = String(column.value);
            }
        }
        else if (this.formattingSettings.generalSettings.showMeasureName.value) {
            // Use measure name if column is empty and showMeasureName is true
            th.textContent = this.getMeasureDynamically();
        }
        else {
            th.textContent = "";
        }
        return th;
    }
    // Helper method to get measure dynamically
    getMeasureDynamically() {
        if (!this.lastOptions?.dataViews?.[0])
            return "Amount";
        return this.getMeasureName(this.lastOptions.dataViews[0]);
    }
    // Format a date value
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
    // Recursive function to render rows with subtotals
    renderRowsWithSubtotals(table, rows, columns, level = 0, parentId = "") {
        if (!rows?.length)
            return;
        const tbody = table.querySelector('tbody');
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        // Always apply subtotal formatting to level0
        const applySubtotalToLevel0 = true;
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
                tr.classList.add(CSS_CLASSES.LEVEL_0_ROW);
            }
            if (row.children?.length > 0) {
                tr.classList.add(CSS_CLASSES.SUBTOTAL_ROW);
            }
            // Add row header - always apply subtotal formatting to level0
            const rowHeader = this.createRowHeader(row, level, nodeId, isExpanded, isLevel0, true);
            tr.appendChild(rowHeader);
            // Add data cells
            if (row.children?.length > 0) {
                // Create subtotal cells
                this.addSubtotalCells(tr, row, columns, isLevel0, columnWidth);
            }
            else if (row.values) {
                // Create regular data cells
                this.addDataCells(tr, row, columns, columnWidth);
            }
            tbody.appendChild(tr);
            // If this node has children and is expanded, render its children
            if (row.children?.length > 0 && isExpanded) {
                this.renderRowsWithSubtotals(table, row.children, columns, level + 1, nodeId);
            }
            // Add blank row if needed
            this.addBlankRowIfNeeded(tbody, columns, i, rows.length, row, level);
        }
    }
    // Create a row header
    createRowHeader(row, level, nodeId, isExpanded, isLevel0, applySubtotalToLevel0) {
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
            const toggleButton = this.createToggleButton(nodeId, isExpanded);
            headerContent.appendChild(toggleButton);
        }
        else {
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
        }
        else {
            this.applyFormatting(rowHeader, 'rowHeader');
        }
        return rowHeader;
    }
    // Create toggle button for expanding/collapsing rows
    createToggleButton(nodeId, isExpanded) {
        const toggleButton = document.createElement("span");
        toggleButton.className = "toggle-button";
        toggleButton.textContent = isExpanded ? "▼" : "►";
        toggleButton.style.flexShrink = "0";
        toggleButton.onclick = (event) => {
            event.stopPropagation();
            this.toggleExpanded(nodeId);
            this.renderVisualWithCurrentState();
        };
        return toggleButton;
    }
    // Create row label element
    createRowLabel(row) {
        const label = document.createElement("span");
        label.className = "row-label";
        label.style.width = "100%";
        // Format date row headers properly
        if (row.isDate || (typeof row.value === 'object' && row.value.epochTimeStamp)) {
            label.textContent = this.formatDateValue(row.value);
        }
        else {
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
    // Add subtotal cells to a row
    addSubtotalCells(tr, row, columns, isLevel0, columnWidth) {
        for (let j = 0; j < columns.length; j++) {
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
        }
    }
    // Add regular data cells to a row
    addDataCells(tr, row, // Use any to handle both types
    columns, columnWidth) {
        for (let j = 0; j < columns.length; j++) {
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
            tr.appendChild(td);
        }
    }
    // Add blank row if settings indicate one is needed
    addBlankRowIfNeeded(tbody, columns, currentIndex, totalRows, currentRow, level) {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        // Only add blank rows if the setting is enabled
        if (!blankRowSettings.enableBlankRows.value) {
            return;
        }
        // Add blank row after each top-level item (level 0) except the last one
        if (level === 0 && currentIndex < totalRows - 1) {
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
    }
    // Format cell value based on type
    formatCellValue(value) {
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
                }
                else if (cellValue === null || cellValue === undefined ||
                    (typeof cellValue === 'object' && Object.keys(cellValue).length === 0)) {
                    return "";
                }
                else {
                    return String(cellValue);
                }
            }
            else if (Object.keys(value).length === 0) {
                return "";
            }
            else {
                return JSON.stringify(value);
            }
        }
        return String(value);
    }
    // Calculate subtotal for a parent node and column
    calculateSubtotalForColumn(parentNode, columnIndex) {
        if (!parentNode?.children?.length) {
            return 0;
        }
        let total = 0;
        for (const child of parentNode.children) {
            if (child.children?.length > 0) {
                // Recursively get subtotals from children
                total += this.calculateSubtotalForColumn(child, columnIndex);
            }
            else {
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
    /**
 * Calculate grand totals for all columns
 */
    calculateGrandTotals(matrix, columns) {
        const totals = new Array(columns.length).fill(0);
        // If no rows, return zeros
        if (!matrix.rows?.root?.children) {
            return totals;
        }
        // Function to recursively process all leaf nodes
        const processNode = (node, level) => {
            if (node.children && node.children.length > 0) {
                // Process children recursively
                for (const child of node.children) {
                    processNode(child, level + 1);
                }
            }
            else if (node.values) {
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
            processNode(row, 0);
        }
        return totals;
    }
    /**
     * Create and append grand total row
     */
    addGrandTotalRow(table, columns, totals) {
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
        }
        else {
            // Clear existing content
            tfoot.innerHTML = '';
        }
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
        for (let i = 0; i < columns.length; i++) {
            const td = document.createElement('td');
            td.textContent = this.formatNumber(totals[i]);
            tr.appendChild(td);
        }
        // Apply formatting to each cell in the grand total row
        const cells = tr.querySelectorAll('th, td');
        cells.forEach(cell => {
            this.applyFormatting(cell, 'grandTotal');
        });
        // Add the row to the footer
        tfoot.appendChild(tr);
    }
    // Format number with locale and decimal places
    formatNumber(value) {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }
    // Apply all formatting to the table
    applyTableFormatting(table) {
        if (!this.formattingSettings) {
            return;
        }
        try {
            // Apply general font size to table
            const fontSize = this.formattingSettings.generalSettings.fontSize.value;
            table.style.fontSize = `${fontSize}pt`;
            // Apply font family
            const fontFamily = this.formattingSettings.generalSettings.fontFamily.value;
            if (fontFamily) {
                table.style.fontFamily = fontFamily;
            }
            // Apply formatting to different cell types
            this.formatCellsByType(table);
            // Apply global border settings
            this.applyGlobalBorders(table);
        }
        catch (error) {
            console.error("Error applying formatting:", error);
        }
    }
    // Format cells by type (data, subtotal, etc.)
    formatCellsByType(table) {
        // Format by cell type using CSS selectors
        const regularCells = table.querySelectorAll('td.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
        const subtotalCells = table.querySelectorAll('td.subtotal-cell, td.level-0-subtotal');
        const regularRowHeaders = table.querySelectorAll('tr:not(.subtotal-row) > th.row-header');
        const subtotalRowHeaders = table.querySelectorAll('tr.subtotal-row > th.row-header');
        const columnHeaderCells = table.querySelectorAll('th.column-header:not(.row-header)');
        const cornerCell = table.querySelector('th.row-header.column-header');
        // Apply formatting to each cell type
        regularCells.forEach((cell) => {
            this.applyFormatting(cell, 'data');
        });
        subtotalCells.forEach((cell) => {
            this.applyFormatting(cell, 'subtotal');
        });
        regularRowHeaders.forEach((cell) => {
            this.applyFormatting(cell, 'rowHeader');
        });
        subtotalRowHeaders.forEach((cell) => {
            this.applyFormatting(cell, 'subtotal');
        });
        columnHeaderCells.forEach((cell) => {
            this.applyFormatting(cell, 'columnHeader');
        });
        if (cornerCell) {
            this.applyFormatting(cornerCell, 'columnHeader');
        }
    }
    // Apply formatting to a specific element based on its type
    applyFormatting(element, type, isSubtotal = false) {
        const settings = this.formattingSettings;
        if (!settings)
            return;
        // Apply global font family from general settings
        const globalFontFamily = settings.generalSettings.fontFamily.value;
        if (globalFontFamily) {
            element.style.fontFamily = globalFontFamily;
        }
        // If this is a subtotal, override the type
        if (isSubtotal) {
            type = 'subtotal';
        }
        switch (type) {
            case 'data':
                const font = settings.fontFormatSettings;
                // Font color
                if (font.color?.value?.value) {
                    element.style.color = font.color.value.value;
                }
                // Font size
                if (font.fontSize?.value) {
                    element.style.fontSize = `${font.fontSize.value}pt`;
                }
                // Font styling
                if (font.bold?.value) {
                    element.style.fontWeight = 'bold';
                }
                else {
                    element.style.fontWeight = 'normal';
                }
                if (font.italic?.value) {
                    element.style.fontStyle = 'italic';
                }
                else {
                    element.style.fontStyle = 'normal';
                }
                if (font.underline?.value) {
                    element.style.textDecoration = 'underline';
                }
                else {
                    element.style.textDecoration = 'none';
                }
                // Background color
                if (font.backgroundColor?.value?.value) {
                    element.style.backgroundColor = font.backgroundColor.value.value;
                }
                // Alignment
                if (font.alignment?.value?.value !== undefined) {
                    element.style.textAlign = font.alignment.value.value.toString();
                }
                break;
            case 'rowHeader':
                const rowFormat = settings.rowHeaderFormatSettings;
                // Font color
                if (rowFormat.color?.value?.value) {
                    element.style.color = rowFormat.color.value.value;
                }
                // Font size
                if (rowFormat.fontSize?.value) {
                    element.style.fontSize = `${rowFormat.fontSize.value}pt`;
                }
                // Background color
                if (rowFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = rowFormat.backgroundColor.value.value;
                }
                // Font styling
                if (rowFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                }
                else {
                    element.style.fontWeight = 'normal';
                }
                if (rowFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                }
                else {
                    element.style.fontStyle = 'normal';
                }
                if (rowFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                }
                else {
                    element.style.textDecoration = 'none';
                }
                // Alignment
                if (rowFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = rowFormat.alignment.value.value.toString();
                }
                break;
            case 'columnHeader':
                const headerFormat = settings.columnHeaderFormatSettings;
                // Font color
                if (headerFormat.color?.value?.value) {
                    element.style.color = headerFormat.color.value.value;
                }
                // Font size
                if (headerFormat.fontSize?.value) {
                    element.style.fontSize = `${headerFormat.fontSize.value}pt`;
                }
                // Background color
                if (headerFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = headerFormat.backgroundColor.value.value;
                }
                // Font styling
                if (headerFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                }
                else {
                    element.style.fontWeight = 'normal';
                }
                if (headerFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                }
                else {
                    element.style.fontStyle = 'normal';
                }
                if (headerFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                }
                else {
                    element.style.textDecoration = 'none';
                }
                // Alignment
                if (headerFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = headerFormat.alignment.value.value.toString();
                }
                break;
            case 'subtotal':
                const subtotalFormat = settings.subtotalFormatSettings;
                // Font color
                if (subtotalFormat.color?.value?.value) {
                    element.style.color = subtotalFormat.color.value.value;
                }
                // Font size
                if (subtotalFormat.fontSize?.value) {
                    element.style.fontSize = `${subtotalFormat.fontSize.value}pt`;
                }
                // Background color
                if (subtotalFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = subtotalFormat.backgroundColor.value.value;
                }
                // Font styling
                if (subtotalFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                }
                else {
                    element.style.fontWeight = 'normal';
                }
                if (subtotalFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                }
                else {
                    element.style.fontStyle = 'normal';
                }
                if (subtotalFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                }
                else {
                    element.style.textDecoration = 'none';
                }
                // Alignment
                if (subtotalFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = subtotalFormat.alignment.value.value.toString();
                }
                break;
            case 'grandTotal':
                const grandTotalFormat = settings.grandTotalSettings;
                // Font color
                if (grandTotalFormat.color?.value?.value) {
                    element.style.color = grandTotalFormat.color.value.value;
                }
                // Font size
                if (grandTotalFormat.fontSize?.value) {
                    element.style.fontSize = `${grandTotalFormat.fontSize.value}pt`;
                }
                // Background color
                if (grandTotalFormat.backgroundColor?.value?.value) {
                    element.style.backgroundColor = grandTotalFormat.backgroundColor.value.value;
                }
                // Font styling
                if (grandTotalFormat.bold?.value) {
                    element.style.fontWeight = 'bold';
                }
                else {
                    element.style.fontWeight = 'normal';
                }
                if (grandTotalFormat.italic?.value) {
                    element.style.fontStyle = 'italic';
                }
                else {
                    element.style.fontStyle = 'normal';
                }
                if (grandTotalFormat.underline?.value) {
                    element.style.textDecoration = 'underline';
                }
                else {
                    element.style.textDecoration = 'none';
                }
                // Apply alignment to the data cells, but not the label
                if (element.tagName === 'TD' && grandTotalFormat.alignment?.value?.value !== undefined) {
                    element.style.textAlign = grandTotalFormat.alignment.value.value.toString();
                }
                else if (element.tagName === 'TH') {
                    // The label cell should align left
                    element.style.textAlign = 'left';
                }
                break;
        }
    }
    // Apply border settings to the table
    applyGlobalBorders(table) {
        const borderSettings = this.formattingSettings.borderSettings;
        if (!borderSettings?.show?.value) {
            // If borders are turned off, remove all border classes
            table.classList.remove(CSS_CLASSES.WITH_BORDERS);
            table.classList.remove(CSS_CLASSES.WITH_HORIZONTAL_BORDERS);
            table.classList.remove(CSS_CLASSES.WITH_VERTICAL_BORDERS);
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
        }
        else {
            table.classList.remove(CSS_CLASSES.WITH_HORIZONTAL_BORDERS);
        }
        if (showVertical) {
            table.classList.add(CSS_CLASSES.WITH_VERTICAL_BORDERS);
        }
        else {
            table.classList.remove(CSS_CLASSES.WITH_VERTICAL_BORDERS);
        }
        // Set CSS variables for border styling
        table.style.setProperty('--border-color', borderColor);
        table.style.setProperty('--border-width', `${borderWidth}px`);
        table.style.setProperty('--border-style', 'solid');
    }
    // Helper method to adjust color brightness
    adjustColor(color, amount) {
        // Handle empty or invalid colors
        if (!color || color === 'transparent' || color === 'inherit' || color === 'initial') {
            return color;
        }
        try {
            // Convert hex to RGB
            let hex = color;
            if (hex.startsWith('#')) {
                hex = hex.slice(1);
            }
            // If not a proper hex color, return a default color
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
            console.error("Error adjusting color:", error);
            return amount < 0 ? '#e0e0e0' : '#f5f5f5';
        }
    }
    // Optimized re-rendering when toggling rows
    renderVisualWithCurrentState() {
        // Use a small timeout to ensure DOM updates
        setTimeout(() => {
            if (this.lastOptions) {
                try {
                    // Store current scroll position
                    const scrollTop = this.tableDiv.scrollTop;
                    const scrollLeft = this.tableDiv.scrollLeft;
                    // Clear and rebuild the table
                    this.tableDiv.innerHTML = "";
                    const dataView = this.lastOptions?.dataViews?.[0];
                    if (!dataView?.matrix)
                        return;
                    // Get measure name and rebuild the table
                    const measureName = this.getMeasureName(dataView);
                    this.createMatrixTable(dataView.matrix, measureName);
                    // Restore scroll position
                    this.tableDiv.scrollTop = scrollTop;
                    this.tableDiv.scrollLeft = scrollLeft;
                }
                catch (error) {
                    console.error("Error in visual re-render:", error);
                }
            }
        }, 10);
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