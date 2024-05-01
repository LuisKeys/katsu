
/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */

const constants = require("./constants");
const db = require("../db/db_commands");
const dbSortResult = require("../db/sort_result");
const filesClean = require("../files/clean");
const filesIndex = require("../files/files_index");
const nl2sql = require("../nl/translate");
const openAI = require("openai");
const openAIAPI = require("../openai/openai_api");
const pageCalc = require("./page_calc");
const reminders= require("./reminders");
const sortFieldFinder = require("../nl/sort_field_finder");
const pageNL = require("../nl/page");
const word = require("../word/create_word");

openai = new openAI();

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (prompt) => {
 
  let resultData = await getSQL(prompt, false, '');

  // Reflection
  if(resultData.result === null || resultData.result.rows.length === 0) {
    const error = db.getError();
    resultData = await getSQL(prompt, true, error);
  }

  return resultData;
}
    
     

const getSQL = async (prompt, reflection, error) => {
  const resultSQL = await nl2sql.generateSQL(openai, openAIAPI, prompt, reflection, error);
  sql = resultSQL.sql;  
  console.log(sql);

  let resultData = {result:null, dispFields:[], sql:"", entity:""};
  if(sql === '') {
    return resultData;
  }
  await db.connect();
  const result = await db.execute(sql);
  await db.close();
  resultData = {result:result, dispFields:resultSQL.dispFields, sql:sql, entity:resultSQL.entity};
  return resultData;
}

/**
 * Handles the LLM prompt.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI API.
 * @returns {Promise<any>} - A promise that resolves to the result of the OpenAI API call.
 */
const llmHandler = async (prompt) => {
  let finalPrompt = prompt;
  finalPrompt += "Format the output for a word document,  including '\n' char for new lines. Provide only the answer without any additional introduction or conclusion.";
  // LLM prompt
  let result = await openAIAPI.ask(
    openai,
    finalPrompt
  );  

  const url = await word.createWord(result);

  return url;
}

/**
 * Handles the link prompt.
 * @async
 * @param {string} prompt - The link prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const linkHandler = async (prompt) => {
  // Link prompt
  let result;
  await db.connect();
  if(prompt.includes(constants.ALL)) {
    result = await db.execute('SELECT name, URL FROM links order by name');
  }
  else{    
    result = await db.execute('SELECT words FROM links');
    sql = await nl2sql.getLinkSQL(prompt, result.rows);
    result = await db.execute(sql);    
  }
  await db.close();

  return result;
}    

/**
 * Handles the sort prompt.
 * @async
 * @param {string} prompt - The sort prompt.
 * @param {object} result - The result object.
 * @returns {Promise} - A promise that resolves to the sorted result object.
 */
const sortHandler = async (prompt, result) => {
  // Sort prompt
  sortFields = [];
  sortFields = sortFieldFinder.getSortfield(prompt, result);
  if (sortFields.length > 0){
    const sortDir = sortFieldFinder.getSortDirection(prompt);
    result.rows = dbSortResult.sortResult(result, sortFields, sortDir);
  }

  return result;
}  

const filesHandler = async (prompt, result) => {

  let fullPrompt = "get the subject words for the prompt: '";
  fullPrompt += prompt;
  fullPrompt += "'.Only answer with a list of single words separated with comma.";
  fullPrompt += "Ignore the words file, files, doc, documents or similar";

  words = await openAIAPI.ask(
    openai,
    fullPrompt
  );

  const wordsList = words.split(',').map(word => word.trim());

  const filesDir = process.env.FILES_FOLDER;
  // clean up not indexable files and folders
  // filesClean.cleanFiles(filesDir);
  // filesClean.cleanEmptyDirs(filesDir);
  // get file list
  let files = filesIndex.exploreFolder(filesDir);
  
  files = filesIndex.searchFiles(files, wordsList);

  filesClean.cleanReports();

  files = filesIndex.copyFilesToReports(files)

  const headerTitle = "Found_Files"
  result = {rows:[], fields:[]};
  field = {name:headerTitle};
  result.fields.push(field);

  for(let i = 0; i < files.length; i++) {
    // File name
    let record = {};
    record[headerTitle] = files[i].fileName;
    result.rows.push(record);
    // URL
    record = {};
    record[headerTitle] = files[i].urlPath;
    result.rows.push(record);
    // separator
    record = {};    
    record[headerTitle] = '----------------------------------------';
    result.rows.push(record);
  }
  
  return result;
} 

const remindersHandler = async (prompt, memberId) => {
  const action = await reminders.getReminderAction(openai, openAIAPI, prompt);
  let result = null;
  switch(action) {
    case 'create':
      result = await reminders.createReminder(openai, openAIAPI, prompt, memberId);
      break;
    case 'delete':
      result = await reminders.deleteReminder(openai, openAIAPI, prompt, memberId);
      break;
    case 'list':
      result = await reminders.listReminders(openai, openAIAPI, prompt, memberId);
      break;
    default:
      break;
  }
  
  return result;
}

/**
 * Handles the page prompt.
 *
 * @param {Object} prompt - The page prompt object.
 * @param {Object} result - The result object.
 * @returns {Promise<Object>} The updated result object.
 */
const pageHandler = (prompt, pageNum, result) => {
  // Pages prompt
  const cmd = pageNL.getPageCommand(prompt);  
  let page = 1;
  switch(cmd) {
    case pageNL.PAGE_LAST:
      page = pageCalc.getLastPage(result);
      break;
    case pageNL.PAGE_NEXT:
      page = pageCalc.getNextPage(pageNum, result);
      break;
    case pageNL.PAGE_PREV:
      page = pageCalc.getPrevPage(pageNum);
      break;
      case pageNL.PAGE_NUMBER:
        page = pageNL.getPageNumber(prompt);
        if(page < 1) {
          page = 1;
        }
        if(page > pageCalc.getLastPage(result)) {
          page = pageCalc.getLastPage(result);
        }
        break;
      default:
      page = 1
      break;
  }
  
  return page;
}  


module.exports = {
  questionHandler,
  linkHandler,
  sortHandler,
  filesHandler,
  llmHandler,
  pageHandler,
  remindersHandler
};