const {  
  formatPhoneNumberFieldUS,
  formatPhoneNumberFieldLA,
} = require("./phone_formatter");
const { formatNumber } = require("./number_formatter");

/**
 * Formats the API result by applying formatting rules to numeric and phone columns.
 *
 * @param {Object[]} result - The API result to be formatted.
 * @returns {Object[]} The formatted API result.
 */
const formatAPIResult = function (result) {
  const numColumns = getNumericColumns(result);
  result = formatNumericColumns(result, numColumns);

  const phoneColumns = getPhoneColumns(result);
  result = formatPhoneNumber(result, phoneColumns);

  const currencyColumns = getCurrencyColumns(result);
  result = formatCurrency(result, currencyColumns);
  

  return result;
};

const formatCurrency = function (result, numColumns) {
  for (let i = 1; i < result.rows.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      result.rows[i][numColumns[j]] = '$' + result.rows[i][numColumns[j]];
    }
  }

  return result;
};

const formatNumericColumns = function (result, numColumns) {
  for (let i = 1; i < result.rows.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      result.rows[i][numColumns[j]] = formatNumber(
        result.rows[i][numColumns[j]]
      );
    }
  }

  return result;
};

const getNumericColumns = function (result) {
  let numericColumns = [];

  const header = result.rows[0];

  for (let i = 0; i < header.length; i++) {
    let isNumeric = true;

    for (let j = 1; j < result.rows.length; j++) {
      if (isNaN(result.rows[j][i])) {
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

const formatPhoneNumber = function (result, numColumns) {
  for (let i = 1; i < result.rows.length; i++) {
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

  return result;
};

const getPhoneColumns = function (result) {
  let phoneColumns = [];

  const header = result.rows[0];

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

    if (fieldName.includes("phone")) {
      phoneColumns.push(i);
    }
  }

  return phoneColumns;
};

const getCurrencyColumns = function (result) {
  let currencyColumns = [];

  const header = result.rows[0];

  for (let i = 0; i < header.length; i++) {
    const fieldName = header[i].toLowerCase().trim();

    if (fieldName.includes("amount")) {
      currencyColumns.push(i);
    }
  }

  return currencyColumns;
};

module.exports = { formatAPIResult };
