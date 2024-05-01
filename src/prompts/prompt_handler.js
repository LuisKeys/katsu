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

let result = [];
let resultData = [];
let pageNum = 1;


/**
 * Handles different types of prompts and performs corresponding actions.
 * @async
 * @param {string} prompt - The prompt to be handled.
 * @param {boolean} isDebug - Indicates whether the debug mode is enabled.
 * @returns {Promise<void>} - A promise that resolves when the prompt handling is complete.
 */
const promptHandler = async (prompt, memberId, isDebug, memberName) => {    
  if(resultData[memberId]) {
  } else {
    resultData[memberId] = {dispFields:[], result:{rows:[], fields:[]}};
  }

  
  const promptType = nlPromptType.getPromptType(prompt);  
  let fileURL = '';

  const promptTr = cleanPrompt.cleanPrompt(prompt);

  if (promptType === constants.QUESTION) {    
    // Question prompt
    pageNum = 1;
    resultData[memberId] = await handlers.questionHandler(promptTr);
    result[memberId] = resultData[memberId].result;
    
  if(process.env.DEMO_MODE == "true") {
    result[memberId] = demoData.replaceDemoValues(result[memberId], resultData[memberId].entity.name);    
  }

    if(result[memberId]) {
      await savePrompt.savePrompt(memberId, promptTr, resultData[memberId].sql, result[memberId].rows.length, memberName, promptType);
    }
  }

  if (promptType === constants.LLM) {
    // LLM prompt
    resultData[memberId].dispFields = [];
    fileURL = await handlers.llmHandler(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.EXCEL) {
    // Export to excel prompt
    fileURL = excel.createExcel(result[memberId]);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
    pageNum = 1;
  }
  
  if (promptType === constants.LINK) {
    // Link prompt
    result[memberId] = await handlers.linkHandler(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
    pageNum = 1;
  } 
  
  if (promptType === constants.SORT) {    
    // Sort prompt
    result[memberId] = await handlers.sortHandler(promptTr, result[memberId]);
    await savePrompt.savePrompt(memberId, promptTr, '', result[memberId].rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.PAGE) {    
    // Page prompt
    pageNum = handlers.pageHandler(promptTr, pageNum, result);
    await savePrompt.savePrompt(memberId, promptTr, '', 0, memberName, promptType);
  }

  if (promptType === constants.FILE) {    
    // File prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await handlers.filesHandler(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', result[memberId].rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.HELP) {    
    // Sort prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await help.getHelp(promptTr);
    await savePrompt.savePrompt(memberId, promptTr, '', result[memberId].rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.PROMPT) {    
    // Sort prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await promptsHistory.listHistory(memberId);
    await savePrompt.savePrompt(memberId, promptTr, '', result[memberId].rows.length, memberName, promptType);
    pageNum = 1;
  }

  if (promptType === constants.REMINDER) {    
    // Reminder prompt
    resultData[memberId].dispFields = [];
    result[memberId] = await handlers.remindersHandler(promptTr, memberId);
    await savePrompt.savePrompt(memberId, promptTr, '', result[memberId].rows.length, memberName, promptType);
    pageNum = 1;
  }

  // Format the result
  let resultObject
  let messages = [];
  if (result[memberId] && result[memberId].rows.length > 0) {
    // Data found
    if(result[memberId].rows.length > constants.PAGE_SIZE) {
      const lastPage = pageCalc.getLastPage(result[memberId]);
      messages.push('Page ' + pageNum + ' of ' + lastPage);                    
    }

    if(promptType === constants.EXCEL) {
      // Export prompt
      messages = [];
      messages.push('The data has been exported to an Excel file.');
      messages.push(fileURL);
    }

    resultObject = resultObj.getResultObject(result[memberId], messages, promptType, resultData[memberId].dispFields, pageNum, isDebug);

  } else {
    // No data found
    messages.push('No data found for your request.');
    messages.push('Try the following Help prompts to get a list of possible valid prompts.');
    let header = [];

    if(promptType === constants.LLM) {
      // Export prompt
      messages = [];
      result[memberId] = {rows:[{"Your answer here:":fileURL}], fields:[{name:"Your answer here:"}]};
    } else {
      result[memberId] = await help.getHelp(constants.HELP);
    }

    header = [];
    for(i = 0; i < result[memberId].fields.length; i++) {
      header.push(result[memberId].fields[i].name);
    }

    resultObject = resultObj.getResultObject(result[memberId], messages, promptType, header, pageNum, isDebug);
  }
  
  return resultObject;
}

module.exports = { promptHandler };