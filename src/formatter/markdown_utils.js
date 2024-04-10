const constants = require("../prompts/constants");

/**
 * Retrieves table data from the given result object.
 * @param {Object} result - The result object containing fields and rows.
 * @returns {Array} - The table data as a 2D array.
 */
const getTableData = function (result, dispFields, maxColumns) {
  let tableData = [];

  // Get the header
  let header = [];

  if (dispFields.length > 0 && result.rows.length > 0) {
    for (let i = 0; i < dispFields.length && i < maxColumns; i++) {
      header.push(dispFields[i]);
    }
  } else {
    for (let i = 0; i < result.fields.length && i < maxColumns; i++) {
      header.push(result.fields[i].name);
    }
  }

  tableData.push(header);

  // Get the rows
  for (
    let i = 0;
    i < result.rows.length && i < constants.MAX_LINES_SLACK;
    i++
  ) {
    let row = result.rows[i];
    let values = [];
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      values.push(row[field]);
    }
    tableData.push(values);
  }

  return tableData;
};

/**
 * Function to get the maximum lengths of each column of a table.
 * @param {Array} tableData - The data of the table.
 * @returns {Array} - An array containing the maximum lengths of each column.
 */
const getColumnWidths = function (tableData) {
  let columnWidths = [];
  let maxColumnWidth = process.env.MAX_COLUMN_WIDTH;

  for (let row of tableData) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === null) {
        row[i] = "";
      }

      if (columnWidths[i] === undefined || row[i].length > columnWidths[i]) {
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

/**
 * Function to get a markdown table row with fields limited by pipes.
 * @param {Array} row - The column values.
 * @param {Array} columnLengths - The maximum length for each column.
 * @returns {String} - A markdown table row.
 */
const getMarkdownTableRow = function (row, columnLengths) {
  let markdownRow = "|";

  for (let i = 0; i < row.length; i++) {
    let field = row[i].toString();

    // If the field length is greater than the column length, wrap the text
    if (field.length > columnLengths[i]) {
      field = field.substring(0, columnLengths[i] - 3) + "...";
    }

    // Pad the field with spaces to match the column width
    let paddedField = "";
    try {
      paddedField = field.padEnd(columnLengths[i]);
    } catch (err) {
      console.log(err);
    }
    markdownRow += ` ${paddedField} |`;
  }

  return markdownRow;
};

/**
 * Function to get a markdown table separator.
 * @param {Array} columnWidths - The maximum length for each column.
 * @returns {String} - A markdown table separator.
 */
const getMarkdownTableSeparator = function (columnWidths) {
  let separator = "|";

  for (let i = 0; i < columnWidths.length; i++) {
    // Add the separator for each column
    separator += " " + "-".repeat(columnWidths[i]) + " |";
  }

  return separator;
};

module.exports = {
  getColumnWidths,
  getMarkdownTableRow,
  getTableData,
  getMarkdownTableSeparator,
};
