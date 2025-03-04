var customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 67:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumericSequenceRange: () => (/* binding */ NumericSequenceRange),
/* harmony export */   hasValue: () => (/* binding */ hasValue)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5442);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

class NumericSequenceRange {
    _ensureIncludeZero() {
        if (this.includeZero) {
            // fixed min and max has higher priority than includeZero
            if (this.min > 0 && !this.hasFixedMin) {
                this.min = 0;
            }
            if (this.max < 0 && !this.hasFixedMax) {
                this.max = 0;
            }
        }
    }
    _ensureNotEmpty() {
        if (this.min === this.max) {
            if (!this.min) {
                this.min = 0;
                this.max = NumericSequenceRange.DEFAULT_MAX;
                this.hasFixedMin = true;
                this.hasFixedMax = true;
            }
            else {
                // We are dealing with a single data value (includeZero is not set)
                // In order to fix the range we need to extend it in both directions by half of the interval.
                // Interval is calculated based on the number:
                // 1. Integers below 10,000 are extended by 0.5: so the [2006-2006] empty range is extended to [2005.5-2006.5] range and the ForsedSingleStop=2006
                // 2. Other numbers are extended by half of their power: [700,001-700,001] => [650,001-750,001] and the ForsedSingleStop=null as we want the intervals to be calculated to cover the range.
                const value = this.min;
                const exp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(Math.abs(value));
                let step;
                if (exp >= 0 && exp < 4) {
                    step = 0.5;
                    this.forcedSingleStop = value;
                }
                else {
                    step = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(exp) / 2;
                    this.forcedSingleStop = null;
                }
                this.min = value - step;
                this.max = value + step;
            }
        }
    }
    _ensureDirection() {
        if (this.min > this.max) {
            const temp = this.min;
            this.min = this.max;
            this.max = temp;
        }
    }
    getSize() {
        return this.max - this.min;
    }
    shrinkByStep(range, step) {
        let oldCount = this.min / step;
        let newCount = range.min / step;
        let deltaCount = Math.floor(newCount - oldCount);
        this.min += deltaCount * step;
        oldCount = this.max / step;
        newCount = range.max / step;
        deltaCount = Math.ceil(newCount - oldCount);
        this.max += deltaCount * step;
    }
    static calculate(dataMin, dataMax, fixedMin, fixedMax, includeZero) {
        const result = new NumericSequenceRange();
        result.includeZero = includeZero ? true : false;
        result.hasDataRange = hasValue(dataMin) && hasValue(dataMax);
        result.hasFixedMin = hasValue(fixedMin);
        result.hasFixedMax = hasValue(fixedMax);
        dataMin = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(dataMin, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
        dataMax = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(dataMax, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
        // Calculate the range using the min, max, dataRange
        if (result.hasFixedMin && result.hasFixedMax) {
            result.min = fixedMin;
            result.max = fixedMax;
        }
        else if (result.hasFixedMin) {
            result.min = fixedMin;
            result.max = dataMax > fixedMin ? dataMax : fixedMin;
        }
        else if (result.hasFixedMax) {
            result.min = dataMin < fixedMax ? dataMin : fixedMax;
            result.max = fixedMax;
        }
        else if (result.hasDataRange) {
            result.min = dataMin;
            result.max = dataMax;
        }
        else {
            result.min = 0;
            result.max = 0;
        }
        result._ensureIncludeZero();
        result._ensureNotEmpty();
        result._ensureDirection();
        if (result.min === 0) {
            result.hasFixedMin = true; // If the range starts from zero we should prevent extending the intervals into the negative range
        }
        else if (result.max === 0) {
            result.hasFixedMax = true; // If the range ends at zero we should prevent extending the intervals into the positive range
        }
        return result;
    }
    static calculateDataRange(dataMin, dataMax, includeZero) {
        if (!hasValue(dataMin) || !hasValue(dataMax)) {
            return NumericSequenceRange.calculateFixedRange(0, NumericSequenceRange.DEFAULT_MAX);
        }
        else {
            return NumericSequenceRange.calculate(dataMin, dataMax, null, null, includeZero);
        }
    }
    static calculateFixedRange(fixedMin, fixedMax, includeZero) {
        const result = new NumericSequenceRange();
        result.hasDataRange = false;
        result.includeZero = includeZero;
        result.min = fixedMin;
        result.max = fixedMax;
        result._ensureIncludeZero();
        result._ensureNotEmpty();
        result._ensureDirection();
        result.hasFixedMin = true;
        result.hasFixedMax = true;
        return result;
    }
}
NumericSequenceRange.DEFAULT_MAX = 10;
NumericSequenceRange.MIN_SUPPORTED_DOUBLE = -1E307;
NumericSequenceRange.MAX_SUPPORTED_DOUBLE = 1E307;
/** Note: Exported for testability */
function hasValue(value) {
    return value !== undefined && value !== null;
}
//# sourceMappingURL=numericSequenceRange.js.map

/***/ }),

/***/ 167:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ephemeralStorageService = exports.EphemeralStorageService = void 0;
var EphemeralStorageService = /** @class */ (function () {
    function EphemeralStorageService(clearCacheInterval) {
        this.cache = {};
        this.clearCacheInterval = (clearCacheInterval != null)
            ? clearCacheInterval
            : EphemeralStorageService.defaultClearCacheInterval;
        this.clearCache();
    }
    EphemeralStorageService.prototype.getData = function (key) {
        return this.cache[key];
    };
    EphemeralStorageService.prototype.setData = function (key, data) {
        var _this = this;
        this.cache[key] = data;
        if (this.clearCacheTimerId == null) {
            this.clearCacheTimerId = setTimeout(function () { return _this.clearCache(); }, this.clearCacheInterval);
        }
    };
    EphemeralStorageService.prototype.clearCache = function () {
        this.cache = {};
        this.clearCacheTimerId = undefined;
    };
    EphemeralStorageService.defaultClearCacheInterval = (1000 * 60 * 60 * 24); // 1 day
    return EphemeralStorageService;
}());
exports.EphemeralStorageService = EphemeralStorageService;
exports.ephemeralStorageService = new EphemeralStorageService();
//# sourceMappingURL=ephemeralStorageService.js.map

/***/ }),

/***/ 372:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumericSequence: () => (/* binding */ NumericSequence)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5442);
/* harmony import */ var _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


class NumericSequence {
    // eslint-disable-next-line max-lines-per-function
    static calculate(range, expectedCount, maxAllowedMargin, minPower, useZeroRefPoint, steps) {
        const result = new NumericSequence();
        if (expectedCount === undefined)
            expectedCount = 10;
        else
            expectedCount = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(expectedCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
        if (minPower === undefined)
            minPower = _double__WEBPACK_IMPORTED_MODULE_0__.MIN_EXP;
        if (useZeroRefPoint === undefined)
            useZeroRefPoint = false;
        if (maxAllowedMargin === undefined)
            maxAllowedMargin = 1;
        if (steps === undefined)
            steps = [1, 2, 5];
        // Handle single stop case
        if (range.forcedSingleStop) {
            result.interval = range.getSize();
            result.intervalOffset = result.interval - (range.forcedSingleStop - range.min);
            result.min = range.min;
            result.max = range.max;
            result.sequence = [range.forcedSingleStop];
            return result;
        }
        let interval = 0;
        let min = 0;
        let max = 9;
        const canExtendMin = maxAllowedMargin > 0 && !range.hasFixedMin;
        const canExtendMax = maxAllowedMargin > 0 && !range.hasFixedMax;
        const size = range.getSize();
        let exp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(size);
        // Account for Exp of steps
        const stepExp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(steps[0]);
        exp = exp - stepExp;
        // Account for MaxCount
        const expectedCountExp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(expectedCount);
        exp = exp - expectedCountExp;
        // Account for MinPower
        exp = Math.max(exp, minPower - stepExp + 1);
        let count = undefined;
        // Create array of "good looking" numbers
        if (interval !== 0) {
            // If explicit interval is defined - use it instead of the steps array.
            const power = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(exp);
            const roundMin = _double__WEBPACK_IMPORTED_MODULE_0__.floorToPrecision(range.min, power);
            const roundMax = _double__WEBPACK_IMPORTED_MODULE_0__.ceilToPrecision(range.max, power);
            const roundRange = _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__.NumericSequenceRange.calculateFixedRange(roundMin, roundMax);
            roundRange.shrinkByStep(range, interval);
            min = roundRange.min;
            max = roundRange.max;
            count = Math.floor(roundRange.getSize() / interval);
        }
        else {
            // No interval defined -> find optimal interval
            let dexp;
            for (dexp = 0; dexp < 3; dexp++) {
                const e = exp + dexp;
                const power = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(e);
                const roundMin = _double__WEBPACK_IMPORTED_MODULE_0__.floorToPrecision(range.min, power);
                const roundMax = _double__WEBPACK_IMPORTED_MODULE_0__.ceilToPrecision(range.max, power);
                // Go throught the steps array looking for the smallest step that produces the right interval count.
                const stepsCount = steps.length;
                const stepPower = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(e - 1);
                for (let i = 0; i < stepsCount; i++) {
                    const step = steps[i] * stepPower;
                    const roundRange = _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__.NumericSequenceRange.calculateFixedRange(roundMin, roundMax, useZeroRefPoint);
                    roundRange.shrinkByStep(range, step);
                    // If the range is based on Data we might need to extend it to provide nice data margins.
                    if (canExtendMin && range.min === roundRange.min && maxAllowedMargin >= 1)
                        roundRange.min -= step;
                    if (canExtendMax && range.max === roundRange.max && maxAllowedMargin >= 1)
                        roundRange.max += step;
                    // Count the intervals
                    count = _double__WEBPACK_IMPORTED_MODULE_0__.ceilWithPrecision(roundRange.getSize() / step, _double__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PRECISION);
                    if (count <= expectedCount || (dexp === 2 && i === stepsCount - 1) || (expectedCount === 1 && count === 2 && (step > range.getSize() || (range.min < 0 && range.max > 0 && step * 2 >= range.getSize())))) {
                        interval = step;
                        min = roundRange.min;
                        max = roundRange.max;
                        break;
                    }
                }
                // Increase the scale power until the interval is found
                if (interval !== 0)
                    break;
            }
        }
        // Avoid extreme count cases (>1000 ticks)
        if (count > expectedCount * 32 || count > NumericSequence.MAX_COUNT) {
            count = Math.min(expectedCount * 32, NumericSequence.MAX_COUNT);
            interval = (max - min) / count;
        }
        result.min = min;
        result.max = max;
        result.interval = interval;
        result.intervalOffset = min - range.min;
        result.maxAllowedMargin = maxAllowedMargin;
        result.canExtendMin = canExtendMin;
        result.canExtendMax = canExtendMax;
        // Fill in the Sequence
        const precision = _double__WEBPACK_IMPORTED_MODULE_0__.getPrecision(interval, 0);
        result.precision = precision;
        const sequence = [];
        let x = _double__WEBPACK_IMPORTED_MODULE_0__.roundToPrecision(min, precision);
        sequence.push(x);
        for (let i = 0; i < count; i++) {
            x = _double__WEBPACK_IMPORTED_MODULE_0__.roundToPrecision(x + interval, precision);
            sequence.push(x);
        }
        result.sequence = sequence;
        result.trimMinMax(range.min, range.max);
        return result;
    }
    /**
     * Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
     * @min - The minimum of the range.
     * @max - The maximum of the range.
     * @maxCount - The max count of intervals.
     * @steps - array of intervals.
     */
    static calculateUnits(min, max, maxCount, steps) {
        // Initialization actions
        maxCount = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(maxCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
        if (min === max) {
            max = min + 1;
        }
        let stepCount = 0;
        let step = 0;
        // Calculate step
        for (let i = 0; i < steps.length; i++) {
            step = steps[i];
            const maxStepCount = _double__WEBPACK_IMPORTED_MODULE_0__.ceilWithPrecision(max / step);
            const minStepCount = _double__WEBPACK_IMPORTED_MODULE_0__.floorWithPrecision(min / step);
            stepCount = maxStepCount - minStepCount;
            if (stepCount <= maxCount) {
                break;
            }
        }
        // Calculate the offset
        let offset = -min;
        offset = offset % step;
        // Create sequence
        const result = new NumericSequence();
        result.sequence = [];
        for (let x = min + offset;; x += step) {
            result.sequence.push(x);
            if (x >= max)
                break;
        }
        result.interval = step;
        result.intervalOffset = offset;
        result.min = result.sequence[0];
        result.max = result.sequence[result.sequence.length - 1];
        return result;
    }
    trimMinMax(min, max) {
        const minMargin = (min - this.min) / this.interval;
        const maxMargin = (this.max - max) / this.interval;
        const marginPrecision = 0.001;
        if (!this.canExtendMin || (minMargin > this.maxAllowedMargin && minMargin > marginPrecision)) {
            this.min = min;
        }
        if (!this.canExtendMax || (maxMargin > this.maxAllowedMargin && maxMargin > marginPrecision)) {
            this.max = max;
        }
    }
}
NumericSequence.MIN_COUNT = 1;
NumericSequence.MAX_COUNT = 1000;
//# sourceMappingURL=numericSequence.js.map

/***/ }),

/***/ 421:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inherit: () => (/* binding */ inherit),
/* harmony export */   inheritSingle: () => (/* binding */ inheritSingle),
/* harmony export */   overrideArray: () => (/* binding */ overrideArray)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 * Returns a new object with the provided obj as its prototype.
 */
function inherit(obj, extension) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function wrapCtor() { }
    wrapCtor.prototype = obj;
    const inherited = new wrapCtor();
    if (extension)
        extension(inherited);
    return inherited;
}
/**
 * Returns a new object with the provided obj as its prototype
 * if, and only if, the prototype has not been previously set
 */
function inheritSingle(obj) {
    const proto = Object.getPrototypeOf(obj);
    if (proto === Object.prototype || proto === Array.prototype)
        obj = inherit(obj);
    return obj;
}
/**
 * Uses the provided callback function to selectively replace contents in the provided array.
 * @return A new array with those values overriden
 * or undefined if no overrides are necessary.
 */
function overrideArray(prototype, override) {
    if (!prototype)
        return;
    let overwritten;
    for (let i = 0, len = prototype.length; i < len; i++) {
        const value = override(prototype[i]);
        if (value) {
            if (!overwritten)
                overwritten = inherit(prototype);
            overwritten[i] = value;
        }
    }
    return overwritten;
}
//# sourceMappingURL=prototype.js.map

/***/ }),

/***/ 539:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   endsWith: () => (/* binding */ endsWith)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 * Extensions to String class.
 */
/**
 * Checks if a string ends with a sub-string.
 */
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
//# sourceMappingURL=stringExtensions.js.map

/***/ }),

/***/ 604:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceSpaceWithNBSP = exports.removeEllipses = exports.removeBreakingSpaces = void 0;
/**
 * Contains functions/constants to aid in text manupilation.
 */
/**
 * Remove breaking spaces from given string and replace by none breaking space (&nbsp).
 */
function removeBreakingSpaces(str) {
    return str.toString().replace(new RegExp(" ", "g"), "&nbsp");
}
exports.removeBreakingSpaces = removeBreakingSpaces;
/**
 * Remove ellipses from a given string
 */
function removeEllipses(str) {
    return str.replace(/(…)|(\.\.\.)/g, "");
}
exports.removeEllipses = removeEllipses;
/**
* Replace every whitespace (0x20) with Non-Breaking Space (0xA0)
    * @param {string} txt String to replace White spaces
    * @returns Text after replcing white spaces
    */
function replaceSpaceWithNBSP(txt) {
    if (txt != null) {
        return txt.replace(/ /g, "\xA0");
    }
}
exports.replaceSpaceWithNBSP = replaceSpaceWithNBSP;
//# sourceMappingURL=textUtil.js.map

/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDataViewWildcardSelector: () => (/* binding */ createDataViewWildcardSelector)
/* harmony export */ });
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
function createDataViewWildcardSelector(dataViewWildcardMatchingOption) {
    if (dataViewWildcardMatchingOption == null) {
        dataViewWildcardMatchingOption = 0 /* DataViewWildcardMatchingOption.InstancesAndTotals */;
    }
    const selector = {
        data: [
            {
                dataViewWildcard: {
                    matchingOption: dataViewWildcardMatchingOption
                }
            }
        ]
    };
    return selector;
}
//# sourceMappingURL=dataViewWildcard.js.map

/***/ }),

/***/ 980:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Globalize Cultures
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */
var powerbiGlobalizeLocales_1 = __webpack_require__(2880);
function injectCultures(Globalize) {
    Object.keys(powerbiGlobalizeLocales_1.locales).forEach(function (locale) { return Globalize.addCultureInfo.apply(Globalize, powerbiGlobalizeLocales_1.locales[locale]); });
}
exports["default"] = injectCultures;
//# sourceMappingURL=globalize.cultures.js.map

/***/ }),

/***/ 1107:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 1248:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stripTagDelimiters = exports.deriveClsCompliantName = exports.stringifyAsPrettyJSON = exports.normalizeFileName = exports.escapeStringForRegex = exports.constructNameFromList = exports.findUniqueName = exports.ensureUniqueNames = exports.replaceAll = exports.repeat = exports.getLengthDifference = exports.trimWhitespace = exports.trimTrailingWhitespace = exports.isWhitespace = exports.containsWhitespace = exports.isNullOrUndefinedOrWhiteSpaceString = exports.isNullOrEmpty = exports.stringToArrayBuffer = exports.normalizeCase = exports.containsIgnoreCase = exports.contains = exports.startsWith = exports.startsWithIgnoreCase = exports.equalIgnoreCase = exports.format = exports.endsWith = void 0;
/* eslint-disable no-useless-escape */
var HtmlTagRegex = new RegExp("[<>]", "g");
/**
 * Checks if a string ends with a sub-string.
 */
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
exports.endsWith = endsWith;
function format() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var s = args[0];
    if (isNullOrUndefinedOrWhiteSpaceString(s))
        return s;
    for (var i = 0; i < args.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, args[i + 1]);
    }
    return s;
}
exports.format = format;
/**
 * Compares two strings for equality, ignoring case.
 */
function equalIgnoreCase(a, b) {
    return normalizeCase(a) === normalizeCase(b);
}
exports.equalIgnoreCase = equalIgnoreCase;
function startsWithIgnoreCase(a, b) {
    var normalizedSearchString = normalizeCase(b);
    return normalizeCase(a).indexOf(normalizedSearchString) === 0;
}
exports.startsWithIgnoreCase = startsWithIgnoreCase;
function startsWith(a, b) {
    return a.indexOf(b) === 0;
}
exports.startsWith = startsWith;
// Determines whether a string contains a specified substring (by case-sensitive comparison).
function contains(source, substring) {
    if (source == null)
        return false;
    return source.indexOf(substring) !== -1;
}
exports.contains = contains;
// Determines whether a string contains a specified substring (while ignoring case).
function containsIgnoreCase(source, substring) {
    if (source == null)
        return false;
    return contains(normalizeCase(source), normalizeCase(substring));
}
exports.containsIgnoreCase = containsIgnoreCase;
/**
 * Normalizes case for a string.
 * Used by equalIgnoreCase method.
 */
function normalizeCase(value) {
    return value.toUpperCase();
}
exports.normalizeCase = normalizeCase;
/**
 * Receives a string and returns an ArrayBuffer of its characters.
 * @return An ArrayBuffer of the string's characters.
 * If the string is empty or null or undefined - returns null.
 */
function stringToArrayBuffer(str) {
    if (isNullOrEmpty(str)) {
        return null;
    }
    var buffer = new ArrayBuffer(str.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufferView[i] = str.charCodeAt(i);
    }
    return bufferView;
}
exports.stringToArrayBuffer = stringToArrayBuffer;
/**
 * Is string null or empty or undefined?
 * @return True if the value is null or undefined or empty string,
 * otherwise false.
 */
function isNullOrEmpty(value) {
    return (value == null) || (value.length === 0);
}
exports.isNullOrEmpty = isNullOrEmpty;
/**
 * Returns true if the string is null, undefined, empty, or only includes white spaces.
 * @return True if the str is null, undefined, empty, or only includes white spaces,
 * otherwise false.
 */
function isNullOrUndefinedOrWhiteSpaceString(str) {
    return isNullOrEmpty(str) || isNullOrEmpty(str.trim());
}
exports.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString;
/**
 * Returns a value indicating whether the str contains any whitespace.
 */
function containsWhitespace(str) {
    var expr = /\s/;
    return expr.test(str);
}
exports.containsWhitespace = containsWhitespace;
/**
 * Returns a value indicating whether the str is a whitespace string.
 */
function isWhitespace(str) {
    return str.trim() === "";
}
exports.isWhitespace = isWhitespace;
/**
 * Returns the string with any trailing whitespace from str removed.
 */
function trimTrailingWhitespace(str) {
    return str.replace(/\s+$/, "");
}
exports.trimTrailingWhitespace = trimTrailingWhitespace;
/**
 * Returns the string with any leading and trailing whitespace from str removed.
 */
function trimWhitespace(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}
exports.trimWhitespace = trimWhitespace;
/**
 * Returns length difference between the two provided strings.
 */
function getLengthDifference(left, right) {
    return Math.abs(left.length - right.length);
}
exports.getLengthDifference = getLengthDifference;
/**
 * Repeat char or string several times.
 * @param char The string to repeat.
 * @param count How many times to repeat the string.
 */
function repeat(char, count) {
    var result = "";
    for (var i = 0; i < count; i++) {
        result += char;
    }
    return result;
}
exports.repeat = repeat;
/**
 * Replace all the occurrences of the textToFind in the text with the textToReplace.
 * @param text The original string.
 * @param textToFind Text to find in the original string.
 * @param textToReplace New text replacing the textToFind.
 */
function replaceAll(text, textToFind, textToReplace) {
    if (!textToFind)
        return text;
    var pattern = escapeStringForRegex(textToFind);
    return text.replace(new RegExp(pattern, "gi"), textToReplace);
}
exports.replaceAll = replaceAll;
function ensureUniqueNames(names) {
    var usedNames = {};
    // Make sure we are giving fair chance for all columns to stay with their original name
    // First we fill the used names map to contain all the original unique names from the list.
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        usedNames[name_1] = false;
    }
    var uniqueNames = [];
    // Now we go over all names and find a unique name for each
    for (var _a = 0, names_2 = names; _a < names_2.length; _a++) {
        var name_2 = names_2[_a];
        var uniqueName = name_2;
        // If the (original) column name is already taken lets try to find another name
        if (usedNames[uniqueName]) {
            var counter = 0;
            // Find a name that is not already in the map
            while (usedNames[uniqueName] !== undefined) {
                uniqueName = name_2 + "." + (++counter);
            }
        }
        uniqueNames.push(uniqueName);
        usedNames[uniqueName] = true;
    }
    return uniqueNames;
}
exports.ensureUniqueNames = ensureUniqueNames;
/**
 * Returns a name that is not specified in the values.
 */
function findUniqueName(usedNames, baseName) {
    // Find a unique name
    var i = 0, uniqueName = baseName;
    while (usedNames[uniqueName]) {
        uniqueName = baseName + (++i);
    }
    return uniqueName;
}
exports.findUniqueName = findUniqueName;
function constructNameFromList(list, separator, maxCharacter) {
    var labels = [];
    var exceeded;
    var length = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var item = list_1[_i];
        if (length + item.length > maxCharacter && labels.length > 0) {
            exceeded = true;
            break;
        }
        labels.push(item);
        length += item.length;
    }
    var separatorWithSpace = " " + separator + " ";
    var name = labels.join(separatorWithSpace);
    if (exceeded)
        name += separatorWithSpace + "...";
    return name;
}
exports.constructNameFromList = constructNameFromList;
function escapeStringForRegex(s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
}
exports.escapeStringForRegex = escapeStringForRegex;
/**
 * Remove file name reserved characters <>:"/\|?* from input string.
 */
function normalizeFileName(fileName) {
    return fileName.replace(/[\<\>\:"\/\\\|\?*]/g, "");
}
exports.normalizeFileName = normalizeFileName;
/**
 * Similar to JSON.stringify, but strips away escape sequences so that the resulting
 * string is human-readable (and parsable by JSON formatting/validating tools).
 */
function stringifyAsPrettyJSON(object) {
    // let specialCharacterRemover = (key: string, value: string) => value.replace(/[^\w\s]/gi, "");
    return JSON.stringify(object /*, specialCharacterRemover*/);
}
exports.stringifyAsPrettyJSON = stringifyAsPrettyJSON;
/**
 * Derive a CLS-compliant name from a specified string.  If no allowed characters are present, return a fallback string instead.
 * (6708134): this should have a fully Unicode-aware implementation
 */
function deriveClsCompliantName(input, fallback) {
    var result = input.replace(/^[^A-Za-z]*/g, "").replace(/[ :\.\/\\\-\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, "_").replace(/[\W]/g, "");
    return result.length > 0 ? result : fallback;
}
exports.deriveClsCompliantName = deriveClsCompliantName;
// Performs cheap sanitization by stripping away HTML tag (<>) characters.
function stripTagDelimiters(s) {
    return s.replace(HtmlTagRegex, "");
}
exports.stripTagDelimiters = stripTagDelimiters;
//# sourceMappingURL=stringExtensions.js.map

/***/ }),

/***/ 1480:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ VisualFormattingSettingsModel)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7674);
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
    columnWidth = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .formattingSettings.NumUpDown */ .z.iB({
        name: "columnWidth",
        displayName: "Column Width",
        value: 0
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
        this.columnWidth,
        this.fontSize,
        this.rowHeaderWidth
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

/***/ 1520:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisplayUnitSystemType = void 0;
// The system used to determine display units used during formatting
var DisplayUnitSystemType;
(function (DisplayUnitSystemType) {
    // Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes.
    DisplayUnitSystemType[DisplayUnitSystemType["Default"] = 0] = "Default";
    // A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards.
    DisplayUnitSystemType[DisplayUnitSystemType["Verbose"] = 1] = "Verbose";
    /**
     * A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
     * Suitable for dashboard tile cards
     */
    DisplayUnitSystemType[DisplayUnitSystemType["WholeUnits"] = 2] = "WholeUnits";
    // A display unit system that also contains Auto and None units for data labels
    DisplayUnitSystemType[DisplayUnitSystemType["DataLabels"] = 3] = "DataLabels";
})(DisplayUnitSystemType = exports.DisplayUnitSystemType || (exports.DisplayUnitSystemType = {}));
//# sourceMappingURL=displayUnitSystemType.js.map

/***/ }),

/***/ 1847:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.G2 = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var formatting = __webpack_require__(4932);
__webpack_unused_export__ = formatting;
var valueFormatter = __webpack_require__(5062);
exports.G2 = valueFormatter;
var stringExtensions = __webpack_require__(1248);
__webpack_unused_export__ = stringExtensions;
var textMeasurementService = __webpack_require__(2391);
__webpack_unused_export__ = textMeasurementService;
var interfaces = __webpack_require__(1107);
__webpack_unused_export__ = interfaces;
var font = __webpack_require__(3801);
__webpack_unused_export__ = font;
var familyInfo = __webpack_require__(6721);
__webpack_unused_export__ = familyInfo;
var textUtil = __webpack_require__(604);
__webpack_unused_export__ = textUtil;
var dateUtils = __webpack_require__(7925);
__webpack_unused_export__ = dateUtils;
var dateTimeSequence = __webpack_require__(7630);
__webpack_unused_export__ = dateTimeSequence;
var displayUnitSystem = __webpack_require__(3224);
__webpack_unused_export__ = displayUnitSystem;
var displayUnitSystemType = __webpack_require__(1520);
__webpack_unused_export__ = displayUnitSystemType;
var formattingService = __webpack_require__(3100);
__webpack_unused_export__ = formattingService;
var wordBreaker = __webpack_require__(5807);
__webpack_unused_export__ = wordBreaker;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2087:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayExtensions: () => (/* reexport module object */ _extensions_arrayExtensions__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   double: () => (/* reexport module object */ _double__WEBPACK_IMPORTED_MODULE_7__),
/* harmony export */   enumExtensions: () => (/* reexport module object */ _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   jsonComparer: () => (/* reexport module object */ _jsonComparer__WEBPACK_IMPORTED_MODULE_8__),
/* harmony export */   logicExtensions: () => (/* reexport module object */ _extensions_logicExtensions__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   numericSequence: () => (/* reexport module object */ _numericSequence_numericSequence__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   numericSequenceRange: () => (/* reexport module object */ _numericSequence_numericSequenceRange__WEBPACK_IMPORTED_MODULE_6__),
/* harmony export */   pixelConverter: () => (/* reexport module object */ _pixelConverter__WEBPACK_IMPORTED_MODULE_9__),
/* harmony export */   prototype: () => (/* reexport module object */ _prototype__WEBPACK_IMPORTED_MODULE_10__),
/* harmony export */   regExpExtensions: () => (/* reexport module object */ _extensions_regExpExtensions__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   stringExtensions: () => (/* reexport module object */ _extensions_stringExtensions__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   textSizeDefaults: () => (/* reexport module object */ _textSizeDefaults__WEBPACK_IMPORTED_MODULE_11__),
/* harmony export */   valueType: () => (/* reexport module object */ _valueType__WEBPACK_IMPORTED_MODULE_12__)
/* harmony export */ });
/* harmony import */ var _extensions_arrayExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4341);
/* harmony import */ var _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2879);
/* harmony import */ var _extensions_logicExtensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4298);
/* harmony import */ var _extensions_regExpExtensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3051);
/* harmony import */ var _extensions_stringExtensions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(539);
/* harmony import */ var _numericSequence_numericSequence__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(372);
/* harmony import */ var _numericSequence_numericSequenceRange__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(67);
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5442);
/* harmony import */ var _jsonComparer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5038);
/* harmony import */ var _pixelConverter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5079);
/* harmony import */ var _prototype__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(421);
/* harmony import */ var _textSizeDefaults__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(5939);
/* harmony import */ var _valueType__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(4182);














//# sourceMappingURL=index.js.map

/***/ }),

/***/ 2391:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wordBreakOverflowingText = exports.wordBreak = exports.svgEllipsis = exports.getTailoredTextOrDefault = exports.getDivElementWidth = exports.getSvgMeasurementProperties = exports.getMeasurementProperties = exports.measureSvgTextElementWidth = exports.estimateSvgTextHeight = exports.estimateSvgTextBaselineDelta = exports.measureSvgTextHeight = exports.measureSvgTextRect = exports.measureSvgTextWidth = exports.removeSpanElement = void 0;
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2087);
// powerbi.extensibility.utils.formatting
var wordBreaker = __webpack_require__(5807);
var ephemeralStorageService_1 = __webpack_require__(167);
var ellipsis = "...";
var spanElement;
var svgTextElement;
var canvasCtx;
var fallbackFontFamily;
/**
 * Idempotent function for adding the elements to the DOM.
 */
function ensureDOM() {
    if (spanElement) {
        return;
    }
    spanElement = document.createElement("span");
    document.body.appendChild(spanElement);
    // The style hides the svg element from the canvas, preventing canvas from scrolling down to show svg black square.
    /* eslint-disable-next-line powerbi-visuals/no-http-string */
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("height", "0");
    svgElement.setAttribute("width", "0");
    svgElement.setAttribute("position", "absolute");
    svgElement.style.top = "0px";
    svgElement.style.left = "0px";
    svgElement.style.position = "absolute";
    svgElement.style.height = "0px";
    svgElement.style.width = "0px";
    /* eslint-disable-next-line powerbi-visuals/no-http-string */
    svgTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgElement.appendChild(svgTextElement);
    document.body.appendChild(svgElement);
    var canvasElement = document.createElement("canvas");
    canvasCtx = canvasElement.getContext("2d");
    var style = window.getComputedStyle(svgTextElement);
    if (style) {
        fallbackFontFamily = style.fontFamily;
    }
    else {
        fallbackFontFamily = "";
    }
}
/**
 * Removes spanElement from DOM.
 */
function removeSpanElement() {
    if (spanElement && spanElement.remove) {
        spanElement.remove();
    }
    spanElement = null;
}
exports.removeSpanElement = removeSpanElement;
/**
 * Measures the width of the text with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextWidth(textProperties, text) {
    ensureDOM();
    canvasCtx.font =
        (textProperties.fontStyle || "") + " " +
            (textProperties.fontVariant || "") + " " +
            (textProperties.fontWeight || "") + " " +
            textProperties.fontSize + " " +
            (textProperties.fontFamily || fallbackFontFamily);
    return canvasCtx.measureText(text || textProperties.text).width;
}
exports.measureSvgTextWidth = measureSvgTextWidth;
/**
 * Return the rect with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextRect(textProperties, text) {
    ensureDOM();
    // Removes DOM elements faster than innerHTML
    while (svgTextElement.firstChild) {
        svgTextElement.removeChild(svgTextElement.firstChild);
    }
    svgTextElement.setAttribute("style", null);
    svgTextElement.style.visibility = "hidden";
    svgTextElement.style.fontFamily = textProperties.fontFamily || fallbackFontFamily;
    svgTextElement.style.fontVariant = textProperties.fontVariant;
    svgTextElement.style.fontSize = textProperties.fontSize;
    svgTextElement.style.fontWeight = textProperties.fontWeight;
    svgTextElement.style.fontStyle = textProperties.fontStyle;
    svgTextElement.style.whiteSpace = textProperties.whiteSpace || "nowrap";
    svgTextElement.appendChild(document.createTextNode(text || textProperties.text));
    // We're expecting the browser to give a synchronous measurement here
    // We're using SVGTextElement because it works across all browsers
    return svgTextElement.getBBox();
}
exports.measureSvgTextRect = measureSvgTextRect;
/**
 * Measures the height of the text with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextHeight(textProperties, text) {
    return measureSvgTextRect(textProperties, text).height;
}
exports.measureSvgTextHeight = measureSvgTextHeight;
/**
 * Returns the text Rect with the given SVG text properties.
 * Does NOT return text width; obliterates text value
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextRect(textProperties) {
    var propertiesKey = textProperties.fontFamily + textProperties.fontSize;
    var rect = ephemeralStorageService_1.ephemeralStorageService.getData(propertiesKey);
    if (rect == null) {
        // To estimate we check the height of a particular character, once it is cached, subsequent
        // calls should always get the height from the cache (regardless of the text).
        var estimatedTextProperties = {
            fontFamily: textProperties.fontFamily,
            fontSize: textProperties.fontSize,
            text: "M",
        };
        rect = exports.measureSvgTextRect(estimatedTextProperties);
        // NOTE: In some cases (disconnected/hidden DOM) we may provide incorrect measurement results (zero sized bounding-box), so
        // we only store values in the cache if we are confident they are correct.
        if (rect.height > 0)
            ephemeralStorageService_1.ephemeralStorageService.setData(propertiesKey, rect);
    }
    return rect;
}
/**
 * Returns the text Rect with the given SVG text properties.
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextBaselineDelta(textProperties) {
    var rect = estimateSvgTextRect(textProperties);
    return rect.y + rect.height;
}
exports.estimateSvgTextBaselineDelta = estimateSvgTextBaselineDelta;
/**
 * Estimates the height of the text with the given SVG text properties.
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextHeight(textProperties, tightFightForNumeric) {
    if (tightFightForNumeric === void 0) { tightFightForNumeric = false; }
    var height = estimateSvgTextRect(textProperties).height;
    // replace it with new baseline calculation
    if (tightFightForNumeric)
        height *= 0.7;
    return height;
}
exports.estimateSvgTextHeight = estimateSvgTextHeight;
/**
 * Measures the width of the svgElement.
 * @param svgElement The SVGTextElement to be measured.
 */
function measureSvgTextElementWidth(svgElement) {
    return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
}
exports.measureSvgTextElementWidth = measureSvgTextElementWidth;
/**
 * Fetches the text measurement properties of the given DOM element.
 * @param element The selector for the DOM Element.
 */
