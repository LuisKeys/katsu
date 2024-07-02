"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanPrompt = void 0;
/**
 * Cleans the given prompt by converting it to lowercase, removing extra spaces, and removing final punctuation marks.
 * @param {string} prompt - The prompt to be cleaned.
 * @returns {string} - The cleaned prompt.
 */
var cleanPrompt = function (prompt) {
    // To lower case
    var promptCl = prompt.toLowerCase();
    // Remove any extra spaces
    promptCl = promptCl.trim();
    // Remove final point, comma or question mark
    promptCl = promptCl.replace(/[\.,\?]+$/, '');
    return promptCl;
};
exports.cleanPrompt = cleanPrompt;
