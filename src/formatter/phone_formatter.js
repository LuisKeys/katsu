/**
 * Formats the phone number columns in the table data.
 *
 * @param {Array<Array<any>>} tableData - The table data array.
 * @param {Array<number>} numColumns - The indices of the phone number columns.
 * @returns {Array<Array<any>>} - The formatted table data array.
 */
const formatPhoneNumber = function (tableData, numColumns) {
  for (let i = 1; i < tableData.length; i++) {
    for (let j = 0; j < numColumns.length; j++) {
      const number = tableData[i][numColumns[j]];
      if (number) {
        const numberDigitsOnly = number.replace(/\D/g, "");
        if (numberDigitsOnly.length === 11 && numberDigitsOnly[0] === "1") {
          tableData[i][numColumns[j]] = formatPhoneNumberFieldUS(number);
        }
        if (numberDigitsOnly.length >= 12 && numberDigitsOnly[0] != "1") {
          tableData[i][numColumns[j]] = formatPhoneNumberFieldLA(number);
        }
        if (numberDigitsOnly.length < 12 && numberDigitsOnly[0] != "1") {
          tableData[i][numColumns[j]] = numberDigitsOnly;
        }
      } else {
        tableData[i][numColumns[j]] = "";
      }
    }
  }

  return tableData;
};

/**
 * Formats a phone number field.
 * @param {string} phoneNumber - The phone number field.
 * @returns {string} - The formatted phone number.
 */
const formatPhoneNumberFieldUS = function (phoneNumber) {
  // Remove all non-digit characters from the phone number
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Format the phone number with parentheses and dashes
  const formattedPhoneNumber = digitsOnly.replace(
    /(\d{1})(\d{3})(\d{3})(\d{4})/,
    "+$1 ($2) $3-$4"
  );

  return formattedPhoneNumber;
};

module.exports = { formatPhoneNumber, formatPhoneNumberFieldUS };

/**
 * Formats a phone number field for non-US numbers.
 * @param {string} phoneNumber - The phone number field.
 * @returns {string} - The formatted phone number.
 */
const formatPhoneNumberFieldLA = function (phoneNumber) {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  let formattedPhoneNumber = digitsOnly.slice(0, 2) + " " + digitsOnly.slice(2);
  formattedPhoneNumber = "+" + formattedPhoneNumber;
  return formattedPhoneNumber;
};

module.exports = {
  formatPhoneNumber,
  formatPhoneNumberFieldUS,
  formatPhoneNumberFieldLA,
};
