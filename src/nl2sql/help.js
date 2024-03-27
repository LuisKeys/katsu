/**
 * @fileoverview This module contains functions for retrieving help information based on a prompt.
 * @module nl2sql/help
 */

const db = require("../db/db_commands");
const constants = require("../prompts/constants");

/**
 * Retrieves help information based on the provided prompt.
 * @param {string} prompt - The prompt to retrieve help information for.
 * @returns {Promise<any>} - A promise that resolves to the help information.
 */
const getHelp = async function (prompt) {
  let result;
  if(prompt === constants.HELP) {
    result = await  getHelpList(prompt);
  }
  else {
  prompt = prompt.replace(constants.HELP, '').trim();
  result = await  getHelpList(prompt);
  }

  return result;
}

/**
 * Retrieves a list of help items based on the provided prompt.
 *
 * @param {string} prompt - The prompt to search for in the help table.
 * @returns {Promise<Array>} - A promise that resolves to an array of help items.
 */
const getHelpList = async function (prompt) {
  const sql = `SELECT sample_prompt As "Prompts for ${prompt}" FROM help where topic = '${prompt}' ORDER BY sample_prompt`;
  await db.connect();
  const result = await db.execute(sql);
  await db.close();

  return result;
}

module.exports = { getHelp };