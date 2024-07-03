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
  let result: ResultObject | null = getResultObjectByUser(userId, results);
  if (result === null) {
    result = results[0];
  }

  const promptType = await nlPromptType.getPromptType(prompt);
  result.sql = '';
  result.promptType = promptType;
  const promptTr = cleanPrompt(prompt);
  result.prompt = promptTr;

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
    fileURL = await excelHandlerCall(result);
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
}

export { promptHandler };
