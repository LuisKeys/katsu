import { formatPhoneNumberFieldUS, formatPhoneNumberFieldLA } from "./phone_formatter";
import { UserResult } from "../result/result_object";
import { getColumnWidths2 } from "./column_width";

/**
 * Formats the API result by applying formatting rules to numeric and phone columns.
 *
 * @param {ResultObject} result - The API result to be formatted.
 * @returns {Object[]} The formatted API result.
 */
const formatAPIResult = function (result: UserResult) {
  const numColumns = getNumericColumns(result);
  formatNumericColumns(result, numColumns);

  const phoneColumns = getPhoneColumns(result);
  formatPhoneNumber(result, phoneColumns);

  const currencyColumns = getCurrencyColumns(result);
  formatCurrency(result, currencyColumns);

  const dateColumns = getDateColumns(result);
  formatDate(result, dateColumns);
};

const formatDate = function (result: UserResult, dateColumns: number[]) {
  for (let j = 0; j < dateColumns.length; j++) {
    for (let i = 0; i < result.rows.length; i++) {
      const date = new Date(result.rows[i][dateColumns[j]]);
      const formattedDate = date.toLocaleDateString();
      result.rows[i][dateColumns[j]] = formattedDate;
    }
  }
};

const formatCurrency = function (result: UserResult, numColumns: number[]) {
  const columnWidths = getColumnWidths2(result);
  for (let i = 0; i < result.rows.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      if (!result.rows[i][numColumns[j]].startsWith("$")) {
        let width = columnWidths[numColumns[j]];
        width = width + 1 // Add 1 for the dollar sign
        let formattedValue = ('$' + result.rows[i][numColumns[j]]);
        formattedValue = formattedValue.padStart(width, ' ');
        // formattedValue = '"' + formattedValue + '"';
        result.rows[i][numColumns[j]] = formattedValue;
      }
    }
  }
};

const formatNumericColumns = function (result: UserResult, numColumns: number[]) {
  for (let i = 0; i < result.rows.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      result.rows[i][numColumns[j]] = result.rows[i][numColumns[j]].formatNumber();
    }
  }
};

const getNumericColumns = function (result: UserResult): number[] {
  let numericColumns: number[] = [];

  const header = result.fields;

  for (let i = 0; i < header.length; i++) {
    let isNumeric = true;

    for (let j = 0; j < result.rows.length; j++) {
      if (isNaN(Number(result.rows[j][i])) ||
        result.rows[j][i] === "" ||
        result.rows[j][i] === null) {
        isNumeric = false;
        break;
      }
    }

    if (isNumeric) {
      numericColumns.push(i);
    }
  }

  return numericColumns;
};

const formatPhoneNumber = function (result: UserResult, numColumns: number[]) {
  for (let i = 0; i < result.rows.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      const number = result.rows[i][numColumns[j]];
      if (number) {
        const numberDigitsOnly = number.replace(/\D/g, "");
        if (numberDigitsOnly.length === 11 && numberDigitsOnly[0] === "1") {
          result.rows[i][numColumns[j]] = formatPhoneNumberFieldUS(number);
        }
        if (numberDigitsOnly.length >= 12 && numberDigitsOnly[0] != "1") {
          result.rows[i][numColumns[j]] = formatPhoneNumberFieldLA(number);
        }
        if (numberDigitsOnly.length < 12 && numberDigitsOnly[0] != "1") {
          result.rows[i][numColumns[j]] = numberDigitsOnly;
        }
      } else {
        result.rows[i][numColumns[j]] = "";
      }
    }
  }
};

const getPhoneColumns = function (result: UserResult): number[] {
  let phoneColumns: number[] = [];

  const header = result.fields;

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

    if (fieldName.includes("phone")) {
      phoneColumns.push(i);
    }
  }

  return phoneColumns;
};

const getCurrencyColumns = function (result: UserResult): number[] {
  let currencyColumns: number[] = [];

  const header = result.fields;

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

    if (fieldName.includes("amount") ||
      fieldName.includes("rate") ||
      fieldName.includes("revenue") ||
      fieldName.includes("profit") ||
      fieldName.includes("cost")) {
      currencyColumns.push(i);
    }
  }

  return currencyColumns;
};

const getDateColumns = function (result: UserResult): number[] {
  let dateColumns: number[] = [];

  const header = result.fields;

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

    if (fieldName.includes("date")) {
      dateColumns.push(i);
    }
  }

  return dateColumns;
};

export { formatAPIResult };