function getMeasurementProperties(element) {
    var style = window.getComputedStyle(element);
    return {
        text: element.value || element.textContent,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        fontVariant: style.fontVariant,
        whiteSpace: style.whiteSpace
    };
}
exports.getMeasurementProperties = getMeasurementProperties;
/**
 * Fetches the text measurement properties of the given SVG text element.
 * @param element The SVGTextElement to be measured.
 */
function getSvgMeasurementProperties(element) {
    var style = window.getComputedStyle(element);
    if (style) {
        return {
            text: element.textContent,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            fontVariant: style.fontVariant,
            whiteSpace: style.whiteSpace
        };
    }
    else {
        return {
            text: element.textContent,
            fontFamily: "",
            fontSize: "0",
        };
    }
}
exports.getSvgMeasurementProperties = getSvgMeasurementProperties;
/**
 * Returns the width of a div element.
 * @param element The div element.
 */
function getDivElementWidth(element) {
    var style = window.getComputedStyle(element);
    if (style)
        return style.width;
    else
        return "0";
}
exports.getDivElementWidth = getDivElementWidth;
/**
 * Compares labels text size to the available size and renders ellipses when the available size is smaller.
 * @param textProperties The text properties (including text content) to use for text measurement.
 * @param maxWidth The maximum width available for rendering the text.
 */
function getTailoredTextOrDefault(textProperties, maxWidth) {
    ensureDOM();
    var strLength = textProperties.text.length;
    if (strLength === 0) {
        return textProperties.text;
    }
    var width = measureSvgTextWidth(textProperties);
    if (width < maxWidth) {
        return textProperties.text;
    }
    var ellipsesWidth = measureSvgTextWidth(textProperties, ellipsis);
    if (ellipsesWidth >= width) {
        return textProperties.text;
    }
    // Create a copy of the textProperties so we don't modify the one that's passed in.
    var copiedTextProperties = powerbi_visuals_utils_typeutils_1.prototype.inherit(textProperties);
    // Take the properties and apply them to svgTextElement
    // Then, do the binary search to figure out the substring we want
    // Set the substring on textElement argument
    var text = copiedTextProperties.text = ellipsis + copiedTextProperties.text;
    var min = 1;
    var max = text.length;
    var i = ellipsis.length;
    while (min <= max) {
        // num | 0 preferred to Math.floor(num) for performance benefits
        i = (min + max) / 2 | 0;
        copiedTextProperties.text = text.substring(0, i);
        width = measureSvgTextWidth(copiedTextProperties);
        if (maxWidth > width) {
            min = i + 1;
        }
        else if (maxWidth < width) {
            max = i - 1;
        }
        else {
            break;
        }
    }
    // Since the search algorithm almost never finds an exact match,
    // it will pick one of the closest two, which could result in a
    // value bigger with than 'maxWidth' thus we need to go back by
    // one to guarantee a smaller width than 'maxWidth'.
    copiedTextProperties.text = text.substring(0, i);
    width = measureSvgTextWidth(copiedTextProperties);
    if (width > maxWidth) {
        i--;
    }
    return textProperties.text.substring(0, i - ellipsis.length) + ellipsis;
}
exports.getTailoredTextOrDefault = getTailoredTextOrDefault;
/**
 * Compares labels text size to the available size and renders ellipses when the available size is smaller.
 * @param textElement The SVGTextElement containing the text to render.
 * @param maxWidth The maximum width available for rendering the text.
 */
function svgEllipsis(textElement, maxWidth) {
    var properties = getSvgMeasurementProperties(textElement);
    var originalText = properties.text;
    var tailoredText = getTailoredTextOrDefault(properties, maxWidth);
    if (originalText !== tailoredText) {
        textElement.textContent = tailoredText;
    }
}
exports.svgEllipsis = svgEllipsis;
/**
 * Word break textContent of <text> SVG element into <tspan>s
 * Each tspan will be the height of a single line of text
 * @param textElement - the SVGTextElement containing the text to wrap
 * @param maxWidth - the maximum width available
 * @param maxHeight - the maximum height available (defaults to single line)
 * @param linePadding - (optional) padding to add to line height
 */
function wordBreak(textElement, maxWidth, maxHeight, linePadding) {
    if (linePadding === void 0) { linePadding = 0; }
    var properties = getSvgMeasurementProperties(textElement);
    var height = estimateSvgTextHeight(properties) + linePadding;
    var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
    // Save y of parent textElement to apply as first tspan dy
    var firstDY = textElement ? textElement.getAttribute("y") : null;
    // Store and clear text content
    var labelText = textElement ? textElement.textContent : null;
    textElement.textContent = null;
    // Append a tspan for each word broken section
    var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
    var fragment = document.createDocumentFragment();
    for (var i = 0, ilen = words.length; i < ilen; i++) {
        var dy = i === 0 ? firstDY : height;
        properties.text = words[i];
        /* eslint-disable-next-line powerbi-visuals/no-http-string */
        var textElement_1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        textElement_1.setAttribute("x", "0");
        textElement_1.setAttribute("dy", dy ? dy.toString() : null);
        textElement_1.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
        fragment.appendChild(textElement_1);
    }
    textElement.appendChild(fragment);
}
exports.wordBreak = wordBreak;
/**
 * Word break textContent of span element into <span>s
 * Each span will be the height of a single line of text
 * @param textElement - the element containing the text to wrap
 * @param maxWidth - the maximum width available
 * @param maxHeight - the maximum height available (defaults to single line)
 * @param linePadding - (optional) padding to add to line height
 */
function wordBreakOverflowingText(textElement, maxWidth, maxHeight, linePadding) {
    if (linePadding === void 0) { linePadding = 0; }
    var properties = getSvgMeasurementProperties(textElement);
    var height = estimateSvgTextHeight(properties) + linePadding;
    var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
    // Store and clear text content
    var labelText = textElement.textContent;
    textElement.textContent = null;
    // Append a span for each word broken section
    var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < words.length; i++) {
        var span = document.createElement("span");
        span.style.overflow = "hidden";
        span.style.whiteSpace = "nowrap";
        span.style.textOverflow = "ellipsis";
        span.style.display = "block";
        span.style.width = powerbi_visuals_utils_typeutils_1.pixelConverter.toString(maxWidth);
        span.appendChild(document.createTextNode(words[i]));
        span.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
        fragment.appendChild(span);
    }
    textElement.appendChild(fragment);
}
exports.wordBreakOverflowingText = wordBreakOverflowingText;
//# sourceMappingURL=textMeasurementService.js.map

/***/ }),

/***/ 2879:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBitCount: () => (/* binding */ getBitCount),
/* harmony export */   hasFlag: () => (/* binding */ hasFlag),
/* harmony export */   resetFlag: () => (/* binding */ resetFlag),
/* harmony export */   setFlag: () => (/* binding */ setFlag),
/* harmony export */   toString: () => (/* binding */ toString)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5442);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.

/**
 * Extensions for Enumerations.
 */
/**
 * Gets a value indicating whether the value has the bit flags set.
 */
function hasFlag(value, flag) {
    return (value & flag) === flag;
}
/**
 * Sets a value of a flag without modifying any other flags.
 */
function setFlag(value, flag) {
    return value |= flag;
}
/**
 * Resets a value of a flag without modifying any other flags.
 */
function resetFlag(value, flag) {
    return value &= ~flag;
}
/**
 * According to the TypeScript Handbook, this is safe to do.
 */
function toString(enumType, value) {
    return enumType[value];
}
/**
 * Returns the number of 1's in the specified value that is a set of binary bit flags.
 */
function getBitCount(value) {
    if (!(0,_double__WEBPACK_IMPORTED_MODULE_0__.isInteger)(value))
        return 0;
    let bitCount = 0;
    let shiftingValue = value;
    while (shiftingValue !== 0) {
        if ((shiftingValue & 1) === 1) {
            bitCount++;
        }
        shiftingValue = shiftingValue >>> 1;
    }
    return bitCount;
}
//# sourceMappingURL=enumExtensions.js.map

/***/ }),

/***/ 2880:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.locales = void 0;
exports.locales = {"en-US":["en-US","default",{"englishName":"English (United States)"}]}

/***/ }),

/***/ 3051:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   run: () => (/* binding */ run)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Runs exec on regex starting from 0 index
 * This is the expected behavior but RegExp actually remember
 * the last index they stopped at (found match at) and will
 * return unexpected results when run in sequence.
 * @param regex - regular expression object
 * @param value - string to search wiht regex
 * @param start - index within value to start regex
 */
function run(regex, value, start) {
    regex.lastIndex = start || 0;
    return regex.exec(value);
}
//# sourceMappingURL=regExpExtensions.js.map

/***/ }),

/***/ 3100:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/* eslint-disable no-useless-escape */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formattingEncoder = exports.dateTimeFormat = exports.numberFormat = exports.formattingService = exports.FormattingService = void 0;
var globalize_1 = __webpack_require__(7717);
var globalize_cultures_1 = __webpack_require__(980);
(0, globalize_cultures_1.default)(globalize_1.Globalize);
var dateTimeFormat = __webpack_require__(6394);
exports.dateTimeFormat = dateTimeFormat;
var numberFormat = __webpack_require__(7534);
exports.numberFormat = numberFormat;
var formattingEncoder = __webpack_require__(6459);
exports.formattingEncoder = formattingEncoder;
var iFormattingService_1 = __webpack_require__(3351);
var IndexedTokensRegex = /({{)|(}})|{(\d+[^}]*)}/g;
// Formatting Service
var FormattingService = /** @class */ (function () {
    function FormattingService() {
    }
    FormattingService.prototype.formatValue = function (value, formatValue, cultureSelector) {
        // Handle special cases
        if (value === undefined || value === null) {
            return "";
        }
        var gculture = this.getCulture(cultureSelector);
        if (dateTimeFormat.canFormat(value)) {
            // Dates
            return dateTimeFormat.format(value, formatValue, gculture);
        }
        else if (numberFormat.canFormat(value)) {
            // Numbers
            return numberFormat.format(value, formatValue, gculture);
        }
        // Other data types - return as string
        return value.toString();
    };
    FormattingService.prototype.format = function (formatWithIndexedTokens, args, culture) {
        var _this = this;
        if (!formatWithIndexedTokens) {
            return "";
        }
        return formatWithIndexedTokens.replace(IndexedTokensRegex, function (match, left, right, argToken) {
            if (left) {
                return "{";
            }
            else if (right) {
                return "}";
            }
            else {
                var parts = argToken.split(":");
                var argIndex = parseInt(parts[0], 10);
                var argFormat = parts[1];
                return _this.formatValue(args[argIndex], argFormat, culture);
            }
        });
    };
    FormattingService.prototype.isStandardNumberFormat = function (format) {
        return numberFormat.isStandardFormat(format);
    };
    FormattingService.prototype.formatNumberWithCustomOverride = function (value, format, nonScientificOverrideFormat, culture) {
        var gculture = this.getCulture(culture);
        return numberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
    };
    FormattingService.prototype.dateFormatString = function (unit) {
        if (!this._dateTimeScaleFormatInfo)
            this.initialize();
        return this._dateTimeScaleFormatInfo.getFormatString(unit);
    };
    /**
     * Sets the current localization culture
     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
     */
    FormattingService.prototype.setCurrentCulture = function (cultureSelector) {
        if (this._currentCultureSelector !== cultureSelector) {
            this._currentCulture = this.getCulture(cultureSelector);
            this._currentCultureSelector = cultureSelector;
            this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture);
        }
    };
    /**
     * Gets the culture assotiated with the specified cultureSelector ("en", "en-US", "fr-FR" etc).
     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
     * Exposing this function for testability of unsupported cultures
     */
    FormattingService.prototype.getCulture = function (cultureSelector) {
        if (cultureSelector == null) {
            if (this._currentCulture == null) {
                this.initialize();
            }
            return this._currentCulture;
        }
        else {
            var culture = globalize_1.Globalize.findClosestCulture(cultureSelector);
            if (!culture)
                culture = globalize_1.Globalize.culture("en-US");
            return culture;
        }
    };
    // By default the Globalization module initializes to the culture/calendar provided in the language/culture URL params
    FormattingService.prototype.initialize = function () {
        var cultureName = this.getCurrentCulture();
        this.setCurrentCulture(cultureName);
        var calendarName = this.getUrlParam("calendar");
        if (calendarName) {
            var culture = this._currentCulture;
            var c = culture.calendars[calendarName];
            if (c) {
                culture.calendar = c;
            }
        }
    };
    /**
     *  Exposing this function for testability
     */
    FormattingService.prototype.getCurrentCulture = function () {
        if (window === null || window === void 0 ? void 0 : window.navigator) {
            return window.navigator.userLanguage || window.navigator["language"];
        }
        return "en-US";
    };
    /**
     *  Exposing this function for testability
     *  @param name: queryString name
     */
    FormattingService.prototype.getUrlParam = function (name) {
        var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
        return param ? param[1] : undefined;
    };
    return FormattingService;
}());
exports.FormattingService = FormattingService;
// DateTimeScaleFormatInfo is used to calculate and keep the Date formats used for different units supported by the DateTimeScaleModel
var DateTimeScaleFormatInfo = /** @class */ (function () {
    // Constructor
    /**
     * Creates new instance of the DateTimeScaleFormatInfo class.
     * @param culture - culture which calendar info is going to be used to derive the formats.
     */
    function DateTimeScaleFormatInfo(culture) {
        var calendar = culture.calendar;
        var patterns = calendar.patterns;
        var monthAbbreviations = calendar["months"]["namesAbbr"];
        var cultureHasMonthAbbr = monthAbbreviations && monthAbbreviations[0];
        var yearMonthPattern = patterns["Y"];
        var monthDayPattern = patterns["M"];
        var fullPattern = patterns["f"];
        var longTimePattern = patterns["T"];
        var shortTimePattern = patterns["t"];
        var separator = fullPattern.indexOf(",") > -1 ? ", " : " ";
        var hasYearSymbol = yearMonthPattern.indexOf("yyyy'") === 0 && yearMonthPattern.length > 6 && yearMonthPattern[6] === "\'";
        this.YearPattern = hasYearSymbol ? yearMonthPattern.substring(0, 7) : "yyyy";
        var yearPos = fullPattern.indexOf("yy");
        var monthPos = fullPattern.indexOf("MMMM");
        this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? (yearPos > monthPos ? "MMM yyyy" : "yyyy MMM") : yearMonthPattern;
        this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;
        var minutePos = fullPattern.indexOf("mm");
        var pmPos = fullPattern.indexOf("tt");
        var shortHourPattern = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
        this.HourPattern = yearPos < minutePos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern;
        this.MinutePattern = shortTimePattern;
        this.SecondPattern = longTimePattern;
        this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff");
        // Special cases
        switch (culture.name) {
            case "fi-FI":
                this.DayPattern = this.DayPattern.replace("'ta'", ""); // Fix for finish 'ta' suffix for month names.
                this.HourPattern = this.HourPattern.replace("'ta'", "");
                break;
        }
    }
    // Methods
    /**
     * Returns the format string of the provided DateTimeUnit.
     * @param unit - date or time unit
     */
    DateTimeScaleFormatInfo.prototype.getFormatString = function (unit) {
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return this.YearPattern;
            case iFormattingService_1.DateTimeUnit.Month:
                return this.MonthPattern;
            case iFormattingService_1.DateTimeUnit.Week:
            case iFormattingService_1.DateTimeUnit.Day:
                return this.DayPattern;
            case iFormattingService_1.DateTimeUnit.Hour:
                return this.HourPattern;
            case iFormattingService_1.DateTimeUnit.Minute:
                return this.MinutePattern;
            case iFormattingService_1.DateTimeUnit.Second:
                return this.SecondPattern;
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return this.MillisecondPattern;
        }
    };
    return DateTimeScaleFormatInfo;
}());
var formattingService = new FormattingService();
exports.formattingService = formattingService;
//# sourceMappingURL=formattingService.js.map

/***/ }),

/***/ 3224:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataLabelsDisplayUnitSystem = exports.WholeUnitsDisplayUnitSystem = exports.DefaultDisplayUnitSystem = exports.NoDisplayUnitSystem = exports.DisplayUnitSystem = exports.DisplayUnit = void 0;
/* eslint-disable no-useless-escape */
var formattingService_1 = __webpack_require__(3100);
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2087);
// Constants
var maxExponent = 24;
var defaultScientificBigNumbersBoundary = 1E15;
var scientificSmallNumbersBoundary = 1E-4;
var PERCENTAGE_FORMAT = "%";
var SCIENTIFIC_FORMAT = "E+0";
var DEFAULT_SCIENTIFIC_FORMAT = "0.##" + SCIENTIFIC_FORMAT;
// Regular expressions
/**
 * This regex looks for strings that match one of the following conditions:
 *   - Optionally contain "0", "#", followed by a period, followed by at least one "0" or "#" (Ex. ###,000.###)
 *   - Contains at least one of "0", "#", or "," (Ex. ###,000)
 *   - Contain a "g" (indicates to use the general .NET numeric format string)
 * The entire string (start to end) must match, and the match is not case-sensitive.
 */
var SUPPORTED_SCIENTIFIC_FORMATS = /^([0\#,]*\.[0\#]+|[0\#,]+|g)$/i;
var DisplayUnit = /** @class */ (function () {
    function DisplayUnit() {
    }
    // Methods
    DisplayUnit.prototype.project = function (value) {
        if (this.value) {
            return powerbi_visuals_utils_typeutils_1.double.removeDecimalNoise(value / this.value);
        }
        else {
            return value;
        }
    };
    DisplayUnit.prototype.reverseProject = function (value) {
        if (this.value) {
            return value * this.value;
        }
        else {
            return value;
        }
    };
    DisplayUnit.prototype.isApplicableTo = function (value) {
        value = Math.abs(value);
        var precision = powerbi_visuals_utils_typeutils_1.double.getPrecision(value, 3);
        return powerbi_visuals_utils_typeutils_1.double.greaterOrEqualWithPrecision(value, this.applicableRangeMin, precision) && powerbi_visuals_utils_typeutils_1.double.lessWithPrecision(value, this.applicableRangeMax, precision);
    };
    DisplayUnit.prototype.isScaling = function () {
        return this.value > 1;
    };
    return DisplayUnit;
}());
exports.DisplayUnit = DisplayUnit;
var DisplayUnitSystem = /** @class */ (function () {
    // Constructor
    function DisplayUnitSystem(units) {
        this.units = units ? units : [];
    }
    Object.defineProperty(DisplayUnitSystem.prototype, "title", {
        // Properties
        get: function () {
            return this.displayUnit ? this.displayUnit.title : undefined;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    DisplayUnitSystem.prototype.update = function (value) {
        if (value === undefined)
            return;
        this.unitBaseValue = value;
        this.displayUnit = this.findApplicableDisplayUnit(value);
    };
    DisplayUnitSystem.prototype.findApplicableDisplayUnit = function (value) {
        for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
            var unit = _a[_i];
            if (unit.isApplicableTo(value))
                return unit;
        }
        return undefined;
    };
    DisplayUnitSystem.prototype.format = function (value, format, decimals, trailingZeros, cultureSelector) {
        decimals = this.getNumberOfDecimalsForFormatting(format, decimals);
        var nonScientificFormat = "";
        if (this.isFormatSupported(format)
            && !this.hasScientitifcFormat(format)
            && this.isScalingUnit()
            && this.shouldRespectScalingUnit(format)) {
            value = this.displayUnit.project(value);
            nonScientificFormat = this.displayUnit.labelFormat;
        }
        return this.formatHelper({
            value: value,
            nonScientificFormat: nonScientificFormat,
            format: format,
            decimals: decimals,
            trailingZeros: trailingZeros,
            cultureSelector: cultureSelector
        });
    };
    DisplayUnitSystem.prototype.isFormatSupported = function (format) {
        return !DisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
    };
    DisplayUnitSystem.prototype.isPercentageFormat = function (format) {
        return format && format.indexOf(PERCENTAGE_FORMAT) >= 0;
    };
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    DisplayUnitSystem.prototype.shouldRespectScalingUnit = function (format) {
        return true;
    };
    DisplayUnitSystem.prototype.getNumberOfDecimalsForFormatting = function (format, decimals) {
        return decimals;
    };
    DisplayUnitSystem.prototype.isScalingUnit = function () {
        return this.displayUnit && this.displayUnit.isScaling();
    };
    DisplayUnitSystem.prototype.formatHelper = function (options) {
        var value = options.value, cultureSelector = options.cultureSelector, decimals = options.decimals, trailingZeros = options.trailingZeros;
        var nonScientificFormat = options.nonScientificFormat, format = options.format;
        // If the format is "general" and we want to override the number of decimal places then use the default numeric format string.
        if ((format === "g" || format === "G") && decimals != null) {
            format = "#,0.00";
        }
        format = formattingService_1.numberFormat.addDecimalsToFormat(format, decimals, trailingZeros);
        if (format && !formattingService_1.formattingService.isStandardNumberFormat(format)) {
            return formattingService_1.formattingService.formatNumberWithCustomOverride(value, format, nonScientificFormat, cultureSelector);
        }
        if (!format) {
            format = "G";
        }
        if (!nonScientificFormat) {
            nonScientificFormat = "{0}";
        }
        var text = formattingService_1.formattingService.formatValue(value, format, cultureSelector);
        return formattingService_1.formattingService.format(nonScientificFormat, [text]);
    };
    //  Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting.
    DisplayUnitSystem.prototype.formatSingleValue = function (value, format, decimals, trailingZeros, cultureSelector) {
        // Change unit base to a value appropriate for this value
        this.update(this.shouldUseValuePrecision(value) ? powerbi_visuals_utils_typeutils_1.double.getPrecision(value, 8) : value);
        return this.format(value, format, decimals, trailingZeros, cultureSelector);
    };
    DisplayUnitSystem.prototype.shouldUseValuePrecision = function (value) {
        if (this.units.length === 0)
            return true;
        // Check if the value is big enough to have a valid unit by checking against the smallest unit (that it's value bigger than 1).
        var applicableRangeMin = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].isScaling()) {
                applicableRangeMin = this.units[i].applicableRangeMin;
                break;
            }
        }
        return Math.abs(value) < applicableRangeMin;
    };
    DisplayUnitSystem.prototype.isScientific = function (value) {
        return value < -defaultScientificBigNumbersBoundary || value > defaultScientificBigNumbersBoundary ||
            (-scientificSmallNumbersBoundary < value && value < scientificSmallNumbersBoundary && value !== 0);
    };
    DisplayUnitSystem.prototype.hasScientitifcFormat = function (format) {
        return format && format.toUpperCase().indexOf("E") !== -1;
    };
    DisplayUnitSystem.prototype.supportsScientificFormat = function (format) {
        if (format)
            return SUPPORTED_SCIENTIFIC_FORMATS.test(format);
        return true;
    };
    DisplayUnitSystem.prototype.shouldFallbackToScientific = function (value, format) {
        return !this.hasScientitifcFormat(format)
            && this.supportsScientificFormat(format)
            && this.isScientific(value);
    };
    DisplayUnitSystem.prototype.getScientificFormat = function (data, format, decimals, trailingZeros) {
        // Use scientific format outside of the range
        if (this.isFormatSupported(format) && this.shouldFallbackToScientific(data, format)) {
            var numericFormat = formattingService_1.numberFormat.getNumericFormat(data, format);
            if (decimals)
                numericFormat = formattingService_1.numberFormat.addDecimalsToFormat(numericFormat ? numericFormat : "0", Math.abs(decimals), trailingZeros);
            if (numericFormat)
                return numericFormat + SCIENTIFIC_FORMAT;
            else
                return DEFAULT_SCIENTIFIC_FORMAT;
        }
        return format;
    };
    DisplayUnitSystem.UNSUPPORTED_FORMATS = /^(p\d*)|(e\d*)$/i;
    return DisplayUnitSystem;
}());
exports.DisplayUnitSystem = DisplayUnitSystem;
// Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode.
var NoDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(NoDisplayUnitSystem, _super);
    // Constructor
    function NoDisplayUnitSystem() {
        return _super.call(this, []) || this;
    }
    return NoDisplayUnitSystem;
}(DisplayUnitSystem));
exports.NoDisplayUnitSystem = NoDisplayUnitSystem;
/** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
    we are showing values (chart axes) and as such it is the default unit system. */
var DefaultDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(DefaultDisplayUnitSystem, _super);
    // Constructor
    function DefaultDisplayUnitSystem(unitLookup) {
        return _super.call(this, DefaultDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    // Methods
    DefaultDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    DefaultDisplayUnitSystem.RESET = function () {
        DefaultDisplayUnitSystem.units = null;
    };
    DefaultDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!DefaultDisplayUnitSystem.units) {
            DefaultDisplayUnitSystem.units = createDisplayUnits(unitLookup, function (value, previousUnitValue, min) {
                // When dealing with millions/billions/trillions we need to switch to millions earlier: for example instead of showing 100K 200K 300K we should show 0.1M 0.2M 0.3M etc
                if (value - previousUnitValue >= 1000) {
                    return value / 10;
                }
                return min;
            });
            // Ensure last unit has max of infinity
            DefaultDisplayUnitSystem.units[DefaultDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return DefaultDisplayUnitSystem.units;
    };
    return DefaultDisplayUnitSystem;
}(DisplayUnitSystem));
exports.DefaultDisplayUnitSystem = DefaultDisplayUnitSystem;
/** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
    one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
    where we have restricted space but do not want to show partial units. */
var WholeUnitsDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(WholeUnitsDisplayUnitSystem, _super);
    // Constructor
    function WholeUnitsDisplayUnitSystem(unitLookup) {
        return _super.call(this, WholeUnitsDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    WholeUnitsDisplayUnitSystem.RESET = function () {
        WholeUnitsDisplayUnitSystem.units = null;
    };
    WholeUnitsDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!WholeUnitsDisplayUnitSystem.units) {
            WholeUnitsDisplayUnitSystem.units = createDisplayUnits(unitLookup);
            // Ensure last unit has max of infinity
            WholeUnitsDisplayUnitSystem.units[WholeUnitsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return WholeUnitsDisplayUnitSystem.units;
    };
    WholeUnitsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    return WholeUnitsDisplayUnitSystem;
}(DisplayUnitSystem));
exports.WholeUnitsDisplayUnitSystem = WholeUnitsDisplayUnitSystem;
var DataLabelsDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(DataLabelsDisplayUnitSystem, _super);
    function DataLabelsDisplayUnitSystem(unitLookup) {
        return _super.call(this, DataLabelsDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    DataLabelsDisplayUnitSystem.prototype.isFormatSupported = function (format) {
        return !DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
    };
    DataLabelsDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!DataLabelsDisplayUnitSystem.units) {
            var units = [];
            var adjustMinBasedOnPreviousUnit = function (value, previousUnitValue, min) {
                // Never returns true, we are always ignoring
                // We do not early switch (e.g. 100K instead of 0.1M)
                // Intended? If so, remove this function, otherwise, remove if statement
                if (value === -1)
                    if (value - previousUnitValue >= 1000) {
                        return value / 10;
                    }
                return min;
            };
            // Add Auto & None
            var names = unitLookup(-1);
            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
            names = unitLookup(0);
            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
            // Add normal units
            DataLabelsDisplayUnitSystem.units = units.concat(createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit));
            // Ensure last unit has max of infinity
            DataLabelsDisplayUnitSystem.units[DataLabelsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return DataLabelsDisplayUnitSystem.units;
    };
    DataLabelsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    // Constants
    DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE = 0;
    DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE = 1;
    DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS = /^(e\d*)$/i;
    return DataLabelsDisplayUnitSystem;
}(DisplayUnitSystem));
exports.DataLabelsDisplayUnitSystem = DataLabelsDisplayUnitSystem;
function createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit) {
    var units = [];
    for (var i = 3; i < maxExponent; i++) {
        var names = unitLookup(i);
        if (names)
            addUnitIfNonEmpty(units, powerbi_visuals_utils_typeutils_1.double.pow10(i), names.title, names.format, adjustMinBasedOnPreviousUnit);
    }
    return units;
}
function addUnitIfNonEmpty(units, value, title, labelFormat, adjustMinBasedOnPreviousUnit) {
    if (title || labelFormat) {
        var min = value;
        if (units.length > 0) {
            var previousUnit = units[units.length - 1];
            if (adjustMinBasedOnPreviousUnit)
                min = adjustMinBasedOnPreviousUnit(value, previousUnit.value, min);
            previousUnit.applicableRangeMax = min;
        }
        var unit = new DisplayUnit();
        unit.value = value;
        unit.applicableRangeMin = min;
        unit.applicableRangeMax = min * 1000;
        unit.title = title;
        unit.labelFormat = labelFormat;
        units.push(unit);
    }
}
//# sourceMappingURL=displayUnitSystem.js.map

/***/ }),

/***/ 3351:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateTimeUnit = void 0;
// Enumeration of DateTimeUnits
var DateTimeUnit;
(function (DateTimeUnit) {
    DateTimeUnit[DateTimeUnit["Year"] = 0] = "Year";
    DateTimeUnit[DateTimeUnit["Month"] = 1] = "Month";
    DateTimeUnit[DateTimeUnit["Week"] = 2] = "Week";
    DateTimeUnit[DateTimeUnit["Day"] = 3] = "Day";
    DateTimeUnit[DateTimeUnit["Hour"] = 4] = "Hour";
    DateTimeUnit[DateTimeUnit["Minute"] = 5] = "Minute";
    DateTimeUnit[DateTimeUnit["Second"] = 6] = "Second";
    DateTimeUnit[DateTimeUnit["Millisecond"] = 7] = "Millisecond";
})(DateTimeUnit = exports.DateTimeUnit || (exports.DateTimeUnit = {}));
//# sourceMappingURL=iFormattingService.js.map

/***/ }),

