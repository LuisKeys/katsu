import { UserResult } from "../../result/result_object";
import { KatsuState, User } from "../../state/katsu_state";

interface Result {
  rows: Array<{ [key: string]: any }>;
}

// Sort userResult based on specified fields and direction.
const sortResult = function (userResult: UserResult, sortBy: string, sortDirection: string) {
  let direction = sortDirection.toLowerCase();
  const fields = userResult.fields;
  let rows = userResult.rows;

  if (rows.length === 0) return;
  if (fields.length === 0) return;

  const sortByIndex = fields.indexOf(sortBy);
  if (sortByIndex === -1) return;

  direction = direction === "desc" ? "desc" : "asc";

  // Create a copy of the rows to avoid mutating the original array
  const sortedRows = [...rows];
  sortedRows.sort((a, b) => {
    const valueA = a[sortByIndex];
    const valueB = b[sortByIndex];

    if (direction === "asc") {
      return valueA.localeCompare(valueB, undefined, { numeric: true });
    } else {
      return valueB.localeCompare(valueA, undefined, { numeric: true });
    }
  });

  userResult.rows = sortedRows;
};

export {
  sortResult
};
