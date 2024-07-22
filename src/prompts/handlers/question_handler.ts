import { KatsuState } from "../../db/katsu_db/katsu_state";

/**
 * This module contains the handler for question prompts type.
 * @module question handler
 */

/**
 * Handles the question prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const questionHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  state.users[userIndex].result.pageNum = 1;
  state.users[userIndex].result.lastPage = 1;

  return state;
};

const createQuestionPrompt = (state: KatsuState, userIndex: number): string => {
  return "";
}

export {
  questionHandler
};