/***/ 3550:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ landingPageHTML)
/* harmony export */ });
// landingPage.ts
const landingPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova Matrix</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background-color: #13141a;
            color: #ffffff;
            height: 100vh;
            width: 100%;
            overflow: hidden;
            position: relative;
        }
        
        /* Star background */
        body:before {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
            background-size: 50px 50px;
            z-index: 0;
            opacity: 0.3;
        }
        
        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            position: relative;
            z-index: 1;
            padding: 20px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            width: 100%;
            position: absolute;
            top: 30px;
            padding: 0 30px;
        }
        
        .logo {
            display: flex;
            align-items: center;
            font-size: 14px;
            font-weight: 500;
            color: #ff7846;
        }
        
        .logo-icon {
            width: 20px;
            height: 20px;
            background-color: #ff7846;
            margin-right: 10px;
        }
        
        .menu-button {
            border: none;
            background: transparent;
            color: #ffffff;
            cursor: pointer;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .orb-container {
            position: relative;
            width: 180px;
            height: 180px;
            margin-bottom: 40px;
        }
        
        .orb {
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, #ffffff 0%, #e0e0e0 70%, #b0b0b0 100%);
            border-radius: 50%;
            margin: 15px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }
        
        .orb-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 180px;
            height: 180px;
            border: 2px solid #2a2a36;
            border-radius: 50%;
            box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
        }
        
        .main-title {
            font-size: 42px;
            font-weight: bold;
            letter-spacing: 10px;
            text-align: center;
            margin-bottom: 20px;
            text-transform: uppercase;
        }
        
        .main-title span {
            display: inline-block;
            margin: 0 5px;
        }
        
        .subtitle {
            font-size: 14px;
            letter-spacing: 2px;
            text-align: center;
            margin-bottom: 40px;
            color: #b0b0b0;
            text-transform: uppercase;
        }
        
        .continue-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-decoration: none;
            color: #ffffff;
            margin-top: 20px;
        }
        
        .diamond {
            width: 40px;
            height: 40px;
            background-color: transparent;
            border: 2px solid rgba(255, 255, 255, 0.5);
            transform: rotate(45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 10px;
        }
        
        .diamond-inner {
            width: 10px;
            height: 10px;
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .continue-text {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .footer {
            position: absolute;
            bottom: 20px;
            width: 100%;
            text-align: center;
        }
        
        .progress {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .progress-item {
            width: 12px;
            height: 12px;
            border: 1px solid rgba(255, 255, 255, 0.5);
            border-radius: 50%;
        }
        
        .progress-item.active {
            background-color: rgba(255, 255, 255, 0.5);
        }
        
        .credit {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">
                <div class="logo-icon"></div>
                <div>Nova Matrix Analytics</div>
            </div>
            <button class="menu-button">Options</button>
        </div>
        
        <div class="orb-container">
            <div class="orb"></div>
            <div class="orb-ring"></div>
        </div>
        
        <h1 class="main-title">
            <span>W</span>
            <span>E</span>
            <span>L</span>
            <span>C</span>
            <span>O</span>
            <span>M</span>
            <span>E</span>
            <span>&nbsp;</span>
            <span>T</span>
            <span>O</span>
            <span>&nbsp;</span>
            <span>T</span>
            <span>H</span>
            <span>E</span>
            <span>&nbsp;</span>
            <span>N</span>
            <span>O</span>
            <span>V</span>
            <span>A</span>
            <span>&nbsp;</span>
            <span>M</span>
            <span>A</span>
            <span>T</span>
            <span>R</span>
            <span>I</span>
            <span>X</span>
        </h1>
        
        <p class="subtitle">Data will not make decisions for you. You do it!</p>
        
        <a href="#" class="continue-button">
            <div class="diamond">
                <div class="diamond-inner"></div>
            </div>
            <span class="continue-text">Continue</span>
        </a>
        
        <div class="footer">
            <div class="progress">
                <div class="progress-item active"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
                <div class="progress-item"></div>
            </div>
            <div class="credit">Developed by Matrix Team</div>
        </div>
    </div>
</body>
</html>`;


/***/ }),

/***/ 3801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Family = exports.fallbackFonts = void 0;
var familyInfo_1 = __webpack_require__(6721);
exports.fallbackFonts = ["helvetica", "arial", "sans-serif"];
exports.Family = {
    light: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    semilight: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    regular: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    semibold: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    bold: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    lightSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    regularSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    boldSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts)
};
//# sourceMappingURL=family.js.map

/***/ }),

/***/ 4182:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtendedType: () => (/* binding */ ExtendedType),
/* harmony export */   FormattingType: () => (/* binding */ FormattingType),
/* harmony export */   GeographyType: () => (/* binding */ GeographyType),
/* harmony export */   MiscellaneousType: () => (/* binding */ MiscellaneousType),
/* harmony export */   PrimitiveType: () => (/* binding */ PrimitiveType),
/* harmony export */   ScriptType: () => (/* binding */ ScriptType),
/* harmony export */   TemporalType: () => (/* binding */ TemporalType),
/* harmony export */   ValueType: () => (/* binding */ ValueType)
/* harmony export */ });
/* harmony import */ var _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2879);
/* harmony import */ var _jsonComparer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5038);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// powerbi.extensibility.utils.type


/** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
class ValueType {
    /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
    constructor(underlyingType, category, enumType, variantTypes) {
        this.underlyingType = underlyingType;
        this.category = category;
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Temporal)) {
            this.temporalType = new TemporalType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Geography)) {
            this.geographyType = new GeographyType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Miscellaneous)) {
            this.miscType = new MiscellaneousType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Formatting)) {
            this.formattingType = new FormattingType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Enumeration)) {
            this.enumType = enumType;
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Scripting)) {
            this.scriptingType = new ScriptType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Variant)) {
            this.variationTypes = variantTypes;
        }
    }
    /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
    static fromDescriptor(descriptor) {
        descriptor = descriptor || {};
        // Simplified primitive types
        if (descriptor.text)
            return ValueType.fromExtendedType(ExtendedType.Text);
        if (descriptor.integer)
            return ValueType.fromExtendedType(ExtendedType.Integer);
        if (descriptor.numeric)
            return ValueType.fromExtendedType(ExtendedType.Double);
        if (descriptor.bool)
            return ValueType.fromExtendedType(ExtendedType.Boolean);
        if (descriptor.dateTime)
            return ValueType.fromExtendedType(ExtendedType.DateTime);
        if (descriptor.duration)
            return ValueType.fromExtendedType(ExtendedType.Duration);
        if (descriptor.binary)
            return ValueType.fromExtendedType(ExtendedType.Binary);
        if (descriptor.none)
            return ValueType.fromExtendedType(ExtendedType.None);
        // Extended types
        if (descriptor.scripting) {
            if (descriptor.scripting.source)
                return ValueType.fromExtendedType(ExtendedType.ScriptSource);
        }
        if (descriptor.enumeration)
            return ValueType.fromEnum(descriptor.enumeration);
        if (descriptor.temporal) {
            if (descriptor.temporal.year)
                return ValueType.fromExtendedType(ExtendedType.Years_Integer);
            if (descriptor.temporal.quarter)
                return ValueType.fromExtendedType(ExtendedType.Quarters_Integer);
            if (descriptor.temporal.month)
                return ValueType.fromExtendedType(ExtendedType.Months_Integer);
            if (descriptor.temporal.day)
                return ValueType.fromExtendedType(ExtendedType.DayOfMonth_Integer);
            if (descriptor.temporal.paddedDateTableDate)
                return ValueType.fromExtendedType(ExtendedType.PaddedDateTableDates);
        }
        if (descriptor.geography) {
            if (descriptor.geography.address)
                return ValueType.fromExtendedType(ExtendedType.Address);
            if (descriptor.geography.city)
                return ValueType.fromExtendedType(ExtendedType.City);
            if (descriptor.geography.continent)
                return ValueType.fromExtendedType(ExtendedType.Continent);
            if (descriptor.geography.country)
                return ValueType.fromExtendedType(ExtendedType.Country);
            if (descriptor.geography.county)
                return ValueType.fromExtendedType(ExtendedType.County);
            if (descriptor.geography.region)
                return ValueType.fromExtendedType(ExtendedType.Region);
            if (descriptor.geography.postalCode)
                return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
            if (descriptor.geography.stateOrProvince)
                return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
            if (descriptor.geography.place)
                return ValueType.fromExtendedType(ExtendedType.Place);
            if (descriptor.geography.latitude)
                return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
            if (descriptor.geography.longitude)
                return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
        }
        if (descriptor.misc) {
            if (descriptor.misc.image)
                return ValueType.fromExtendedType(ExtendedType.Image);
            if (descriptor.misc.imageUrl)
                return ValueType.fromExtendedType(ExtendedType.ImageUrl);
            if (descriptor.misc.webUrl)
                return ValueType.fromExtendedType(ExtendedType.WebUrl);
            if (descriptor.misc.barcode)
                return ValueType.fromExtendedType(ExtendedType.Barcode_Text);
        }
        if (descriptor.formatting) {
            if (descriptor.formatting.color)
                return ValueType.fromExtendedType(ExtendedType.Color);
            if (descriptor.formatting.formatString)
                return ValueType.fromExtendedType(ExtendedType.FormatString);
            if (descriptor.formatting.alignment)
                return ValueType.fromExtendedType(ExtendedType.Alignment);
            if (descriptor.formatting.labelDisplayUnits)
                return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
            if (descriptor.formatting.fontSize)
                return ValueType.fromExtendedType(ExtendedType.FontSize);
            if (descriptor.formatting.labelDensity)
                return ValueType.fromExtendedType(ExtendedType.LabelDensity);
        }
        if (descriptor.extendedType) {
            return ValueType.fromExtendedType(descriptor.extendedType);
        }
        if (descriptor.operations) {
            if (descriptor.operations.searchEnabled)
                return ValueType.fromExtendedType(ExtendedType.SearchEnabled);
        }
        if (descriptor.variant) {
            const variantTypes = descriptor.variant.map((variantType) => ValueType.fromDescriptor(variantType));
            return ValueType.fromVariant(variantTypes);
        }
        return ValueType.fromExtendedType(ExtendedType.Null);
    }
    /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
    static fromExtendedType(extendedType) {
        extendedType = extendedType || ExtendedType.Null;
        const primitiveType = getPrimitiveType(extendedType), category = getCategoryFromExtendedType(extendedType);
        return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
    }
    /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
    static fromPrimitiveTypeAndCategory(primitiveType, category) {
        primitiveType = primitiveType || PrimitiveType.Null;
        category = category || null;
        let id = primitiveType.toString();
        if (category)
            id += "|" + category;
        return ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
    }
    /** Creates a ValueType to describe the given IEnumType. */
    static fromEnum(enumType) {
        return new ValueType(ExtendedType.Enumeration, null, enumType);
    }
    /** Creates a ValueType to describe the given Variant type. */
    static fromVariant(variantTypes) {
        return new ValueType(ExtendedType.Variant, /* category */ null, /* enumType */ null, variantTypes);
    }
    /** Determines if the specified type is compatible from at least one of the otherTypes. */
    static isCompatibleTo(typeDescriptor, otherTypes) {
        const valueType = ValueType.fromDescriptor(typeDescriptor);
        for (const otherType of otherTypes) {
            const otherValueType = ValueType.fromDescriptor(otherType);
            if (otherValueType.isCompatibleFrom(valueType))
                return true;
        }
        return false;
    }
    /** Determines if the instance ValueType is convertable from the 'other' ValueType. */
    isCompatibleFrom(other) {
        const otherPrimitiveType = other.primitiveType;
        if (this === other ||
            this.primitiveType === otherPrimitiveType ||
            otherPrimitiveType === PrimitiveType.Null ||
            // Return true if both types are numbers
            (this.numeric && other.numeric))
            return true;
        return false;
    }
    /**
     * Determines if the instance ValueType is equal to the 'other' ValueType
     * @param {ValueType} other the other ValueType to check equality against
     * @returns True if the instance ValueType is equal to the 'other' ValueType
     */
    equals(other) {
        return (0,_jsonComparer__WEBPACK_IMPORTED_MODULE_1__.equals)(this, other);
    }
    /** Gets the exact primitive type of this ValueType. */
    get primitiveType() {
        return getPrimitiveType(this.underlyingType);
    }
    /** Gets the exact extended type of this ValueType. */
    get extendedType() {
        return this.underlyingType;
    }
    /** Gets the data category string (if any) for this ValueType. */
    get categoryString() {
        return this.category;
    }
    // Simplified primitive types
    /** Indicates whether the type represents text values. */
    get text() {
        return this.primitiveType === PrimitiveType.Text;
    }
    /** Indicates whether the type represents any numeric value. */
    get numeric() {
        return _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(this.underlyingType, ExtendedType.Numeric);
    }
    /** Indicates whether the type represents integer numeric values. */
    get integer() {
        return this.primitiveType === PrimitiveType.Integer;
    }
    /** Indicates whether the type represents Boolean values. */
    get bool() {
        return this.primitiveType === PrimitiveType.Boolean;
    }
    /** Indicates whether the type represents any date/time values. */
    get dateTime() {
        return this.primitiveType === PrimitiveType.DateTime ||
            this.primitiveType === PrimitiveType.Date ||
            this.primitiveType === PrimitiveType.Time;
    }
    /** Indicates whether the type represents duration values. */
    get duration() {
        return this.primitiveType === PrimitiveType.Duration;
    }
    /** Indicates whether the type represents binary values. */
    get binary() {
        return this.primitiveType === PrimitiveType.Binary;
    }
    /** Indicates whether the type represents none values. */
    get none() {
        return this.primitiveType === PrimitiveType.None;
    }
    // Extended types
    /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
    get temporal() {
        return this.temporalType;
    }
    /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
    get geography() {
        return this.geographyType;
    }
    /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
    get misc() {
        return this.miscType;
    }
    /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
    get formatting() {
        return this.formattingType;
    }
    /** Returns an object describing the enum values represented by the type, if it represents an enumeration type. */
    get enumeration() {
        return this.enumType;
    }
    get scripting() {
        return this.scriptingType;
    }
    /** Returns an array describing the variant values represented by the type, if it represents an Variant type. */
    get variant() {
        return this.variationTypes;
    }
}
ValueType.typeCache = {};
class ScriptType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get source() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ScriptSource);
    }
}
class TemporalType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get year() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Years);
    }
    get quarter() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Quarters);
    }
    get month() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Months);
    }
    get day() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.DayOfMonth);
    }
    get paddedDateTableDate() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PaddedDateTableDates);
    }
}
class GeographyType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get address() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
    }
    get city() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
    }
    get continent() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
    }
    get country() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
    }
    get county() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
    }
    get region() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
    }
    get postalCode() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
    }
    get stateOrProvince() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
    }
    get place() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
    }
    get latitude() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
    }
    get longitude() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
    }
}
class MiscellaneousType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get image() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
    }
    get imageUrl() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
    }
    get webUrl() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
    }
    get barcode() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Barcode);
    }
}
class FormattingType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get color() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
    }
    get formatString() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
    }
    get alignment() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
    }
    get labelDisplayUnits() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
    }
    get fontSize() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FontSize);
    }
    get labelDensity() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDensity);
    }
}
/** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["Null"] = 0] = "Null";
    PrimitiveType[PrimitiveType["Text"] = 1] = "Text";
    PrimitiveType[PrimitiveType["Decimal"] = 2] = "Decimal";
    PrimitiveType[PrimitiveType["Double"] = 3] = "Double";
    PrimitiveType[PrimitiveType["Integer"] = 4] = "Integer";
    PrimitiveType[PrimitiveType["Boolean"] = 5] = "Boolean";
    PrimitiveType[PrimitiveType["Date"] = 6] = "Date";
    PrimitiveType[PrimitiveType["DateTime"] = 7] = "DateTime";
    PrimitiveType[PrimitiveType["DateTimeZone"] = 8] = "DateTimeZone";
    PrimitiveType[PrimitiveType["Time"] = 9] = "Time";
    PrimitiveType[PrimitiveType["Duration"] = 10] = "Duration";
    PrimitiveType[PrimitiveType["Binary"] = 11] = "Binary";
    PrimitiveType[PrimitiveType["None"] = 12] = "None";
    PrimitiveType[PrimitiveType["Variant"] = 13] = "Variant";
})(PrimitiveType || (PrimitiveType = {}));
var PrimitiveTypeStrings;
(function (PrimitiveTypeStrings) {
    PrimitiveTypeStrings[PrimitiveTypeStrings["Null"] = 0] = "Null";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Text"] = 1] = "Text";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Decimal"] = 2] = "Decimal";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Double"] = 3] = "Double";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Integer"] = 4] = "Integer";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Boolean"] = 5] = "Boolean";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Date"] = 6] = "Date";
    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTime"] = 7] = "DateTime";
    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTimeZone"] = 8] = "DateTimeZone";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Time"] = 9] = "Time";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Duration"] = 10] = "Duration";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Binary"] = 11] = "Binary";
    PrimitiveTypeStrings[PrimitiveTypeStrings["None"] = 12] = "None";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Variant"] = 13] = "Variant";
})(PrimitiveTypeStrings || (PrimitiveTypeStrings = {}));
/** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
var ExtendedType;
(function (ExtendedType) {
    // Flags (1 << 8-15 range [0xFF00])
    // Important: Enum members must be declared before they are used in TypeScript.
    ExtendedType[ExtendedType["Numeric"] = 256] = "Numeric";
    ExtendedType[ExtendedType["Temporal"] = 512] = "Temporal";
    ExtendedType[ExtendedType["Geography"] = 1024] = "Geography";
    ExtendedType[ExtendedType["Miscellaneous"] = 2048] = "Miscellaneous";
    ExtendedType[ExtendedType["Formatting"] = 4096] = "Formatting";
    ExtendedType[ExtendedType["Scripting"] = 8192] = "Scripting";
    // Primitive types (0-255 range [0xFF] | flags)
    // The member names and base values must match those in PrimitiveType.
    ExtendedType[ExtendedType["Null"] = 0] = "Null";
    ExtendedType[ExtendedType["Text"] = 1] = "Text";
    ExtendedType[ExtendedType["Decimal"] = 258] = "Decimal";
    ExtendedType[ExtendedType["Double"] = 259] = "Double";
    ExtendedType[ExtendedType["Integer"] = 260] = "Integer";
    ExtendedType[ExtendedType["Boolean"] = 5] = "Boolean";
    ExtendedType[ExtendedType["Date"] = 518] = "Date";
    ExtendedType[ExtendedType["DateTime"] = 519] = "DateTime";
    ExtendedType[ExtendedType["DateTimeZone"] = 520] = "DateTimeZone";
    ExtendedType[ExtendedType["Time"] = 521] = "Time";
    ExtendedType[ExtendedType["Duration"] = 10] = "Duration";
    ExtendedType[ExtendedType["Binary"] = 11] = "Binary";
    ExtendedType[ExtendedType["None"] = 12] = "None";
    ExtendedType[ExtendedType["Variant"] = 13] = "Variant";
    // Extended types (0-32767 << 16 range [0xFFFF0000] | corresponding primitive type | flags)
    // Temporal
    ExtendedType[ExtendedType["Years"] = 66048] = "Years";
    ExtendedType[ExtendedType["Years_Text"] = 66049] = "Years_Text";
    ExtendedType[ExtendedType["Years_Integer"] = 66308] = "Years_Integer";
    ExtendedType[ExtendedType["Years_Date"] = 66054] = "Years_Date";
    ExtendedType[ExtendedType["Years_DateTime"] = 66055] = "Years_DateTime";
    ExtendedType[ExtendedType["Months"] = 131584] = "Months";
    ExtendedType[ExtendedType["Months_Text"] = 131585] = "Months_Text";
    ExtendedType[ExtendedType["Months_Integer"] = 131844] = "Months_Integer";
    ExtendedType[ExtendedType["Months_Date"] = 131590] = "Months_Date";
    ExtendedType[ExtendedType["Months_DateTime"] = 131591] = "Months_DateTime";
    ExtendedType[ExtendedType["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
    ExtendedType[ExtendedType["Quarters"] = 262656] = "Quarters";
    ExtendedType[ExtendedType["Quarters_Text"] = 262657] = "Quarters_Text";
    ExtendedType[ExtendedType["Quarters_Integer"] = 262916] = "Quarters_Integer";
    ExtendedType[ExtendedType["Quarters_Date"] = 262662] = "Quarters_Date";
    ExtendedType[ExtendedType["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
    ExtendedType[ExtendedType["DayOfMonth"] = 328192] = "DayOfMonth";
    ExtendedType[ExtendedType["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
    ExtendedType[ExtendedType["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
    ExtendedType[ExtendedType["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
    ExtendedType[ExtendedType["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
    // Geography
    ExtendedType[ExtendedType["Address"] = 6554625] = "Address";
    ExtendedType[ExtendedType["City"] = 6620161] = "City";
    ExtendedType[ExtendedType["Continent"] = 6685697] = "Continent";
    ExtendedType[ExtendedType["Country"] = 6751233] = "Country";
    ExtendedType[ExtendedType["County"] = 6816769] = "County";
    ExtendedType[ExtendedType["Region"] = 6882305] = "Region";
    ExtendedType[ExtendedType["PostalCode"] = 6947840] = "PostalCode";
    ExtendedType[ExtendedType["PostalCode_Text"] = 6947841] = "PostalCode_Text";
    ExtendedType[ExtendedType["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
    ExtendedType[ExtendedType["StateOrProvince"] = 7013377] = "StateOrProvince";
    ExtendedType[ExtendedType["Place"] = 7078913] = "Place";
    ExtendedType[ExtendedType["Latitude"] = 7144448] = "Latitude";
    ExtendedType[ExtendedType["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
    ExtendedType[ExtendedType["Latitude_Double"] = 7144707] = "Latitude_Double";
    ExtendedType[ExtendedType["Longitude"] = 7209984] = "Longitude";
    ExtendedType[ExtendedType["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
    ExtendedType[ExtendedType["Longitude_Double"] = 7210243] = "Longitude_Double";
    // Miscellaneous
    ExtendedType[ExtendedType["Image"] = 13109259] = "Image";
    ExtendedType[ExtendedType["ImageUrl"] = 13174785] = "ImageUrl";
    ExtendedType[ExtendedType["WebUrl"] = 13240321] = "WebUrl";
    ExtendedType[ExtendedType["Barcode"] = 13305856] = "Barcode";
    ExtendedType[ExtendedType["Barcode_Text"] = 13305857] = "Barcode_Text";
    ExtendedType[ExtendedType["Barcode_Integer"] = 13306116] = "Barcode_Integer";
    // Formatting
    ExtendedType[ExtendedType["Color"] = 19664897] = "Color";
    ExtendedType[ExtendedType["FormatString"] = 19730433] = "FormatString";
    ExtendedType[ExtendedType["Alignment"] = 20058113] = "Alignment";
    ExtendedType[ExtendedType["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
    ExtendedType[ExtendedType["FontSize"] = 20189443] = "FontSize";
    ExtendedType[ExtendedType["LabelDensity"] = 20254979] = "LabelDensity";
    // Enumeration
    ExtendedType[ExtendedType["Enumeration"] = 26214401] = "Enumeration";
    // Scripting
    ExtendedType[ExtendedType["ScriptSource"] = 32776193] = "ScriptSource";
    // NOTE: To avoid confusion, underscores should be used only to delimit primitive type variants of an extended type
    // (e.g. Year_Integer or Latitude_Double above)
    // Operations
    ExtendedType[ExtendedType["SearchEnabled"] = 65541] = "SearchEnabled";
})(ExtendedType || (ExtendedType = {}));
var ExtendedTypeStrings;
(function (ExtendedTypeStrings) {
    ExtendedTypeStrings[ExtendedTypeStrings["Numeric"] = 256] = "Numeric";
    ExtendedTypeStrings[ExtendedTypeStrings["Temporal"] = 512] = "Temporal";
    ExtendedTypeStrings[ExtendedTypeStrings["Geography"] = 1024] = "Geography";
    ExtendedTypeStrings[ExtendedTypeStrings["Miscellaneous"] = 2048] = "Miscellaneous";
    ExtendedTypeStrings[ExtendedTypeStrings["Formatting"] = 4096] = "Formatting";
    ExtendedTypeStrings[ExtendedTypeStrings["Scripting"] = 8192] = "Scripting";
    ExtendedTypeStrings[ExtendedTypeStrings["Null"] = 0] = "Null";
    ExtendedTypeStrings[ExtendedTypeStrings["Text"] = 1] = "Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Decimal"] = 258] = "Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Double"] = 259] = "Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Integer"] = 260] = "Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Boolean"] = 5] = "Boolean";
    ExtendedTypeStrings[ExtendedTypeStrings["Date"] = 518] = "Date";
    ExtendedTypeStrings[ExtendedTypeStrings["DateTime"] = 519] = "DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["DateTimeZone"] = 520] = "DateTimeZone";
    ExtendedTypeStrings[ExtendedTypeStrings["Time"] = 521] = "Time";
    ExtendedTypeStrings[ExtendedTypeStrings["Duration"] = 10] = "Duration";
    ExtendedTypeStrings[ExtendedTypeStrings["Binary"] = 11] = "Binary";
    ExtendedTypeStrings[ExtendedTypeStrings["None"] = 12] = "None";
    ExtendedTypeStrings[ExtendedTypeStrings["Variant"] = 13] = "Variant";
    ExtendedTypeStrings[ExtendedTypeStrings["Years"] = 66048] = "Years";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Text"] = 66049] = "Years_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Integer"] = 66308] = "Years_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Date"] = 66054] = "Years_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_DateTime"] = 66055] = "Years_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["Months"] = 131584] = "Months";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Text"] = 131585] = "Months_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Integer"] = 131844] = "Months_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Date"] = 131590] = "Months_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_DateTime"] = 131591] = "Months_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters"] = 262656] = "Quarters";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Text"] = 262657] = "Quarters_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Integer"] = 262916] = "Quarters_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Date"] = 262662] = "Quarters_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth"] = 328192] = "DayOfMonth";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["Address"] = 6554625] = "Address";
    ExtendedTypeStrings[ExtendedTypeStrings["City"] = 6620161] = "City";
    ExtendedTypeStrings[ExtendedTypeStrings["Continent"] = 6685697] = "Continent";
    ExtendedTypeStrings[ExtendedTypeStrings["Country"] = 6751233] = "Country";
    ExtendedTypeStrings[ExtendedTypeStrings["County"] = 6816769] = "County";
    ExtendedTypeStrings[ExtendedTypeStrings["Region"] = 6882305] = "Region";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode"] = 6947840] = "PostalCode";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Text"] = 6947841] = "PostalCode_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["StateOrProvince"] = 7013377] = "StateOrProvince";
    ExtendedTypeStrings[ExtendedTypeStrings["Place"] = 7078913] = "Place";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude"] = 7144448] = "Latitude";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Double"] = 7144707] = "Latitude_Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude"] = 7209984] = "Longitude";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Double"] = 7210243] = "Longitude_Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Image"] = 13109259] = "Image";
    ExtendedTypeStrings[ExtendedTypeStrings["ImageUrl"] = 13174785] = "ImageUrl";
    ExtendedTypeStrings[ExtendedTypeStrings["WebUrl"] = 13240321] = "WebUrl";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode"] = 13305856] = "Barcode";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Text"] = 13305857] = "Barcode_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Integer"] = 13306116] = "Barcode_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Color"] = 19664897] = "Color";
    ExtendedTypeStrings[ExtendedTypeStrings["FormatString"] = 19730433] = "FormatString";
    ExtendedTypeStrings[ExtendedTypeStrings["Alignment"] = 20058113] = "Alignment";
    ExtendedTypeStrings[ExtendedTypeStrings["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
    ExtendedTypeStrings[ExtendedTypeStrings["FontSize"] = 20189443] = "FontSize";
    ExtendedTypeStrings[ExtendedTypeStrings["LabelDensity"] = 20254979] = "LabelDensity";
    ExtendedTypeStrings[ExtendedTypeStrings["Enumeration"] = 26214401] = "Enumeration";
    ExtendedTypeStrings[ExtendedTypeStrings["ScriptSource"] = 32776193] = "ScriptSource";
    ExtendedTypeStrings[ExtendedTypeStrings["SearchEnabled"] = 65541] = "SearchEnabled";
})(ExtendedTypeStrings || (ExtendedTypeStrings = {}));
const PrimitiveTypeMask = 0xFF;
const PrimitiveTypeWithFlagsMask = 0xFFFF;
const PrimitiveTypeFlagsExcludedMask = 0xFFFF0000;
function getPrimitiveType(extendedType) {
    return extendedType & PrimitiveTypeMask;
}
function isPrimitiveType(extendedType) {
    return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
}
function getCategoryFromExtendedType(extendedType) {
    if (isPrimitiveType(extendedType))
        return null;
    let category = ExtendedTypeStrings[extendedType];
    if (category) {
        // Check for ExtendedType declaration without a primitive type.
        // If exists, use it as category (e.g. Longitude rather than Longitude_Double)
        // Otherwise use the ExtendedType declaration with a primitive type (e.g. Address)
        const delimIdx = category.lastIndexOf("_");
        if (delimIdx > 0) {
            const baseCategory = category.slice(0, delimIdx);
            if (ExtendedTypeStrings[baseCategory]) {
                category = baseCategory;
            }
        }
    }
    return category || null;
}
function toExtendedType(primitiveType, category) {
    const primitiveString = PrimitiveTypeStrings[primitiveType];
    let t = ExtendedTypeStrings[primitiveString];
    if (t == null) {
        t = ExtendedType.Null;
    }
    if (primitiveType && category) {
        let categoryType = ExtendedTypeStrings[category];
        if (categoryType) {
            const categoryPrimitiveType = getPrimitiveType(categoryType);
            if (categoryPrimitiveType === PrimitiveType.Null) {
                // Category supports multiple primitive types, check if requested primitive type is supported
                // (note: important to use t here rather than primitiveType as it may include primitive type flags)
                categoryType = t | categoryType;
                if (ExtendedTypeStrings[categoryType]) {
                    t = categoryType;
                }
            }
            else if (categoryPrimitiveType === primitiveType) {
                // Primitive type matches the single supported type for the category
                t = categoryType;
            }
        }
    }
    return t;
}
function matchesExtendedTypeWithAnyPrimitive(a, b) {
    return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
}
//# sourceMappingURL=valueType.js.map

/***/ }),

/***/ 4298:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XOR: () => (/* binding */ XOR)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
function XOR(a, b) {
    return (a || b) && !(a && b);
}
//# sourceMappingURL=logicExtensions.js.map

/***/ }),

/***/ 4341:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clear: () => (/* binding */ clear),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   createWithId: () => (/* binding */ createWithId),
/* harmony export */   createWithName: () => (/* binding */ createWithName),
/* harmony export */   diff: () => (/* binding */ diff),
/* harmony export */   distinct: () => (/* binding */ distinct),
/* harmony export */   emptyToNull: () => (/* binding */ emptyToNull),
/* harmony export */   ensureArray: () => (/* binding */ ensureArray),
/* harmony export */   extendWithId: () => (/* binding */ extendWithId),
/* harmony export */   extendWithName: () => (/* binding */ extendWithName),
/* harmony export */   findItemWithName: () => (/* binding */ findItemWithName),
/* harmony export */   findWithId: () => (/* binding */ findWithId),
/* harmony export */   indexOf: () => (/* binding */ indexOf),
/* harmony export */   indexWithName: () => (/* binding */ indexWithName),
/* harmony export */   insertSorted: () => (/* binding */ insertSorted),
/* harmony export */   intersect: () => (/* binding */ intersect),
/* harmony export */   isArrayOrInheritedArray: () => (/* binding */ isArrayOrInheritedArray),
/* harmony export */   isInArray: () => (/* binding */ isInArray),
/* harmony export */   isSorted: () => (/* binding */ isSorted),
/* harmony export */   isSortedNumeric: () => (/* binding */ isSortedNumeric),
/* harmony export */   isUndefinedOrEmpty: () => (/* binding */ isUndefinedOrEmpty),
/* harmony export */   range: () => (/* binding */ range),
/* harmony export */   removeFirst: () => (/* binding */ removeFirst),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   sequenceEqual: () => (/* binding */ sequenceEqual),
/* harmony export */   swap: () => (/* binding */ swap),
/* harmony export */   take: () => (/* binding */ take),
/* harmony export */   union: () => (/* binding */ union),
/* harmony export */   unionSingle: () => (/* binding */ unionSingle)
/* harmony export */ });
/**
 * Returns items that exist in target and other.
 */
function intersect(target, other) {
    const result = [];
    for (let i = target.length - 1; i >= 0; --i) {
        if (other.indexOf(target[i]) !== -1) {
            result.push(target[i]);
        }
    }
    return result;
}
/**
 * Return elements exists in target but not exists in other.
 */
function diff(target, other) {
    const result = [];
    for (let i = target.length - 1; i >= 0; --i) {
        const value = target[i];
        if (other.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
}
/**
 * Return an array with only the distinct items in the source.
 */
function distinct(source) {
    const result = [];
    for (let i = 0, len = source.length; i < len; i++) {
        const value = source[i];
        if (result.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
}
/**
 * Pushes content of source onto target,
 * for parts of course that do not already exist in target.
 */
function union(target, source) {
    for (let i = 0, len = source.length; i < len; ++i) {
        unionSingle(target, source[i]);
    }
}
/**
 * Pushes value onto target, if value does not already exist in target.
 */
function unionSingle(target, value) {
    if (target.indexOf(value) < 0) {
        target.push(value);
    }
}
/**
 * Returns an array with a range of items from source,
 * including the startIndex & endIndex.
 */
function range(source, startIndex, endIndex) {
    const result = [];
    for (let i = startIndex; i <= endIndex; ++i) {
        result.push(source[i]);
    }
    return result;
}
/**
 * Returns an array that includes items from source, up to the specified count.
 */
function take(source, count) {
    const result = [];
    for (let i = 0; i < count; ++i) {
        result.push(source[i]);
    }
    return result;
}
function copy(source) {
    return take(source, source.length);
}
/**
  * Returns a value indicating whether the arrays have the same values in the same sequence.
  */
function sequenceEqual(left, right, comparison) {
    // Normalize falsy to null
    if (!left) {
        left = null;
    }
    if (!right) {
        right = null;
    }
    // T can be same as U, and it is possible for left and right to be the same array object...
    if (left === right) {
        return true;
    }
    if (!!left !== !!right) {
        return false;
    }
    const len = left.length;
    if (len !== right.length) {
        return false;
    }
    let i = 0;
    while (i < len && comparison(left[i], right[i])) {
        ++i;
    }
    return i === len;
}
/**
 * Returns null if the specified array is empty.
 * Otherwise returns the specified array.
 */
function emptyToNull(array) {
    if (array && array.length === 0) {
        return null;
    }
    return array;
}
function indexOf(array, predicate) {
    for (let i = 0, len = array.length; i < len; ++i) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * Returns a copy of the array rotated by the specified offset.
 */
function rotate(array, offset) {
    if (offset === 0)
        return array.slice();
    const rotated = array.slice(offset);
    Array.prototype.push.apply(rotated, array.slice(0, offset));
    return rotated;
}
function createWithId() {
    return extendWithId([]);
}
function extendWithId(array) {
    const extended = array;
    extended.withId = withId;
    return extended;
}
/**
 * Finds and returns the first item with a matching ID.
 */
function findWithId(array, id) {
    for (let i = 0, len = array.length; i < len; i++) {
        const item = array[i];
        if (item.id === id)
            return item;
    }
}
function withId(id) {
    return findWithId(this, id);
}
function createWithName() {
    return extendWithName([]);
}
function extendWithName(array) {
    const extended = array;
    extended.withName = withName;
    return extended;
}
function findItemWithName(array, name) {
    const index = indexWithName(array, name);
    if (index >= 0)
        return array[index];
}
function indexWithName(array, name) {
    for (let i = 0, len = array.length; i < len; i++) {
        const item = array[i];
        if (item.name === name)
            return i;
    }
    return -1;
}
/**
 * Inserts a number in sorted order into a list of numbers already in sorted order.
 * @returns True if the item was added, false if it already existed.
 */
function insertSorted(list, value) {
    const len = list.length;
    // NOTE: iterate backwards because incoming values tend to be sorted already.
    for (let i = len - 1; i >= 0; i--) {
        const diff = list[i] - value;
        if (diff === 0)
            return false;
        if (diff > 0)
            continue;
        // diff < 0
        list.splice(i + 1, 0, value);
        return true;
    }
    list.unshift(value);
    return true;
}
/**
 * Removes the first occurrence of a value from a list if it exists.
 * @returns True if the value was removed, false if it did not exist in the list.
 */
function removeFirst(list, value) {
    const index = list.indexOf(value);
    if (index < 0)
        return false;
    list.splice(index, 1);
    return true;
}
/**
 * Finds and returns the first item with a matching name.
 */
function withName(name) {
    return findItemWithName(this, name);
}
/**
 * Deletes all items from the array.
 */
function clear(array) {
    if (!array)
        return;
    while (array.length > 0)
        array.pop();
}
function isUndefinedOrEmpty(array) {
    if (!array || array.length === 0) {
        return true;
    }
    return false;
}
function swap(array, firstIndex, secondIndex) {
    const temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}
function isInArray(array, lookupItem, compareCallback) {
    return array.some(item => compareCallback(item, lookupItem));
}
/** Checks if the given object is an Array, and looking all the way up the prototype chain. */
function isArrayOrInheritedArray(obj) {
    let nextPrototype = obj;
    while (nextPrototype != null) {
        if (Array.isArray(nextPrototype))
            return true;
        nextPrototype = Object.getPrototypeOf(nextPrototype);
    }
    return false;
}
/**
 * Returns true if the specified values array is sorted in an order as determined by the specified compareFunction.
 */
function isSorted(values, compareFunction) {
    const ilen = values.length;
    if (ilen >= 2) {
        for (let i = 1; i < ilen; i++) {
            if (compareFunction(values[i - 1], values[i]) > 0) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Returns true if the specified number values array is sorted in ascending order
 * (or descending order if the specified descendingOrder is truthy).
 */
function isSortedNumeric(values, descendingOrder) {
    const compareFunction = descendingOrder ?
        (a, b) => b - a :
        (a, b) => a - b;
    return isSorted(values, compareFunction);
}
/**
 * Ensures that the given T || T[] is in array form, either returning the array or
 * converting single items into an array of length one.
 */
function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
//# sourceMappingURL=arrayExtensions.js.map

/***/ }),

/***/ 4932:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
/* eslint-disable no-useless-escape */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fixDateTimeFormat = exports.findDateFormat = void 0;
var regexCache;
/**
 * Translate .NET format into something supported by Globalize.
 */
function findDateFormat(value, format, cultureName) {
    switch (format) {
        case "m":
            // Month + day
            format = "M";
            break;
        case "O":
        case "o":
            // Roundtrip
            format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
            break;
        case "R":
        case "r":
            // RFC1123 pattern - - time must be converted to UTC before formatting
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
            break;
        case "s":
            // Sortable - should use invariant culture
            format = "S";
            break;
        case "u":
            // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
            break;
        case "U":
            // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "F";
            break;
        case "y":
        case "Y":
            // Year and month
            switch (cultureName) {
                case "default":
                case "en":
                case "en-US":
                    format = "MMMM, yyyy"; // Fix the default year-month pattern for english
                    break;
                default:
                    format = "Y"; // For other cultures - use the localized pattern
            }
            break;
    }
    return { value: value, format: format };
}
exports.findDateFormat = findDateFormat;
/**
 * Translates unsupported .NET custom format expressions to the custom expressions supported by Globalize.
 */
function fixDateTimeFormat(format) {
    // Fix for the "K" format (timezone):
    // T he js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
    format = format.replace(/%K/g, "zzz");
    format = format.replace(/K/g, "zzz");
    format = format.replace(/fffffff/g, "fff0000");
    format = format.replace(/ffffff/g, "fff000");
    format = format.replace(/fffff/g, "fff00");
    format = format.replace(/ffff/g, "fff0");
    // Fix for the 5 digit year: "yyyyy" format.
    // The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
    format = format.replace(/yyyyy/g, "0yyyy");
    // Fix for the 3 digit year: "yyy" format.
    // The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
    format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");
    if (!regexCache) {
        // Creating Regexes for cases "Using single format specifier"
        // - http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
        // This is not supported from The Globalize.
        // The case covers all single "%" lead specifier (like "%d" but not %dd)
        // The cases as single "%d" are filtered in if the bellow.
        // (?!S) where S is the specifier make sure that we only one symbol for specifier.
        regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map(function (s) {
            return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
        });
    }
    if (format.indexOf("%") !== -1 && format.length > 2) {
        for (var i = 0; i < regexCache.length; i++) {
            format = format.replace(regexCache[i].r, regexCache[i].s);
        }
    }
    return format;
}
exports.fixDateTimeFormat = fixDateTimeFormat;
//# sourceMappingURL=formatting.js.map

/***/ }),

/***/ 5038:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   equals: () => (/* binding */ equals)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Performs JSON-style comparison of two objects.
 */
function equals(x, y) {
    if (x === y)
        return true;
    return JSON.stringify(x) === JSON.stringify(y);
}
//# sourceMappingURL=jsonComparer.js.map

/***/ }),

/***/ 5062:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateExactDigitsPrecision = exports.getDisplayUnits = exports.formatListOr = exports.formatListAnd = exports.getFormatStringByColumn = exports.getFormatString = exports.createDisplayUnitSystem = exports.formatVariantMeasureValue = exports.format = exports.create = exports.checkValueInBounds = exports.createDefaultFormatter = exports.setLocaleOptions = exports.getFormatMetadata = exports.getLocalizedString = exports.DefaultDateFormat = exports.DefaultNumericFormat = exports.DefaultIntegerFormat = void 0;
var displayUnitSystem_1 = __webpack_require__(3224);
var displayUnitSystemType_1 = __webpack_require__(1520);
var stringExtensions = __webpack_require__(1248);
var formattingService_1 = __webpack_require__(3100);
var dateTimeSequence_1 = __webpack_require__(7630);
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2087);
var powerbi_visuals_utils_dataviewutils_1 = __webpack_require__(9933);
// powerbi.extensibility.utils.type
var ValueType = powerbi_visuals_utils_typeutils_1.valueType.ValueType;
var PrimitiveType = powerbi_visuals_utils_typeutils_1.valueType.PrimitiveType;
var StringExtensions = stringExtensions;
var BeautifiedFormat = {
    "0.00 %;-0.00 %;0.00 %": "Percentage",
    "0.0 %;-0.0 %;0.0 %": "Percentage1",
};
exports.DefaultIntegerFormat = "g";
exports.DefaultNumericFormat = "#,0.00";
exports.DefaultDateFormat = "d";
var defaultLocalizedStrings = {
    "NullValue": "(Blank)",
    "BooleanTrue": "True",
    "BooleanFalse": "False",
    "NaNValue": "NaN",
    "InfinityValue": "+Infinity",
    "NegativeInfinityValue": "-Infinity",
    "RestatementComma": "{0}, {1}",
    "RestatementCompoundAnd": "{0} and {1}",
    "RestatementCompoundOr": "{0} or {1}",
    "DisplayUnitSystem_EAuto_Title": "Auto",
    "DisplayUnitSystem_E0_Title": "None",
    "DisplayUnitSystem_E3_LabelFormat": "{0}K",
    "DisplayUnitSystem_E3_Title": "Thousands",
    "DisplayUnitSystem_E6_LabelFormat": "{0}M",
    "DisplayUnitSystem_E6_Title": "Millions",
    "DisplayUnitSystem_E9_LabelFormat": "{0}bn",
    "DisplayUnitSystem_E9_Title": "Billions",
    "DisplayUnitSystem_E12_LabelFormat": "{0}T",
    "DisplayUnitSystem_E12_Title": "Trillions",
    "Percentage": "#,0.##%",
    "Percentage1": "#,0.#%",
    "TableTotalLabel": "Total",
    "Tooltip_HighlightedValueDisplayName": "Highlighted",
    "Funnel_PercentOfFirst": "Percent of first",
    "Funnel_PercentOfPrevious": "Percent of previous",
    "Funnel_PercentOfFirst_Highlight": "Percent of first (highlighted)",
    "Funnel_PercentOfPrevious_Highlight": "Percent of previous (highlighted)",
    // Geotagging strings
    "GeotaggingString_Continent": "continent",
    "GeotaggingString_Continents": "continents",
    "GeotaggingString_Country": "country",
    "GeotaggingString_Countries": "countries",
    "GeotaggingString_State": "state",
    "GeotaggingString_States": "states",
    "GeotaggingString_City": "city",
    "GeotaggingString_Cities": "cities",
    "GeotaggingString_Town": "town",
    "GeotaggingString_Towns": "towns",
    "GeotaggingString_Province": "province",
    "GeotaggingString_Provinces": "provinces",
    "GeotaggingString_County": "county",
    "GeotaggingString_Counties": "counties",
    "GeotaggingString_Village": "village",
    "GeotaggingString_Villages": "villages",
    "GeotaggingString_Post": "post",
    "GeotaggingString_Zip": "zip",
    "GeotaggingString_Code": "code",
    "GeotaggingString_Place": "place",
    "GeotaggingString_Places": "places",
    "GeotaggingString_Address": "address",
    "GeotaggingString_Addresses": "addresses",
    "GeotaggingString_Street": "street",
    "GeotaggingString_Streets": "streets",
    "GeotaggingString_Longitude": "longitude",
    "GeotaggingString_Longitude_Short": "lon",
    "GeotaggingString_Longitude_Short2": "long",
    "GeotaggingString_Latitude": "latitude",
    "GeotaggingString_Latitude_Short": "lat",
    "GeotaggingString_PostalCode": "postal code",
    "GeotaggingString_PostalCodes": "postal codes",
    "GeotaggingString_ZipCode": "zip code",
    "GeotaggingString_ZipCodes": "zip codes",
    "GeotaggingString_Territory": "territory",
    "GeotaggingString_Territories": "territories",
};
function beautify(format) {
    var key = BeautifiedFormat[format];
    if (key)
        return defaultLocalizedStrings[key] || format;
    return format;
}
function describeUnit(exponent) {
    var exponentLookup = (exponent === -1) ? "Auto" : exponent.toString();
    var title = defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_Title"];
    var format = (exponent <= 0) ? "{0}" : defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_LabelFormat"];
    if (title || format)
        return { title: title, format: format };
}
function getLocalizedString(stringId) {
    return defaultLocalizedStrings[stringId];
}
exports.getLocalizedString = getLocalizedString;
// NOTE: Define default locale options, but these can be overriden by setLocaleOptions.
var localizationOptions = {
    nullValue: defaultLocalizedStrings["NullValue"],
    trueValue: defaultLocalizedStrings["BooleanTrue"],
    falseValue: defaultLocalizedStrings["BooleanFalse"],
    NaN: defaultLocalizedStrings["NaNValue"],
    infinity: defaultLocalizedStrings["InfinityValue"],
    negativeInfinity: defaultLocalizedStrings["NegativeInfinityValue"],
    beautify: function (format) { return beautify(format); },
    describe: function (exponent) { return describeUnit(exponent); },
    restatementComma: defaultLocalizedStrings["RestatementComma"],
    restatementCompoundAnd: defaultLocalizedStrings["RestatementCompoundAnd"],
    restatementCompoundOr: defaultLocalizedStrings["RestatementCompoundOr"],
};
var MaxScaledDecimalPlaces = 2;
var MaxValueForDisplayUnitRounding = 1000;
var MinIntegerValueForDisplayUnits = 10000;
var MinPrecisionForDisplayUnits = 2;
var DateTimeMetadataColumn = {
    displayName: "",
    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
};
function getFormatMetadata(format) {
    return formattingService_1.numberFormat.getCustomFormatMetadata(format);
}
exports.getFormatMetadata = getFormatMetadata;
function setLocaleOptions(options) {
    localizationOptions = options;
    displayUnitSystem_1.DefaultDisplayUnitSystem.RESET();
    displayUnitSystem_1.WholeUnitsDisplayUnitSystem.RESET();
}
exports.setLocaleOptions = setLocaleOptions;
function createDefaultFormatter(formatString, allowFormatBeautification, cultureSelector) {
    var formatBeautified = allowFormatBeautification
        ? localizationOptions.beautify(formatString)
        : formatString;
    return {
        format: function (value) {
            if (value == null) {
                return localizationOptions.nullValue;
            }
            return formatCore({
                value: value,
                cultureSelector: cultureSelector,
                format: formatBeautified
            });
        }
    };
}
exports.createDefaultFormatter = createDefaultFormatter;
/**
 * Check that provided value is in provided bounds. If not -- replace it by minimal or maximal replacement value
 * @param targetNum checking value
 * @param min minimal bound of value
 * @param max maximal bound of value
 * @param lessMinReplacement value that will be returned if checking value is lesser than minimal
 * @param greaterMaxReplacement value that will be returned if checking value is greater than maximal
 */
function checkValueInBounds(targetNum, min, max, lessMinReplacement, greaterMaxReplacement) {
    if (lessMinReplacement === void 0) { lessMinReplacement = min; }
    if (greaterMaxReplacement === void 0) { greaterMaxReplacement = max; }
    if (max !== undefined && max !== null) {
        targetNum = targetNum <= max ? targetNum : greaterMaxReplacement;
    }
    if (min !== undefined && min !== null) {
        targetNum = targetNum > min ? targetNum : lessMinReplacement;
    }
    return targetNum;
}
exports.checkValueInBounds = checkValueInBounds;
// Creates an IValueFormatter to be used for a range of values.
function create(options) {
    var format = options.allowFormatBeautification
        ? localizationOptions.beautify(options.format)
        : options.format;
    var cultureSelector = options.cultureSelector;
    if (shouldUseNumericDisplayUnits(options)) {
        var displayUnitSystem_2 = createDisplayUnitSystem(options.displayUnitSystemType);
        var singleValueFormattingMode_1 = !!options.formatSingleValues;
        displayUnitSystem_2.update(Math.max(Math.abs(options.value || 0), Math.abs(options.value2 || 0)));
        var forcePrecision_1 = options.precision != null;
        var decimals_1;
        if (forcePrecision_1)
            decimals_1 = -options.precision;
        else if (displayUnitSystem_2.displayUnit && displayUnitSystem_2.displayUnit.value > 1)
            decimals_1 = -MaxScaledDecimalPlaces;
        return {
            format: function (value) {
                var formattedValue = getStringFormat(value, true /*nullsAreBlank*/);
                if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
                    return formattedValue;
                }
                // Round to Double.DEFAULT_PRECISION
                if (value
                    && !displayUnitSystem_2.isScalingUnit()
                    && Math.abs(value) < MaxValueForDisplayUnitRounding
                    && !forcePrecision_1) {
                    value = powerbi_visuals_utils_typeutils_1.double.roundToPrecision(value);
                }
                if (singleValueFormattingMode_1) {
                    return displayUnitSystem_2.formatSingleValue(value, format, decimals_1, forcePrecision_1, cultureSelector);
                }
                else {
                    return displayUnitSystem_2.format(value, format, decimals_1, forcePrecision_1, cultureSelector);
                }
            },
            displayUnit: displayUnitSystem_2.displayUnit,
            options: options
        };
    }
    if (shouldUseDateUnits(options.value, options.value2, options.tickCount)) {
        var unit_1 = dateTimeSequence_1.DateTimeSequence.GET_INTERVAL_UNIT(options.value /* minDate */, options.value2 /* maxDate */, options.tickCount);
        return {
            format: function (value) {
                if (value == null) {
                    return localizationOptions.nullValue;
                }
                var formatString = formattingService_1.formattingService.dateFormatString(unit_1);
                return formatCore({
                    value: value,
                    cultureSelector: cultureSelector,
                    format: formatString,
                });
            },
            options: options
        };
    }
    return createDefaultFormatter(format, false, cultureSelector);
}
exports.create = create;
function format(value, format, allowFormatBeautification, cultureSelector) {
    if (value == null) {
        return localizationOptions.nullValue;
    }
    var formatString = allowFormatBeautification
        ? localizationOptions.beautify(format)
        : format;
    return formatCore({
        value: value,
        cultureSelector: cultureSelector,
        format: formatString
    });
}
exports.format = format;
/**
 * Value formatting function to handle variant measures.
 * For a Date/Time value within a non-date/time field, it's formatted with the default date/time formatString instead of as a number
 * @param {any} value Value to be formatted
 * @param {DataViewMetadataColumn} column Field which the value belongs to
 * @param {DataViewObjectPropertyIdentifier} formatStringProp formatString Property ID
 * @param {boolean} nullsAreBlank? Whether to show "(Blank)" instead of empty string for null values
 * @returns Formatted value
 */
function formatVariantMeasureValue(value, column, formatStringProp, nullsAreBlank, cultureSelector) {
    // If column type is not datetime, but the value is of time datetime,
    // then use the default date format string
    if (!(column && column.type && column.type.dateTime) && value instanceof Date) {
        var valueFormat = getFormatString(DateTimeMetadataColumn, null, false);
        return formatCore({
            value: value,
            nullsAreBlank: nullsAreBlank,
            cultureSelector: cultureSelector,
            format: valueFormat
        });
    }
    else {
        var valueFormat = getFormatString(column, formatStringProp);
        return formatCore({
            value: value,
            nullsAreBlank: nullsAreBlank,
            cultureSelector: cultureSelector,
            format: valueFormat
        });
    }
}
exports.formatVariantMeasureValue = formatVariantMeasureValue;
function createDisplayUnitSystem(displayUnitSystemType) {
    if (displayUnitSystemType == null)
        return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
    switch (displayUnitSystemType) {
        case displayUnitSystemType_1.DisplayUnitSystemType.Default:
            return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
        case displayUnitSystemType_1.DisplayUnitSystemType.WholeUnits:
            return new displayUnitSystem_1.WholeUnitsDisplayUnitSystem(localizationOptions.describe);
        case displayUnitSystemType_1.DisplayUnitSystemType.Verbose:
            return new displayUnitSystem_1.NoDisplayUnitSystem();
        case displayUnitSystemType_1.DisplayUnitSystemType.DataLabels:
            return new displayUnitSystem_1.DataLabelsDisplayUnitSystem(localizationOptions.describe);
        default:
            return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
    }
}
exports.createDisplayUnitSystem = createDisplayUnitSystem;
function shouldUseNumericDisplayUnits(options) {
    var value = options.value;
    var value2 = options.value2;
    var format = options.format;
    // For singleValue visuals like card, gauge we don't want to roundoff data to the nearest thousands so format the whole number / integers below 10K to not use display units
    if (options.formatSingleValues && format) {
        if (Math.abs(value) < MinIntegerValueForDisplayUnits) {
            var isCustomFormat = !formattingService_1.numberFormat.isStandardFormat(format);
            if (isCustomFormat) {
                var precision = formattingService_1.numberFormat.getCustomFormatMetadata(format, true /*calculatePrecision*/).precision;
                if (precision < MinPrecisionForDisplayUnits)
                    return false;
            }
            else if (powerbi_visuals_utils_typeutils_1.double.isInteger(value))
                return false;
        }
    }
    if ((typeof value === "number") || (typeof value2 === "number")) {
        return true;
    }
}
function shouldUseDateUnits(value, value2, tickCount) {
    // must check both value and value2 because we'll need to get an interval for date units
    return (value instanceof Date) && (value2 instanceof Date) && (tickCount !== undefined && tickCount !== null);
}
/*
    * Get the column format. Order of precendence is:
    *  1. Column format
    *  2. Default PowerView policy for column type
    */
function getFormatString(column, formatStringProperty, suppressTypeFallback) {
    if (column) {
        if (formatStringProperty) {
            var propertyValue = powerbi_visuals_utils_dataviewutils_1.dataViewObjects.getValue(column.objects, formatStringProperty);
            if (propertyValue)
                return propertyValue;
        }
        if (!suppressTypeFallback) {
            var columnType = column.type;
            if (columnType) {
                if (columnType.dateTime)
                    return exports.DefaultDateFormat;
                if (columnType.integer) {
                    if (columnType.temporal && columnType.temporal.year)
                        return "0";
                    return exports.DefaultIntegerFormat;
                }
                if (columnType.numeric)
                    return exports.DefaultNumericFormat;
            }
        }
    }
}
exports.getFormatString = getFormatString;
function getFormatStringByColumn(column, suppressTypeFallback) {
    if (column) {
        if (column.format) {
            return column.format;
        }
        if (!suppressTypeFallback) {
            var columnType = column.type;
            if (columnType) {
                if (columnType.dateTime) {
                    return exports.DefaultDateFormat;
                }
                if (columnType.integer) {
                    if (columnType.temporal && columnType.temporal.year) {
                        return "0";
                    }
                    return exports.DefaultIntegerFormat;
                }
                if (columnType.numeric) {
                    return exports.DefaultNumericFormat;
                }
            }
        }
    }
    return undefined;
}
exports.getFormatStringByColumn = getFormatStringByColumn;
function formatListCompound(strings, conjunction) {
    var result;
    if (!strings) {
        return null;
    }
    var length = strings.length;
    if (length > 0) {
        result = strings[0];
        var lastIndex = length - 1;
        for (var i = 1, len = lastIndex; i < len; i++) {
            var value = strings[i];
            result = StringExtensions.format(localizationOptions.restatementComma, result, value);
        }
        if (length > 1) {
            var value = strings[lastIndex];
            result = StringExtensions.format(conjunction, result, value);
        }
    }
    else {
        result = null;
    }
    return result;
}
// The returned string will look like 'A, B, ..., and C'
function formatListAnd(strings) {
    return formatListCompound(strings, localizationOptions.restatementCompoundAnd);
}
exports.formatListAnd = formatListAnd;
// The returned string will look like 'A, B, ..., or C'
function formatListOr(strings) {
    return formatListCompound(strings, localizationOptions.restatementCompoundOr);
}
exports.formatListOr = formatListOr;
function formatCore(options) {
    var value = options.value, format = options.format, nullsAreBlank = options.nullsAreBlank, cultureSelector = options.cultureSelector;
    var formattedValue = getStringFormat(value, nullsAreBlank ? nullsAreBlank : false);
    if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
        return formattedValue;
    }
    return formattingService_1.formattingService.formatValue(value, format, cultureSelector);
}
function getStringFormat(value, nullsAreBlank) {
    if (value == null && nullsAreBlank) {
        return localizationOptions.nullValue;
    }
    if (value === true) {
        return localizationOptions.trueValue;
    }
    if (value === false) {
        return localizationOptions.falseValue;
    }
    if (typeof value === "number" && isNaN(value)) {
        return localizationOptions.NaN;
    }
    if (value === Number.NEGATIVE_INFINITY) {
        return localizationOptions.negativeInfinity;
    }
    if (value === Number.POSITIVE_INFINITY) {
        return localizationOptions.infinity;
    }
    return "";
}
function getDisplayUnits(displayUnitSystemType) {
    var displayUnitSystem = createDisplayUnitSystem(displayUnitSystemType);
    return displayUnitSystem.units;
}
exports.getDisplayUnits = getDisplayUnits;
/**
 * Precision calculating function to build values showing minimum 3 digits as 3.56 or 25.7 or 754 or 2345
 * @param {number} inputValue Value to be basement for precision calculation
 * @param {string} format Format that will be used for value formatting (to detect percentage values)
 * @param {number} displayUnits Dispaly units that will be used for value formatting (to correctly calculate precision)
 * @param {number} digitsNum Number of visible digits, including digits before separator
 * @returns calculated precision
 */
function calculateExactDigitsPrecision(inputValue, format, displayUnits, digitsNum) {
    if (!inputValue && inputValue !== 0) {
        return 0;
    }
    var precision = 0;
    var inPercent = format && format.indexOf("%") !== -1;
    var value = inPercent ? inputValue * 100 : inputValue;
    value = displayUnits > 0 ? value / displayUnits : value;
    var leftPartLength = parseInt(value).toString().length;
    if ((inPercent || displayUnits > 0) && leftPartLength >= digitsNum) {
        return 0;
    }
    // Auto units, calculate final value 
    if (displayUnits === 0) {
        var unitsDegree = Math.floor(leftPartLength / 3);
        unitsDegree = leftPartLength % 3 === 0 ? unitsDegree - 1 : unitsDegree;
        var divider = Math.pow(1000, unitsDegree);
        if (divider > 0) {
            value = value / divider;
        }
    }
    leftPartLength = parseInt(value).toString().length;
    var restOfDiv = leftPartLength % digitsNum;
    if (restOfDiv === 0) {
        precision = 0;
    }
    else {
        precision = digitsNum - restOfDiv;
    }
    return precision;
}
exports.calculateExactDigitsPrecision = calculateExactDigitsPrecision;
//# sourceMappingURL=valueFormatter.js.map

/***/ }),

/***/ 5079:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromPoint: () => (/* binding */ fromPoint),
/* harmony export */   fromPointToPixel: () => (/* binding */ fromPointToPixel),
/* harmony export */   toPoint: () => (/* binding */ toPoint),
/* harmony export */   toString: () => (/* binding */ toString)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
const PxPtRatio = 4 / 3;
const PixelString = "px";
/**
 * Appends 'px' to the end of number value for use as pixel string in styles
 */
function toString(px) {
    return px + PixelString;
}
/**
 * Converts point value (pt) to pixels
 * Returns a string for font-size property
 * e.g. fromPoint(8) => '24px'
 */
function fromPoint(pt) {
    return toString(fromPointToPixel(pt));
}
/**
 * Converts point value (pt) to pixels
 * Returns a number for font-size property
 * e.g. fromPoint(8) => 24px
 */
function fromPointToPixel(pt) {
    return (PxPtRatio * pt);
}
/**
 * Converts pixel value (px) to pt
 * e.g. toPoint(24) => 8
 */
function toPoint(px) {
    return px / PxPtRatio;
}
//# sourceMappingURL=pixelConverter.js.map

/***/ }),

/***/ 5165:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCategoryIndexOfRole: () => (/* binding */ getCategoryIndexOfRole),
/* harmony export */   getMeasureIndexOfRole: () => (/* binding */ getMeasureIndexOfRole),
/* harmony export */   hasRole: () => (/* binding */ hasRole),
/* harmony export */   hasRoleInDataView: () => (/* binding */ hasRoleInDataView),
/* harmony export */   hasRoleInValueColumn: () => (/* binding */ hasRoleInValueColumn)
/* harmony export */ });
function getMeasureIndexOfRole(grouped, roleName) {
    if (!grouped || !grouped.length) {
        return -1;
    }
    const firstGroup = grouped[0];
    if (firstGroup.values && firstGroup.values.length > 0) {
        for (let i = 0, len = firstGroup.values.length; i < len; ++i) {
            const value = firstGroup.values[i];
            if (value && value.source) {
                if (hasRole(value.source, roleName)) {
                    return i;
                }
            }
        }
    }
    return -1;
}
function getCategoryIndexOfRole(categories, roleName) {
    if (categories && categories.length) {
        for (let i = 0, ilen = categories.length; i < ilen; i++) {
            if (hasRole(categories[i].source, roleName)) {
                return i;
            }
        }
    }
    return -1;
}
function hasRole(column, name) {
    const roles = column.roles;
    return roles && roles[name];
}
function hasRoleInDataView(dataView, name) {
    return dataView != null
        && dataView.metadata != null
        && dataView.metadata.columns
        && dataView.metadata.columns.some((c) => c.roles && c.roles[name] !== undefined); // any is an alias of some
}
function hasRoleInValueColumn(valueColumn, name) {
    return valueColumn
        && valueColumn.source
        && valueColumn.source.roles
        && (valueColumn.source.roles[name] === true);
}
//# sourceMappingURL=dataRoleHelper.js.map

/***/ }),

/***/ 5442:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PRECISION: () => (/* binding */ DEFAULT_PRECISION),
/* harmony export */   DEFAULT_PRECISION_IN_DECIMAL_DIGITS: () => (/* binding */ DEFAULT_PRECISION_IN_DECIMAL_DIGITS),
/* harmony export */   EPSILON: () => (/* binding */ EPSILON),
/* harmony export */   LOG_E_10: () => (/* binding */ LOG_E_10),
/* harmony export */   MAX_EXP: () => (/* binding */ MAX_EXP),
/* harmony export */   MAX_VALUE: () => (/* binding */ MAX_VALUE),
/* harmony export */   MIN_EXP: () => (/* binding */ MIN_EXP),
/* harmony export */   MIN_VALUE: () => (/* binding */ MIN_VALUE),
/* harmony export */   NEGATIVE_POWERS: () => (/* binding */ NEGATIVE_POWERS),
/* harmony export */   POSITIVE_POWERS: () => (/* binding */ POSITIVE_POWERS),
/* harmony export */   ceilToPrecision: () => (/* binding */ ceilToPrecision),
/* harmony export */   ceilWithPrecision: () => (/* binding */ ceilWithPrecision),
/* harmony export */   detectPrecision: () => (/* binding */ detectPrecision),
/* harmony export */   ensureInRange: () => (/* binding */ ensureInRange),
/* harmony export */   equalWithPrecision: () => (/* binding */ equalWithPrecision),
/* harmony export */   floorToPrecision: () => (/* binding */ floorToPrecision),
/* harmony export */   floorWithPrecision: () => (/* binding */ floorWithPrecision),
/* harmony export */   getPrecision: () => (/* binding */ getPrecision),
/* harmony export */   greaterOrEqualWithPrecision: () => (/* binding */ greaterOrEqualWithPrecision),
/* harmony export */   greaterWithPrecision: () => (/* binding */ greaterWithPrecision),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   lessOrEqualWithPrecision: () => (/* binding */ lessOrEqualWithPrecision),
/* harmony export */   lessWithPrecision: () => (/* binding */ lessWithPrecision),
/* harmony export */   log10: () => (/* binding */ log10),
/* harmony export */   pow10: () => (/* binding */ pow10),
/* harmony export */   project: () => (/* binding */ project),
/* harmony export */   removeDecimalNoise: () => (/* binding */ removeDecimalNoise),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   roundToPrecision: () => (/* binding */ roundToPrecision),
/* harmony export */   toIncrement: () => (/* binding */ toIncrement)
/* harmony export */ });
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
/**
 * Module Double contains a set of constants and precision based utility methods
 * for dealing with doubles and their decimal garbage in the javascript.
 */
// Constants.
const MIN_VALUE = -Number.MAX_VALUE;
const MAX_VALUE = Number.MAX_VALUE;
const MIN_EXP = -308;
const MAX_EXP = 308;
const EPSILON = 1E-323;
const DEFAULT_PRECISION = 0.0001;
const DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
const LOG_E_10 = Math.log(10);
const POSITIVE_POWERS = [
    1E0, 1E1, 1E2, 1E3, 1E4, 1E5, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20, 1E21, 1E22, 1E23, 1E24, 1E25, 1E26, 1E27, 1E28, 1E29, 1E30, 1E31, 1E32, 1E33, 1E34, 1E35, 1E36, 1E37, 1E38, 1E39, 1E40, 1E41, 1E42, 1E43, 1E44, 1E45, 1E46, 1E47, 1E48, 1E49, 1E50, 1E51, 1E52, 1E53, 1E54, 1E55, 1E56, 1E57, 1E58, 1E59, 1E60, 1E61, 1E62, 1E63, 1E64, 1E65, 1E66, 1E67, 1E68, 1E69, 1E70, 1E71, 1E72, 1E73, 1E74, 1E75, 1E76, 1E77, 1E78, 1E79, 1E80, 1E81, 1E82, 1E83, 1E84, 1E85, 1E86, 1E87, 1E88, 1E89, 1E90, 1E91, 1E92, 1E93, 1E94, 1E95, 1E96, 1E97, 1E98, 1E99,
    1E100, 1E101, 1E102, 1E103, 1E104, 1E105, 1E106, 1E107, 1E108, 1E109, 1E110, 1E111, 1E112, 1E113, 1E114, 1E115, 1E116, 1E117, 1E118, 1E119, 1E120, 1E121, 1E122, 1E123, 1E124, 1E125, 1E126, 1E127, 1E128, 1E129, 1E130, 1E131, 1E132, 1E133, 1E134, 1E135, 1E136, 1E137, 1E138, 1E139, 1E140, 1E141, 1E142, 1E143, 1E144, 1E145, 1E146, 1E147, 1E148, 1E149, 1E150, 1E151, 1E152, 1E153, 1E154, 1E155, 1E156, 1E157, 1E158, 1E159, 1E160, 1E161, 1E162, 1E163, 1E164, 1E165, 1E166, 1E167, 1E168, 1E169, 1E170, 1E171, 1E172, 1E173, 1E174, 1E175, 1E176, 1E177, 1E178, 1E179, 1E180, 1E181, 1E182, 1E183, 1E184, 1E185, 1E186, 1E187, 1E188, 1E189, 1E190, 1E191, 1E192, 1E193, 1E194, 1E195, 1E196, 1E197, 1E198, 1E199,
    1E200, 1E201, 1E202, 1E203, 1E204, 1E205, 1E206, 1E207, 1E208, 1E209, 1E210, 1E211, 1E212, 1E213, 1E214, 1E215, 1E216, 1E217, 1E218, 1E219, 1E220, 1E221, 1E222, 1E223, 1E224, 1E225, 1E226, 1E227, 1E228, 1E229, 1E230, 1E231, 1E232, 1E233, 1E234, 1E235, 1E236, 1E237, 1E238, 1E239, 1E240, 1E241, 1E242, 1E243, 1E244, 1E245, 1E246, 1E247, 1E248, 1E249, 1E250, 1E251, 1E252, 1E253, 1E254, 1E255, 1E256, 1E257, 1E258, 1E259, 1E260, 1E261, 1E262, 1E263, 1E264, 1E265, 1E266, 1E267, 1E268, 1E269, 1E270, 1E271, 1E272, 1E273, 1E274, 1E275, 1E276, 1E277, 1E278, 1E279, 1E280, 1E281, 1E282, 1E283, 1E284, 1E285, 1E286, 1E287, 1E288, 1E289, 1E290, 1E291, 1E292, 1E293, 1E294, 1E295, 1E296, 1E297, 1E298, 1E299,
    1E300, 1E301, 1E302, 1E303, 1E304, 1E305, 1E306, 1E307, 1E308
];
const NEGATIVE_POWERS = [
    1E0, 1E-1, 1E-2, 1E-3, 1E-4, 1E-5, 1E-6, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20, 1E-21, 1E-22, 1E-23, 1E-24, 1E-25, 1E-26, 1E-27, 1E-28, 1E-29, 1E-30, 1E-31, 1E-32, 1E-33, 1E-34, 1E-35, 1E-36, 1E-37, 1E-38, 1E-39, 1E-40, 1E-41, 1E-42, 1E-43, 1E-44, 1E-45, 1E-46, 1E-47, 1E-48, 1E-49, 1E-50, 1E-51, 1E-52, 1E-53, 1E-54, 1E-55, 1E-56, 1E-57, 1E-58, 1E-59, 1E-60, 1E-61, 1E-62, 1E-63, 1E-64, 1E-65, 1E-66, 1E-67, 1E-68, 1E-69, 1E-70, 1E-71, 1E-72, 1E-73, 1E-74, 1E-75, 1E-76, 1E-77, 1E-78, 1E-79, 1E-80, 1E-81, 1E-82, 1E-83, 1E-84, 1E-85, 1E-86, 1E-87, 1E-88, 1E-89, 1E-90, 1E-91, 1E-92, 1E-93, 1E-94, 1E-95, 1E-96, 1E-97, 1E-98, 1E-99,
    1E-100, 1E-101, 1E-102, 1E-103, 1E-104, 1E-105, 1E-106, 1E-107, 1E-108, 1E-109, 1E-110, 1E-111, 1E-112, 1E-113, 1E-114, 1E-115, 1E-116, 1E-117, 1E-118, 1E-119, 1E-120, 1E-121, 1E-122, 1E-123, 1E-124, 1E-125, 1E-126, 1E-127, 1E-128, 1E-129, 1E-130, 1E-131, 1E-132, 1E-133, 1E-134, 1E-135, 1E-136, 1E-137, 1E-138, 1E-139, 1E-140, 1E-141, 1E-142, 1E-143, 1E-144, 1E-145, 1E-146, 1E-147, 1E-148, 1E-149, 1E-150, 1E-151, 1E-152, 1E-153, 1E-154, 1E-155, 1E-156, 1E-157, 1E-158, 1E-159, 1E-160, 1E-161, 1E-162, 1E-163, 1E-164, 1E-165, 1E-166, 1E-167, 1E-168, 1E-169, 1E-170, 1E-171, 1E-172, 1E-173, 1E-174, 1E-175, 1E-176, 1E-177, 1E-178, 1E-179, 1E-180, 1E-181, 1E-182, 1E-183, 1E-184, 1E-185, 1E-186, 1E-187, 1E-188, 1E-189, 1E-190, 1E-191, 1E-192, 1E-193, 1E-194, 1E-195, 1E-196, 1E-197, 1E-198, 1E-199,
    1E-200, 1E-201, 1E-202, 1E-203, 1E-204, 1E-205, 1E-206, 1E-207, 1E-208, 1E-209, 1E-210, 1E-211, 1E-212, 1E-213, 1E-214, 1E-215, 1E-216, 1E-217, 1E-218, 1E-219, 1E-220, 1E-221, 1E-222, 1E-223, 1E-224, 1E-225, 1E-226, 1E-227, 1E-228, 1E-229, 1E-230, 1E-231, 1E-232, 1E-233, 1E-234, 1E-235, 1E-236, 1E-237, 1E-238, 1E-239, 1E-240, 1E-241, 1E-242, 1E-243, 1E-244, 1E-245, 1E-246, 1E-247, 1E-248, 1E-249, 1E-250, 1E-251, 1E-252, 1E-253, 1E-254, 1E-255, 1E-256, 1E-257, 1E-258, 1E-259, 1E-260, 1E-261, 1E-262, 1E-263, 1E-264, 1E-265, 1E-266, 1E-267, 1E-268, 1E-269, 1E-270, 1E-271, 1E-272, 1E-273, 1E-274, 1E-275, 1E-276, 1E-277, 1E-278, 1E-279, 1E-280, 1E-281, 1E-282, 1E-283, 1E-284, 1E-285, 1E-286, 1E-287, 1E-288, 1E-289, 1E-290, 1E-291, 1E-292, 1E-293, 1E-294, 1E-295, 1E-296, 1E-297, 1E-298, 1E-299,
    1E-300, 1E-301, 1E-302, 1E-303, 1E-304, 1E-305, 1E-306, 1E-307, 1E-308, 1E-309, 1E-310, 1E-311, 1E-312, 1E-313, 1E-314, 1E-315, 1E-316, 1E-317, 1E-318, 1E-319, 1E-320, 1E-321, 1E-322, 1E-323, 1E-324
];
/**
 * Returns powers of 10.
 * Unlike the Math.pow this function produces no decimal garbage.
 * @param exp Exponent.
 */
function pow10(exp) {
    // Positive & zero
    if (exp >= 0) {
        if (exp < POSITIVE_POWERS.length) {
            return POSITIVE_POWERS[exp];
        }
        else {
            return Infinity;
        }
    }
    // Negative
    exp = -exp;
    if (exp > 0 && exp < NEGATIVE_POWERS.length) { // if exp==int.MIN_VALUE then changing the sign will overflow and keep the number negative - we need to check for exp > 0 to filter out this corner case
        return NEGATIVE_POWERS[exp];
    }
    else {
        return 0;
    }
}
/**
 * Returns the 10 base logarithm of the number.
 * Unlike Math.log function this produces integer results with no decimal garbage.
 * @param val Positive value or zero.
 */
// eslint-disable-next-line max-lines-per-function
function log10(val) {
    // Fast Log10() algorithm
    if (val > 1 && val < 1E16) {
        if (val < 1E8) {
            if (val < 1E4) {
                if (val < 1E2) {
                    if (val < 1E1) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                }
                else {
                    if (val < 1E3) {
                        return 2;
                    }
                    else {
                        return 3;
                    }
                }
            }
            else {
                if (val < 1E6) {
                    if (val < 1E5) {
                        return 4;
                    }
                    else {
                        return 5;
                    }
                }
                else {
                    if (val < 1E7) {
                        return 6;
                    }
                    else {
                        return 7;
                    }
                }
            }
        }
        else {
            if (val < 1E12) {
                if (val < 1E10) {
                    if (val < 1E9) {
                        return 8;
                    }
                    else {
                        return 9;
                    }
                }
                else {
                    if (val < 1E11) {
                        return 10;
                    }
                    else {
                        return 11;
                    }
                }
            }
            else {
                if (val < 1E14) {
                    if (val < 1E13) {
                        return 12;
                    }
                    else {
                        return 13;
                    }
                }
                else {
                    if (val < 1E15) {
                        return 14;
                    }
                    else {
                        return 15;
                    }
                }
            }
        }
    }
    if (val > 1E-16 && val < 1) {
        if (val < 1E-8) {
            if (val < 1E-12) {
                if (val < 1E-14) {
                    if (val < 1E-15) {
                        return -16;
                    }
                    else {
                        return -15;
                    }
                }
                else {
                    if (val < 1E-13) {
                        return -14;
                    }
                    else {
                        return -13;
                    }
                }
            }
            else {
                if (val < 1E-10) {
                    if (val < 1E-11) {
                        return -12;
                    }
                    else {
                        return -11;
                    }
                }
                else {
                    if (val < 1E-9) {
                        return -10;
                    }
                    else {
                        return -9;
                    }
                }
            }
        }
        else {
            if (val < 1E-4) {
                if (val < 1E-6) {
                    if (val < 1E-7) {
                        return -8;
                    }
                    else {
                        return -7;
                    }
                }
                else {
                    if (val < 1E-5) {
                        return -6;
                    }
                    else {
                        return -5;
                    }
                }
            }
            else {
                if (val < 1E-2) {
                    if (val < 1E-3) {
                        return -4;
                    }
                    else {
                        return -3;
                    }
                }
                else {
                    if (val < 1E-1) {
                        return -2;
                    }
                    else {
                        return -1;
                    }
                }
            }
        }
    }
    // JS Math provides only natural log function so we need to calc the 10 base logarithm:
    // logb(x) = logk(x)/logk(b);
    const log10 = Math.log(val) / LOG_E_10;
    return floorWithPrecision(log10);
}
/**
 * Returns a power of 10 representing precision of the number based on the number of meaningful decimal digits.
 * For example the precision of 56,263.3767 with the 6 meaningful decimal digit is 0.1.
 * @param x Value.
 * @param decimalDigits How many decimal digits are meaningfull.
 */
function getPrecision(x, decimalDigits) {
    if (decimalDigits === undefined) {
        decimalDigits = DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
    }
    if (!x || !isFinite(x)) {
        return undefined;
    }
    const exp = log10(Math.abs(x));
    if (exp < MIN_EXP) {
        return 0;
    }
    const precisionExp = Math.max(exp - decimalDigits, -NEGATIVE_POWERS.length + 1);
    return pow10(precisionExp);
}
/**
 * Checks if a delta between 2 numbers is less than provided precision.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function equalWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x === y || Math.abs(x - y) < precision;
}
/**
 * Checks if a first value is less than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function lessWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x < y && Math.abs(x - y) > precision;
}
/**
 * Checks if a first value is less or equal than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function lessOrEqualWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x < y || Math.abs(x - y) < precision;
}
/**
 * Checks if a first value is greater than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function greaterWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x > y && Math.abs(x - y) > precision;
}
/**
 * Checks if a first value is greater or equal to another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function greaterOrEqualWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x > y || Math.abs(x - y) < precision;
}
/**
 * Floors the number unless it's withing the precision distance from the higher int.
 * @param x One value.
 * @param precision Precision value.
 */
function floorWithPrecision(x, precision) {
    precision = precision != null ? precision : DEFAULT_PRECISION;
    const roundX = Math.round(x);
    if (Math.abs(x - roundX) < precision) {
        return roundX;
    }
    else {
        return Math.floor(x);
    }
}
/**
 * Ceils the number unless it's withing the precision distance from the lower int.
 * @param x One value.
 * @param precision Precision value.
 */
function ceilWithPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    const roundX = Math.round(x);
    if (Math.abs(x - roundX) < precision) {
        return roundX;
    }
    else {
        return Math.ceil(x);
    }
}
/**
 * Floors the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 234,000.
 * @param x One value.
 * @param precision Precision value.
 */
function floorToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    return Math.floor(x / precision) * precision;
}
/**
 * Ceils the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 235,000.
 * @param x One value.
 * @param precision Precision value.
 */
function ceilToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    return Math.ceil(x / precision) * precision;
}
/**
 * Rounds the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 235,000.
 * @param x One value.
 * @param precision Precision value.
 */
function roundToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    let result = Math.round(x / precision) * precision;
    const decimalDigits = Math.round(log10(Math.abs(x)) - log10(precision)) + 1;
    if (decimalDigits > 0 && decimalDigits < 16) {
        result = parseFloat(result.toPrecision(decimalDigits));
    }
    return result;
}
/**
 * Returns the value making sure that it's restricted to the provided range.
 * @param x One value.
 * @param min Range min boundary.
 * @param max Range max boundary.
 */
function ensureInRange(x, min, max) {
    if (x === undefined || x === null) {
        return x;
    }
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}
/**
 * Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
 * @param x Value to round.
 */
function round(x) {
    return (0.5 + x) << 0;
}
/**
 * Projects the value from the source range into the target range.
 * @param value Value to project.
 * @param fromMin Minimum of the source range.
 * @param toMin Minimum of the target range.
 * @param toMax Maximum of the target range.
 */
function project(value, fromMin, fromSize, toMin, toSize) {
    if (fromSize === 0 || toSize === 0) {
        if (fromMin <= value && value <= fromMin + fromSize) {
            return toMin;
        }
        else {
            return NaN;
        }
    }
    const relativeX = (value - fromMin) / fromSize;
    const projectedX = toMin + relativeX * toSize;
    return projectedX;
}
/**
 * Removes decimal noise.
 * @param value Value to be processed.
 */
function removeDecimalNoise(value) {
    return roundToPrecision(value, getPrecision(value));
}
/**
 * Checks whether the number is integer.
 * @param value Value to be checked.
 */
function isInteger(value) {
    return value !== null && value % 1 === 0;
}
/**
 * Dividing by increment will give us count of increments
 * Round out the rough edges into even integer
 * Multiply back by increment to get rounded value
 * e.g. Rounder.toIncrement(0.647291, 0.05) => 0.65
 * @param value - value to round to nearest increment
 * @param increment - smallest increment to round toward
 */
function toIncrement(value, increment) {
    return Math.round(value / increment) * increment;
}
/**
 * Overrides the given precision with defaults if necessary. Exported only for tests
 *
 * precision defined returns precision
 * x defined with y undefined returns twelve digits of precision based on x
 * x defined but zero with y defined; returns twelve digits of precision based on y
 * x and y defined retursn twelve digits of precision based on the minimum of the two
 * if no applicable precision is found based on those (such as x and y being zero), the default precision is used
 */
function detectPrecision(precision, x, y) {
    if (precision !== undefined) {
        return precision;
    }
    let calculatedPrecision;
    if (!y) {
        calculatedPrecision = getPrecision(x);
    }
    else if (!x) {
        calculatedPrecision = getPrecision(y);
    }
    else {
        calculatedPrecision = getPrecision(Math.min(Math.abs(x), Math.abs(y)));
    }
    return calculatedPrecision || DEFAULT_PRECISION;
}
//# sourceMappingURL=double.js.map

/***/ }),

/***/ 5807:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitByWidth = exports.getMaxWordWidth = exports.wordCount = exports.hasBreakers = exports.find = void 0;
var SPACE = " ";
var BREAKERS_REGEX = /[\s\n]+/g;
function search(index, content, backward) {
    if (backward) {
        for (var i = index - 1; i > -1; i--) {
            if (hasBreakers(content[i]))
                return i + 1;
        }
    }
    else {
        for (var i = index, ilen = content.length; i < ilen; i++) {
            if (hasBreakers(content[i]))
                return i;
        }
    }
    return backward ? 0 : content.length;
}
/**
 * Find the word nearest the cursor specified within content
 * @param index - point within content to search forward/backward from
 * @param content - string to search
*/
function find(index, content) {
    var result = { start: 0, end: 0 };
    if (content.length === 0) {
        return result;
    }
    result.start = search(index, content, true);
    result.end = search(index, content, false);
    return result;
}
exports.find = find;
/**
 * Test for presence of breakers within content
 * @param content - string to test
*/
function hasBreakers(content) {
    BREAKERS_REGEX.lastIndex = 0;
    return BREAKERS_REGEX.test(content);
}
exports.hasBreakers = hasBreakers;
/**
 * Count the number of pieces when broken by BREAKERS_REGEX
 * ~2.7x faster than WordBreaker.split(content).length
 * @param content - string to break and count
*/
function wordCount(content) {
    var count = 1;
    BREAKERS_REGEX.lastIndex = 0;
    BREAKERS_REGEX.exec(content);
    while (BREAKERS_REGEX.lastIndex !== 0) {
        count++;
        BREAKERS_REGEX.exec(content);
    }
    return count;
}
exports.wordCount = wordCount;
function getMaxWordWidth(content, textWidthMeasurer, properties) {
    var words = split(content);
    var maxWidth = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var w = words_1[_i];
        properties.text = w;
        maxWidth = Math.max(maxWidth, textWidthMeasurer(properties));
    }
    return maxWidth;
}
exports.getMaxWordWidth = getMaxWordWidth;
function split(content) {
    return content.split(BREAKERS_REGEX);
}
function getWidth(content, properties, textWidthMeasurer) {
    properties.text = content;
    return textWidthMeasurer(properties);
}
function truncate(content, properties, truncator, maxWidth) {
    properties.text = content;
    return truncator(properties, maxWidth);
}
/**
 * Split content by breakers (words) and greedy fit as many words
 * into each index in the result based on max width and number of lines
 * e.g. Each index in result corresponds to a line of content
 *      when used by AxisHelper.LabelLayoutStrategy.wordBreak
 * @param content - string to split
 * @param properties - text properties to be used by @param:textWidthMeasurer
 * @param textWidthMeasurer - function to calculate width of given text content
 * @param maxWidth - maximum allowed width of text content in each result
 * @param maxNumLines - maximum number of results we will allow, valid values must be greater than 0
 * @param truncator - (optional) if specified, used as a function to truncate content to a given width
*/
function splitByWidth(content, properties, textWidthMeasurer, maxWidth, maxNumLines, truncator) {
    // Default truncator returns string as-is
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    truncator = truncator ? truncator : function (properties, maxWidth) { return properties.text; };
    var result = [];
    var words = split(content);
    var usedWidth = 0;
    var wordsInLine = [];
    for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
        var word = words_2[_i];
        // Last line? Just add whatever is left
        if ((maxNumLines > 0) && (result.length >= maxNumLines - 1)) {
            wordsInLine.push(word);
            continue;
        }
        // Determine width if we add this word
        // Account for SPACE we will add when joining...
        var wordWidth = wordsInLine.length === 0
            ? getWidth(word, properties, textWidthMeasurer)
            : getWidth(SPACE + word, properties, textWidthMeasurer);
        // If width would exceed max width,
        // then push used words and start new split result
        if (usedWidth + wordWidth > maxWidth) {
            // Word alone exceeds max width, just add it.
            if (wordsInLine.length === 0) {
                result.push(truncate(word, properties, truncator, maxWidth));
                usedWidth = 0;
                wordsInLine = [];
                continue;
            }
            result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
            usedWidth = 0;
            wordsInLine = [];
        }
        // ...otherwise, add word and continue
        wordsInLine.push(word);
        usedWidth += wordWidth;
    }
    // Push remaining words onto result (if any)
    if (wordsInLine && wordsInLine.length) {
        result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
    }
    return result;
}
exports.splitByWidth = splitByWidth;
//# sourceMappingURL=wordBreaker.js.map

/***/ }),

/***/ 5939:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextSizeMax: () => (/* binding */ TextSizeMax),
/* harmony export */   TextSizeMin: () => (/* binding */ TextSizeMin),
/* harmony export */   getScale: () => (/* binding */ getScale)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Values are in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
/**
 * Stored in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
const TextSizeMin = 8;
/**
 * Stored in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
const TextSizeMax = 40;
const TextSizeRange = TextSizeMax - TextSizeMin;
/**
 * Returns the percentage of this value relative to the TextSizeMax
 * @param textSize - should be given in terms of 'pt'
 */
function getScale(textSize) {
    return (textSize - TextSizeMin) / TextSizeRange;
}
//# sourceMappingURL=textSizeDefaults.js.map

/***/ }),

/***/ 6394:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.format = exports.canFormat = void 0;
var formatting_1 = __webpack_require__(4932);
var formattingEncoder = __webpack_require__(6459);
var stringExtensions = __webpack_require__(1248);
var globalize_1 = __webpack_require__(7717);
var _currentCachedFormat;
var _currentCachedProcessedFormat;
// Evaluates if the value can be formatted using the NumberFormat
function canFormat(value) {
    return value instanceof Date;
}
exports.canFormat = canFormat;
// Formats the date using provided format and culture
function format(value, format, culture) {
    format = format || "G";
    var isStandard = format.length === 1;
    try {
        if (isStandard) {
            return formatDateStandard(value, format, culture);
        }
        else {
            return formatDateCustom(value, format, culture);
        }
    }
    catch (e) {
        return formatDateStandard(value, "G", culture);
    }
}
exports.format = format;
// Formats the date using standard format expression
function formatDateStandard(value, format, culture) {
    // In order to provide parity with .NET we have to support additional set of DateTime patterns.
    var patterns = culture.calendar.patterns;
    // Extend supported set of patterns
    ensurePatterns(culture.calendar);
    // Handle extended set of formats
    var output = (0, formatting_1.findDateFormat)(value, format, culture.name);
    if (output.format.length === 1)
        format = patterns[output.format];
    else
        format = output.format;
    // need to revisit when globalization is enabled
    if (!culture) {
        culture = this.getCurrentCulture();
    }
    return globalize_1.Globalize.format(output.value, format, culture);
}
// Formats the date using custom format expression
function formatDateCustom(value, format, culture) {
    var result;
    var literals = [];
    format = formattingEncoder.preserveLiterals(format, literals);
    if (format.indexOf("F") > -1) {
        // F is not supported so we need to replace the F with f based on the milliseconds
        // Replace all sequences of F longer than 3 with "FFF"
        format = stringExtensions.replaceAll(format, "FFFF", "FFF");
        // Based on milliseconds update the format to use fff
        var milliseconds = value.getMilliseconds();
        if (milliseconds % 10 >= 1) {
            format = stringExtensions.replaceAll(format, "FFF", "fff");
        }
        format = stringExtensions.replaceAll(format, "FFF", "FF");
        if ((milliseconds % 100) / 10 >= 1) {
            format = stringExtensions.replaceAll(format, "FF", "ff");
        }
        format = stringExtensions.replaceAll(format, "FF", "F");
        if ((milliseconds % 1000) / 100 >= 1) {
            format = stringExtensions.replaceAll(format, "F", "f");
        }
        format = stringExtensions.replaceAll(format, "F", "");
        if (format === "" || format === "%")
            return "";
    }
    format = processCustomDateTimeFormat(format);
    result = globalize_1.Globalize.format(value, format, culture);
    result = localize(result, culture.calendar);
    result = formattingEncoder.restoreLiterals(result, literals, false);
    return result;
}
// Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
function processCustomDateTimeFormat(format) {
    if (format === _currentCachedFormat) {
        return _currentCachedProcessedFormat;
    }
    _currentCachedFormat = format;
    format = (0, formatting_1.fixDateTimeFormat)(format);
    _currentCachedProcessedFormat = format;
    return format;
}
// Localizes the time separator symbol
function localize(value, dictionary) {
    var timeSeparator = dictionary[":"];
    if (timeSeparator === ":") {
        return value;
    }
    var result = "";
    var count = value.length;
    for (var i = 0; i < count; i++) {
        var char = value.charAt(i);
        switch (char) {
            case ":":
                result += timeSeparator;
                break;
            default:
                result += char;
                break;
        }
    }
    return result;
}
function ensurePatterns(calendar) {
    var patterns = calendar.patterns;
    if (patterns["g"] === undefined) {
        patterns["g"] = patterns["f"].replace(patterns["D"], patterns["d"]); // Generic: Short date, short time
        patterns["G"] = patterns["F"].replace(patterns["D"], patterns["d"]); // Generic: Short date, long time
    }
}
//# sourceMappingURL=dateTimeFormat.js.map

/***/ }),

/***/ 6459:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.restoreLiterals = exports.preserveLiterals = exports.removeLiterals = void 0;
// quoted and escaped literal patterns
// NOTE: the final three cases match .NET behavior
var literalPatterns = [
    "'[^']*'",
    "\"[^\"]*\"",
    "\\\\.",
    "'[^']*$",
    "\"[^\"]*$",
    "\\\\$", // backslash at end of string
];
var literalMatcher = new RegExp(literalPatterns.join("|"), "g");
// Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
function removeLiterals(format) {
    literalMatcher.lastIndex = 0;
    // just in case consecutive non-literals have some meaning
    return format.replace(literalMatcher, "\uE100");
}
exports.removeLiterals = removeLiterals;
function preserveLiterals(format, literals) {
    literalMatcher.lastIndex = 0;
    for (;;) {
        var match = literalMatcher.exec(format);
        if (!match)
            break;
        var literal = match[0];
        var literalOffset = literalMatcher.lastIndex - literal.length;
        var token = String.fromCharCode(0xE100 + literals.length);
        literals.push(literal);
        format = format.substring(0, literalOffset) + token + format.substring(literalMatcher.lastIndex);
        // back to avoid skipping due to removed literal substring
        literalMatcher.lastIndex = literalOffset + 1;
    }
    return format;
}
exports.preserveLiterals = preserveLiterals;
function restoreLiterals(format, literals, quoted) {
    if (quoted === void 0) { quoted = true; }
    var count = literals.length;
    for (var i = 0; i < count; i++) {
        var token = String.fromCharCode(0xE100 + i);
        var literal = literals[i];
        if (!quoted) {
            // caller wants literals to be re-inserted without escaping
            var firstChar = literal[0];
            if (firstChar === "\\" || literal.length === 1 || literal[literal.length - 1] !== firstChar) {
                // either escaped literal OR quoted literal that's missing the trailing quote
                // in either case we only remove the leading character
                literal = literal.substring(1);
            }
            else {
                // so must be a quoted literal with both starting and ending quote
                literal = literal.substring(1, literal.length - 1);
            }
        }
        format = format.replace(token, literal);
    }
    return format;
}
exports.restoreLiterals = restoreLiterals;
//# sourceMappingURL=formattingEncoder.js.map

/***/ }),

/***/ 6573:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataViewObjectsParser: () => (/* binding */ DataViewObjectsParser)
/* harmony export */ });
/* harmony import */ var _dataViewObjects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8862);

class DataViewObjectsParser {
    static getDefault() {
        return new this();
    }
    static createPropertyIdentifier(objectName, propertyName) {
        return {
            objectName,
            propertyName
        };
    }
    static parse(dataView) {
        const dataViewObjectParser = this.getDefault();
        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
            return dataViewObjectParser;
        }
        const properties = dataViewObjectParser.getProperties();
        for (const objectName in properties) {
            for (const propertyName in properties[objectName]) {
                const defaultValue = dataViewObjectParser[objectName][propertyName];
                dataViewObjectParser[objectName][propertyName] = _dataViewObjects__WEBPACK_IMPORTED_MODULE_0__.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
            }
        }
        return dataViewObjectParser;
    }
    static isPropertyEnumerable(propertyName) {
        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
    }
    static enumerateObjectInstances(dataViewObjectParser, options) {
        const dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
        if (!dataViewProperties) {
            return [];
        }
        const instance = {
            objectName: options.objectName,
            selector: null,
            properties: {}
        };
        for (const key in dataViewProperties) {
            if (Object.prototype.hasOwnProperty.call(dataViewProperties, key)) {
                instance.properties[key] = dataViewProperties[key];
            }
        }
        return {
            instances: [instance]
        };
    }
    getProperties() {
        const properties = {}, objectNames = Object.keys(this);
        objectNames.forEach((objectName) => {
            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                const propertyNames = Object.keys(this[objectName]);
                properties[objectName] = {};
                propertyNames.forEach((propertyName) => {
                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                        properties[objectName][propertyName] =
                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                    }
                });
            }
        });
        return properties;
    }
}
DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
//# sourceMappingURL=dataViewObjectsParser.js.map

/***/ }),

/***/ 6667:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export FormattingSettingsService */
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9754);

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

/***/ 6721:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FamilyInfo = void 0;
var FamilyInfo = /** @class */ (function () {
    function FamilyInfo(families) {
        this.families = families;
    }
    Object.defineProperty(FamilyInfo.prototype, "family", {
        /**
         * Gets the first font "wf_" font family since it will always be loaded.
         */
        get: function () {
            return this.getFamily();
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Gets the first font family that matches regex (if provided).
    * Default regex looks for "wf_" fonts which are always loaded.
    */
    FamilyInfo.prototype.getFamily = function (regex) {
        if (regex === void 0) { regex = /^wf_/; }
        if (!this.families) {
            return null;
        }
        if (regex) {
            for (var _i = 0, _a = this.families; _i < _a.length; _i++) {
                var fontFamily = _a[_i];
                if (regex.test(fontFamily)) {
                    return fontFamily;
                }
            }
        }
        return this.families[0];
    };
    Object.defineProperty(FamilyInfo.prototype, "css", {
        /**
         * Gets the CSS string for the "font-family" CSS attribute.
         */
        get: function () {
            return this.getCSS();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the CSS string for the "font-family" CSS attribute.
     */
    FamilyInfo.prototype.getCSS = function () {
        return this.families ? this.families.map((function (font) { return font.indexOf(" ") > 0 ? "'" + font + "'" : font; })).join(", ") : null;
    };
    return FamilyInfo;
}());
exports.FamilyInfo = FamilyInfo;
//# sourceMappingURL=familyInfo.js.map

/***/ }),

/***/ 7534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCustomFormatMetadata = exports.formatWithCustomOverride = exports.format = exports.isStandardFormat = exports.canFormat = exports.getComponents = exports.hasFormatComponents = exports.addDecimalsToFormat = exports.getNumericFormat = exports.NumberFormatComponentsDelimeter = void 0;
/**
 * NumberFormat module contains the static methods for formatting the numbers.
 * It extends the Globalize functionality to support complete set of .NET
 * formatting expressions for numeric types including custom formats.
 */
/* eslint-disable no-useless-escape */
var globalize_1 = __webpack_require__(7717);
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2087);
// powerbi.extensibility.utils.formatting
var stringExtensions = __webpack_require__(1248);
var formattingEncoder = __webpack_require__(6459);
var formattingService_1 = __webpack_require__(3100);
var NumericalPlaceHolderRegex = /\{.+\}/;
var ScientificFormatRegex = /e[+-]*[0#]+/i;
var StandardFormatRegex = /^[a-z]\d{0,2}$/i; // a letter + up to 2 digits for precision specifier
var TrailingZerosRegex = /0+$/;
var DecimalFormatRegex = /\.([0#]*)/g;
var NumericFormatRegex = /[0#,\.]+[0,#]*/g;
// (?=...) is a positive lookahead assertion. The RE is asking for the last digit placeholder, [0#],
// which is followed by non-digit placeholders and the end of string, [^0#]*$. But it only matches
// the last digit placeholder, not anything that follows because the positive lookahead isn"t included
// in the match - it is only a condition.
var LastNumericPlaceholderRegex = /([0#])(?=[^0#]*$)/;
var DecimalFormatCharacter = ".";
var ZeroPlaceholder = "0";
var DigitPlaceholder = "#";
var ExponentialFormatChar = "E";
var NumericPlaceholders = [ZeroPlaceholder, DigitPlaceholder];
var NumericPlaceholderRegex = new RegExp(NumericPlaceholders.join("|"), "g");
exports.NumberFormatComponentsDelimeter = ";";
function getNonScientificFormatWithPrecision(baseFormat, numericFormat) {
    if (!numericFormat || baseFormat === undefined)
        return baseFormat;
    var newFormat = "{0:" + numericFormat + "}";
    return baseFormat.replace("{0}", newFormat);
}
function getNumericFormat(value, baseFormat) {
    if (baseFormat == null)
        return baseFormat;
    if (hasFormatComponents(baseFormat)) {
        var _a = getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
        if (value > 0)
            return getNumericFormatFromComponent(value, positive);
        else if (value === 0)
            return getNumericFormatFromComponent(value, zero);
        return getNumericFormatFromComponent(value, negative);
    }
    return getNumericFormatFromComponent(value, baseFormat);
}
exports.getNumericFormat = getNumericFormat;
function getNumericFormatFromComponent(value, format) {
    var match = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(NumericFormatRegex, format);
    if (match)
        return match[0];
    return format;
}
function addDecimalsToFormat(baseFormat, decimals, trailingZeros) {
    if (decimals == null)
        return baseFormat;
    // Default format string
    if (baseFormat == null)
        baseFormat = ZeroPlaceholder;
    if (hasFormatComponents(baseFormat)) {
        var _a = getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
        var formats = [positive, negative, zero];
        for (var i = 0; i < formats.length; i++) {
            // Update format in formats array
            formats[i] = addDecimalsToFormatComponent(formats[i], decimals, trailingZeros);
        }
        return formats.join(exports.NumberFormatComponentsDelimeter);
    }
    return addDecimalsToFormatComponent(baseFormat, decimals, trailingZeros);
}
exports.addDecimalsToFormat = addDecimalsToFormat;
function addDecimalsToFormatComponent(format, decimals, trailingZeros) {
    decimals = Math.abs(decimals);
    if (decimals >= 0) {
        var literals = [];
        format = formattingEncoder.preserveLiterals(format, literals);
        var placeholder = trailingZeros ? ZeroPlaceholder : DigitPlaceholder;
        var decimalPlaceholders = stringExtensions.repeat(placeholder, Math.abs(decimals));
        var match = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(DecimalFormatRegex, format);
        if (match) {
            var beforeDecimal = format.substring(0, match.index);
            var formatDecimal = format.substring(match.index + 1, match[1].length + match.index + 1);
            var afterDecimal = format.substring(match.index + match[0].length);
            if (trailingZeros)
                // Use explicit decimals argument as placeholders
                formatDecimal = decimalPlaceholders;
            else {
                var decimalChange = decimalPlaceholders.length - formatDecimal.length;
                if (decimalChange > 0)
                    // Append decimalPlaceholders to existing decimal portion of format string
                    formatDecimal = formatDecimal + decimalPlaceholders.slice(-decimalChange);
                else if (decimalChange < 0)
                    // Remove decimals from formatDecimal
                    formatDecimal = formatDecimal.slice(0, decimalChange);
            }
            if (formatDecimal.length > 0)
                formatDecimal = DecimalFormatCharacter + formatDecimal;
            format = beforeDecimal + formatDecimal + afterDecimal;
        }
        else if (decimalPlaceholders.length > 0) {
            // Replace last numeric placeholder with decimal portion
            format = format.replace(LastNumericPlaceholderRegex, "$1" + DecimalFormatCharacter + decimalPlaceholders);
        }
        if (literals.length !== 0)
            format = formattingEncoder.restoreLiterals(format, literals);
    }
    return format;
}
function hasFormatComponents(format) {
    return formattingEncoder.removeLiterals(format).indexOf(exports.NumberFormatComponentsDelimeter) !== -1;
}
exports.hasFormatComponents = hasFormatComponents;
function getComponents(format) {
    var signFormat = {
        hasNegative: false,
        positive: format,
        negative: format,
        zero: format,
    };
    // escape literals so semi-colon in a literal isn't interpreted as a delimiter
    // NOTE: OK to use the literals extracted here for all three components before since the literals are indexed.
    // For example, "'pos-lit';'neg-lit'" will get preserved as "\uE000;\uE001" and the literal array will be
    // ['pos-lit', 'neg-lit']. When the negative components is restored, its \uE001 will select the second
    // literal.
    var literals = [];
    format = formattingEncoder.preserveLiterals(format, literals);
    var signSpecificFormats = format.split(exports.NumberFormatComponentsDelimeter);
    var formatCount = signSpecificFormats.length;
    if (formatCount > 1) {
        if (literals.length !== 0)
            signSpecificFormats = signSpecificFormats.map(function (signSpecificFormat) { return formattingEncoder.restoreLiterals(signSpecificFormat, literals); });
        signFormat.hasNegative = true;
        signFormat.positive = signFormat.zero = signSpecificFormats[0];
        signFormat.negative = signSpecificFormats[1];
        if (formatCount > 2)
            signFormat.zero = signSpecificFormats[2];
    }
    return signFormat;
}
exports.getComponents = getComponents;
var _lastCustomFormatMeta;
// Evaluates if the value can be formatted using the NumberFormat
function canFormat(value) {
    return typeof (value) === "number";
}
exports.canFormat = canFormat;
function isStandardFormat(format) {
    return StandardFormatRegex.test(format);
}
exports.isStandardFormat = isStandardFormat;
// Formats the number using specified format expression and culture
function format(value, format, culture) {
    format = format || "G";
    try {
        if (isStandardFormat(format))
            return formatNumberStandard(value, format, culture);
        return formatNumberCustom(value, format, culture);
    }
    catch (e) {
        return globalize_1.Globalize.format(value, undefined, culture);
    }
}
exports.format = format;
// Performs a custom format with a value override.  Typically used for custom formats showing scaled values.
function formatWithCustomOverride(value, format, nonScientificOverrideFormat, culture) {
    return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
}
exports.formatWithCustomOverride = formatWithCustomOverride;
// Formats the number using standard format expression
function formatNumberStandard(value, format, culture) {
    var result;
    var precision = (format.length > 1 ? parseInt(format.substring(1, format.length), 10) : undefined);
    var numberFormatInfo = culture.numberFormat;
    var formatChar = format.charAt(0);
    var abs = Math.abs(value);
    switch (formatChar) {
        case "e":
        case "E":
            if (precision === undefined) {
                precision = 6;
            }
            format = "0." + stringExtensions.repeat("0", precision) + formatChar + "+000";
            result = formatNumberCustom(value, format, culture);
            break;
        case "f":
        case "F":
            result = precision !== undefined ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals);
            result = localize(result, numberFormatInfo);
            break;
        case "g":
        case "G":
            if (abs === 0 || (1E-4 <= abs && abs < 1E15)) {
                // For the range of 0.0001 to 1,000,000,000,000,000 - use the normal form
                result = precision !== undefined ? value.toPrecision(precision) : value.toString();
            }
            else {
                // Otherwise use exponential
                // Assert that value is a number and fall back on returning value if it is not
                if (typeof (value) !== "number")
                    return String(value);
                result = precision !== undefined ? value.toExponential(precision) : value.toExponential();
                result = result.replace("e", "E");
            }
            result = localize(result, numberFormatInfo);
            break;
        case "r":
        case "R":
            result = value.toString();
            result = localize(result, numberFormatInfo);
            break;
        case "x":
        case "X":
            result = value.toString(16);
            if (formatChar === "X") {
                result = result.toUpperCase();
            }
            if (precision !== undefined) {
                var actualPrecision = result.length;
                var isNegative = value < 0;
                if (isNegative) {
                    actualPrecision--;
                }
                var paddingZerosCount = precision - actualPrecision;
                var paddingZeros = undefined;
                if (paddingZerosCount > 0) {
                    paddingZeros = stringExtensions.repeat("0", paddingZerosCount);
                }
                if (isNegative) {
                    result = "-" + paddingZeros + result.substring(1);
                }
                else {
                    result = paddingZeros + result;
                }
            }
            result = localize(result, numberFormatInfo);
            break;
        default:
            result = globalize_1.Globalize.format(value, format, culture);
    }
    return result;
}
// Formats the number using custom format expression
function formatNumberCustom(value, format, culture, nonScientificOverrideFormat) {
    var result;
    var numberFormatInfo = culture.numberFormat;
    if (isFinite(value)) {
        // Split format by positive[;negative;zero] pattern
        var formatComponents = getComponents(format);
        // Pick a format based on the sign of value
        if (value > 0) {
            format = formatComponents.positive;
        }
        else if (value === 0) {
            format = formatComponents.zero;
        }
        else {
            format = formatComponents.negative;
        }
        // Normalize value if we have an explicit negative format
        if (formatComponents.hasNegative)
            value = Math.abs(value);
        // Get format metadata
        var formatMeta = getCustomFormatMetadata(format, true /*calculatePrecision*/);
        // Preserve literals and escaped chars
        var literals = [];
        if (formatMeta.hasLiterals) {
            format = formattingEncoder.preserveLiterals(format, literals);
        }
        // Scientific format
        if (formatMeta.hasE && !nonScientificOverrideFormat) {
            var scientificMatch = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(ScientificFormatRegex, format);
            if (scientificMatch) {
                // Case 2.1. Scientific custom format
                var formatM = format.substring(0, scientificMatch.index);
                var formatE = format.substring(scientificMatch.index + 2); // E(+|-)
                var precision = getCustomFormatPrecision(formatM, formatMeta);
                var scale = getCustomFormatScale(formatM, formatMeta);
                if (scale !== 1) {
                    value = value * scale;
                }
                // Assert that value is a number and fall back on returning value if it is not
                if (typeof (value) !== "number")
                    return String(value);
                var s = value.toExponential(precision);
                var indexOfE = s.indexOf("e");
                var mantissa = s.substring(0, indexOfE);
                var exp = s.substring(indexOfE + 1);
                var resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo);
                var resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                if (resultE.charAt(0) === "+" && scientificMatch[0].charAt(1) !== "+") {
                    resultE = resultE.substring(1);
                }
                var e = scientificMatch[0].charAt(0);
                result = resultM + e + resultE;
            }
        }
        // Non scientific format
        if (result === undefined) {
            var valueFormatted = void 0;
            var isValueGlobalized = false;
            var precision = getCustomFormatPrecision(format, formatMeta);
            var scale = getCustomFormatScale(format, formatMeta);
            if (scale !== 1)
                value = value * scale;
            // Rounding
            value = parseFloat(toNonScientific(value, precision));
            if (!isFinite(value)) {
                // very large and small finite values can become infinite by parseFloat(toNonScientific())
                return globalize_1.Globalize.format(value, undefined);
            }
            if (nonScientificOverrideFormat) {
                // Get numeric format from format string
                var numericFormat = getNumericFormat(value, format);
                // Add separators and decimalFormat to nonScientificFormat
                nonScientificOverrideFormat = getNonScientificFormatWithPrecision(nonScientificOverrideFormat, numericFormat);
                // Format the value
                valueFormatted = formattingService_1.formattingService.format(nonScientificOverrideFormat, [value], culture.name);
                isValueGlobalized = true;
            }
            else
                valueFormatted = toNonScientific(value, precision);
            result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized);
        }
        if (formatMeta.hasLiterals) {
            result = formattingEncoder.restoreLiterals(result, literals, false);
        }
        _lastCustomFormatMeta = formatMeta;
    }
    else {
        return globalize_1.Globalize.format(value, undefined);
    }
    return result;
}
// Returns string with the fixed point respresentation of the number
function toNonScientific(value, precision) {
    var result = "";
    var precisionZeros = 0;
    // Double precision numbers support actual 15-16 decimal digits of precision.
    if (precision > 16) {
        precisionZeros = precision - 16;
        precision = 16;
    }
    var digitsBeforeDecimalPoint = powerbi_visuals_utils_typeutils_1.double.log10(Math.abs(value));
    if (digitsBeforeDecimalPoint < 16) {
        if (digitsBeforeDecimalPoint > 0) {
            var maxPrecision = 16 - digitsBeforeDecimalPoint;
            if (precision > maxPrecision) {
                precisionZeros += precision - maxPrecision;
                precision = maxPrecision;
            }
        }
        result = value.toFixed(precision);
    }
    else if (digitsBeforeDecimalPoint === 16) {
        result = value.toFixed(0);
        precisionZeros += precision;
        if (precisionZeros > 0) {
            result += ".";
        }
    }
    else { // digitsBeforeDecimalPoint > 16
        // Different browsers have different implementations of the toFixed().
        // In IE it returns fixed format no matter what's the number. In FF and Chrome the method returns exponential format for numbers greater than 1E21.
        // So we need to check for range and convert the to exponential with the max precision.
        // Then we convert exponential string to fixed by removing the dot and padding with "power" zeros.
        // Assert that value is a number and fall back on returning value if it is not
        if (typeof (value) !== "number")
            return String(value);
        result = value.toExponential(15);
        var indexOfE = result.indexOf("e");
        if (indexOfE > 0) {
            var indexOfDot = result.indexOf(".");
            var mantissa = result.substring(0, indexOfE);
            var exp = result.substring(indexOfE + 1);
            var powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
            result = mantissa.replace(".", "") + stringExtensions.repeat("0", powerZeros);
            if (precision > 0) {
                result = result + "." + stringExtensions.repeat("0", precision);
            }
        }
    }
    if (precisionZeros > 0) {
        result = result + stringExtensions.repeat("0", precisionZeros);
    }
    return result;
}
/**
 * Returns the formatMetadata of the format
 * When calculating precision and scale, if format string of
 * positive[;negative;zero] => positive format will be used
 * @param (required) format - format string
 * @param (optional) calculatePrecision - calculate precision of positive format
 * @param (optional) calculateScale - calculate scale of positive format
 */
function getCustomFormatMetadata(format, calculatePrecision, calculateScale, calculatePartsPerScale) {
    if (_lastCustomFormatMeta !== undefined && format === _lastCustomFormatMeta.format) {
        return _lastCustomFormatMeta;
    }
    var literals = [];
    var escaped = formattingEncoder.preserveLiterals(format, literals);
    var result = {
        format: format,
        hasLiterals: literals.length !== 0,
        hasE: false,
        hasCommas: false,
        hasDots: false,
        hasPercent: false,
        hasPermile: false,
        precision: undefined,
        scale: undefined,
        partsPerScale: undefined,
    };
    for (var i = 0, length_1 = escaped.length; i < length_1; i++) {
        var c = escaped.charAt(i);
        switch (c) {
            case "e":
            case "E":
                result.hasE = true;
                break;
            case ",":
                result.hasCommas = true;
                break;
            case ".":
                result.hasDots = true;
                break;
            case "%":
                result.hasPercent = true;
                break;
            case "\u2030": // ‰
                result.hasPermile = true;
                break;
        }
    }
    // Use positive format for calculating these values
    var formatComponents = getComponents(format);
    if (calculatePrecision)
        result.precision = getCustomFormatPrecision(formatComponents.positive, result);
    if (calculatePartsPerScale)
        result.partsPerScale = getCustomFormatPartsPerScale(formatComponents.positive, result);
    if (calculateScale)
        result.scale = getCustomFormatScale(formatComponents.positive, result);
    return result;
}
exports.getCustomFormatMetadata = getCustomFormatMetadata;
/** Returns the decimal precision of format based on the number of # and 0 chars after the decimal point
     * Important: The input format string needs to be split to the appropriate pos/neg/zero portion to work correctly */
function getCustomFormatPrecision(format, formatMeta) {
    if (formatMeta.precision > -1) {
        return formatMeta.precision;
    }
    var result = 0;
    if (formatMeta.hasDots) {
        if (formatMeta.hasLiterals) {
            format = formattingEncoder.removeLiterals(format);
        }
        var dotIndex = format.indexOf(".");
        if (dotIndex > -1) {
            var count = format.length;
            for (var i = dotIndex; i < count; i++) {
                var char = format.charAt(i);
                if (char.match(NumericPlaceholderRegex))
                    result++;
                // 0.00E+0 :: Break before counting 0 in
                // exponential portion of format string
                if (char === ExponentialFormatChar)
                    break;
            }
            result = Math.min(19, result);
        }
    }
    formatMeta.precision = result;
    return result;
}
function getCustomFormatPartsPerScale(format, formatMeta) {
    if (formatMeta.partsPerScale != null)
        return formatMeta.partsPerScale;
    var result = 1;
    if (formatMeta.hasPercent && format.indexOf("%") > -1) {
        result = result * 100;
    }
    if (formatMeta.hasPermile && format.indexOf(/* ‰ */ "\u2030") > -1) {
        result = result * 1000;
    }
    formatMeta.partsPerScale = result;
    return result;
}
// Returns the scale factor of the format based on the "%" and scaling "," chars in the format
function getCustomFormatScale(format, formatMeta) {
    if (formatMeta.scale > -1) {
        return formatMeta.scale;
    }
    var result = getCustomFormatPartsPerScale(format, formatMeta);
    if (formatMeta.hasCommas) {
        var dotIndex = format.indexOf(".");
        if (dotIndex === -1) {
            dotIndex = format.length;
        }
        for (var i = dotIndex - 1; i > -1; i--) {
            var char = format.charAt(i);
            if (char === ",") {
                result = result / 1000;
            }
            else {
                break;
            }
        }
    }
    formatMeta.scale = result;
    return result;
}
function fuseNumberWithCustomFormat(value, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized) {
    var suppressModifyValue = !!nonScientificOverrideFormat;
    var formatParts = format.split(".", 2);
    if (formatParts.length === 2) {
        var wholeFormat = formatParts[0];
        var fractionFormat = formatParts[1];
        var displayUnit = "";
        // Remove display unit from value before splitting on "." as localized display units sometimes end with "."
        if (nonScientificOverrideFormat) {
            displayUnit = nonScientificOverrideFormat.replace(NumericalPlaceHolderRegex, "");
            value = value.replace(displayUnit, "");
        }
        var globalizedDecimalSeparator = numberFormatInfo["."];
        var decimalSeparator = isValueGlobalized ? globalizedDecimalSeparator : ".";
        var valueParts = value.split(decimalSeparator, 2);
        var wholeValue = valueParts.length === 1 ? valueParts[0] + displayUnit : valueParts[0];
        var fractionValue = valueParts.length === 2 ? valueParts[1] + displayUnit : "";
        fractionValue = fractionValue.replace(TrailingZerosRegex, "");
        var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue);
        var fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);
        if (fractionFormattedValue.fmtOnly || fractionFormattedValue.value === "")
            return wholeFormattedValue + fractionFormattedValue.value;
        return wholeFormattedValue + globalizedDecimalSeparator + fractionFormattedValue.value;
    }
    return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
}
function fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue) {
    var groupSymbolIndex = format.indexOf(",");
    var enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","];
    var groupDigitCount = 0;
    var groupIndex = 0;
    var groupSizes = numberFormatInfo.groupSizes || [3];
    var groupSize = groupSizes[0];
    var groupSeparator = numberFormatInfo[","];
    var sign = "";
    var firstChar = value.charAt(0);
    if (firstChar === "+" || firstChar === "-") {
        sign = numberFormatInfo[firstChar];
        value = value.substring(1);
    }
    var isZero = value === "0";
    var result = "";
    var leftBuffer = "";
    var vi = value.length - 1;
    var fmtOnly = true;
    // Iterate through format chars and replace 0 and # with the digits from the value string
    for (var fi = format.length - 1; fi > -1; fi--) {
        var formatChar = format.charAt(fi);
        switch (formatChar) {
            case ZeroPlaceholder:
            case DigitPlaceholder:
                fmtOnly = false;
                if (leftBuffer !== "") {
                    result = leftBuffer + result;
                    leftBuffer = "";
                }
                if (!suppressModifyValue) {
                    if (vi > -1 || formatChar === ZeroPlaceholder) {
                        if (enableGroups) {
                            // If the groups are enabled we'll need to keep track of the current group index and periodically insert group separator,
                            if (groupDigitCount === groupSize) {
                                result = groupSeparator + result;
                                groupIndex++;
                                if (groupIndex < groupSizes.length) {
                                    groupSize = groupSizes[groupIndex];
                                }
                                groupDigitCount = 1;
                            }
                            else {
                                groupDigitCount++;
                            }
                        }
                    }
                    if (vi > -1) {
                        if (isZero && formatChar === DigitPlaceholder) {
                            // Special case - if we need to format a zero value and the # symbol is used - we don't copy it into the result)
                        }
                        else {
                            result = value.charAt(vi) + result;
                        }
                        vi--;
                    }
                    else if (formatChar !== DigitPlaceholder) {
                        result = formatChar + result;
                    }
                }
                break;
            case ",":
                // We should skip all the , chars
                break;
            default:
                leftBuffer = formatChar + leftBuffer;
                break;
        }
    }
    // If the value didn't fit into the number of zeros provided in the format then we should insert the missing part of the value into the result
    if (!suppressModifyValue) {
        if (vi > -1 && result !== "") {
            if (enableGroups) {
                while (vi > -1) {
                    if (groupDigitCount === groupSize) {
                        result = groupSeparator + result;
                        groupIndex++;
                        if (groupIndex < groupSizes.length) {
                            groupSize = groupSizes[groupIndex];
                        }
                        groupDigitCount = 1;
                    }
                    else {
                        groupDigitCount++;
                    }
                    result = value.charAt(vi) + result;
                    vi--;
                }
            }
            else {
                result = value.substring(0, vi + 1) + result;
            }
        }
        // Insert sign in front of the leftBuffer and result
        return sign + leftBuffer + result;
    }
    if (fmtOnly)
        // If the format doesn't specify any digits to be displayed, then just return the format we've parsed up until now.
        return sign + leftBuffer + result;
    return sign + leftBuffer + value + result;
}
function fuseNumberWithCustomFormatRight(value, format, suppressModifyValue) {
    var formatLength = format.length;
    var valueLength = value.length;
    if (suppressModifyValue) {
        var lastChar = format.charAt(formatLength - 1);
        if (!lastChar.match(NumericPlaceholderRegex))
            return {
                value: value + lastChar,
                fmtOnly: value === "",
            };
        return {
            value: value,
            fmtOnly: value === "",
        };
    }
    var result = "", fmtOnly = true, vi = 0;
    for (var fi = 0; fi < formatLength; fi++) {
        var formatChar = format.charAt(fi);
        if (vi < valueLength) {
            switch (formatChar) {
                case ZeroPlaceholder:
                case DigitPlaceholder:
                    result += value[vi++];
                    fmtOnly = false;
                    break;
                default:
                    result += formatChar;
            }
        }
        else {
            if (formatChar !== DigitPlaceholder) {
                result += formatChar;
                fmtOnly = fmtOnly && (formatChar !== ZeroPlaceholder);
            }
        }
    }
    return {
        value: result,
        fmtOnly: fmtOnly,
    };
}
function localize(value, dictionary) {
    var plus = dictionary["+"];
    var minus = dictionary["-"];
    var dot = dictionary["."];
    var comma = dictionary[","];
    if (plus === "+" && minus === "-" && dot === "." && comma === ",") {
        return value;
    }
    var count = value.length;
    var result = "";
    for (var i = 0; i < count; i++) {
        var char = value.charAt(i);
        switch (char) {
            case "+":
                result = result + plus;
                break;
            case "-":
                result = result + minus;
                break;
            case ".":
                result = result + dot;
                break;
            case ",":
                result = result + comma;
                break;
            default:
                result = result + char;
                break;
        }
    }
    return result;
}
//# sourceMappingURL=numberFormat.js.map

/***/ }),

/***/ 7630:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateTimeSequence = void 0;
var dateUtils = __webpack_require__(7925);
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2087);
var NumericSequence = powerbi_visuals_utils_typeutils_1.numericSequence.NumericSequence;
var NumericSequenceRange = powerbi_visuals_utils_typeutils_1.numericSequenceRange.NumericSequenceRange;
// powerbi.extensibility.utils.formatting
var iFormattingService_1 = __webpack_require__(3351);
// Repreasents the sequence of the dates/times
var DateTimeSequence = /** @class */ (function () {
    // Constructors
    // Creates new instance of the DateTimeSequence
    function DateTimeSequence(unit) {
        this.unit = unit;
        this.sequence = [];
        this.min = new Date("9999-12-31T23:59:59.999");
        this.max = new Date("0001-01-01T00:00:00.000");
    }
    // Methods
    /**
     * Add a new Date to a sequence.
     * @param date - date to add
     */
    DateTimeSequence.prototype.add = function (date) {
        if (date < this.min) {
            this.min = date;
        }
        if (date > this.max) {
            this.max = date;
        }
        this.sequence.push(date);
    };
    // Methods
    /**
     * Extends the sequence to cover new date range
     * @param min - new min to be covered by sequence
     * @param max - new max to be covered by sequence
     */
    DateTimeSequence.prototype.extendToCover = function (min, max) {
        var x = this.min;
        while (min < x) {
            x = DateTimeSequence.ADD_INTERVAL(x, -this.interval, this.unit);
            this.sequence.splice(0, 0, x);
        }
        this.min = x;
        x = this.max;
        while (x < max) {
            x = DateTimeSequence.ADD_INTERVAL(x, this.interval, this.unit);
            this.sequence.push(x);
        }
        this.max = x;
    };
    /**
     * Move the sequence to cover new date range
     * @param min - new min to be covered by sequence
     * @param max - new max to be covered by sequence
     */
    DateTimeSequence.prototype.moveToCover = function (min, max) {
        var delta = DateTimeSequence.getDelta(min, max, this.unit);
        var count = Math.floor(delta / this.interval);
        this.min = DateTimeSequence.ADD_INTERVAL(this.min, count * this.interval, this.unit);
        this.sequence = [];
        this.sequence.push(this.min);
        this.max = this.min;
        while (this.max < max) {
            this.max = DateTimeSequence.ADD_INTERVAL(this.max, this.interval, this.unit);
            this.sequence.push(this.max);
        }
    };
    // Static
    /**
     * Calculate a new DateTimeSequence
     * @param dataMin - Date representing min of the data range
     * @param dataMax - Date representing max of the data range
     * @param expectedCount - expected number of intervals in the sequence
     * @param unit - of the intervals in the sequence
     */
    DateTimeSequence.CALCULATE = function (dataMin, dataMax, expectedCount, unit) {
        if (!unit) {
            unit = DateTimeSequence.GET_INTERVAL_UNIT(dataMin, dataMax, expectedCount);
        }
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return DateTimeSequence.CALCULATE_YEARS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Month:
                return DateTimeSequence.CALCULATE_MONTHS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Week:
                return DateTimeSequence.CALCULATE_WEEKS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Day:
                return DateTimeSequence.CALCULATE_DAYS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Hour:
                return DateTimeSequence.CALCULATE_HOURS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Minute:
                return DateTimeSequence.CALCULATE_MINUTES(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Second:
                return DateTimeSequence.CALCULATE_SECONDS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return DateTimeSequence.CALCULATE_MILLISECONDS(dataMin, dataMax, expectedCount);
        }
    };
    DateTimeSequence.CALCULATE_YEARS = function (dataMin, dataMax, expectedCount) {
        // Calculate range and sequence
        var yearsRange = NumericSequenceRange.calculateDataRange(dataMin.getFullYear(), dataMax.getFullYear(), false);
        // Calculate year sequence
        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(0, yearsRange.max - yearsRange.min), expectedCount, 0, null, null, [1, 2, 5]);
        var newMinYear = Math.floor(yearsRange.min / sequence.interval) * sequence.interval;
        var date = new Date(newMinYear, 0, 1);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Year);
    };
    DateTimeSequence.CALCULATE_MONTHS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var minYear = dataMin.getFullYear();
        var maxYear = dataMax.getFullYear();
        var minMonth = dataMin.getMonth();
        var maxMonth = (maxYear - minYear) * 12 + dataMax.getMonth();
        var date = new Date(minYear, 0, 1);
        // Calculate month sequence
        var sequence = NumericSequence.calculateUnits(minMonth, maxMonth, expectedCount, [1, 2, 3, 6, 12]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Month);
    };
    DateTimeSequence.CALCULATE_WEEKS = function (dataMin, dataMax, expectedCount) {
        var firstDayOfWeek = 0;
        var minDayOfWeek = dataMin.getDay();
        var dayOffset = (minDayOfWeek - firstDayOfWeek + 7) % 7;
        var minDay = dataMin.getDate() - dayOffset;
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), minDay);
        var min = 0;
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Week));
        // Calculate week sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 4, 8]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Week);
    };
    DateTimeSequence.CALCULATE_DAYS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
        var min = 0;
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(dataMin, dataMax, iFormattingService_1.DateTimeUnit.Day));
        // Calculate day sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 7, 14]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Day);
    };
    DateTimeSequence.CALCULATE_HOURS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Hour));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Hour));
        // Calculate hour sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 3, 6, 12, 24]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Hour);
    };
    DateTimeSequence.CALCULATE_MINUTES = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Minute));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Minute));
        // Calculate minutes numeric sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 3, 60 * 6, 60 * 12, 60 * 24]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Minute);
    };
    DateTimeSequence.CALCULATE_SECONDS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Second));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Second));
        // Calculate minutes numeric sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 5, 60 * 10, 60 * 15, 60 * 30, 60 * 60]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Second);
    };
    DateTimeSequence.CALCULATE_MILLISECONDS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes(), dataMin.getSeconds());
        var min = DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Millisecond);
        var max = DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Millisecond);
        // Calculate milliseconds numeric sequence
        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(min, max), expectedCount, 0);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Millisecond);
    };
    DateTimeSequence.ADD_INTERVAL = function (value, interval, unit) {
        interval = Math.round(interval);
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return dateUtils.addYears(value, interval);
            case iFormattingService_1.DateTimeUnit.Month:
                return dateUtils.addMonths(value, interval);
            case iFormattingService_1.DateTimeUnit.Week:
                return dateUtils.addWeeks(value, interval);
            case iFormattingService_1.DateTimeUnit.Day:
                return dateUtils.addDays(value, interval);
            case iFormattingService_1.DateTimeUnit.Hour:
                return dateUtils.addHours(value, interval);
            case iFormattingService_1.DateTimeUnit.Minute:
                return dateUtils.addMinutes(value, interval);
            case iFormattingService_1.DateTimeUnit.Second:
                return dateUtils.addSeconds(value, interval);
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return dateUtils.addMilliseconds(value, interval);
        }
    };
    DateTimeSequence.fromNumericSequence = function (date, sequence, unit) {
        var result = new DateTimeSequence(unit);
        for (var i = 0; i < sequence.sequence.length; i++) {
            var x = sequence.sequence[i];
            var d = DateTimeSequence.ADD_INTERVAL(date, x, unit);
            result.add(d);
        }
        result.interval = sequence.interval;
        result.intervalOffset = sequence.intervalOffset;
        return result;
    };
    DateTimeSequence.getDelta = function (min, max, unit) {
        var delta = 0;
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                delta = max.getFullYear() - min.getFullYear();
                break;
            case iFormattingService_1.DateTimeUnit.Month:
                delta = (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth();
                break;
            case iFormattingService_1.DateTimeUnit.Week:
                delta = (max.getTime() - min.getTime()) / (7 * 24 * 3600000);
                break;
            case iFormattingService_1.DateTimeUnit.Day:
                delta = (max.getTime() - min.getTime()) / (24 * 3600000);
                break;
            case iFormattingService_1.DateTimeUnit.Hour:
                delta = (max.getTime() - min.getTime()) / 3600000;
                break;
            case iFormattingService_1.DateTimeUnit.Minute:
                delta = (max.getTime() - min.getTime()) / 60000;
                break;
            case iFormattingService_1.DateTimeUnit.Second:
                delta = (max.getTime() - min.getTime()) / 1000;
                break;
            case iFormattingService_1.DateTimeUnit.Millisecond:
                delta = max.getTime() - min.getTime();
                break;
        }
        return delta;
    };
    DateTimeSequence.GET_INTERVAL_UNIT = function (min, max, maxCount) {
        maxCount = Math.max(maxCount, 2);
        var totalDays = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Day);
        if (totalDays > 356 && totalDays >= 30 * 6 * maxCount)
            return iFormattingService_1.DateTimeUnit.Year;
        if (totalDays > 60 && totalDays > 7 * maxCount)
            return iFormattingService_1.DateTimeUnit.Month;
        if (totalDays > 14 && totalDays > 2 * maxCount)
            return iFormattingService_1.DateTimeUnit.Week;
        var totalHours = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Hour);
        if (totalDays > 2 && totalHours > 12 * maxCount)
            return iFormattingService_1.DateTimeUnit.Day;
        if (totalHours >= 24 && totalHours >= maxCount)
            return iFormattingService_1.DateTimeUnit.Hour;
        var totalMinutes = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Minute);
        if (totalMinutes > 2 && totalMinutes >= maxCount)
            return iFormattingService_1.DateTimeUnit.Minute;
        var totalSeconds = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Second);
        if (totalSeconds > 2 && totalSeconds >= 0.8 * maxCount)
            return iFormattingService_1.DateTimeUnit.Second;
        var totalMilliseconds = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Millisecond);
        if (totalMilliseconds > 0)
            return iFormattingService_1.DateTimeUnit.Millisecond;
        // If the size of the range is 0 we need to guess the unit based on the date's non-zero values starting with milliseconds
        var date = min;
        if (date.getMilliseconds() !== 0)
            return iFormattingService_1.DateTimeUnit.Millisecond;
        if (date.getSeconds() !== 0)
            return iFormattingService_1.DateTimeUnit.Second;
        if (date.getMinutes() !== 0)
            return iFormattingService_1.DateTimeUnit.Minute;
        if (date.getHours() !== 0)
            return iFormattingService_1.DateTimeUnit.Hour;
        if (date.getDate() !== 1)
            return iFormattingService_1.DateTimeUnit.Day;
        if (date.getMonth() !== 0)
            return iFormattingService_1.DateTimeUnit.Month;
        return iFormattingService_1.DateTimeUnit.Year;
    };
    // Constants
    DateTimeSequence.MIN_COUNT = 1;
    DateTimeSequence.MAX_COUNT = 1000;
    return DateTimeSequence;
}());
exports.DateTimeSequence = DateTimeSequence;
//# sourceMappingURL=dateTimeSequence.js.map

/***/ }),

/***/ 7674:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* reexport safe */ _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__.A),
/* harmony export */   z: () => (/* reexport module object */ _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9754);
/* harmony import */ var _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6667);



//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7717:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseNegativePattern = exports.parseExact = exports.getEraYear = exports.getEra = exports.getTokenRegExp = exports.formatNumber = exports.formatDate = exports.expandFormat = exports.appendPreOrPostMatch = exports.zeroPad = exports.trim = exports.startsWith = exports.isObject = exports.isFunction = exports.isArray = exports.extend = exports.endsWith = exports.arrayIndexOf = exports.regexTrim = exports.regexParseFloat = exports.regexInfinity = exports.regexHex = exports.Globalize = void 0;
// Global variable (Globalize) or CommonJS module (globalize)
exports.Globalize = function (cultureSelector) {
    return new exports.Globalize.prototype.init(cultureSelector);
};
exports.Globalize.cultures = {};
exports.Globalize.prototype = {
    constructor: exports.Globalize,
    init: function (cultureSelector) {
        this.cultures = exports.Globalize.cultures;
        this.cultureSelector = cultureSelector;
        return this;
    }
};
exports.Globalize.prototype.init.prototype = exports.Globalize.prototype;
// 1.	 When defining a culture, all fields are required except the ones stated as optional.
// 2.	 Each culture should have a ".calendars" object with at least one calendar named "standard"
//		 which serves as the default calendar in use by that culture.
// 3.	 Each culture should have a ".calendar" object which is the current calendar being used,
//		 it may be dynamically changed at any time to one of the calendars in ".calendars".
exports.Globalize.cultures["default"] = {
    // A unique name for the culture in the form <language code>-<country/region code>
    name: "en",
    // the name of the culture in the english language
    englishName: "English",
    // the name of the culture in its own language
    nativeName: "English",
    // whether the culture uses right-to-left text
    isRTL: false,
    // "language" is used for so-called "specific" cultures.
    // For example, the culture "es-CL" means "Spanish, in Chili".
    // It represents the Spanish-speaking culture as it is in Chili,
    // which might have different formatting rules or even translations
    // than Spanish in Spain. A "neutral" culture is one that is not
    // specific to a region. For example, the culture "es" is the generic
    // Spanish culture, which may be a more generalized version of the language
    // that may or may not be what a specific culture expects.
    // For a specific culture like "es-CL", the "language" field refers to the
    // neutral, generic culture information for the language it is using.
    // This is not always a simple matter of the string before the dash.
    // For example, the "zh-Hans" culture is netural (Simplified Chinese).
    // And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
    // field is "zh-CHS", not "zh".
    // This field should be used to navigate from a specific culture to it's
    // more general, neutral culture. If a culture is already as general as it
    // can get, the language may refer to itself.
    language: "en",
    // numberFormat defines general number formatting rules, like the digits in
    // each grouping, the group separator, and how negative numbers are displayed.
    numberFormat: {
        // [negativePattern]
        // Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
        // but is still defined as an array for consistency with them.
        //   negativePattern: one of "(n)|-n|- n|n-|n -"
        pattern: ["-n"],
        // number of decimal places normally shown
        decimals: 2,
        // string that separates number groups, as in 1,000,000
        ",": ",",
        // string that separates a number from the fractional portion, as in 1.99
        ".": ".",
        // array of numbers indicating the size of each number group.
        // TODO: more detailed description and example
        groupSizes: [3],
        // symbol used for positive numbers
        "+": "+",
        // symbol used for negative numbers
        "-": "-",
        percent: {
            // [negativePattern, positivePattern]
            //   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
            //   positivePattern: one of "n %|n%|%n|% n"
            pattern: ["-n %", "n %"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ",": ",",
            // string that separates a number from the fractional portion, as in 1.99
            ".": ".",
            // symbol used to represent a percentage
            symbol: "%"
        },
        currency: {
            // [negativePattern, positivePattern]
            //   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //   positivePattern: one of "$n|n$|$ n|n $"
            pattern: ["($n)", "$n"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ",": ",",
            // string that separates a number from the fractional portion, as in 1.99
            ".": ".",
            // symbol used to represent currency
            symbol: "$"
        }
    },
    // calendars defines all the possible calendars used by this culture.
    // There should be at least one defined with name "standard", and is the default
    // calendar used by the culture.
    // A calendar contains information about how dates are formatted, information about
    // the calendar's eras, a standard set of the date formats,
    // translations for day and month names, and if the calendar is not based on the Gregorian
    // calendar, conversion functions to and from the Gregorian calendar.
    calendars: {
        standard: {
            // name that identifies the type of calendar this is
            name: "Gregorian_USEnglish",
            // separator of parts of a date (e.g. "/" in 11/05/1955)
            "/": "/",
            // separator of parts of a time (e.g. ":" in 05:44 PM)
            ":": ":",
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
            firstDay: 0,
            days: {
                // full day names
                names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                // abbreviated day names
                namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                // shortest day names
                namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            },
            months: {
                // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                // abbreviated month names
                namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
            },
            // AM and PM designators in one of these forms:
            // The usual view, and the upper and lower case versions
            //   [ standard, lowercase, uppercase ]
            // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
            //   null
            AM: ["AM", "am", "AM"],
            PM: ["PM", "pm", "PM"],
            eras: [
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
                {
                    "name": "A.D.",
                    "start": null,
                    "offset": 0
                }
            ],
            // when a two digit year is given, it will never be parsed as a four digit
            // year greater than this year (in the appropriate era for the culture)
            // Set it as a full year (e.g. 2029) or use an offset format starting from
            // the current year: "+19" would correspond to 2029 if the current year 2010.
            twoDigitYearMax: 2029,
            // set of predefined date and time patterns used by the culture
            // these represent the format someone in this culture would expect
            // to see given the portions of the date that are shown.
            patterns: {
                // short date pattern
                d: "M/d/yyyy",
                // long date pattern
                D: "dddd, MMMM dd, yyyy",
                // short time pattern
                t: "h:mm tt",
                // long time pattern
                T: "h:mm:ss tt",
                // long date, short time pattern
                f: "dddd, MMMM dd, yyyy h:mm tt",
                // long date, long time pattern
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                // month/day pattern
                M: "MMMM dd",
                // month/year pattern
                Y: "yyyy MMMM",
                // S is a sortable format that does not vary by culture
                S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
            }
            // optional fields for each calendar:
            /*
            monthsGenitive:
                Same as months but used when the day preceeds the month.
                Omit if the culture has no genitive distinction in month names.
                For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
            convert:
                Allows for the support of non-gregorian based calendars. This convert object is used to
                to convert a date to and from a gregorian calendar date to handle parsing and formatting.
                The two functions:
                    fromGregorian( date )
                        Given the date as a parameter, return an array with parts [ year, month, day ]
                        corresponding to the non-gregorian based year, month, and day for the calendar.
                    toGregorian( year, month, day )
                        Given the non-gregorian year, month, and day, return a new Date() object
                        set to the corresponding date in the gregorian calendar.
            */
        }
    },
    // For localized strings
    messages: {}
};
exports.Globalize.cultures["default"].calendar = exports.Globalize.cultures["default"].calendars.standard;
exports.Globalize.cultures.en = exports.Globalize.cultures["default"];
exports.Globalize.cultureSelector = "en";
//
// private variables
//
exports.regexHex = /^0x[a-f0-9]+$/i;
exports.regexInfinity = /^[+-]?infinity$/i;
exports.regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
exports.regexTrim = /^\s+|\s+$/g;
//
// private JavaScript utility functions
//
exports.arrayIndexOf = function (array, item) {
    if (array.indexOf) {
        return array.indexOf(item);
    }
    for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === item) {
            return i;
        }
    }
    return -1;
};
exports.endsWith = function (value, pattern) {
    return value.substring(value.length - pattern.length) === pattern;
};
exports.extend = function (deep) {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !(0, exports.isFunction)(target)) {
        target = {};
    }
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && ((0, exports.isObject)(copy) || (copyIsArray = (0, exports.isArray)(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && (0, exports.isArray)(src) ? src : [];
                    }
                    else {
                        clone = src && (0, exports.isObject)(src) ? src : {};
                    }
                    // Never move original objects, clone them
                    target[name] = (0, exports.extend)(deep, clone, copy);
                    // Don't bring in undefined values
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
};
exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
};
exports.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
};
exports.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};
exports.startsWith = function (value, pattern) {
    return value.indexOf(pattern) === 0;
};
exports.trim = function (value) {
    return (value + "").replace(exports.regexTrim, "");
};
exports.zeroPad = function (str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
        str = (left ? ("0" + str) : (str + "0"));
    }
    return str;
};
//
// private Globalization utility functions
//
exports.appendPreOrPostMatch = function (preMatch, strings) {
    // appends pre- and post- token match strings while removing escaped characters.
    // Returns a single quote count which is used to determine if the token occurs
    // in a string literal.
    var quoteCount = 0, escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
        var c = preMatch.charAt(i);
        switch (c) {
            case "\'":
                if (escaped) {
                    strings.push("\'");
                }
                else {
                    quoteCount++;
                }
                escaped = false;
                break;
            case "\\":
                if (escaped) {
                    strings.push("\\");
                }
                escaped = !escaped;
                break;
            default:
                strings.push(c);
                escaped = false;
                break;
        }
    }
    return quoteCount;
};
exports.expandFormat = function (cal, format) {
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var pattern, patterns = cal.patterns, len = format.length;
    if (len === 1) {
        pattern = patterns[format];
        if (!pattern) {
            throw "Invalid date format string \'" + format + "\'.";
        }
        format = pattern;
    }
    else if (len === 2 && format.charAt(0) === "%") {
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
        format = format.charAt(1);
    }
    return format;
};
exports.formatDate = function (value, format, culture) {
    var cal = culture.calendar, convert = cal.convert;
    if (!format || !format.length || format === "i") {
        var ret;
        if (culture && culture.name.length) {
            if (convert) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
                ret = (0, exports.formatDate)(value, cal.patterns.F, culture);
            }
            else {
                var eraDate = new Date(value.getTime()), era = (0, exports.getEra)(value, cal.eras);
                eraDate.setFullYear((0, exports.getEraYear)(value, cal, era));
                ret = eraDate.toLocaleString();
            }
        }
        else {
            ret = value.toString();
        }
        return ret;
    }
    var eras = cal.eras, sortable = format === "s";
    format = (0, exports.expandFormat)(cal, format);
    // Start with an empty string
    ret = [];
    var hour, zeros = ["0", "00", "000"], foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g, quoteCount = 0, tokenRegExp = (0, exports.getTokenRegExp)(), converted;
    function padZeros(num, c) {
        var r, s = num + "";
        if (c > 1 && s.length < c) {
            r = (zeros[c - 2] + s);
            return r.substring(r.length - c, r.length);
        }
        else {
            r = s;
        }
        return r;
    }
    function hasDay() {
        if (foundDay || checkedDay) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test(format);
        checkedDay = true;
        return foundDay;
    }
    function getPart(date, part) {
        if (converted) {
            return converted[part];
        }
        switch (part) {
            case 0: return date.getFullYear();
            case 1: return date.getMonth();
            case 2: return date.getDate();
        }
    }
    if (!sortable && convert) {
        converted = convert.fromGregorian(value);
    }
    for (;;) {
        // Save the current index
        var index = tokenRegExp.lastIndex, 
        // Look for the next pattern
        ar = tokenRegExp.exec(format);
        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice(index, ar ? ar.index : format.length);
        quoteCount += (0, exports.appendPreOrPostMatch)(preMatch, ret);
        if (!ar) {
            break;
        }
        // do not replace any matches that occur inside a string literal.
        if (quoteCount % 2) {
            ret.push(ar[0]);
            continue;
        }
        var current = ar[0], clength = current.length;
        switch (current) {
            case "ddd":
            //Day of the week, as a three-letter abbreviation
            case "dddd":
                // Day of the week, using the full name
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push(names[value.getDay()]);
                break;
            case "d":
            // Day of month, without leading zero for single-digit days
            case "dd":
                // Day of month, with leading zero for single-digit days
                foundDay = true;
                ret.push(padZeros(getPart(value, 2), clength));
                break;
            case "MMM":
            // Month, as a three-letter abbreviation
            case "MMMM":
                // Month, using the full name
                var part = getPart(value, 1);
                ret.push((cal.monthsGenitive && hasDay())
                    ?
                        cal.monthsGenitive[clength === 3 ? "namesAbbr" : "names"][part]
                    :
                        cal.months[clength === 3 ? "namesAbbr" : "names"][part]);
                break;
            case "M":
            // Month, as digits, with no leading zero for single-digit months
            case "MM":
                // Month, as digits, with leading zero for single-digit months
                ret.push(padZeros(getPart(value, 1) + 1, clength));
                break;
            case "y":
            // Year, as two digits, but with no leading zero for years less than 10
            case "yy":
            // Year, as two digits, with leading zero for years less than 10
            case "yyyy":
                // Year represented by four full digits
                part = converted ? converted[0] : (0, exports.getEraYear)(value, cal, (0, exports.getEra)(value, eras), sortable);
                if (clength < 4) {
                    part = part % 100;
                }
                ret.push(padZeros(part, clength));
                break;
            case "h":
            // Hours with no leading zero for single-digit hours, using 12-hour clock
            case "hh":
                // Hours with leading zero for single-digit hours, using 12-hour clock
                hour = value.getHours() % 12;
                if (hour === 0)
                    hour = 12;
                ret.push(padZeros(hour, clength));
                break;
            case "H":
            // Hours with no leading zero for single-digit hours, using 24-hour clock
            case "HH":
                // Hours with leading zero for single-digit hours, using 24-hour clock
                ret.push(padZeros(value.getHours(), clength));
                break;
            case "m":
            // Minutes with no leading zero for single-digit minutes
            case "mm":
                // Minutes with leading zero for single-digit minutes
                ret.push(padZeros(value.getMinutes(), clength));
                break;
            case "s":
            // Seconds with no leading zero for single-digit seconds
            case "ss":
                // Seconds with leading zero for single-digit seconds
                ret.push(padZeros(value.getSeconds(), clength));
                break;
            case "t":
            // One character am/pm indicator ("a" or "p")
            case "tt":
                // Multicharacter am/pm indicator
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push(clength === 1 ? part.charAt(0) : part);
                break;
            case "f":
            // Deciseconds
            case "ff":
            // Centiseconds
            case "fff":
                // Milliseconds
                ret.push(padZeros(value.getMilliseconds(), 3).substring(0, clength));
                break;
            case "z":
            // Time zone offset, no leading zero
            case "zz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), clength));
                break;
            case "zzz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), 2)
                    // Hard coded ":" separator, rather than using cal.TimeSeparator
                    // Repeated here for consistency, plus ":" was already assumed in date parsing.
                    + ":" + padZeros(Math.abs(value.getTimezoneOffset() % 60), 2));
                break;
            case "g":
            case "gg":
                if (cal.eras) {
                    ret.push(cal.eras[(0, exports.getEra)(value, eras)].name);
                }
                break;
            case "/":
                ret.push(cal["/"]);
                break;
            default:
                throw "Invalid date format pattern \'" + current + "\'.";
        }
    }
    return ret.join("");
};
// formatNumber
(function () {
    var expandNumber;
    expandNumber = function (number, precision, formatInfo) {
        var groupSizes = formatInfo.groupSizes, curSize = groupSizes[0], curGroupIndex = 1, factor = Math.pow(10, precision), rounded = Math.round(number * factor) / factor;
        if (!isFinite(rounded)) {
            rounded = number;
        }
        number = rounded;
        var numberString = number + "", right = "", split = numberString.split(/e/i), exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
        numberString = split[0];
        split = numberString.split(".");
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        var l;
        if (exponent > 0) {
            right = (0, exports.zeroPad)(right, exponent, false);
            numberString += right.slice(0, exponent);
            right = right.substring(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            numberString = (0, exports.zeroPad)(numberString, exponent + 1);
            right = numberString.slice(-exponent, numberString.length) + right;
            numberString = numberString.slice(0, -exponent);
        }
        if (precision > 0) {
            right = formatInfo["."] +
                ((right.length > precision) ? right.slice(0, precision) : (0, exports.zeroPad)(right, precision));
        }
        else {
            right = "";
        }
        var stringIndex = numberString.length - 1, sep = formatInfo[","], ret = "";
        while (stringIndex >= 0) {
            if (curSize === 0 || curSize > stringIndex) {
                return numberString.slice(0, stringIndex + 1) + (ret.length ? (sep + ret + right) : right);
            }
            ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (sep + ret) : "");
            stringIndex -= curSize;
            if (curGroupIndex < groupSizes.length) {
                curSize = groupSizes[curGroupIndex];
                curGroupIndex++;
            }
        }
        return numberString.slice(0, stringIndex + 1) + sep + ret + right;
    };
    exports.formatNumber = function (value, format, culture) {
        if (!format || format === "i") {
            return culture.name.length ? value.toLocaleString() : value.toString();
        }
        format = format || "D";
        var nf = culture.numberFormat, number = Math.abs(value), precision = -1, pattern;
        if (format.length > 1)
            precision = parseInt(format.slice(1), 10);
        var current = format.charAt(0).toUpperCase(), formatInfo;
        switch (current) {
            case "D":
                pattern = "n";
                if (precision !== -1) {
                    number = (0, exports.zeroPad)("" + number, precision, true);
                }
                if (value < 0)
                    number = -number;
                break;
            case "N":
                formatInfo = nf;
            // fall through
            case "C":
                formatInfo = formatInfo || nf.currency;
            // fall through
            case "P":
                formatInfo = formatInfo || nf.percent;
                pattern = value < 0 ? formatInfo.pattern[0] : (formatInfo.pattern[1] || "n");
                if (precision === -1)
                    precision = formatInfo.decimals;
                number = expandNumber(number * (current === "P" ? 100 : 1), precision, formatInfo);
                break;
            default:
                throw "Bad number format specifier: " + current;
        }
        var patternParts = /n|\$|-|%/g, ret = "";
        for (;;) {
            var index = patternParts.lastIndex, ar = patternParts.exec(pattern);
            ret += pattern.slice(index, ar ? ar.index : pattern.length);
            if (!ar) {
                break;
            }
            switch (ar[0]) {
                case "n":
                    ret += number;
                    break;
                case "$":
                    ret += nf.currency.symbol;
                    break;
                case "-":
                    // don't make 0 negative
                    if (/[1-9]/.test(number.toString())) {
                        ret += nf["-"];
                    }
                    break;
                case "%":
                    ret += nf.percent.symbol;
                    break;
            }
        }
        return ret;
    };
}());
exports.getTokenRegExp = function () {
    // regular expression for matching date and time tokens in format strings.
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
exports.getEra = function (date, eras) {
    if (!eras)
        return 0;
    var start, ticks = date.getTime();
    for (var i = 0, l = eras.length; i < l; i++) {
        start = eras[i].start;
        if (start === null || ticks >= start) {
            return i;
        }
    }
    return 0;
};
exports.getEraYear = function (date, cal, era, sortable) {
    var year = date.getFullYear();
    if (!sortable && cal.eras) {
        // convert normal gregorian year to era-shifted gregorian
        // year by subtracting the era offset
        year -= cal.eras[era].offset;
    }
    return year;
};
// parseExact
(function () {
    var expandYear, getDayIndex, getMonthIndex, getParseRegExp, outOfRange, toUpper, toUpperArray;
    expandYear = function (cal, year) {
        // expands 2-digit year into 4 digits.
        var now = new Date(), era = (0, exports.getEra)(now);
        if (year < 100) {
            var twoDigitYearMax = cal.twoDigitYearMax;
            twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
            var curr = (0, exports.getEraYear)(now, cal, era);
            year += curr - (curr % 100);
            if (year > twoDigitYearMax) {
                year -= 100;
            }
        }
        return year;
    };
    getDayIndex = function (cal, value, abbr) {
        var ret, days = cal.days, upperDays = cal._upperDays;
        if (!upperDays) {
            cal._upperDays = upperDays = [
                toUpperArray(days.names),
                toUpperArray(days.namesAbbr),
                toUpperArray(days.namesShort)
            ];
        }
        value = toUpper(value);
        if (abbr) {
            ret = (0, exports.arrayIndexOf)(upperDays[1], value);
            if (ret === -1) {
                ret = (0, exports.arrayIndexOf)(upperDays[2], value);
            }
        }
        else {
            ret = (0, exports.arrayIndexOf)(upperDays[0], value);
        }
        return ret;
    };
    getMonthIndex = function (cal, value, abbr) {
        var months = cal.months, monthsGen = cal.monthsGenitive || cal.months, upperMonths = cal._upperMonths, upperMonthsGen = cal._upperMonthsGen;
        if (!upperMonths) {
            cal._upperMonths = upperMonths = [
                toUpperArray(months.names),
                toUpperArray(months.namesAbbr)
            ];
            cal._upperMonthsGen = upperMonthsGen = [
                toUpperArray(monthsGen.names),
                toUpperArray(monthsGen.namesAbbr)
            ];
        }
        value = toUpper(value);
        var i = (0, exports.arrayIndexOf)(abbr ? upperMonths[1] : upperMonths[0], value);
        if (i < 0) {
            i = (0, exports.arrayIndexOf)(abbr ? upperMonthsGen[1] : upperMonthsGen[0], value);
        }
        return i;
    };
    getParseRegExp = function (cal, format) {
        // converts a format string into a regular expression with groups that
        // can be used to extract date fields from a date string.
        // check for a cached parse regex.
        var re = cal._parseRegExp;
        if (!re) {
            cal._parseRegExp = re = {};
        }
        else {
            var reFormat = re[format];
            if (reFormat) {
                return reFormat;
            }
        }
        // expand single digit formats, then escape regular expression characters.
        var expFormat = (0, exports.expandFormat)(cal, format).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), regexp = ["^"], groups = [], index = 0, quoteCount = 0, tokenRegExp = (0, exports.getTokenRegExp)(), match;
        // iterate through each date token found.
        while ((match = tokenRegExp.exec(expFormat)) !== null) {
            var preMatch = expFormat.slice(index, match.index);
            index = tokenRegExp.lastIndex;
            // don't replace any matches that occur inside a string literal.
            quoteCount += (0, exports.appendPreOrPostMatch)(preMatch, regexp);
            if (quoteCount % 2) {
                regexp.push(match[0]);
                continue;
            }
            // add a regex group for the token.
            var m = match[0], len = m.length, add;
            switch (m) {
                case "dddd":
                case "ddd":
                case "MMMM":
                case "MMM":
                case "gg":
                case "g":
                    add = "(\\D+)";
                    break;
                case "tt":
                case "t":
                    add = "(\\D*)";
                    break;
                case "yyyy":
                case "fff":
                case "ff":
                case "f":
                    add = "(\\d{" + len + "})";
                    break;
                case "dd":
                case "d":
                case "MM":
                case "M":
                case "yy":
                case "y":
                case "HH":
                case "H":
                case "hh":
                case "h":
                case "mm":
                case "m":
                case "ss":
                case "s":
                    add = "(\\d\\d?)";
                    break;
                case "zzz":
                    add = "([+-]?\\d\\d?:\\d{2})";
                    break;
                case "zz":
                case "z":
                    add = "([+-]?\\d\\d?)";
                    break;
                case "/":
                    add = "(\\" + cal["/"] + ")";
                    break;
                default:
                    throw "Invalid date format pattern \'" + m + "\'.";
            }
            if (add) {
                regexp.push(add);
            }
            groups.push(match[0]);
        }
        (0, exports.appendPreOrPostMatch)(expFormat.slice(index), regexp);
        regexp.push("$");
        // allow whitespace to differ when matching formats.
        var regexpStr = regexp.join("").replace(/\s+/g, "\\s+"), parseRegExp = { "regExp": regexpStr, "groups": groups };
        // cache the regex for this format.
        return re[format] = parseRegExp;
    };
    outOfRange = function (value, low, high) {
        return value < low || value > high;
    };
    toUpper = function (value) {
        // "he-IL" has non-breaking space in weekday names.
        return value.split("\u00A0").join(" ").toUpperCase();
    };
    toUpperArray = function (arr) {
        var results = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            results[i] = toUpper(arr[i]);
        }
        return results;
    };
    exports.parseExact = function (value, format, culture) {
        // try to parse the date string by matching against the format string
        // while using the specified culture for date field names.
        value = (0, exports.trim)(value);
        var cal = culture.calendar, 
        // convert date formats into regular expressions with groupings.
        // use the regexp to determine the input format and extract the date fields.
        parseInfo = getParseRegExp(cal, format), match = new RegExp(parseInfo.regExp).exec(value);
        if (match === null) {
            return null;
        }
        // found a date format that matches the input.
        var groups = parseInfo.groups, era = null, year = null, month = null, date = null, weekDay = null, hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null, pmHour = false;
        // iterate the format groups to extract and set the date fields.
        for (var j = 0, jl = groups.length; j < jl; j++) {
            var matchGroup = match[j + 1];
            if (matchGroup) {
                var current = groups[j], clength = current.length, matchInt = parseInt(matchGroup, 10);
                switch (current) {
                    case "dd":
                    case "d":
                        // Day of month.
                        date = matchInt;
                        // check that date is generally in valid range, also checking overflow below.
                        if (outOfRange(date, 1, 31))
                            return null;
                        break;
                    case "MMM":
                    case "MMMM":
                        month = getMonthIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(month, 0, 11))
                            return null;
                        break;
                    case "M":
                    case "MM":
                        // Month.
                        month = matchInt - 1;
                        if (outOfRange(month, 0, 11))
                            return null;
                        break;
                    case "y":
                    case "yy":
                    case "yyyy":
                        year = clength < 4 ? expandYear(cal, matchInt) : matchInt;
                        if (outOfRange(year, 0, 9999))
                            return null;
                        break;
                    case "h":
                    case "hh":
                        // Hours (12-hour clock).
                        hour = matchInt;
                        if (hour === 12)
                            hour = 0;
                        if (outOfRange(hour, 0, 11))
                            return null;
                        break;
                    case "H":
                    case "HH":
                        // Hours (24-hour clock).
                        hour = matchInt;
                        if (outOfRange(hour, 0, 23))
                            return null;
                        break;
                    case "m":
                    case "mm":
                        // Minutes.
                        min = matchInt;
                        if (outOfRange(min, 0, 59))
                            return null;
                        break;
                    case "s":
                    case "ss":
                        // Seconds.
                        sec = matchInt;
                        if (outOfRange(sec, 0, 59))
                            return null;
                        break;
                    case "tt":
                    case "t":
                        // AM/PM designator.
                        // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                        // the AM tokens. If not, fail the parse for this format.
                        pmHour = cal.PM && (matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2]);
                        if (!pmHour && (!cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2])))
                            return null;
                        break;
                    case "f":
                    // Deciseconds.
                    case "ff":
                    // Centiseconds.
                    case "fff":
                        // Milliseconds.
                        msec = matchInt * Math.pow(10, 3 - clength);
                        if (outOfRange(msec, 0, 999))
                            return null;
                        break;
                    case "ddd":
                    // Day of week.
                    case "dddd":
                        // Day of week.
                        weekDay = getDayIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(weekDay, 0, 6))
                            return null;
                        break;
                    case "zzz":
                        // Time zone offset in +/- hours:min.
                        var offsets = matchGroup.split(/:/);
                        if (offsets.length !== 2)
                            return null;
                        hourOffset = parseInt(offsets[0], 10);
                        if (outOfRange(hourOffset, -12, 13))
                            return null;
                        var minOffset = parseInt(offsets[1], 10);
                        if (outOfRange(minOffset, 0, 59))
                            return null;
                        tzMinOffset = (hourOffset * 60) + ((0, exports.startsWith)(matchGroup, "-") ? -minOffset : minOffset);
                        break;
                    case "z":
                    case "zz":
                        // Time zone offset in +/- hours.
                        hourOffset = matchInt;
                        if (outOfRange(hourOffset, -12, 13))
                            return null;
                        tzMinOffset = hourOffset * 60;
                        break;
                    case "g":
                    case "gg":
                        var eraName = matchGroup;
                        if (!eraName || !cal.eras)
                            return null;
                        eraName = (0, exports.trim)(eraName.toLowerCase());
                        for (var i = 0, l = cal.eras.length; i < l; i++) {
                            if (eraName === cal.eras[i].name.toLowerCase()) {
                                era = i;
                                break;
                            }
                        }
                        // could not find an era with that name
                        if (era === null)
                            return null;
                        break;
                }
            }
        }
        var result = new Date(), defaultYear, convert = cal.convert;
        defaultYear = convert ? convert.fromGregorian(result)[0] : result.getFullYear();
        if (year === null) {
            year = defaultYear;
        }
        else if (cal.eras) {
            // year must be shifted to normal gregorian year
            // but not if year was not specified, its already normal gregorian
            // per the main if clause above.
            year += cal.eras[(era || 0)].offset;
        }
        // set default day and month to 1 and January, so if unspecified, these are the defaults
        // instead of the current day/month.
        if (month === null) {
            month = 0;
        }
        if (date === null) {
            date = 1;
        }
        // now have year, month, and date, but in the culture's calendar.
        // convert to gregorian if necessary
        if (convert) {
            result = convert.toGregorian(year, month, date);
            // conversion failed, must be an invalid match
            if (result === null)
                return null;
        }
        else {
            // have to set year, month and date together to avoid overflow based on current date.
            result.setFullYear(year, month, date);
            // check to see if date overflowed for specified month (only checked 1-31 above).
            if (result.getDate() !== date)
                return null;
            // invalid day of week.
            if (weekDay !== null && result.getDay() !== weekDay) {
                return null;
            }
        }
        // if pm designator token was found make sure the hours fit the 24-hour clock.
        if (pmHour && hour < 12) {
            hour += 12;
        }
        result.setHours(hour, min, sec, msec);
        if (tzMinOffset !== null) {
            // adjust timezone to utc before applying local offset.
            var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
            // Safari limits hours and minutes to the range of -127 to 127.	 We need to use setHours
            // to ensure both these fields will not exceed this range.	adjustedMin will range
            // somewhere between -1440 and 1500, so we only need to split this into hours.
            result.setHours(result.getHours() + parseInt((adjustedMin / 60).toString(), 10), adjustedMin % 60);
        }
        return result;
    };
}());
exports.parseNegativePattern = function (value, nf, negativePattern) {
    var neg = nf["-"], pos = nf["+"], ret;
    switch (negativePattern) {
        case "n -":
            neg = " " + neg;
            pos = " " + pos;
        // fall through
        case "n-":
            if ((0, exports.endsWith)(value, neg)) {
                ret = ["-", value.substring(0, value.length - neg.length)];
            }
            else if ((0, exports.endsWith)(value, pos)) {
                ret = ["+", value.substring(0, value.length - pos.length)];
            }
            break;
        case "- n":
            neg += " ";
            pos += " ";
        // fall through
        case "-n":
            if ((0, exports.startsWith)(value, neg)) {
                ret = ["-", value.substring(neg.length)];
            }
            else if ((0, exports.startsWith)(value, pos)) {
                ret = ["+", value.substring(pos.length)];
            }
            break;
        case "(n)":
            if ((0, exports.startsWith)(value, "(") && (0, exports.endsWith)(value, ")")) {
                ret = ["-", value.substring(1, value.length - 1)];
            }
            break;
    }
    return ret || ["", value];
};
//
// public instance functions
//
exports.Globalize.prototype.findClosestCulture = function (cultureSelector) {
    return exports.Globalize.findClosestCulture.call(this, cultureSelector);
};
exports.Globalize.prototype.format = function (value, format, cultureSelector) {
    return exports.Globalize.format.call(this, value, format, cultureSelector);
};
exports.Globalize.prototype.localize = function (key, cultureSelector) {
    return exports.Globalize.localize.call(this, key, cultureSelector);
};
exports.Globalize.prototype.parseInt = function (value, radix, cultureSelector) {
    return exports.Globalize.parseInt.call(this, value, radix, cultureSelector);
};
exports.Globalize.prototype.parseFloat = function (value, radix, cultureSelector) {
    return exports.Globalize.parseFloat.call(this, value, radix, cultureSelector);
};
exports.Globalize.prototype.culture = function (cultureSelector) {
    return exports.Globalize.culture.call(this, cultureSelector);
};
//
// public singleton functions
//
exports.Globalize.addCultureInfo = function (cultureName, baseCultureName, info) {
    var base = {}, isNew = false;
    if (typeof cultureName !== "string") {
        // cultureName argument is optional string. If not specified, assume info is first
        // and only argument. Specified info deep-extends current culture.
        info = cultureName;
        cultureName = this.culture().name;
        base = this.cultures[cultureName];
    }
    else if (typeof baseCultureName !== "string") {
        // baseCultureName argument is optional string. If not specified, assume info is second
        // argument. Specified info deep-extends specified culture.
        // If specified culture does not exist, create by deep-extending default
        info = baseCultureName;
        isNew = (this.cultures[cultureName] == null);
        base = this.cultures[cultureName] || this.cultures["default"];
    }
    else {
        // cultureName and baseCultureName specified. Assume a new culture is being created
        // by deep-extending an specified base culture
        isNew = true;
        base = this.cultures[baseCultureName];
    }
    this.cultures[cultureName] = (0, exports.extend)(true, {}, base, info);
    // Make the standard calendar the current culture if it's a new culture
    if (isNew) {
        this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
    }
};
exports.Globalize.findClosestCulture = function (name) {
    var match;
    if (!name) {
        return this.cultures[this.cultureSelector] || this.cultures["default"];
    }
    if (typeof name === "string") {
        name = name.split(",");
    }
    if ((0, exports.isArray)(name)) {
        var lang, cultures = this.cultures, list = name, i, l = list.length, prioritized = [];
        for (i = 0; i < l; i++) {
            name = (0, exports.trim)(list[i]);
            var pri, parts = name.split(";");
            lang = (0, exports.trim)(parts[0]);
            if (parts.length === 1) {
                pri = 1;
            }
            else {
                name = (0, exports.trim)(parts[1]);
                if (name.indexOf("q=") === 0) {
                    name = name.substring(2);
                    pri = parseFloat(name);
                    pri = isNaN(pri) ? 0 : pri;
                }
                else {
                    pri = 1;
                }
            }
            prioritized.push({ lang: lang, pri: pri });
        }
        prioritized.sort(function (a, b) {
            return a.pri < b.pri ? 1 : -1;
        });
        // exact match
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            match = cultures[lang];
            if (match) {
                return match;
            }
        }
        // neutral language match
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            do {
                var index = lang.lastIndexOf("-");
                if (index === -1) {
                    break;
                }
                // strip off the last part. e.g. en-US => en
                lang = lang.substring(0, index);
                match = cultures[lang];
                if (match) {
                    return match;
                }
            } while (1);
        }
        // last resort: match first culture using that language
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            for (var cultureKey in cultures) {
                var culture = cultures[cultureKey];
                if (culture.language == lang) {
                    return culture;
                }
            }
        }
    }
    else if (typeof name === "object") {
        return name;
    }
    return match || null;
};
exports.Globalize.format = function (value, format, cultureSelector) {
    var culture = this.findClosestCulture(cultureSelector);
    if (value instanceof Date) {
        value = (0, exports.formatDate)(value, format, culture);
    }
    else if (typeof value === "number") {
        value = (0, exports.formatNumber)(value, format, culture);
    }
    return value;
};
exports.Globalize.localize = function (key, cultureSelector) {
    return (this.findClosestCulture(cultureSelector).messages[key]
        ||
            this.cultures["default"].messages["key"]);
};
exports.Globalize.parseDate = function (value, formats, culture) {
    culture = this.findClosestCulture(culture);
    var date, prop, patterns;
    if (formats) {
        if (typeof formats === "string") {
            formats = [formats];
        }
        if (formats.length) {
            for (var i = 0, l = formats.length; i < l; i++) {
                var format = formats[i];
                if (format) {
                    date = (0, exports.parseExact)(value, format, culture);
                    if (date) {
                        break;
                    }
                }
            }
        }
    }
    else {
        patterns = culture.calendar.patterns;
        for (prop in patterns) {
            date = (0, exports.parseExact)(value, patterns[prop], culture);
            if (date) {
                break;
            }
        }
    }
    return date || null;
};
exports.Globalize.parseInt = function (value, radix, cultureSelector) {
    return Math.floor(exports.Globalize.parseFloat(value, radix, cultureSelector));
};
exports.Globalize.parseFloat = function (value, radix, cultureSelector) {
    // radix argument is optional
    if (typeof radix !== "number") {
        cultureSelector = radix;
        radix = 10;
    }
    var culture = this.findClosestCulture(cultureSelector);
    var ret = NaN, nf = culture.numberFormat;
    if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
        // remove currency symbol
        value = value.replace(culture.numberFormat.currency.symbol, "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.currency["."], culture.numberFormat["."]);
    }
    // trim leading and trailing whitespace
    value = (0, exports.trim)(value);
    // allow infinity or hexidecimal
    if (exports.regexInfinity.test(value)) {
        ret = parseFloat(value);
    }
    else if (!radix && exports.regexHex.test(value)) {
        ret = parseInt(value, 16);
    }
    else {
        var signInfo = (0, exports.parseNegativePattern)(value, nf, nf.pattern[0]), sign = signInfo[0], num = signInfo[1];
        // determine sign and number
        if (sign === "" && nf.pattern[0] !== "-n") {
            signInfo = (0, exports.parseNegativePattern)(value, nf, "-n");
            sign = signInfo[0];
            num = signInfo[1];
        }
        sign = sign || "+";
        // determine exponent and number
        var exponent, intAndFraction, exponentPos = num.indexOf("e");
        if (exponentPos < 0)
            exponentPos = num.indexOf("E");
        if (exponentPos < 0) {
            intAndFraction = num;
            exponent = null;
        }
        else {
            intAndFraction = num.substring(0, exponentPos);
            exponent = num.substring(exponentPos + 1);
        }
        // determine decimal position
        var integer, fraction, decSep = nf["."], decimalPos = intAndFraction.indexOf(decSep);
        if (decimalPos < 0) {
            integer = intAndFraction;
            fraction = null;
        }
        else {
            integer = intAndFraction.substring(0, decimalPos);
            fraction = intAndFraction.substring(decimalPos + decSep.length);
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = nf[","];
        integer = integer.split(groupSep).join("");
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if (groupSep !== altGroupSep) {
            integer = integer.split(altGroupSep).join("");
        }
        // build a natively parsable number string
        var p = sign + integer;
        if (fraction !== null) {
            p += "." + fraction;
        }
        if (exponent !== null) {
            // exponent itself may have a number patternd
            var expSignInfo = (0, exports.parseNegativePattern)(exponent, nf, "-n");
            p += "e" + (expSignInfo[0] || "+") + expSignInfo[1];
        }
        if (exports.regexParseFloat.test(p)) {
            ret = parseFloat(p);
        }
    }
    return ret;
};
exports.Globalize.culture = function (cultureSelector) {
    // setter
    if (typeof cultureSelector !== "undefined") {
        this.cultureSelector = cultureSelector;
    }
    // getter
    return this.findClosestCulture(cultureSelector) || this.culture["default"];
};
//# sourceMappingURL=globalize.js.map

/***/ }),

/***/ 7925:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addMilliseconds = exports.addSeconds = exports.addMinutes = exports.addHours = exports.addDays = exports.addWeeks = exports.addMonths = exports.addYears = void 0;
// dateUtils module provides DateTimeSequence with set of additional date manipulation routines
var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var MonthDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * Returns bool indicating weither the provided year is a leap year.
 * @param year - year value
 */
function isLeap(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}
/**
 * Returns number of days in the provided year/month.
 * @param year - year value
 * @param month - month value
 */
function getMonthDays(year, month) {
    return isLeap(year) ? MonthDaysLeap[month] : MonthDays[month];
}
/**
 * Adds a specified number of years to the provided date.
 * @param date - date value
 * @param yearDelta - number of years to add
 */
function addYears(date, yearDelta) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var isLeapDay = month === 2 && day === 29;
    var result = new Date(date.getTime());
    year = year + yearDelta;
    if (isLeapDay && !isLeap(year)) {
        day = 28;
    }
    result.setFullYear(year, month, day);
    return result;
}
exports.addYears = addYears;
/**
 * Adds a specified number of months to the provided date.
 * @param date - date value
 * @param monthDelta - number of months to add
 */
function addMonths(date, monthDelta) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var result = new Date(date.getTime());
    year += (monthDelta - (monthDelta % 12)) / 12;
    month += monthDelta % 12;
    // VSTS 1325771: Certain column charts don't display any data
    // Wrap arround the month if is after december (value 11)
    if (month > 11) {
        month = month % 12;
        year++;
    }
    day = Math.min(day, getMonthDays(year, month));
    result.setFullYear(year, month, day);
    return result;
}
exports.addMonths = addMonths;
/**
 * Adds a specified number of weeks to the provided date.
 * @param date - date value
 * @param weeks - number of weeks to add
 */
function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
}
exports.addWeeks = addWeeks;
/**
 * Adds a specified number of days to the provided date.
 * @param date - date value
 * @param days - number of days to add
 */
function addDays(date, days) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var result = new Date(date.getTime());
    result.setFullYear(year, month, day + days);
    return result;
}
exports.addDays = addDays;
/**
 * Adds a specified number of hours to the provided date.
 * @param date - date value
 * @param hours - number of hours to add
 */
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 3600000);
}
exports.addHours = addHours;
/**
 * Adds a specified number of minutes to the provided date.
 * @param date - date value
 * @param minutes - number of minutes to add
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
exports.addMinutes = addMinutes;
/**
 * Adds a specified number of seconds to the provided date.
 * @param date - date value
 * @param seconds - number of seconds to add
 */
function addSeconds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}
exports.addSeconds = addSeconds;
/**
 * Adds a specified number of milliseconds to the provided date.
 * @param date - date value
 * @param milliseconds - number of milliseconds to add
 */
function addMilliseconds(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
}
exports.addMilliseconds = addMilliseconds;
//# sourceMappingURL=dateUtils.js.map

/***/ }),

/***/ 7963:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFillColorByPropertyName: () => (/* binding */ getFillColorByPropertyName),
/* harmony export */   getValue: () => (/* binding */ getValue)
/* harmony export */ });
function getValue(object, propertyName, defaultValue) {
    if (!object) {
        return defaultValue;
    }
    const propertyValue = object[propertyName];
    if (propertyValue === undefined) {
        return defaultValue;
    }
    return propertyValue;
}
/** Gets the solid color from a fill property using only a propertyName */
function getFillColorByPropertyName(object, propertyName, defaultColor) {
    const value = getValue(object, propertyName);
    if (!value || !value.solid) {
        return defaultColor;
    }
    return value.solid.color;
}
//# sourceMappingURL=dataViewObject.js.map

/***/ }),

/***/ 8639:
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

/***/ 8849:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ Visual)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7674);
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1847);
/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1480);
/* harmony import */ var _style_landingPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3550);
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
    animatingNodes = new Set();
    animationTimeouts = new Map();
    cachedFormatString = "#,0.00";
    static savedExpandedState = new Map();
    isLandingPageOn = false;
    landingPageRemoved = false;
    landingPageElement;
    //=========================================================================
    // INITIALIZATION
    //=========================================================================
    constructor(options) {
        this.target = options.element;
        this.host = options.host;
        this.formattingSettingsService = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_0__/* .FormattingSettingsService */ .O();
        this.expandedRows = new Map();
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
        // Create context menu
        const contextMenu = document.createElement("div");
        contextMenu.className = "custom-context-menu";
        contextMenu.style.display = "none";
        contextMenu.style.position = "absolute";
        contextMenu.style.zIndex = "1000";
        // Add the Copy Value option first
        const copyItem = document.createElement("div");
        copyItem.className = "context-menu-item";
        copyItem.setAttribute("data-action", "copyValue");
        copyItem.textContent = "Copy Value";
        contextMenu.appendChild(copyItem);
        // Add separator
        const separator = document.createElement("div");
        separator.className = "context-menu-separator";
        contextMenu.appendChild(separator);
        // Add menu items for expand/collapse
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
        // Add the context menu to the DOM once
        this.target.appendChild(contextMenu);
        this.contextMenu = contextMenu;
        // Add event listeners for context menu
        this.setupContextMenuEvents();
    }
    handleLandingPage(options) {
        // Show landing page if no data views or empty data
        if (!options.dataViews || !options.dataViews[0]?.metadata?.columns?.length) {
            if (!this.isLandingPageOn) {
                this.isLandingPageOn = true;
                // Clear previous content
                while (this.target.firstChild) {
                    this.target.removeChild(this.target.firstChild);
                }
                // Create landing page
                const landingPageHTML = this.getLandingPageHTML();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = landingPageHTML;
                // Add landing page to the DOM
                this.landingPageElement = tempDiv.firstChild;
                this.target.appendChild(this.landingPageElement);
                // Add event listener to the continue button
                const continueButton = this.landingPageElement.querySelector('.continue-button');
                if (continueButton) {
                    continueButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        // Remove landing page
                        if (this.landingPageElement && this.landingPageElement.parentNode) {
                            this.landingPageElement.parentNode.removeChild(this.landingPageElement);
                            this.isLandingPageOn = false;
                            this.landingPageRemoved = true;
                            this.createContainerElements();
                        }
                    });
                }
            }
        }
        else {
            // Remove landing page if we have data
            if (this.isLandingPageOn && !this.landingPageRemoved) {
                this.landingPageRemoved = true;
                if (this.landingPageElement && this.landingPageElement.parentNode) {
                    this.landingPageElement.parentNode.removeChild(this.landingPageElement);
                }
                // Recreate the container elements for the actual visual
                this.createContainerElements();
            }
        }
    }
    // Add method to get the landing page HTML content
    getLandingPageHTML() {
        return _style_landingPage__WEBPACK_IMPORTED_MODULE_2__/* .landingPageHTML */ .q;
    }
    //=========================================================================
    // CORE VISUAL METHODS
    //=========================================================================
    //=========================================================================
    // CORE VISUAL METHODS
    //=========================================================================
    update(options) {
        console.log("Update called, checking for data...");
        // Check if we have data
        const hasData = options.dataViews &&
            options.dataViews[0] &&
            options.dataViews[0].metadata &&
            options.dataViews[0].metadata.columns &&
            options.dataViews[0].metadata.columns.length > 0;
        console.log("Has data:", hasData);
        if (!hasData) {
            console.log("No data, showing landing page");
            // Show landing page
            this.showLandingPage();
            return; // Exit early - nothing else to do when showing landing page
        }
        // If we get here, we have data
        console.log("Has data, showing visual");
        // Hide landing page if it exists
        this.hideLandingPage();
        // Regular update logic
        this.lastOptions = options;
        // Save scroll position
        const scrollTop = this.tableDiv?.scrollTop || 0;
        const scrollLeft = this.tableDiv?.scrollLeft || 0;
        // Save current expanded state before clearing
        if (this.expandedRows?.size > 0) {
            Visual.savedExpandedState = new Map(this.expandedRows);
        }
        // Clear previous content
        while (this.tableDiv.firstChild) {
            this.tableDiv.removeChild(this.tableDiv.firstChild);
        }
        // Validate data
        if (!options?.dataViews?.[0])
            return;
        // Get formatting settings
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(_settings__WEBPACK_IMPORTED_MODULE_1__/* .VisualFormattingSettingsModel */ .S, options.dataViews[0]);
        try {
            const dataView = options.dataViews[0];
            // Cache the format string
            this.cachedFormatString = this.getFormatString(dataView);
            // Check if we have matrix data
            if (!dataView.matrix)
                return;
            // Restore the expanded state from the static property
            if (Visual.savedExpandedState.size > 0) {
                this.expandedRows = new Map(Visual.savedExpandedState);
            }
            const matrix = dataView.matrix;
            const measureName = this.getMeasureName(dataView);
            // Create matrix table
            this.createMatrixTable(matrix, measureName);
            // Restore scroll position
            this.tableDiv.scrollTop = scrollTop;
            this.tableDiv.scrollLeft = scrollLeft;
        }
        catch (error) {
            console.error("Error in update:", error);
        }
    }
    getFormattingModel() {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
    //=========================================================================
    // DATA PROCESSING
    //=========================================================================
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
    getMeasureDynamically() {
        if (!this.lastOptions?.dataViews?.[0])
            return "Amount";
        return this.getMeasureName(this.lastOptions.dataViews[0]);
    }
    getFormatString(dataView) {
        // Try to get from matrix valueSources
        if (dataView.matrix?.valueSources?.[0]?.format) {
            return dataView.matrix.valueSources[0].format;
        }
        // Try to get from metadata columns with 'values' role
        if (dataView.metadata?.columns) {
            const valueColumn = dataView.metadata.columns.find(col => col.roles && (col.roles.values || col.roles.value || col.roles.measures || col.roles.measure));
            if (valueColumn?.format) {
                return valueColumn.format;
            }
        }
        return "#,0.00"; // Default fallback format
    }
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
    formatNumber(value, formatString) {
        formatString = formatString || this.cachedFormatString;
        const formatter = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_3__/* .valueFormatter */ .G2.create({ format: formatString });
        return formatter.format(value);
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
    calculateGrandTotals(matrix, columns) {
        const totals = new Array(columns.length).fill(0);
        // If no rows, return zeros
        if (!matrix.rows?.root?.children) {
            return totals;
        }
        // Function to recursively process all leaf nodes
        const processNode = (node) => {
            if (node.children && node.children.length > 0) {
                // Process children recursively
                for (const child of node.children) {
                    processNode(child);
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
            processNode(row);
        }
        return totals;
    }
    //=========================================================================
    // TABLE CREATION AND RENDERING
    //=========================================================================
    createMatrixTable(matrix, measureName) {
        // Create table
        const table = document.createElement("table");
        table.className = CSS_CLASSES.MATRIX_TABLE;
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
        // Use saved expanded state if we have it
        if (Visual.savedExpandedState.size > 0) {
            this.expandedRows = new Map(Visual.savedExpandedState);
        }
        // Initialize level 0 items as expanded if not already set
        if (matrix.rows.root.children) {
            matrix.rows.root.children.forEach((row, idx) => {
                const nodeId = this.getNodeId(row, 0);
                if (!this.expandedRows.has(nodeId)) {
                    this.expandedRows.set(nodeId, true); // Level 0 default to expanded
                }
            });
        }
        // Render rows with current expanded state
        if (matrix.rows.root.children) {
            this.renderRowsWithSubtotals(table, matrix.rows.root.children, columns, 0, "");
        }
        // Calculate grand totals
        const grandTotals = this.calculateGrandTotals(matrix, columns);
        // Add grand total row
        this.addGrandTotalRow(table, columns, grandTotals);
        // Apply all formatting
        this.applyTableFormatting(table);
        // Save expanded state after table creation
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
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
    createTableHeader(table, columns, columnFormats) {
        const thead = document.createElement("thead");
        const headerRow = document.createElement("tr");
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
    renderRowsWithSubtotals(table, rows, columns, level = 0, parentId = "") {
        if (!rows?.length)
            return;
        const tbody = table.querySelector('tbody');
        const columnWidth = this.formattingSettings.generalSettings.columnWidth.value;
        const applySubtotalToLevel0 = true;
        rows.forEach((row, rowIndex) => {
            const nodeId = parentId + this.getNodeId(row, level);
            // Default to expanded for level 0 if not explicitly set
            if (level === 0 && !this.expandedRows.has(nodeId)) {
                this.expandedRows.set(nodeId, true);
            }
            // Get expanded state from our map, default to false for non-level-0
            const isExpanded = this.expandedRows.get(nodeId) ?? false;
            const isLevel0 = level === 0;
            // Create the table row
            const tr = document.createElement("tr");
            tr.setAttribute("data-node-id", nodeId);
            tr.setAttribute("data-level", String(level));
            if (parentId) {
                tr.setAttribute("data-parent-id", parentId);
            }
            if (level > 0) {
                tr.classList.add("expandable-row");
                // Check if parent is expanded
                const parentExpanded = this.expandedRows.get(parentId) ?? false;
                // Hide this row if parent is collapsed OR this level is not expanded by default
                if (!parentExpanded) {
                    tr.classList.add("collapsed");
                }
            }
            if (isLevel0) {
                tr.classList.add(CSS_CLASSES.LEVEL_0_ROW);
            }
            if (row.children?.length > 0) {
                tr.classList.add(CSS_CLASSES.SUBTOTAL_ROW);
            }
            // Add row header
            const rowHeader = this.createRowHeader(row, level, nodeId, isExpanded, isLevel0, true);
            tr.appendChild(rowHeader);
            // Add data cells
            if (row.children?.length > 0) {
                this.addSubtotalCells(tr, row, columns, isLevel0, columnWidth);
            }
            else if (row.values) {
                this.addDataCells(tr, row, columns, columnWidth);
            }
            tbody.appendChild(tr);
            // If this node has children, always render them
            if (row.children?.length > 0) {
                // Set initial collapsed state for children based on parent
                if (!isExpanded) {
                    this.setChildrenCollapsed(nodeId, row.children, level + 1);
                }
                this.renderRowsWithSubtotals(table, row.children, columns, level + 1, nodeId);
            }
            // Add blank row if needed
            this.addBlankRowIfNeeded(tbody, columns, rowIndex, rows.length, row, level);
        });
    }
    //=========================================================================
    // CELL AND ELEMENT CREATION
    //=========================================================================
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
        else {
            th.textContent = this.getMeasureDynamically();
        }
        return th;
    }
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
            // Use the actual expanded state from the map, not the parameter
            const actualIsExpanded = this.expandedRows.get(nodeId) === true;
            const toggleButton = this.createToggleButton(nodeId, actualIsExpanded);
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
    createToggleButton(nodeId, isExpanded) {
        const toggleButton = document.createElement("span");
        toggleButton.className = "toggle-button";
        // Use Unicode characters instead of icon classes
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
    addDataCells(tr, row, columns, columnWidth) {
        columns.forEach((_, j) => {
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
            // Store the raw value as a data attribute
            if (value && typeof value.value === 'number') {
                td.setAttribute('data-raw-value', value.value.toString());
            }
            tr.appendChild(td);
        });
    }
    addSubtotalCells(tr, row, columns, isLevel0, columnWidth) {
        columns.forEach((_, j) => {
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
        });
    }
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
            while (tfoot.firstChild) {
                tfoot.removeChild(tfoot.firstChild);
            }
        }
        this.addBlankRowBeforeTotal(tfoot, columns);
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
        totals.forEach((total, i) => {
            const td = document.createElement('td');
            td.textContent = this.formatNumber(total);
            tr.appendChild(td);
        });
        // Apply formatting to each cell in the grand total row
        const cells = tr.querySelectorAll('th, td');
        cells.forEach(cell => {
            this.applyFormatting(cell, 'grandTotal');
        });
        // Add the row to the footer
        tfoot.appendChild(tr);
    }
    addBlankRowIfNeeded(tbody, columns, currentIndex, totalRows, currentRow, level) {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        // Only add blank rows if the setting is enabled and this is a level 0 row (not the last one)
        if (!blankRowSettings.enableBlankRows.value || level !== 0 || currentIndex >= totalRows - 1) {
            return;
        }
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
    addBlankRowBeforeTotal(tfoot, columns) {
        const blankRowSettings = this.formattingSettings.blankRowSettings;
        // Only add blank row if the setting is enabled
        if (!blankRowSettings.enableBlankRows.value) {
            return;
        }
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
        // Add the cell to the row and the row to the table footer
        blankRow.appendChild(blankCell);
        tfoot.appendChild(blankRow);
    }
    //=========================================================================
    // FORMATTING AND STYLING
    //=========================================================================
    applyTableFormatting(table) {
        if (!this.formattingSettings) {
            return;
        }
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
        }
        catch (error) {
            console.error("Error applying formatting:", error);
        }
    }
    formatCellsByType(table) {
        // Use CSS selectors to get different cell types
        const regularCells = table.querySelectorAll('td.data-cell:not(.subtotal-cell):not(.level-0-subtotal)');
        const subtotalCells = table.querySelectorAll('td.subtotal-cell, td.level-0-subtotal');
        const regularRowHeaders = table.querySelectorAll('tr:not(.subtotal-row) > th.row-header');
        const subtotalRowHeaders = table.querySelectorAll('tr.subtotal-row > th.row-header');
        const columnHeaderCells = table.querySelectorAll('th.column-header:not(.row-header)');
        const cornerCell = table.querySelector('th.row-header.column-header');
        // Apply formatting to each cell type
        regularCells.forEach(cell => this.applyFormatting(cell, 'data'));
        subtotalCells.forEach(cell => this.applyFormatting(cell, 'subtotal'));
        regularRowHeaders.forEach(cell => this.applyFormatting(cell, 'rowHeader'));
        subtotalRowHeaders.forEach(cell => this.applyFormatting(cell, 'subtotal'));
        columnHeaderCells.forEach(cell => this.applyFormatting(cell, 'columnHeader'));
        if (cornerCell) {
            this.applyFormatting(cornerCell, 'columnHeader');
        }
    }
    applyFormatting(element, type) {
        const settings = this.formattingSettings;
        if (!settings)
            return;
        // Common properties to format
        const props = [
            'color',
            'fontSize',
            'backgroundColor',
            'bold',
            'italic',
            'underline',
            'alignment'
        ];
        // Get the appropriate formatting settings based on type
        let formatSettings;
        switch (type) {
            case 'data':
                formatSettings = settings.fontFormatSettings;
                break;
            case 'rowHeader':
                formatSettings = settings.rowHeaderFormatSettings;
                break;
            case 'columnHeader':
                formatSettings = settings.columnHeaderFormatSettings;
                break;
            case 'subtotal':
                formatSettings = settings.subtotalFormatSettings;
                break;
            case 'grandTotal':
                formatSettings = settings.grandTotalSettings;
                break;
        }
        // Apply global font family
        const globalFontFamily = settings.generalSettings.fontFamily.value;
        if (globalFontFamily) {
            element.style.fontFamily = globalFontFamily;
        }
        // Apply global font size (new code)
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
                if (type === 'grandTotal' && element.tagName === 'TH') {
                    element.style.textAlign = 'left';
                }
                else {
                    element.style.textAlign = formatSettings.alignment.value.value.toString();
                }
            }
        }
    }
    applyGlobalBorders(table) {
        const borderSettings = this.formattingSettings.borderSettings;
        if (!borderSettings?.show?.value) {
            // If borders are turned off, remove all border classes
            table.classList.remove(CSS_CLASSES.WITH_BORDERS, CSS_CLASSES.WITH_HORIZONTAL_BORDERS, CSS_CLASSES.WITH_VERTICAL_BORDERS);
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
        // Fix consistent borders on sticky headers
        if (borderSettings.show.value) {
            const rowHeaders = table.querySelectorAll('th.row-header');
            rowHeaders.forEach(header => {
                const headerEl = header;
                if (showVertical) {
                    headerEl.style.borderRightWidth = `${borderWidth}px`;
                    headerEl.style.borderLeftWidth = `${borderWidth}px`;
                }
                if (showHorizontal) {
                    headerEl.style.borderTopWidth = `${borderWidth}px`;
                    headerEl.style.borderBottomWidth = `${borderWidth}px`;
                }
                headerEl.style.borderColor = borderColor;
                headerEl.style.borderStyle = 'solid';
            });
        }
    }
    //=========================================================================
    // EXPAND/COLLAPSE FUNCTIONALITY
    //=========================================================================
    getNodeId(node, level) {
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
            }
            else {
                value = String(node.value);
            }
        }
        else {
            value = "null";
        }
        // Create a consistent node ID
        return `level_${level}_${value}`;
    }
    isExpanded(nodeId) {
        return this.expandedRows.get(nodeId) === true;
    }
    initializeDefaultExpandedState(rows, level, parentId) {
        if (!rows)
            return;
        for (const row of rows) {
            const nodeId = parentId + this.getNodeId(row, level);
            // Default: expand level 0, collapse others
            const defaultExpanded = level === 0;
            this.expandedRows.set(nodeId, defaultExpanded);
            // Always recursively process children
            if (row.children?.length > 0) {
                this.initializeDefaultExpandedState(row.children, level + 1, nodeId);
            }
        }
        // Save to static property
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    // Toggle expanded state of a node
    toggleExpanded(nodeId) {
        // Prevent action if this node is currently animating
        if (this.animatingNodes.has(nodeId) || this.animatingNodes.size > 0) {
            return;
        }
        // Mark this node as animating
        this.animatingNodes.add(nodeId);
        // Get current expanded state and update it
        const isExpanded = this.expandedRows.get(nodeId) ?? false;
        this.expandedRows.set(nodeId, !isExpanded);
        // Get direct children for animation
        const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
        // Update toggle button appearance immediately
        const toggleButton = this.tableDiv.querySelector(`tr[data-node-id="${nodeId}"] .toggle-button`);
        if (toggleButton) {
            // Toggle the text content based on the NEW state
            const newExpandedState = !isExpanded;
            toggleButton.textContent = newExpandedState ? '▲' : '▼';
        }
        // Save state to static property for persistence
        Visual.savedExpandedState = new Map(this.expandedRows);
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        // Set safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupAnimation(nodeId);
        }, 500);
        this.animationTimeouts.set(nodeId, timeout);
        if (isExpanded) {
            // COLLAPSING
            this.animateCollapse(directChildren, nodeId);
        }
        else {
            // EXPANDING
            this.animateExpand(directChildren, nodeId);
        }
    }
    contextMenu;
    activeNodeId = null;
    activeLevel = null;
    activeCell = null;
    setupContextMenuEvents() {
        const tableDiv = this.tableDiv;
        const contextMenu = this.contextMenu;
        // Prevent default context menu on the table
        tableDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            // Hide any visible context menu
            contextMenu.style.display = 'none';
            // Find the clicked cell
            const target = e.target;
            const cell = target.closest('td, th');
            if (cell) {
                // Store the active cell
                this.activeCell = cell;
                // Get row info for expand/collapse
                const row = cell.closest('tr');
                if (row) {
                    this.activeNodeId = row.getAttribute('data-node-id');
                    this.activeLevel = parseInt(row.getAttribute('data-level') || '0', 10);
                }
                // Show context menu at mouse position
                contextMenu.style.left = `${e.pageX}px`;
                contextMenu.style.top = `${e.pageY}px`;
                contextMenu.style.display = 'block';
            }
        });
        // Handle clicks on menu items
        contextMenu.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('context-menu-item')) {
                const action = target.getAttribute('data-action');
                if (action === 'copyValue') {
                    this.copyValueToClipboard();
                }
                else if (this.activeNodeId) {
                    // Handle expand/collapse actions
                    this.handleContextMenuAction(action, this.activeNodeId, this.activeLevel);
                }
                // Hide menu after action
                contextMenu.style.display = 'none';
            }
        });
        // Hide menu when clicking elsewhere
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });
    }
    copyValueToClipboard() {
        if (!this.activeCell)
            return;
        // Check if we have a raw numeric value
        let textToCopy = '';
        const rawValue = this.activeCell.getAttribute('data-raw-value');
        if (rawValue !== null) {
            // We have a raw number value, use it
            textToCopy = rawValue;
        }
        else {
            // Otherwise use the formatted text
            textToCopy = this.activeCell.textContent || '';
        }
        try {
            // Create a temporary textarea element that's properly visible/focused
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            // Same positioning code as before...
            textArea.style.position = 'absolute';
            textArea.style.left = '0';
            textArea.style.top = '0';
            // ... rest of the styling
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast('Clipboard secured! Mission accomplished.');
            }
            else {
                this.showToast('Copy failed—clipboard said "not today." Try again!');
            }
            document.body.removeChild(textArea);
        }
        catch (err) {
            this.showToast('Copy failed - browser restriction');
            console.error('Copy failed:', err);
        }
    }
    showToast(message) {
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
    //=========================================================================
    // ANIMATION METHODS
    //=========================================================================
    disableAllToggleButtons() {
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            btn.style.cursor = "copy";
            btn.style.opacity = "0.5";
            btn.setAttribute('data-animating', 'true');
        });
    }
    animateExpand(rows, nodeId) {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        // Prepare rows for animation
        rows.forEach(row => {
            // Setup for animation
            row.classList.remove('collapsed', 'collapsing-wave');
            row.style.height = '0';
            row.style.opacity = '0';
            row.style.overflow = 'hidden';
            row.style.transformOrigin = 'top';
            row.style.transform = 'scaleY(0.3)'; // Starting transform
            // Set target height
            const naturalHeight = row.scrollHeight;
            row.style.setProperty('--row-height', `${naturalHeight}px`);
        });
        // Force a reflow
        void rows[0].offsetHeight;
        // Apply animation with more pronounced staggered delay
        rows.forEach((row, index) => {
            // Increase delay between rows (from 20ms to 50ms)
            row.style.animationDelay = `${index * 50}ms`;
            row.classList.add('expanding-wave');
        });
        // Listen for animation end on the last row
        const lastRow = rows[rows.length - 1];
        lastRow.addEventListener('animationend', () => {
            // Cleanup all styling
            rows.forEach(row => {
                row.classList.remove('expanding-wave');
                row.style.animationDelay = '';
                row.style.height = '';
                row.style.opacity = '';
                row.style.overflow = '';
                row.style.transform = '';
            });
            this.cleanupAnimation(nodeId);
        }, { once: true });
    }
    animateCollapse(rows, nodeId) {
        if (rows.length === 0) {
            this.cleanupAnimation(nodeId);
            return;
        }
        // Prepare rows for animation
        rows.forEach(row => {
            row.classList.remove('expanding-wave', 'collapsed');
            row.style.transformOrigin = 'top';
            // Set initial state
            const rowHeight = row.offsetHeight;
            row.style.setProperty('--row-height', `${rowHeight}px`);
            row.style.overflow = 'hidden';
            // Force reflow
            void row.offsetHeight;
        });
        // Apply animation with more pronounced staggered delay
        // Reverse the order for collapse, so items collapse from bottom to top
        rows.slice().reverse().forEach((row, index) => {
            row.style.animationDelay = `${index * 50}ms`;
            row.classList.add('collapsing-wave');
        });
        // Listen for animation end
        const lastRow = rows[0]; // First row will be the last to collapse with our reversed order
        lastRow.addEventListener('animationend', () => {
            // Hide rows after animation
            rows.forEach(row => {
                row.classList.remove('collapsing-wave');
                row.classList.add('collapsed');
                row.style.animationDelay = '';
                row.style.transform = '';
            });
            this.cleanupAnimation(nodeId);
        }, { once: true });
    }
    cleanupAnimation(nodeId) {
        // Clear timeout
        const timeout = this.animationTimeouts.get(nodeId);
        if (timeout) {
            window.clearTimeout(timeout);
            this.animationTimeouts.delete(nodeId);
        }
        // Remove from animating set
        this.animatingNodes.delete(nodeId);
        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });
        // Get current expanded state
        const isExpanded = this.expandedRows.get(nodeId) ?? false;
        // Make sure all direct children have the correct visibility
        const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
        directChildren.forEach(child => {
            if (isExpanded) {
                child.classList.remove('collapsed');
            }
            else {
                child.classList.add('collapsed');
            }
        });
        // If this was a collapse, also collapse all descendants
        if (!isExpanded) {
            // Mark all descendants as collapsed in the state
            const allDescendants = this.findAllDescendants(nodeId);
            allDescendants.forEach(row => {
                const rowId = row.getAttribute('data-node-id');
                if (rowId) {
                    // Update the UI
                    row.classList.add('collapsed');
                    // Update toggle button
                    const childToggle = row.querySelector('.toggle-button');
                    if (childToggle) {
                        childToggle.textContent = "▲"; // Collapsed state
                    }
                    // Update state
                    this.expandedRows.set(rowId, false);
                }
            });
        }
        // Save final state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    //=========================================================================
    // HELPER METHODS
    //=========================================================================
    findAllDescendants(nodeId) {
        const allRows = Array.from(this.tableDiv.querySelectorAll('tr[data-node-id]'));
        const allDescendants = [];
        // Helper function to recursively find descendants
        const findDescendants = (id) => {
            const children = allRows.filter(row => row.getAttribute('data-parent-id') === id);
            children.forEach(child => {
                allDescendants.push(child);
                const childId = child.getAttribute('data-node-id');
                if (childId) {
                    findDescendants(childId);
                }
            });
        };
        findDescendants(nodeId);
        return allDescendants;
    }
    getAllDescendants(nodeId) {
        const allRows = Array.from(this.tableDiv.querySelectorAll('tr[data-node-id]'));
        const descendants = [];
        // Get direct children
        const directChildren = allRows.filter(row => row.getAttribute('data-parent-id') === nodeId);
        descendants.push(...directChildren);
        // Recursively add their descendants
        directChildren.forEach(child => {
            const childId = child.getAttribute('data-node-id');
            if (childId) {
                descendants.push(...this.getAllDescendants(childId));
            }
        });
        return descendants;
    }
    setChildrenCollapsed(parentId, children, level) {
        if (!children)
            return;
        for (const child of children) {
            const childId = parentId + this.getNodeId(child, level);
            this.expandedRows.set(childId, false);
            if (child.children?.length > 0) {
                this.setChildrenCollapsed(childId, child.children, level + 1);
            }
        }
    }
    handleContextMenuAction(action, nodeId, level) {
        if (!nodeId)
            return;
        // Prevent multiple animations running at once
        if (this.animatingNodes.size > 0)
            return;
        switch (action) {
            case 'expandThis':
                // Expand just this item if it's collapsed
                if (!this.isExpanded(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
            case 'collapseThis':
                // Collapse just this item if it's expanded
                if (this.isExpanded(nodeId)) {
                    this.toggleExpanded(nodeId);
                }
                break;
            case 'expandLevel':
                // Expand all nodes at this level
                this.animateExpandCollapseLevel(level, true);
                break;
            case 'collapseLevel':
                // Collapse all nodes at this level
                this.animateExpandCollapseLevel(level, false);
                break;
            case 'expandAll':
                // Expand all nodes
                this.animateExpandCollapseAll(true);
                break;
            case 'collapseAll':
                // Collapse all nodes
                this.animateExpandCollapseAll(false);
                break;
        }
    }
    animateExpandCollapseLevel(level, expand) {
        // Find all rows at the specified level that have children (i.e., toggle buttons)
        const levelRows = Array.from(this.tableDiv.querySelectorAll(`tr[data-level="${level}"] .toggle-button`)).map(btn => btn.closest('tr'));
        // Filter to only rows that need to change state (not already in desired state)
        const rowsToChange = levelRows.filter(row => {
            if (!row)
                return false;
            const nodeId = row.getAttribute('data-node-id');
            return nodeId && this.expandedRows.get(nodeId) !== expand;
        });
        if (rowsToChange.length === 0)
            return;
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        // Track animation state
        const batchId = `level_${level}_${expand ? 'expand' : 'collapse'}_batch`;
        this.animatingNodes.add(batchId);
        // Set a safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
        }, 1000);
        this.animationTimeouts.set(batchId, timeout);
        // Process each row with small delays between them to create wave effect
        rowsToChange.forEach((row, index) => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId)
                return;
            // Update toggle button appearance immediately
            const toggleButton = row.querySelector('.toggle-button');
            if (toggleButton) {
                toggleButton.textContent = expand ? '▲' : '▼';
            }
            // Update the state in our map
            this.expandedRows.set(nodeId, expand);
            // Wait a small amount of time before processing each row
            setTimeout(() => {
                const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
                if (expand) {
                    // Animate expansion
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                else {
                    // Animate collapse
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                // If this is the last row, set up cleanup
                if (index === rowsToChange.length - 1) {
                    const lastChildren = directChildren[directChildren.length - 1];
                    if (lastChildren) {
                        lastChildren.addEventListener('animationend', () => {
                            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
                        }, { once: true });
                    }
                }
            }, index * 60); // Slightly longer delay between parent rows
        });
        // Save expanded state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    // New method for animated expand/collapse all
    animateExpandCollapseAll(expand) {
        // Get all rows with toggle buttons (rows that can be expanded/collapsed)
        const allToggleRows = Array.from(this.tableDiv.querySelectorAll('tr .toggle-button')).map(btn => btn.closest('tr'));
        // Filter to only rows that need to change state
        const rowsToChange = allToggleRows.filter(row => {
            if (!row)
                return false;
            const nodeId = row.getAttribute('data-node-id');
            return nodeId && this.expandedRows.get(nodeId) !== expand;
        });
        if (rowsToChange.length === 0)
            return;
        // Disable all toggle buttons during animation
        this.disableAllToggleButtons();
        // Track animation state
        const batchId = `all_${expand ? 'expand' : 'collapse'}_batch`;
        this.animatingNodes.add(batchId);
        // Set a safety timeout
        const timeout = window.setTimeout(() => {
            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
        }, 2000);
        this.animationTimeouts.set(batchId, timeout);
        // Sort rows by level for better animation (top-to-bottom for expand, bottom-to-top for collapse)
        rowsToChange.sort((a, b) => {
            const levelA = parseInt(a.getAttribute('data-level') || '0', 10);
            const levelB = parseInt(b.getAttribute('data-level') || '0', 10);
            return expand ? levelA - levelB : levelB - levelA;
        });
        // Process each row with small delays between them
        rowsToChange.forEach((row, index) => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId)
                return;
            // Update toggle button appearance
            const toggleButton = row.querySelector('.toggle-button');
            if (toggleButton) {
                toggleButton.textContent = expand ? '▲' : '▼';
            }
            // Update the state in our map
            this.expandedRows.set(nodeId, expand);
            // Wait a small amount of time before processing each row
            setTimeout(() => {
                const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
                if (expand) {
                    // Animate expansion
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                else {
                    // Animate collapse
                    this.animateRowsWithoutCleanup(directChildren, expand);
                }
                // If this is the last row, set up cleanup
                if (index === rowsToChange.length - 1) {
                    const lastChildren = directChildren[directChildren.length - 1];
                    if (lastChildren) {
                        lastChildren.addEventListener('animationend', () => {
                            this.cleanupBatchAnimation(batchId, rowsToChange, expand);
                        }, { once: true });
                    }
                }
            }, index * 40); // Slightly smaller delay to keep total animation time reasonable
        });
        // Save expanded state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    // Helper method to animate rows without immediate cleanup
    animateRowsWithoutCleanup(rows, isExpand) {
        if (rows.length === 0)
            return;
        if (isExpand) {
            // Prepare rows for expand animation
            rows.forEach(row => {
                row.classList.remove('collapsed', 'collapsing-wave');
                row.style.height = '0';
                row.style.opacity = '0';
                row.style.overflow = 'hidden';
                row.style.transformOrigin = 'top';
                row.style.transform = 'scaleY(0.3)';
                const naturalHeight = row.scrollHeight;
                row.style.setProperty('--row-height', `${naturalHeight}px`);
            });
            // Force a reflow
            void rows[0].offsetHeight;
            // Apply animation with staggered delay
            rows.forEach((row, index) => {
                row.style.animationDelay = `${index * 50}ms`;
                row.classList.add('expanding-wave');
            });
        }
        else {
            // Prepare rows for collapse animation
            rows.forEach(row => {
                row.classList.remove('expanding-wave', 'collapsed');
                row.style.transformOrigin = 'top';
                const rowHeight = row.offsetHeight;
                row.style.setProperty('--row-height', `${rowHeight}px`);
                row.style.overflow = 'hidden';
            });
            // Force a reflow
            void rows[0].offsetHeight;
            // Apply animation with staggered delay (reversed for collapse)
            rows.slice().reverse().forEach((row, index) => {
                row.style.animationDelay = `${index * 50}ms`;
                row.classList.add('collapsing-wave');
            });
        }
    }
    // Cleanup for batch operations
    cleanupBatchAnimation(batchId, rows, wasExpanding) {
        // Clear timeout
        const timeout = this.animationTimeouts.get(batchId);
        if (timeout) {
            window.clearTimeout(timeout);
            this.animationTimeouts.delete(batchId);
        }
        // Remove from animating set
        this.animatingNodes.delete(batchId);
        // Re-enable all toggle buttons
        const allButtons = this.tableDiv.querySelectorAll('.toggle-button');
        allButtons.forEach((btn) => {
            const htmlBtn = btn;
            htmlBtn.style.cursor = "pointer";
            htmlBtn.style.opacity = "1";
            htmlBtn.removeAttribute('data-animating');
        });
        // Clean up all rows
        rows.forEach(row => {
            const nodeId = row.getAttribute('data-node-id');
            if (!nodeId)
                return;
            // Get direct children
            const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
            // Remove animation classes and reset styles
            directChildren.forEach(child => {
                child.classList.remove('expanding-wave', 'collapsing-wave');
                child.style.animationDelay = '';
                child.style.height = '';
                child.style.opacity = '';
                child.style.overflow = '';
                child.style.transform = '';
                // Set final class based on expanded state
                if (wasExpanding) {
                    child.classList.remove('collapsed');
                }
                else {
                    child.classList.add('collapsed');
                }
            });
        });
        // Call updateExpandedState to ensure UI is consistent
        this.updateExpandedState();
        // Save final state
        Visual.savedExpandedState = new Map(this.expandedRows);
    }
    updateExpandedState() {
        // This function updates the UI to reflect the current expanded state
        const allRows = Array.from(this.tableDiv.querySelectorAll('tr[data-node-id]'));
        allRows.forEach(row => {
            const nodeId = row.getAttribute('data-node-id');
            const parentId = row.getAttribute('data-parent-id');
            if (nodeId) {
                // For non-root elements, check if parent is expanded
                if (parentId) {
                    const parentExpanded = this.expandedRows.get(parentId) === true;
                    if (!parentExpanded) {
                        // If parent is collapsed, hide this row
                        row.classList.add('collapsed');
                    }
                    else {
                        // If parent is expanded, show/hide based on this row's state
                        const isExpanded = this.expandedRows.get(nodeId) === true;
                        // Only check direct children
                        const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
                        directChildren.forEach(child => {
                            if (isExpanded) {
                                child.classList.remove('collapsed');
                            }
                            else {
                                child.classList.add('collapsed');
                            }
                        });
                    }
                }
                else {
                    // Root level elements - just check their own state
                    const isExpanded = this.expandedRows.get(nodeId) === true;
                    // Update direct children
                    const directChildren = Array.from(this.tableDiv.querySelectorAll(`tr[data-parent-id="${nodeId}"]`));
                    directChildren.forEach(child => {
                        if (isExpanded) {
                            child.classList.remove('collapsed');
                        }
                        else {
                            child.classList.add('collapsed');
                        }
                    });
                }
            }
        });
    }
    showLandingPage() {
        console.log("Showing landing page");
        // Clear existing content
        while (this.target.firstChild) {
            this.target.removeChild(this.target.firstChild);
        }
        // Create container for landing page
        const container = document.createElement('div');
        container.className = 'landing-page-container';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.overflow = 'hidden';
        container.style.position = 'relative';
        container.style.background = '#13141a'; // Dark background from your HTML
        // Insert the HTML
        container.innerHTML = _style_landingPage__WEBPACK_IMPORTED_MODULE_2__/* .landingPageHTML */ .q;
        // Store reference and add to DOM
        this.landingPageElement = container;
        this.target.appendChild(container);
        console.log("Landing page added to DOM");
        // Add event listener to the continue button
        const continueButton = this.landingPageElement.querySelector('.continue-button');
        if (continueButton) {
            continueButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.hideLandingPage();
            });
        }
        this.isLandingPageOn = true;
    }
    hideLandingPage() {
        if (this.isLandingPageOn && this.landingPageElement) {
            console.log("Hiding landing page");
            // Remove landing page
            if (this.landingPageElement.parentNode) {
                this.landingPageElement.parentNode.removeChild(this.landingPageElement);
            }
            this.isLandingPageOn = false;
            // Create container elements for the visual
            this.createContainerElements();
        }
    }
}


/***/ }),

/***/ 8862:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCommonValue: () => (/* binding */ getCommonValue),
/* harmony export */   getFillColor: () => (/* binding */ getFillColor),
/* harmony export */   getObject: () => (/* binding */ getObject),
/* harmony export */   getValue: () => (/* binding */ getValue)
/* harmony export */ });
/* harmony import */ var _dataViewObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7963);

/** Gets the value of the given object/property pair. */
function getValue(objects, propertyId, defaultValue) {
    if (!objects) {
        return defaultValue;
    }
    return _dataViewObject__WEBPACK_IMPORTED_MODULE_0__.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
}
/** Gets an object from objects. */
function getObject(objects, objectName, defaultValue) {
    if (objects && objects[objectName]) {
        return objects[objectName];
    }
    return defaultValue;
}
/** Gets the solid color from a fill property. */
function getFillColor(objects, propertyId, defaultColor) {
    const value = getValue(objects, propertyId);
    if (!value || !value.solid) {
        return defaultColor;
    }
    return value.solid.color;
}
function getCommonValue(objects, propertyId, defaultValue) {
    const value = getValue(objects, propertyId, defaultValue);
    if (value && value.solid) {
        return value.solid.color;
    }
    if (value === undefined
        || value === null
        || (typeof value === "object" && !value.solid)) {
        return defaultValue;
    }
    return value;
}
//# sourceMappingURL=dataViewObjects.js.map

/***/ }),

/***/ 9098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createValueColumns: () => (/* binding */ createValueColumns),
/* harmony export */   groupValues: () => (/* binding */ groupValues),
/* harmony export */   setGrouped: () => (/* binding */ setGrouped)
/* harmony export */ });
// TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
// TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
function createValueColumns(values = [], valueIdentityFields, source) {
    const result = values;
    setGrouped(result);
    if (valueIdentityFields) {
        result.identityFields = valueIdentityFields;
    }
    if (source) {
        result.source = source;
    }
    return result;
}
function setGrouped(values, groupedResult) {
    values.grouped = groupedResult
        ? () => groupedResult
        : () => groupValues(values);
}
/** Group together the values with a common identity. */
function groupValues(values) {
    const groups = [];
    let currentGroup;
    for (let i = 0, len = values.length; i < len; i++) {
        const value = values[i];
        if (!currentGroup || currentGroup.identity !== value.identity) {
            currentGroup = {
                values: []
            };
            if (value.identity) {
                currentGroup.identity = value.identity;
                const source = value.source;
                // allow null, which will be formatted as (Blank).
                if (source.groupName !== undefined) {
                    currentGroup.name = source.groupName;
                }
                else if (source.displayName) {
                    currentGroup.name = source.displayName;
                }
            }
            groups.push(currentGroup);
        }
        currentGroup.values.push(value);
    }
    return groups;
}
//# sourceMappingURL=dataViewTransform.js.map

/***/ }),

/***/ 9397:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   categoryIsAlsoSeriesRole: () => (/* binding */ categoryIsAlsoSeriesRole),
/* harmony export */   getMiscellaneousTypeDescriptor: () => (/* binding */ getMiscellaneousTypeDescriptor),
/* harmony export */   getSeriesName: () => (/* binding */ getSeriesName),
/* harmony export */   hasImageUrlColumn: () => (/* binding */ hasImageUrlColumn),
/* harmony export */   isImageUrlColumn: () => (/* binding */ isImageUrlColumn),
/* harmony export */   isWebUrlColumn: () => (/* binding */ isWebUrlColumn)
/* harmony export */ });
/* harmony import */ var _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5165);
// powerbi.extensibility.utils.dataview

function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
    if (dataView.categories && dataView.categories.length > 0) {
        // Need to pivot data if our category soure is a series role
        const category = dataView.categories[0];
        return category.source &&
            _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__.hasRole(category.source, seriesRoleName) &&
            _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__.hasRole(category.source, categoryRoleName);
    }
    return false;
}
function getSeriesName(source) {
    return (source.groupName !== undefined)
        ? source.groupName
        : source.queryName;
}
function isImageUrlColumn(column) {
    const misc = getMiscellaneousTypeDescriptor(column);
    return misc != null && misc.imageUrl === true;
}
function isWebUrlColumn(column) {
    const misc = getMiscellaneousTypeDescriptor(column);
    return misc != null && misc.webUrl === true;
}
function getMiscellaneousTypeDescriptor(column) {
    return column
        && column.type
        && column.type.misc;
}
function hasImageUrlColumn(dataView) {
    if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
        return false;
    }
    return dataView.metadata.columns.some((column) => isImageUrlColumn(column) === true);
}
//# sourceMappingURL=converterHelper.js.map

/***/ }),

/***/ 9754:
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
/* harmony import */ var _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8639);
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

/***/ 9933:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   converterHelper: () => (/* reexport module object */ _converterHelper__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   dataRoleHelper: () => (/* reexport module object */ _dataRoleHelper__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   dataViewObject: () => (/* reexport module object */ _dataViewObject__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   dataViewObjects: () => (/* reexport module object */ _dataViewObjects__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   dataViewObjectsParser: () => (/* reexport module object */ _dataViewObjectsParser__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   dataViewTransform: () => (/* reexport module object */ _dataViewTransform__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   dataViewWildcard: () => (/* reexport module object */ _dataViewWildcard__WEBPACK_IMPORTED_MODULE_6__)
/* harmony export */ });
/* harmony import */ var _converterHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9397);
/* harmony import */ var _dataRoleHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5165);
/* harmony import */ var _dataViewObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7963);
/* harmony import */ var _dataViewObjects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8862);
/* harmony import */ var _dataViewObjectsParser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6573);
/* harmony import */ var _dataViewTransform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9098);
/* harmony import */ var _dataViewWildcard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(686);








//# sourceMappingURL=index.js.map

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/* harmony import */ var visualPlugin_src_visual_WEBPACK_IMPORTED_MODULE_0_ = __webpack_require__(8849);

var visualPlugin_powerbiKey = "powerbi";
var visualPlugin_powerbi = window[visualPlugin_powerbiKey];
var visualPlugin_customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG = {
    name: 'customMatrix3D2AF31BB00A42FC89209A2F7F87EB77_DEBUG',
    displayName: 'NovaGrid',
    class: 'Visual',
    apiVersion: '5.11.0',
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