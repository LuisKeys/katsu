import { Client, QueryResult } from "pg";
import { connect, close, execute } from "../db/db_commands";
import { HELP } from "../state/constants";
import { KatsuState } from "../state/katsu_state";
import { getUserIndex } from "../users/get_user";

/**
 * @fileoverview This module contains functions for retrieving help information based on a prompt.
 * @module nl/help
 */


/**
 * Retrieves help information based on the provided prompt.
 * @param {string} prompt - The prompt to retrieve help information for.
 * @returns {Promise<any>} - A promise that resolves to the help information.
 */
const getHelp = async function (state: KatsuState, userIndex: number): Promise<KatsuState> {
  let result;
  let prompt = state.users[userIndex].prompt;
  if (prompt === HELP) {
    result = await getHelpList(state, userIndex);
  } else {
    prompt = prompt.replace(HELP, '').trim();
    result = await getHelpList(state, userIndex);
  }

  return result;
}

/**
 * Retrieves a list of help items based on the provided prompt.
 *
 * @param {string} prompt - The prompt to search for in the help table.
 * @returns {Promise<Array>} - A promise that resolves to an array of help items.
 */
const getHelpList = async function (state: KatsuState, userIndex: number): Promise<KatsuState> {
  /*
  const sql = `SELECT sample_prompt As "Prompts for ${prompt}" FROM help where topic = '${prompt}' ORDER BY sample_prompt`;
  const 
  const client = await connect();
  if (client === null) {
    return null;
  }

  const result: QueryResult | null = await execute(sql, client);
  await close(client);
  return result;
  */
  return state;
}

export { getHelp };
