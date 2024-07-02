"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = void 0;
/**
 * Formats a number with thousand and decimal separators.
 * @param {string} number - The non-formatted number as a string.
 * @returns {string} - The formatted number with separators.
 */
var formatNumber = function (number) {
    // Convert the number to a float
    var parsedNumber = parseFloat(number);
    // Check if the number is valid
    if (isNaN(parsedNumber)) {
        return "";
    }
    return parsedNumber.toLocaleString();
};
exports.formatNumber = formatNumber;
