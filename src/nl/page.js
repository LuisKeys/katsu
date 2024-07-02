"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageNumber = exports.getPageCommand = exports.PAGE_PREV = exports.PAGE_NUMBER = exports.PAGE_NEXT = exports.PAGE_LAST = exports.PAGE_FIRST = void 0;
var PAGE_NEXT = 'next';
exports.PAGE_NEXT = PAGE_NEXT;
var PAGE_PREV = 'prev';
exports.PAGE_PREV = PAGE_PREV;
var PAGE_FIRST = 'first';
exports.PAGE_FIRST = PAGE_FIRST;
var PAGE_LAST = 'last';
exports.PAGE_LAST = PAGE_LAST;
var PAGE_NUMBER = 'number';
exports.PAGE_NUMBER = PAGE_NUMBER;
/**
 * Retrieves the page command based on the given prompt.
 *
 * @param {string} prompt - The prompt to extract the page command from.
 * @returns {string} The page command.
 */
var getPageCommand = function (prompt) {
    var cmd = prompt.toLowerCase().replace('page', '').trim();
    if (/^\d+$/.test(cmd)) {
        cmd = PAGE_NUMBER;
        return cmd;
    }
    switch (cmd) {
        case 'last':
            cmd = PAGE_LAST;
            break;
        case 'next':
            cmd = PAGE_NEXT;
            break;
        case 'previous':
            cmd = PAGE_PREV;
            break;
        default:
            cmd = PAGE_FIRST;
            break;
    }
    return cmd;
};
exports.getPageCommand = getPageCommand;
var getPageNumber = function (prompt) {
    var cmd = prompt.toLowerCase().replace('page', '').trim();
    if (/^\d+$/.test(cmd)) {
        return parseInt(cmd);
    }
    return 1;
};
exports.getPageNumber = getPageNumber;
