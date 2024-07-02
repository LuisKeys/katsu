import { cleanPrompt } from "./clean";
import * as constants from "./constants";
import * as demoData from "../demo/demo_data";
import * as handlers from "./handlers";
import * as help from "../nl/help";
import * as nlPromptType from "./prompt_type";
import * as promptsHistory from "./check_history";
import * as savePrompt from "./save_prompt";
import { formatResult, llmHandlerCall, excelHandlerCall } from "./prompt_handler_utils";
import { getResultObjectByUser, ResultObject } from "./result_object";

/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {number} userId - The id of the user.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
const promptHandler = async function (prompt: string, userId: number, isDebug: boolean, results: ResultObject[]): Promise<ResultObject> {

  // Get the result object for the user
  let result: ResultObject = getResultObjectByUser(userId, results);

  const promptType = await nlPromptType.getPromptType(prompt);
  let fileURL = '';
  result.sql = '';
  result.promptType = promptType;
  const promptTr = cleanPrompt(prompt);
  result.prompt = promptTr;

  if (promptType === constants.QUESTION) {
    // Question prompt
    result.pageNum = 1;
    result = await handlers.questionHandler(promptTr);

    if (process.env.DEMO_MODE == "true") {
      result = demoData.replaceDemoValues(result, result.entity.name);
    }
  }

  if (promptType === constants.LLM) {
    // LLM prompt
    result = await llmHandlerCall(promptTr, userId, result, promptType);
  }

  if (promptType === constants.EXCEL) {
    // Excel prompt
    fileURL = await excelHandlerCall(promptTr, userId, result);
  }

  if (promptType === constants.LINK) {
    // Link prompt
    result[userId] = await handlers.linkHandler(promptTr);
  }

  if (promptType === constants.SORT) {
    // Sort prompt
    result[userId] = await handlers.sortHandler(promptTr, result[userId]);

  }

  if (promptType === constants.PAGE) {
    // Page prompt
    result.pageNum = handlers.pageHandler(promptTr, result);
    await savePrompt.savePrompt(result);
  }

  if (promptType === constants.FILE) {
    // File prompt
    result.dispFields = [];
    result = await handlers.filesHandler(promptTr);

  }

  if (promptType === constants.HELP) {
    // Sort prompt
    result.dispFields = [];
    result = await help.getHelp(promptTr);

  }

  if (promptType === constants.PROMPT) {
    // Sort prompt
    result.dispFields = [];
    result = await promptsHistory.listHistory(userId);
  }

  if (promptType != constants.QUESTION && promptType != constants.PAGE) {
    result.pageNum = 1;
  }

  if (result[userId]) {
    await savePrompt.savePrompt(result);
  }

  // Format the result

  // Call the formatResult function
  // let resultObject = await formatResult(result, userId, promptType, resultData, pageNum, isDebug);

  return result;
}

export { promptHandler };
