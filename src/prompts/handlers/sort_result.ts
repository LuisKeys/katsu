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
const sortResult = function (state: KatsuState, userIndex: number, sortBy: string, sortDirection: string): KatsuState {
  let direction = sortDirection.toLowerCase();
  const result = state.users[userIndex].result;
  const fields = result.fields;
  let rows = result.rows;
  // Check if the list of rows is empty
  if (rows.length === 0) {
    return state;
  }

  // Check if the list of fields is empty
  if (fields.length === 0) {
    return state;
  }

  // Find the index of the field to sort by
  const sortByIndex = fields.indexOf(sortBy);

  // Check if the field to sort by is not in the list of fields
  if (sortByIndex === -1) {
    return state;
  }

  // Check if the sort direction is valid
  if (direction !== "asc" && direction !== "desc") {
    direction = "asc";
  }

  // Create a copy of the rows to avoid mutating the original array
  const sortedRows = [...rows];

  // Sort the rows
  sortedRows.sort((a, b) => {
    const valueA = a[sortByIndex];
    const valueB = b[sortByIndex];

    if (direction === "asc") {
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    } else {
      return valueB.localeCompare(valueA, undefined, { numeric: true });
    }
  });

  state.users[userIndex].result.rows = sortedRows;
  return state;
};

export {
  sortResult
};
