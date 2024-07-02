/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

// Required External Modules
require("dotenv").config();
const cleanPrompt = require("./clean");
const constants = require("./constants");
const demoData = require("../demo/demo_data");
const handlers = require("./handlers");
const help = require("../nl/help");
const nlPromptType = require("./prompt_type");
const promptsHistory = require("./check_history");
const savePrompt = require("./save_prompt");
const { formatResult, llmHandlerCall, excelHandlerCall } = require("./prompt_handler_utils");

let result = [];
let resultData = [];
let pageNum = [];

/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
const promptHandler = async (prompt, memberId, isDebug, memberName) => {    

  if (!resultData[memberId]) {
    resultData[memberId] = {
      dispFields: [],
      result: {
        rows: [],
        fields: [],
        requiresAnswer: false
      }
    };
  }
  
  const promptType = await nlPromptType.getPromptType(prompt);  
  let fileURL = '';
  resultData[memberId].sql = '';
  const promptTr = cleanPrompt.cleanPrompt(prompt);

  if (promptType === constants.QUESTION) {    
    // Question prompt
    pageNum[memberId] = 1;
    resultData[memberId] = await handlers.questionHandler(promptTr);
    result[memberId] = resultData[memberId].result;
    
    if(process.env.DEMO_MODE == "true") {
      result[memberId] = demoData.replaceDemoValues(result[memberId], resultData[memberId].entity.name);    
    }
  }

  if (promptType === constants.LLM) {
    // LLM prompt
    fileURL, result = await llmHandlerCall(promptTr, memberId, memberName);
    result[memberId] = result;
  }

  if (promptType === constants.EXCEL) {
    // Excel prompt
    fileURL = await excelHandlerCall(promptTr, memberId, memberName);     
  }
  
  if (promptType === constants.LINK) {
    // Link prompt
    result[memberId] = await handlers.linkHandler(promptTr);    
  } 
  
  if (promptType === constants.SORT) {    
    // Sort prompt
    result[memberId] = await handlers.sortHandler(promptTr, result[memberId]);
    
  }

  if (promptType === constants.PAGE) {    
    // Page prompt
    pageNum[memberId] = handlers.pageHandler(promptTr, pageNum[memberId], result[memberId]);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
  }

  if (promptType === constants.FILE) {    
    // File prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await handlers.filesHandler(promptTr);
    
  }

  if (promptType === constants.HELP) {    
    // Sort prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await help.getHelp(promptTr);
    
  }

  if (promptType === constants.PROMPT) {    
    // Sort prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await promptsHistory.listHistory(memberId);
    
  }

  if (promptType === constants.REMINDER) {    
    // Reminder prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await handlers.remindersHandler(promptTr, memberId);
  }

  if (promptType != constants.QUESTION && promptType != constants.PAGE) {    
    pageNum[memberId] = 1;
  }

  if(result[memberId]) {
    await savePrompt.savePrompt(memberId, promptTr, result[memberId].sql, result[memberId].rows.length, memberName, promptType);
  }

  // Format the result

  // Call the formatResult function
  resultObject = await formatResult(result, memberId, promptType, resultData, pageNum, isDebug);
  
  // Add original prompt
  resultObject.prompt = prompt;
  
  resultObject.requiresAnswer = result[memberId].requiresAnswer;

  return resultObject;
}

module.exports = { promptHandler };