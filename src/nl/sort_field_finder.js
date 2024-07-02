"use strict";
/**
 * This module provides a function to find the sort field based on a prompt and a result object.
 * @module sort_field_finder
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSortDirection = exports.getSortfield = void 0;
/**
 * Finds the sort field based on a prompt and a result object.
 * @param {string} prompt - The prompt to search for in the field names.
 * @param {object} result - The result object containing the fields.
 * @returns {string[]} - An array of sort field names if found, or an empty array if not found.
 */
var getSortfield = function (result) {
    var sortFields = [];
    var sanitizedPrompt = result.prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
    var promptWords = sanitizedPrompt.split(" ").map(function (word) { return word.trim(); });
    for (var i = 0; i < promptWords.length; i++) {
        var word = promptWords[i].toLowerCase();
        for (var _i = 0, _a = result.fields; _i < _a.length; _i++) {
            var field = _a[_i];
            if (word.toLowerCase() === field.toLowerCase()) {
                sortFields.push(field);
            }
        }
    }
    if (sortFields.length === 0) {
        // Try by field index
        for (var i = 0; i < promptWords.length; i++) {
            var word = promptWords[i].toLowerCase();
            if (!isNaN(Number(word))) {
                var index = parseInt(word);
                index--;
                if (index < 0) {
                    index = 0;
                }
                if (index >= result.fields.length) {
                    index = result.fields.length - 1;
                }
                sortFields.push(result.fields[index]);
            }
        }
    }
    return sortFields;
};
exports.getSortfield = getSortfield;
/**
 * Determines the sort direction based on the given prompt.
 *
 * @param {string} prompt - The prompt to analyze.
 * @returns {string} The sort direction ("asc" for ascending, "desc" for descending).
 */
var getSortDirection = function (prompt) {
    var sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
    if (sanitizedPrompt.includes("asc") || sanitizedPrompt.includes("ascendent")) {
        return "asc";
    }
    if (sanitizedPrompt.includes("desc") || sanitizedPrompt.includes("descendent")) {
        return "desc";
    }
    return "asc";
};
exports.getSortDirection = getSortDirection;
