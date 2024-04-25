/**
 * @fileoverview This module exports the `promptHandler` function which handles different types of prompts and performs corresponding actions.
 * @module promptHandler
 */

// Required External Modules
require("dotenv").config();
const cleanPrompt = require("./clean");
const constants = require("./constants");
const demoData = require("../demo/demo_data");
const excel = require("../excel/create_excel");
const handlers = require("./handlers");
const help = require("../nl/help");
const nlPromptType = require("./prompt_type");
const pageCalc = require("./page_calc");
const resultObj = require("./result_object");
const savePrompt = require("./save_prompt");
const promptsHistory = require("./check_history");

let result;
let resultData;
let pageNum = 1;
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
    pageNum = 1;
    resultData = await handlers.questionHandler(promptTr);
    result = resultData.result;
    
  if(process.env.DEMO_MODE == "true") {
    result = demoData.replaceDemoValues(result, resultData.entity.name);    
  }

    if(result) {
      await savePrompt.savePrompt(memberId, promptTr, resultData.sql, result.rows.length, memberName, promptType);
    }
  }

  if (promptType === constants.EXPORT) {
    // Export prompt
    fileURL = excel.createExcel(result);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
    pageNum = 1;
  }
  
  if (promptType === constants.LINK) {
    // Link prompt
    result = await handlers.linkHandler(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
    pageNum = 1;
  } 
  
  if (promptType === constants.SORT) {    
    // Sort prompt
    result = await handlers.sortHandler(promptTr, result);
    await savePrompt.savePrompt(memberId, promptTr, '', result.rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.PAGE) {    
    // Page prompt
    pageNum = handlers.pageHandler(promptTr, pageNum, result);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
  }

  if (promptType === constants.FILE) {    
    // File prompt
    resultData.dispFields = [];
    result = await handlers.filesHandler(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', result.rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.HELP) {    
    // Sort prompt
    resultData.dispFields = [];
    result = await help.getHelp(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', result.rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.PROMPT) {    
    // Sort prompt
    resultData.dispFields = [];
    result = await promptsHistory.listHistory(memberId);
    await savePrompt.savePrompt(memberId, promptTr, '', result.rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.REMINDER) {    
    // Reminder prompt
    resultData.dispFields = [];
    result = await handlers.remindersHandler(promptTr, memberId);
    await savePrompt.savePrompt(memberId, promptTr, '', result.rows.length, memberName, promptType);
    pageNum = 1;
  }

  // Format the result
  let resultObject
  let messages = [];
  if (result && result.rows.length > 0) {        
    // Data found
    if(result.rows.length > constants.PAGE_SIZE) {
      const lastPage = pageCalc.getLastPage(result);
      messages.push('Page ' + pageNum + ' of ' + lastPage);                    
    }

    if(promptType === constants.EXPORT) {
      // Export prompt
      messages = [];
      messages.push('The data has been exported to an Excel file.');
      messages.push(fileURL);
    }

    resultObject = resultObj.getResultObject(result, messages, promptType, resultData.dispFields, pageNum, isDebug);

  } else {
    // No data found
    messages.push('No data found for your request.');
    messages.push('Try the following Help prompts to get a list of possible valid prompts.');
    
    result = await help.getHelp(constants.HELP);

    let header = [];
    for(i = 0; i < result.fields.length; i++) {
      header.push(result.fields[i].name);
    }

    resultObject = resultObj.getResultObject(result, messages, promptType, header, pageNum, isDebug);
  }
  
  return resultObject;
}

module.exports = { promptHandler };