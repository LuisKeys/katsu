import { getPromptType } from "./prompt_type";
import { KatsuState } from "../db/katsu_db/katsu_state";
import { getDataSource } from "./data_source";
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
  state = await getPromptType(state, userId);
  state = await getDataSource(state, userId);

  // Call the corresponding handler
  console.log("Prompt type:", state.users[userId].promptType);
  console.log("Data Source:", state.dataSources[state.users[userId].dataSourceIndex]);
  return state;
};

/*
if (promptType === constants.QUESTION) {
  // Question prompt
  result.pageNum = 1;
  result = await handlers.questionHandler(result);

  if (process.env.DEMO_MODE == "true") {
    result = demoData.replaceDemoValues(result, result.entity.name);
  }
}

if (promptType === constants.LLM) {
  // LLM prompt
  result = await llmHandlerCall(result);
}

if (promptType === constants.EXCEL) {
  // Excel prompt
  result.fileURL = await excelHandlerCall(result);
}

if (promptType === constants.LINK) {
  // Link prompt
  result = await handlers.linkHandler(result);
}

if (promptType === constants.SORT) {
  // Sort prompt
  result = await handlers.sortHandler(result);
}

if (promptType === constants.PAGE) {
  // Page prompt
  if (result != null) {
    result.pageNum = handlers.pageHandler(result);
    await savePrompt.savePrompt(result);
  }

}

if (promptType === constants.FILE) {
  // File prompt
  if (result != null) {
    result.dispFields = [];
    result = await handlers.filesHandler(result);
  }

}

if (promptType === constants.HELP) {
  // Sort prompt
  if (result != null) {
    result.dispFields = [];
    result = await help.getHelp(promptTr);
  }
}

if (promptType === constants.PROMPT) {
  // Sort prompt
  if (result != null) {
    result.dispFields = [];
    result = await promptsHistory.listHistory(result);
  }
}

if (promptType != constants.QUESTION && promptType != constants.PAGE) {
  if (result != null) { result.pageNum = 1; }
}

if (result != null) {
  await savePrompt.savePrompt(result);
} else {
  throw new Error("Result is null.");
}

// Format the result

// Call the formatResult function
// let resultObject = await formatResult(result, userId, promptType, resultData, pageNum, isDebug);

return result;
*/

export { promptHandler };
