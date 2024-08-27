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
  const sortField = await getSortfield(state, userIndex);
  const sortDir = await getSortDirection(state, userIndex);
  state = sortResult(state, userIndex, sortField, sortDir);

  result.pageNum = 1;
  state.users[userIndex].result = result;
  return state;
};

export {
  sortHandler
};
