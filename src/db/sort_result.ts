/**
 * @module sort_result
 * @description Module for sorting result rows based on a specified field.
 */

interface Result {
  rows: Array<{ [key: string]: any }>;
}

/**
 * Sorts the result rows based on a specified field.
 *
 * @param {Result} result - The result object containing rows to be sorted.
 * @param {Field[]} sortFields - The field array specifying the fields to sort by.
 * @param {string} sortDir - The sort direction ("asc" or "desc").
 * @returns {Array} - The sorted rows.
 */
const sortResult = function (result: Result, sortFields: string[], sortDir: string): Array<{ [key: string]: any }> {
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

      if (sortDir === "asc") {
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

export {
  sortResult,
};
