import { KatsuState } from "../../state/katsu_state";
import { getHelp } from "../../nl/help";

/**
 * This module contains the handler for help prompts type.
 * @module help handler
 */

/**
 * Handles the help prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const helpHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  state = await getHelp(state, userIndex);
  return state;
};

export {
  helpHandler
};
