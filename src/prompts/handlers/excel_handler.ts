import { KatsuState } from "../../state/katsu_state";
import { createExcel } from "../../exports/excel/create_excel";

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
  state = createExcel(state, userIndex);
  return state;
};

export {
  excelExportHandler
};
