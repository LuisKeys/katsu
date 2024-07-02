"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAPIResult = void 0;
var phone_formatter_1 = require("./phone_formatter");
var number_formatter_1 = require("./number_formatter");
/**
 * Formats the API result by applying formatting rules to numeric and phone columns.
 *
 * @param {ResultObject} result - The API result to be formatted.
 * @returns {Object[]} The formatted API result.
 */
var formatAPIResult = function (result) {
    var numColumns = getNumericColumns(result);
    result = formatNumericColumns(result, numColumns);
    var phoneColumns = getPhoneColumns(result);
    result = formatPhoneNumber(result, phoneColumns);
    var currencyColumns = getCurrencyColumns(result);
    result = formatCurrency(result, currencyColumns);
    return result;
};
exports.formatAPIResult = formatAPIResult;
var formatCurrency = function (result, numColumns) {
    for (var i = 1; i < result.rows.length; i++) {
        for (var j = 0; j < numColumns.length; j++) {
            result.rows[i][numColumns[j]] = '$' + result.rows[i][numColumns[j]];
        }
    }
    return result;
};
var formatNumericColumns = function (result, numColumns) {
    for (var i = 1; i < result.rows.length; i++) {
        for (var j = 0; j < numColumns.length; j++) {
            result.rows[i][numColumns[j]] = (0, number_formatter_1.formatNumber)(result.rows[i][numColumns[j]]);
        }
    }
    return result;
};
var getNumericColumns = function (result) {
    var numericColumns = [];
    var header = result.rows[0];
    for (var i = 0; i < header.length; i++) {
        var isNumeric = true;
        for (var j = 1; j < result.rows.length; j++) {
            if (isNaN(result.rows[j][i])) {
                isNumeric = false;
                break;
            }
        }
        if (isNumeric) {
            numericColumns.push(i);
        }
    }
    return numericColumns;
};
var formatPhoneNumber = function (result, numColumns) {
    for (var i = 1; i < result.rows.length; i++) {
        for (var j = 0; j < numColumns.length; j++) {
            var number = result.rows[i][numColumns[j]];
            if (number) {
                var numberDigitsOnly = number.replace(/\D/g, "");
                if (numberDigitsOnly.length === 11 && numberDigitsOnly[0] === "1") {
                    result.rows[i][numColumns[j]] = (0, phone_formatter_1.formatPhoneNumberFieldUS)(number);
                }
                if (numberDigitsOnly.length >= 12 && numberDigitsOnly[0] != "1") {
                    result.rows[i][numColumns[j]] = (0, phone_formatter_1.formatPhoneNumberFieldLA)(number);
                }
                if (numberDigitsOnly.length < 12 && numberDigitsOnly[0] != "1") {
                    result.rows[i][numColumns[j]] = numberDigitsOnly;
                }
            }
            else {
                result.rows[i][numColumns[j]] = "";
            }
        }
    }
    return result;
};
var getPhoneColumns = function (result) {
    var phoneColumns = [];
    var header = result.rows[0];
    for (var i = 0; i < header.length; i++) {
        var fieldName = header[i].toLowerCase().trim();
        if (fieldName.includes("phone")) {
            phoneColumns.push(i);
        }
    }
    return phoneColumns;
};
var getCurrencyColumns = function (result) {
    var currencyColumns = [];
    var header = result.rows[0];
    for (var i = 0; i < header.length; i++) {
        var fieldName = header[i].toLowerCase().trim();
        if (fieldName.includes("amount")) {
            currencyColumns.push(i);
        }
    }
    return currencyColumns;
};
