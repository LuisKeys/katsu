"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validExtensions = void 0;
exports.getExtWithDot = getExtWithDot;
/**
 * Array of valid file extensions.
 * @type {string[]}
 */
var validExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
exports.validExtensions = validExtensions;
/**
 * Adds a dot prefix to each extension in the given list.
 * @param {string[]} validExtensions - List of extensions.
 * @returns {string[]} - List of extensions with dot prefix.
 */
function getExtWithDot(validExtensions) {
    return validExtensions.map(function (extension) { return ".".concat(extension); });
}
