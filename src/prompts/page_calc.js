"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrevPage = exports.getNextPage = exports.getLastPage = void 0;
/**
 * Calculates the last page number based on the total number of rows and the page size.
 *
 * @param {Object} result - The result object containing the rows.
 * @returns {number} The last page number.
 */
var getLastPage = function (result) {
    var pageSize = Number(process.env.PAGE_SIZE);
    var lastPage = Math.ceil(result.rows.length / pageSize);
    return lastPage;
};
exports.getLastPage = getLastPage;
/**
 * Gets the next page number based on the current page number and the result.
 *
 * @param {number} pageNum - The current page number.
 * @param {any} result - The result object.
 * @returns {number} - The next page number.
 */
var getNextPage = function (result) {
    var page = result.pageNum;
    page++;
    var lastPage = getLastPage(result);
    if (page > lastPage) {
        page = lastPage;
    }
    return page;
};
exports.getNextPage = getNextPage;
/**
 * Returns the previous page number based on the given page number.
 *
 * @param {number} pageNum - The current page number.
 * @returns {number} - The previous page number.
 */
var getPrevPage = function (pageNum) {
    var page = pageNum;
    page--;
    if (page < 1) {
        page = 1;
    }
    return page;
};
exports.getPrevPage = getPrevPage;
