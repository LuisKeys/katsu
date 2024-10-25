import { resetResult } from "../../result/result_object";
import { KatsuState } from "../../state/katsu_state";

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
  state = resetResult(state, userIndex);
  const result = state.users[userIndex].result;
  const helpList = state.dataSources[state.users[userIndex].dataSourceIndex].helpList;

  result.text = "Sample prompts:";
  for (const helpItem of helpList) {
    result.text += `\n- ${helpItem}\n`;
  }
  return state;
};

export {
  helpHandler
};
