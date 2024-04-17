
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
const sortFieldFinder = require("../nl/sort_field_finder");

openai = new openAI();

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (prompt) => {
  
  const resultSQL = await nl2sql.generateSQL(openai, openAIAPI, prompt);
  sql = resultSQL.sql;  
  console.log(sql);

  let resultData = {result:null, dispFields:[], sql:""};
  if(sql === '') {
    return resultData;
  }
  await db.connect();
  const result = await db.execute(sql);
  await db.close();  
  
  resultData = {result:result, dispFields:resultSQL.dispFields, sql:sql};
  return resultData;
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
  field = sortFieldFinder.getSortfield(prompt, result);
  if (field) {
    result.rows = dbSortResult.sortResult(result, field);
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
    record[headerTitle] = '////////////////////////////////////////';
    result.rows.push(record);
  }
  
  return result;
}  

module.exports = {
  questionHandler,
  linkHandler,
  sortHandler,
  filesHandler
};