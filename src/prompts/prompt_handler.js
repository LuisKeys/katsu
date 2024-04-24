/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

// Required External Modules
require("dotenv").config();
const constants = require("./constants");
const excel = require("../excel/create_excel");
const handlers = require("./handlers");
const help = require("../nl/help");
const nlPromptType = require("./prompt_type");
const resultObj = require("./result_object");
const cleanPrompt = require("./clean");
const savePrompt = require("./save_prompt");

let result;
let resultData;
let page = 1;
resultData = {dispFields:[], result:{rows:[], fields:[]}};

/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
const promptHandler = async (prompt, memberId, isDebug, memberName) => {    
  const promptType = nlPromptType.getPromptType(prompt);  
  let fileURL = '';

  const promptTr = cleanPrompt.cleanPrompt(prompt);

  if (promptType === constants.QUESTION) {    
    // Question prompt
    page = 1;
    resultData = await handlers.questionHandler(promptTr);
    result = resultData.result;
    if(result && result.rows.length > 0) {
      await savePrompt.savePrompt(memberId, prompt, resultData.sql, result.rows.length, memberName);
    }
  }

  if (promptType === constants.EXPORT) {
    // Export prompt
    fileURL = excel.createExcel(result);
    page = 1;
  }
  
  if (promptType === constants.LINK) {
    // Link prompt
    result = await handlers.linkHandler(promptTr);
    page = 1;
  } 
  
  if (promptType === constants.SORT) {    
    // Sort prompt
    result = await handlers.sortHandler(promptTr, result);
    page = 1;
  }

  if (promptType === constants.PAGE) {    
    // Page prompt
    page = handlers.pageHandler(promptTr);
  }

  if (promptType === constants.FILE) {    
    // File prompt
    resultData.dispFields = [];
    result = await handlers.filesHandler(promptTr);
    page = 1;
  }

  if (promptType === constants.HELP) {    
    // Sort prompt
    resultData.dispFields = [];
    result = await help.getHelp(promptTr);
    page = 1;
  }

  if (promptType === constants.REMINDER) {    
    // Reminder prompt
    resultData.dispFields = [];
    result = await handlers.remindersHandler(promptTr, memberId);
    page = 1;
  }

  // Format the result
  let resultObject
  let messages = [];
  if (result && result.rows.length > 0) {        
    // Data found
    if(result.rows.length > constants.PAGE_SIZE) {
      messages.push('Only ' + constants.PAGE_SIZE + ' records are displayed. To see the complete list, use the Export to Excel prompt.');        
    }

    if(promptType === constants.EXPORT) {
      // Export prompt
      messages = [];
      messages.push('The data has been exported to an Excel file.');
      messages.push(fileURL);
    }

    resultObject = resultObj.getResultObject(result, messages, promptType, resultData.dispFields, page, isDebug);

  } else {
    // No data found
    messages.push('No data found for your request.');
    messages.push('Try the following Help prompts to get a list of possible valid prompts.');
    
    result = await help.getHelp(constants.HELP);

    let header = [];
    for(i = 0; i < result.fields.length; i++) {
      header.push(result.fields[i].name);
    }

    resultObject = resultObj.getResultObject(result, messages, promptType, header, page, isDebug);
  }
  
  return resultObject;
}

module.exports = { promptHandler };