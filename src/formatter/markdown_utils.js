"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTableData = exports.getMarkdownTableSeparator = exports.getTableData = exports.getMarkdownTableRow = exports.getColumnWidths = void 0;
var phone_formatter_1 = require("./phone_formatter");
var number_formatter_1 = require("./number_formatter");
/**
 * Retrieves table data from the given result object.
 * @param {Object} result - The result object containing fields and rows.
 * @returns {Array} - The table data as a 2D array.
 */
var getTableData = function (result, allRows) {
    var maxColumns = Number(process.env.MAX_COLUMNS);
    var tableData = [];
    var pageSize = Number(process.env.RESULT_PAGE_SIZE);
    // Get the header
    var header = [];
    var useDispFields = false;
    if (result.dispFields.length > 0 && result.rows.length >= 1) {
        if (result.fields.length > 1) {
            useDispFields = true;
        }
    }
    if (useDispFields) {
        for (var i = 0; i < result.dispFields.length && i < maxColumns; i++) {
            header.push(result.dispFields[i]);
        }
    }
    else {
        for (var i = 0; i < result.fields.length && i < maxColumns; i++) {
            header.push(result.fields[i]);
        }
    }
    tableData.push(header);
    // Get the rows
    var startIndex = (result.pageNum - 1) * pageSize;
    var endIndex = startIndex + pageSize;
    if (allRows) {
        startIndex = 0;
        endIndex = result.rows.length;
    }
    for (var i = startIndex; i < result.rows.length && i < endIndex; i++) {
        var row = result.rows[i];
        var values = [];
        for (var j = 0; j < header.length; j++) {
            var field = header[j];
            values.push(row[field]);
        }
        tableData.push(values);
    }
    return tableData;
};
exports.getTableData = getTableData;
/**
 * Function to get the maximum lengths of each column of a table.
 * @param {Array} tableData - The data of the table.
 * @returns {Array} - An array containing the maximum lengths of each column.
 */
var getColumnWidths = function (tableData) {
    var columnWidths = [];
    var maxColumnWidth = Number(process.env.MAX_COLUMN_WIDTH);
    for (var _i = 0, tableData_1 = tableData; _i < tableData_1.length; _i++) {
        var row = tableData_1[_i];
        for (var i = 0; i < row.length; i++) {
            if (row[i] === null) {
                row[i] = "";
            }
            if (typeof row[i] == "undefined") {
                row[i] = "";
            }
            if (columnWidths[i] === undefined ||
                row[i].length > columnWidths[i]) {
                columnWidths[i] = row[i].length;
                if (columnWidths[i] < 3) {
                    columnWidths[i] = 3;
                }
                if (columnWidths[i] > maxColumnWidth) {
                    columnWidths[i] = maxColumnWidth;
                }
            }
        }
    }
    return columnWidths;
};
exports.getColumnWidths = getColumnWidths;
/**
 * Function to get a markdown table row with fields limited by pipes.
 * @param {Array} row - The column values.
 * @param {Array} columnLengths - The maximum length for each column.
 * @returns {String} - A markdown table row.
 */
var getMarkdownTableRow = function (row, columnLengths, numColumns, truncate) {
    var markdownRow = "";
    var truncatRow = truncate;
    // If only one field  do not truncate the row
    if (numColumns.length <= 1) {
        truncatRow = false;
    }
    for (var i = 0; i < row.length; i++) {
        var field = row[i].toString();
        var columnLength = columnLengths[i];
        // If the field length is greater than the column length, wrap the text
        if (field.length > columnLength && truncatRow) {
            field = field.substring(0, columnLength - 3) + "...";
        }
        // Pad the field with spaces to match the column width
        var paddedField = "";
        try {
            if (numColumns.includes(i)) {
                paddedField = field.padStart(columnLength);
            }
            else {
                paddedField = field.padEnd(columnLength);
            }
        }
        catch (err) {
            console.log(err);
        }
        markdownRow += " ".concat(paddedField);
    }
    return markdownRow;
};
exports.getMarkdownTableRow = getMarkdownTableRow;
/**
 * Function to get a markdown table separator.
 * @param {Array} columnWidths - The maximum length for each column.
 * @returns {String} - A markdown table separator.
 */
var getMarkdownTableSeparator = function (columnWidths) {
    var separator = "";
    for (var i = 0; i < columnWidths.length; i++) {
        // Add the separator for each column
        separator += " " + "-".repeat(columnWidths[i]);
    }
    return separator;
};
exports.getMarkdownTableSeparator = getMarkdownTableSeparator;
/**
 * Formats the table data by applying formatting rules to numeric columns.
 *
 * @param {Array<Array<any>>} tableData - The table data to be formatted.
 * @returns {Object} - An object containing the formatted table data and the number of numeric columns.
 */
var formatTableData = function (tableData) {
    if (tableData.length === 0) {
        return tableData;
    }
    var phoneColumns = getPhoneColumns(tableData);
    var formattedTableData = (0, phone_formatter_1.formatPhoneNumber)(tableData, phoneColumns);
    var numColumns = getNumericColumns(formattedTableData, phoneColumns);
    formattedTableData = formatNumericColumns(formattedTableData, numColumns);
    var result = { tableData: formattedTableData, numColumns: numColumns };
    return result;
};
exports.formatTableData = formatTableData;
/**
 * Retrieves the indices of phone number columns in a table.
 *
 * @param {Array<Array<any>>} tableData - The table data.
 * @returns {Array<number>} - The indices of phone number columns.
 */
var getPhoneColumns = function (tableData) {
    var phoneColumns = [];
    var header = tableData[0];
    for (var i = 0; i < header.length; i++) {
        var fieldName = header[i].toLowerCase().trim();
        if (fieldName.includes("phone")) {
            phoneColumns.push(i);
        }
    }
    return phoneColumns;
};
/**
 * Retrieves the indices of numeric columns in a table.
 *
 * @param {Array<Array<any>>} tableData - The table data.
 * @returns {Array<number>} - The indices of numeric columns.
 */
var getNumericColumns = function (tableData, phoneColumns) {
    var numericColumns = [];
    var header = tableData[0];
    for (var i = 0; i < header.length; i++) {
        var isNumeric = true;
        for (var j = 1; j < tableData.length; j++) {
            if (isNaN(tableData[j][i])) {
                isNumeric = false;
                break;
            }
        }
        if (isNumeric) {
            if (!phoneColumns.includes(i)) {
                numericColumns.push(i);
            }
        }
    }
    return numericColumns;
};
/**
 * Formats the numeric columns of a table data array.
 *
 * @param {Array<Array<any>>} tableData - The table data array.
 * @param {Array<number>} numColumns - The indices of the numeric columns.
 * @returns {Array<Array<any>>} - The formatted table data array.
 */
var formatNumericColumns = function (tableData, numColumns) {
    for (var i = 1; i < tableData.length; i++) {
        for (var j = 0; j < numColumns.length; j++) {
            tableData[i][numColumns[j]] = (0, number_formatter_1.formatNumber)(tableData[i][numColumns[j]]);
        }
    }
    return tableData;
};
