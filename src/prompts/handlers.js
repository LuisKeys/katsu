
/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */

const constants = require("./constants");
const db = require("../db/db_commands");
const nl2sql = require("../nl2sql/translate");
const openAI = require("openai");
const openAIAPI = require("../openai/openai_api");

openai = new openAI();

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (prompt) => {
  sql = await nl2sql.generateSQL(openai, openAIAPI, prompt);
  console.log(sql);
  await db.connect();
  result = await db.execute(sql);
  await db.close();  
  return result;
}    

/**
 * Handles the link prompt.
 * @async
 * @param {string} prompt - The link prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const linkHandler = async (prompt) => {
  // Link prompt
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
  field = sortFieldFinder.getSortfield(promptTr, result);
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