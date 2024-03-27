/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

// Required External Modules
require("dotenv").config();
const constants = require("./src/prompts/constants");
const excel = require("./src/excel/create_excel");
const handlers = require("./src/prompts/handlers");
const help = require("./src/nl2sql/help");
const nlPromptType = require("./src/prompts/prompt_type");
const resultObj = require("./src/prompts/result_object");

let result;

/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
const promptHandler = async (prompt, isDebug) => {    
  const promptType = nlPromptType.getPromptType(prompt);
  let sql = '';  
  const promptTr = prompt.trim().toLowerCase();

  if (promptType === constants.QUESTION) {    
    // Question prompt
    result = await handlers.questionHandler(promptTr);
  }

  if (promptType === constants.EXPORT) {
    // Export prompt
    excel.createExcel(result);
  }
  
  if (promptType === constants.LINK) {
    // Link prompt
    result = await handlers.linkHandler(promptTr);
  } 
  
  if (promptType === constants.SORT) {    
    // Sort prompt
    result = await handlers.sortHandler(promptTr, result);
  }

  if (promptType === constants.HELP) {    
    // Sort prompt
    result = await help.getHelp(promptTr);
  }

  // Format the result
  let resultObject
  if (result && result.rows.length > 0 && isDebug) {        
    resultObject = resultObj.getResultObject(result, [], isDebug);
  } else {
    messages = [];
    messages.push('No data found for your request.');
    messages.push('Try the following Help prompts to get a list of possible valid prompts.');
    
    result = await help.getHelp(constants.HELP);

    resultObject = resultObj.getResultObject(result, messages, isDebug);
  }
  
    return resultObject;
}

module.exports = { promptHandler };