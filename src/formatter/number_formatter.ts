/**
 * Formats a number with thousand and decimal separators.
 * @param {string} number - The non-formatted number as a string.
 * @returns {string} - The formatted number with separators.
 */
const formatNumber = function(number: string): string {
  // Convert the number to a float
  const parsedNumber = parseFloat(number);

  // Check if the number is valid
  if (isNaN(parsedNumber)) {
    return "";
  }

  return parsedNumber.toLocaleString();
}

export { formatNumber };
