import { KatsuState } from "../../state/katsu_state";
import { getHelp } from "../../nl/help";
import { QueryResultRow } from "pg";

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
  const helpList = state.dataSources[state.users[userIndex].dataSourceIndex].helpList;

  state.users[userIndex].result.fields = ["Sample prompts"];
  for (let i = 0; i < helpList.length; i++) {
    const row: string[] = [helpList[i]];
    state.users[userIndex].result.rows.push(row);
  }
  return state;
};

export {
  helpHandler
};
