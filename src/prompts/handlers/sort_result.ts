/**
 * @module sort_result
 * @description Module for sorting result rows based on a specified field.
 */

import { KatsuState } from "../../state/katsu_state";
interface Result {
  rows: Array<{ [key: string]: any }>;
}

/**
 * Sorts the result of a user in the KatsuState object based on the specified sort fields and sort direction.
 * @param state - The KatsuState object.
 * @param userIndex - The index of the user in the state.
 * @param sortFields - An array of strings representing the fields to sort by.
 * @param sortDir - The sort direction ("asc" for ascending, "desc" for descending).
 * @returns The updated KatsuState object with the sorted result.
 */
const sortResult = function (state: KatsuState, userIndex: number, sortFields: string[], sortDir: string): KatsuState {
  const result = state.users[userIndex].result;
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

  state.users[userIndex].result = result;
  return state;
};

export {
  sortResult
};
