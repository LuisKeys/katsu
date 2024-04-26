/**
 * @module sort_result
 * @description Module for sorting result rows based on a specified field.
 */

/**
 * Sorts the result rows based on a specified field.
 *
 * @param {Object} result - The result object containing rows to be sorted.
 * @param {Object} field - The field object specifying the field to sort by.
 * @returns {Array} - The sorted rows.
 */
const sortResult = function (result, sortFields, sortDir) {
  for (let i = 0; i < result.rows.length; i++) {
    for (let j = i + 1; j < result.rows.length; j++) {
      let a = "";
      let b = "";

      for (let k = 0; k < sortFields.length; k++) {
        let field = sortFields[k];

        let at = result.rows[i][field];
        let bt = result.rows[j][field];

        // check if the values are numbers
        if (!isNaN(result.rows[i][field]) && !isNaN(result.rows[j][field])) {
          at = parseFloat(result.rows[i][field]);
          bt = parseFloat(result.rows[j][field]);
        }

        a += at;
        b += bt;
      }

      if (sortDir == "asc") {
        if (a > b) {
          let temp = result.rows[i];
          result.rows[i] = result.rows[j];
          result.rows[j] = temp;
        }
      } else {
        if (a < b) {
          let temp = result.rows[i];
          result.rows[i] = result.rows[j];
          result.rows[j] = temp;
        }
      }
    }
  }

  return result.rows;
};

module.exports = {
  sortResult,
};
