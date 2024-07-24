import { closeKDB, openKDB, db_allKDB } from "../db/katsu_db/katsu_db";
import { DataSource, KatsuState } from "../state/katsu_state";

/**
 * @fileoverview This module contains functions for retrieving help information based on a prompt.
 * @module nl/help
 */


/**
 * Retrieves help information based on the provided prompt.
 * @param {string} prompt - The prompt to retrieve help information for.
 * @returns {Promise<any>} - A promise that resolves to the help information.
 */
const getHelp = async function (dataSource: DataSource): Promise<string[]> {
  const name = dataSource.name;
  const sql = `SELECT sample_prompt FROM help WHERE data_source = '${name}' ORDER BY sample_prompt asc`;

  const db = await openKDB();
  const result = await db_allKDB(db, sql);
  await closeKDB(db);
  let helpList = [];
  for (let i = 0; i < result.length; i++) {
    helpList.push(result[i].sample_prompt);
  }

  return helpList;
}

export { getHelp };
