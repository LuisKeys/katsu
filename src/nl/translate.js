
/**
 * This module contains functions for generating SQL statements based on user prompts.
 * @module nl2sql/translate
 */

const finder = require("./entity_finder");
const checkPrompt = require("../prompts/check_history");
const dbFields = require("../db/db_get_fields");

/**
 * Retrieves the SQL statement for retrieving links based on the given prompt and rows.
 * @param {string} prompt - The prompt to be used for searching links.
 * @param {Array} rows - The rows containing words to be matched with the prompt.
 * @returns {string} The SQL statement for retrieving links.
 */
const getLinkSQL = async function (prompt, rows) {
  let sql = '';

  for (let i = 0; i < rows.length; i++) {
    let row = rows[i];
    words = row.words.split(',');
    for (let j = 0; j < words.length; j++) {
      if (prompt.includes(words[j])) {
        sql = "SELECT name, url as link FROM links where words like '%" + words[j] + "%' order by name";
      }
    }
  }

  return sql;
}

/**
 * Generates an SQL statement based on the provided prompt.
 * @param {object} openai - The OpenAI object.
 * @param {object} openaiapi - The OpenAI API object.
 * @param {string} userPrompt - The user prompt for generating the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, userPrompt) {

  // Get the entity from the prompt
  const entity = await finder.getEntity(userPrompt);
  let result = {sql:"", dispFields:[]};

  if(entity === '') {
    
    return result;
  }


  // Get the fields for the entity
  const fields = await dbFields.getViewFields(entity);

  // Get the prompt for the SQL statement
  const fullPrompt = getPrompt(openai, openaiapi, entity.view, fields, userPrompt);

  let sql = await checkPrompt.checkPrompt(userPrompt);

  if(sql == null) {
    sql = await openaiapi.ask(
      openai,
      fullPrompt
    );
  }

  sql = sanitizeSQL(sql);
  sql = replaceEqualityWithLike(sql);

  result = {sql:sql, dispFields:entity.dispFields};

  return result;
}

/**
 * Replaces equality comparisons in the SQL string with LIKE comparisons.
 *
 * @param {string} sql - The SQL string to modify.
 * @returns {string} The modified SQL string.
 */
const replaceEqualityWithLike = function (sql) {
  const pattern = /lower\((.*?)\) = '(.*?)'/g;
  const replacement = "lower($1) like '%$2%'";
  sql = sql.replace(pattern, replacement);
  
  return sql;
}

/**
 * Sanitizes the given SQL string by removing unwanted characters and converting it to lowercase.
 *
 * @param {string} sql - The SQL string to sanitize.
 * @returns {string} The sanitized SQL string.
 */
const sanitizeSQL = function (sql) {
  sql = sql.replaceAll("```", " ");
  sql = sql.replaceAll("sql", " ");
  sql = sql.replaceAll("\n", " ");
  sql = sql.trim();
  sql = sql.toLowerCase();
  
  return sql;
}

/**
 * Generates the prompt for the SQL statement based on the entity, fields, and user prompt.
 * @param {object} openai - The OpenAI object.
 * @param {object} openaiapi - The OpenAI API object.
 * @param {string} entity - The entity for the SQL statement.
 * @param {Array} fields - The fields to be included in the WHERE statement.
 * @param {string} userPrompt - The user prompt for the SQL statement.
 * @returns {string} The generated prompt for the SQL statement.
 */
const getPrompt = function (openai, openaiapi, entity, fields, userPrompt) {
  let prompt = "Create a SELECT statement for PostgreSql to retrieve data from the " + entity + " table.";
  if(userPrompt.includes("number of")) {
    prompt += " Count the number of rows.";
  } 

  prompt += " Include the following fields to define the where statement: ";
  for(let i = 0; i < fields.length; i++) {
    prompt += fields[i] + ", ";
  }

  prompt+= " based on the following user prompt: " + userPrompt;

  prompt += " If there is a where clause use the lower() function to compare string fields.";  
  prompt += " Limit the results to 100 rows.";  
  prompt += " Answer only with the SQL statement.";  

  return prompt;
}

module.exports = { generateSQL, getLinkSQL };

