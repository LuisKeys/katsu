import { resetResult } from "../../result/result_object";
import { KatsuState } from "../../state/katsu_state";
import { getLastPage } from "./page_calc";

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

  state = resetResult(state, userIndex);
  state.users[userIndex].result.fields = ["Sample prompts"];
  for (let i = 0; i < helpList.length; i++) {
    const row: string[] = [helpList[i]];
    state.users[userIndex].result.rows.push(row);
  }

  state.users[userIndex].result.pageNum = 1;
  const result = state.users[userIndex].result
  state.users[userIndex].result.lastPage = getLastPage(result);
  return state;
};

export {
  helpHandler
};
