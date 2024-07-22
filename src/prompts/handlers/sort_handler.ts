import { ResultObject } from "../../result/result_object";
import { getSortfield, getSortDirection } from "../../nl/sort_field_finder";
import { sortResult } from "./sort_result";
import { KatsuState } from "../../state/katsu_state";
/**
 * This module contains the handler for sort prompts type.
 * @module sort handler
 */


/**
 * Handles the sort prompt.
 * @async
 * @param {string} prompt - The sort prompt.
 * @param {object} result - The result object.
 * @returns {Promise} - A promise that resolves to the sorted result object.
 */
const sortHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  const result = state.users[userIndex].result;
  if (result != null) {
    const sortFields = getSortfield(result);
    if (sortFields.length > 0) {
      const sortDir = getSortDirection(result.prompt);
      state = sortResult(state, userIndex, sortFields, sortDir);
    }
  }

  state.users[userIndex].result = result;
  return state;
};

export {
  sortHandler
};
