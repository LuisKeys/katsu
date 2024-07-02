"use strict";
/**
 * @module sort_result
 * @description Module for sorting result rows based on a specified field.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortResult = void 0;
/**
 * Sorts the result rows based on a specified field.
 *
 * @param {Result} result - The result object containing rows to be sorted.
 * @param {Field[]} sortFields - The field array specifying the fields to sort by.
 * @param {string} sortDir - The sort direction ("asc" or "desc").
 * @returns {Array} - The sorted rows.
 */
var sortResult = function (result, sortFields, sortDir) {
    for (var i = 0; i < result.rows.length; i++) {
        for (var j = i + 1; j < result.rows.length; j++) {
            var a = "";
            var b = "";
            for (var k = 0; k < sortFields.length; k++) {
                var field = sortFields[k];
                var at = result.rows[i][field];
                var bt = result.rows[j][field];
                // check if the values are numbers
                if (!isNaN(result.rows[i][field]) && !isNaN(result.rows[j][field])) {
                    at = parseFloat(result.rows[i][field]);
                    bt = parseFloat(result.rows[j][field]);
                }
                a += at;
                b += bt;
            }
            if (sortDir === "asc") {
                if (a > b) {
                    var temp = result.rows[i];
                    result.rows[i] = result.rows[j];
                    result.rows[j] = temp;
                }
            }
            else {
                if (a < b) {
                    var temp = result.rows[i];
                    result.rows[i] = result.rows[j];
                    result.rows[j] = temp;
                }
            }
        }
    }
    return result.rows;
};
exports.sortResult = sortResult;
