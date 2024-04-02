const constants = require('../prompts/constants');

/**
 * Retrieves table data from the given result object.
 * @param {Object} result - The result object containing fields and rows.
 * @returns {Array} - The table data as a 2D array.
 */
const getTableData = function (result) {
  let tableData = [];

  // Get the header
  let header = [];
  for (let i = 0; i < result.fields.length; i++) {
    header.push(result.fields[i].name);
  }
  tableData.push(header);
  
  // Get the rows  
  for (let i = 0; i < result.rows.length && i < constants.MAX_LINES_SLACK; i++) {
    let row = result.rows[i];
    let values = [];
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      values.push(row[field]);
    }
    tableData.push(values);
  }  

  return tableData;
}

/**
 * Function to get the maximum lengths of each column of a table.
 * @param {Array} tableData - The data of the table.
 * @returns {Array} - An array containing the maximum lengths of each column.
 */
const getColumnWidths = function(tableData) {
  let columnWidths = [];

  for (let row of tableData) {
    for (let i = 0; i < row.length; i++) {
      if (columnWidths[i] === undefined || row[i].length > columnWidths[i]) {
        columnWidths[i] = row[i].length;
      }
    }
  }

  return columnWidths;
}

/**
 * Function to get a markdown table row with fields limited by pipes.
 * @param {Array} row - The column values.
 * @param {Array} columnLengths - The maximum length for each column.
 * @returns {String} - A markdown table row.
 */
const getMarkdownTableRow = function(row, columnLengths, isHeader) {
  let markdownRow = '\`|';

  for (let i = 0; i < row.length; i++) {
    let field = row[i];
    // If line is header add a '*' to the field to create a bold text
    if (isHeader) {
      field = '*' + field + '*';
    }

    // Pad the field with spaces to match the column width
    let paddedField = field.padEnd(columnLengths[i]);
    markdownRow += ` ${paddedField} |\``;
  }

  return markdownRow;
}

/**
 * Function to get a markdown table separator.
 * @param {Array} columnWidths - The maximum length for each column.
 * @returns {String} - A markdown table separator.
 */
const getMarkdownTableSeparator = function(columnWidths) {
  let separator = '\`|';

  for (let i = 0; i < columnWidths.length; i++) {
    // Add the separator for each column
    separator += ' ' + '-'.repeat(columnWidths[i]) + ' |\`';
  }

  return separator;
}

module.exports = { 
  getColumnWidths, 
  getMarkdownTableRow,
  getTableData,
  getMarkdownTableSeparator
};