import { KatsuState } from "../../db/katsu_db/katsu_state";

/**
 * This module contains the handler for excel export prompts type.
 * @module excel export handler
 */

/**
 * Handles the excel export prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const excelExportHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {

  return state;
};

export {
  excelExportHandler
};
