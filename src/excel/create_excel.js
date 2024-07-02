"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExcel = void 0;
var clean = require("../files/clean");
var excel = require("excel4node");
var mdUtils = require("../formatter/markdown_utils");
var filesName = require("../files/file_name");
/**
 * @file Creates an Excel file with the provided data.
 * @module createExcel
 */
/**
 * Creates an Excel file with the provided data.
 * @param {Object} result - The data to be included in the Excel file.
 * @returns {string} The filename of the created Excel file.
 */
var createExcel = function (result) {
    var wb = new excel.Workbook();
    var ws = wb.addWorksheet('KATSU Report');
    var fileName = excelFileName();
    var folder = process.env.REPORTS_FOLDER;
    var fullPath = "".concat(folder, "/") + fileName;
    var tableData = mdUtils.getTableData(result, true);
    var columnWidths = mdUtils.getColumnWidths(tableData);
    var headerStyle = wb.createStyle({
        font: {
            color: '#000000',
            size: 12,
            bold: true,
        },
        alignment: {
            horizontal: 'center',
            vertical: 'center',
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: 'd0d0d0',
            fgColor: 'd0d0d0',
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });
    var rowStyle = wb.createStyle({
        font: {
            color: '#101010',
            size: 12,
            bold: false,
        },
        numberFormat: '#,##0; (#,##0); -',
    });
    var header = result.fields.map(function (field) { return field.name; });
    // Add the header row
    for (var i = 0; i < header.length; i++) {
        ws.cell(1, i + 1).string(header[i]).style(headerStyle);
        ws.column(i + 1).setWidth(columnWidths[i] + 2);
    }
    for (var i = 0; i < result.rows.length; i++) {
        var row = result.rows[i];
        for (var j = 0; j < header.length; j++) {
            var field = header[j];
            var value = '';
            if (row[field] !== null)
                value = row[field].toString();
            ws.cell(i + 2, j + 1).string(value).style(rowStyle);
        }
    }
    wb.write(fullPath);
    clean.cleanReports();
    var url = process.env.REPORTS_URL + fileName;
    return url;
};
exports.createExcel = createExcel;
/**
 * Generates a unique filename for the Excel file based on the current date and time.
 * @returns {string} The generated filename.
 */
var excelFileName = function () {
    var fileName = filesName.randomFileName('xlsx');
    return fileName;
};
