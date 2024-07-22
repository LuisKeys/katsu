import { KatsuState } from "../../db/katsu_db/katsu_state";

/**
 * This module contains the handler for files prompts type.
 * @module file handler
 */

/**
 * Handles the files prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const filesHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {

  return state;
};

export {
  filesHandler
};
