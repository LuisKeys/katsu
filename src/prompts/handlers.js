
/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */

const constants = require("./constants");
const db = require("../db/db_commands");
const dbSortResult = require("../db/sort_result");
const nl2sql = require("../nl2sql/translate");
const openAI = require("openai");
const openAIAPI = require("../openai/openai_api");
const sortFieldFinder = require("../nl2sql/sort_field_finder");

openai = new openAI();

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (prompt) => {
  const resultSQL = await nl2sql.generateSQL(openai, openAIAPI, prompt);
  const sql = resultSQL.sql;  
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

module.exports = {
  questionHandler,
  linkHandler,
  sortHandler
};