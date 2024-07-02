import { connect, close, execute } from "../db/db_commands";
import { HELP } from "../prompts/constants";

/**
 * @fileoverview This module contains functions for retrieving help information based on a prompt.
 * @module nl/help
 */


/**
 * Retrieves help information based on the provided prompt.
 * @param {string} prompt - The prompt to retrieve help information for.
 * @returns {Promise<any>} - A promise that resolves to the help information.
 */
const getHelp = async function (prompt: string): Promise<any> {
  let result;
  if (prompt === HELP) {
    result = await getHelpList(prompt);
  } else {
    prompt = prompt.replace(HELP, '').trim();
    result = await getHelpList(prompt);
  }

  return result;
}

/**
 * Retrieves a list of help items based on the provided prompt.
 *
 * @param {string} prompt - The prompt to search for in the help table.
 * @returns {Promise<Array>} - A promise that resolves to an array of help items.
 */
const getHelpList = async function (prompt: string): Promise<Array<any>> {
  const sql = `SELECT sample_prompt As "Prompts for ${prompt}" FROM help where topic = '${prompt}' ORDER BY sample_prompt`;
  await connect();
  const result = await execute(sql);
  await close();

  return result;
}

export { getHelp };
