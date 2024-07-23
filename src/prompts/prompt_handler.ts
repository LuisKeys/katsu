import { getPromptType } from "./utils/prompt_type";
import { KatsuState } from "../state/katsu_state";
import { getDataSource } from "./utils/data_source";
import { questionHandler } from "./handlers/question_handler";
import { excelExportHandler } from "./handlers/excel_handler";
import { sortHandler } from "./handlers/sort_handler";
import { pageHandler } from "./handlers/page_handler";
import { filesHandler } from "./handlers/files_handler";
import { helpHandler } from "./handlers/help_handler";



/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

/**
 * Handles the prompt based on the given state and user ID.
 * @param state - The current state of the application.
 * @param userId - The ID of the user.
 * @returns A promise that resolves to the updated state after handling the prompt.
 */
const promptHandler = async (state: KatsuState, userId: number): Promise<KatsuState> => {
  // Get the prompt type and data source 
  state.showWordsCount = true;
  state = await getPromptType(state, userId);
  state = await getDataSource(state, userId);
  state = await processPrompt(state, userId);

  // console.log("Prompt type:", state.users[userId].promptType);
  // console.log("Data Source:", state.dataSources[state.users[userId].dataSourceIndex]);
  return state;
};


/**
 * Processes the prompt for a given user and returns the updated KatsuState.
 *
 * @param state - The current state of the Katsu application.
 * @param userId - The ID of the user for whom the prompt is being processed.
 * @returns The updated KatsuState after processing the prompt.
 */
const processPrompt = async (state: KatsuState, userId: number): Promise<KatsuState> => {
  switch (state.users[userId].promptType.toUpperCase()) {
    case "QUESTION":
      state = await questionHandler(state, userId);
      break;
    case "EXCEL":
      state = await excelExportHandler(state, userId);
      break;
    case "SORT":
      state = await sortHandler(state, userId);
      break;
    case "PAGE":
      state = await pageHandler(state, userId);
      break;
    case "FILE":
      state = await filesHandler(state, userId);
      break;
    case "HELP":
      state = await helpHandler(state, userId);
      break;
    default:
      break;
  }
  return state;
}

export { promptHandler };
