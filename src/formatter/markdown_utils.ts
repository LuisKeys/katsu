import { formatPhoneNumber } from "./phone_formatter";
import { formatNumber } from "./number_formatter";
import { ResultObject } from "../result/result_object";

/**
 * Retrieves table data from the given result object.
 * @param {Object} result - The result object containing fields and rows.
 * @returns {Array} - The table data as a 2D array.
 */
const getTableData = function (result: ResultObject, allRows: boolean) {

  const maxColumns: number = Number(process.env.MAX_COLUMNS)

  let tableData: any[] = [];
  const pageSize = Number(process.env.RESULT_PAGE_SIZE);

  // Get the header
  let header: string[] = [];
  let useDispFields = false;

  if (result.dispFields.length > 0 && result.rows.length >= 1) {
    if (result.fields.length > 1) {
      useDispFields = true;
    }
  }

  if (useDispFields) {
    for (let i = 0; i < result.dispFields.length && i < maxColumns; i++) {
      header.push(result.dispFields[i]);
    }
  } else {
    for (let i = 0; i < result.fields.length && i < maxColumns; i++) {
      header.push(result.fields[i]);
    }
  }

  tableData.push(header);

  // Get the rows
  let startIndex = (result.pageNum - 1) * pageSize;
  let endIndex = startIndex + pageSize;

  if (allRows) {
    startIndex = 0;
    endIndex = result.rows.length;
  }

  for (let i = startIndex; i < result.rows.length && i < endIndex; i++) {
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
const getColumnWidths = function (tableData: any[]) {
  let columnWidths: number[] = [];
  const maxColumnWidth: number = Number(process.env.MAX_COLUMN_WIDTH);

  for (let row of tableData) {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === null) {
        row[i] = "";
      }

      if (typeof row[i] == "undefined") {
        row[i] = "";
      }

      if (
        columnWidths[i] === undefined ||
        row[i].length > columnWidths[i]
      ) {
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
const getMarkdownTableRow = function (
  row: any[],
  columnLengths: number[],
  numColumns: number[],
  truncate: boolean
) {
  let markdownRow = "";
  let truncatRow = truncate;

  // If only one field  do not truncate the row
  if (numColumns.length <= 1) {
    truncatRow = false;
  }

  for (let i = 0; i < row.length; i++) {
    let field = row[i].toString();

    const columnLength = columnLengths[i];

    // If the field length is greater than the column length, wrap the text
    if (field.length > columnLength && truncatRow) {
      field = field.substring(0, columnLength - 3) + "...";
    }

    // Pad the field with spaces to match the column width
    let paddedField = "";
    try {
      if (numColumns.includes(i)) {
        paddedField = field.padStart(columnLength);
      } else {
        paddedField = field.padEnd(columnLength);
      }
    } catch (err) {
      console.log(err);
    }
    markdownRow += ` ${paddedField}`;
  }

  return markdownRow;
};

/**
 * Function to get a markdown table separator.
 * @param {Array} columnWidths - The maximum length for each column.
 * @returns {String} - A markdown table separator.
 */
const getMarkdownTableSeparator = function (columnWidths: number[]) {
  let separator = "";

  for (let i = 0; i < columnWidths.length; i++) {
    // Add the separator for each column
    separator += " " + "-".repeat(columnWidths[i]);
  }

  return separator;
};

/**
 * Formats the table data by applying formatting rules to numeric columns.
 *
 * @param {Array<Array<any>>} tableData - The table data to be formatted.
 * @returns {Object} - An object containing the formatted table data and the number of numeric columns.
 */
const formatTableData = function (tableData: any[]) {
  if (tableData.length === 0) {
    return tableData;
  }

  const phoneColumns = getPhoneColumns(tableData);
  let formattedTableData = formatPhoneNumber(tableData, phoneColumns);

  const numColumns = getNumericColumns(formattedTableData, phoneColumns);
  formattedTableData = formatNumericColumns(formattedTableData, numColumns);

  const result = { tableData: formattedTableData, numColumns: numColumns };

  return result;
};

/**
 * Retrieves the indices of phone number columns in a table.
 *
 * @param {Array<Array<any>>} tableData - The table data.
 * @returns {Array<number>} - The indices of phone number columns.
 */
const getPhoneColumns = function (tableData: any[]) {
  let phoneColumns: number[] = [];

  const header = tableData[0];

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

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
const getNumericColumns = function (
  tableData: any[],
  phoneColumns: number[]
) {
  let numericColumns: number[] = [];

  const header = tableData[0];

  for (let i = 0; i < header.length; i++) {
    let isNumeric = true;

    for (let j = 1; j < tableData.length; j++) {
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
const formatNumericColumns = function (
  tableData: any[],
  numColumns: number[]
) {
  for (let i = 1; i < tableData.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      tableData[i][numColumns[j]] = formatNumber(tableData[i][numColumns[j]]);
    }
  }

  return tableData;
};

export {
  getColumnWidths,
  getMarkdownTableRow,
  getTableData,
  getMarkdownTableSeparator,
  formatTableData,
};
