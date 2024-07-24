/**
 * This module provides a function to find the sort field based on a prompt and a result object.
 * @module sort_field_finder
 */

import { KatsuState } from "../state/katsu_state";
import { createSortDirectionPrompt, createSortFieldPrompt } from "../llm/prompt_generators/sort_gen";
import { ask } from "../llm/openai/openai_api";

/**
 * Retrieves the sort field for a given user from the Katsu state.
 * 
 * @param state - The Katsu state object.
 * @param userIndex - The index of the user.
 * @returns A promise that resolves to the sort field string.
 */
const getSortfield = async (state: KatsuState, userIndex: number): Promise<string> => {

  state.users[userIndex].context = createSortFieldPrompt(state, userIndex);
  const sortField = await ask(state, userIndex);
  return sortField;
};

const getSortDirection = async (state: KatsuState, userIndex: number): Promise<string> => {

  state.users[userIndex].context = createSortDirectionPrompt(state, userIndex);
  const sortField = await ask(state, userIndex);
  return sortField;
};


export { getSortfield, getSortDirection };
