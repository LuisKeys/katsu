import { connect, close, execute } from "../../db/db_commands";
import { getResultObjectByUser, ResultObject } from "../../result/result_object";
import { KatsuState } from "../../state/katsu_state";

/**
 * Saves a prompt to the prompts_history table.
 * 
 * @param {string} memberId - The user's id.
 * @param {string} prompt - The prompt text.
 * @param {string} sql - The SQL query.
 * @param {number} rowsCount - The number of rows affected by the SQL query.
 * @param {string} memberName - The member's name.
 * @param {string} promptType - The type of prompt.
 * @returns {Promise<void>} - A Promise that resolves when the prompt is saved.
 */
const savePrompt = async (state: KatsuState, userIndex: number): Promise<void> => {
  /*
  const userId: number = result.user?.userId || 0;
  const prompt: string = result.prompt;
  let sql: string = result.sql;
  const rowsCount: number = result.rows.length;
  const promptType: string = result.promptType;

  const promptSafe = prompt.replace(/'/g, "''");
  if (!sql) {
    sql = "";
  }
  const sqlSafe = sql.replace(/'/g, "''");
  let insertSQL = "insert into prompts_history ";
  insertSQL += "(userId, prompt, SQL, rows_count, prompt_cmp, prompt_type) ";
  const promptClean = cleanPrompt(prompt);
  insertSQL += `values (${userId}, '${promptSafe}', '${sqlSafe}', ${rowsCount}, '${promptClean}', '${promptType}') `;

  const client = await connect();
  if (client !== null) {
    await execute(insertSQL, client);
    await close(client);
  }
  */
}

/**
 * Cleans the given prompt by replacing single quotes with double quotes,
 * removing all spaces, and converting it to lowercase.
 *
 * @param {string} prompt - The prompt to be cleaned.
 * @returns {string} The cleaned prompt.
 */
const cleanPrompt = (prompt: string): string => {
  let promptSafe = prompt.replace(/'/g, "''");
  // clean all spaces
  promptSafe = promptSafe.replace(/\s/g, '');
  // remove all special characters
  promptSafe = promptSafe.replace(/[^a-zA-Z0-9]/g, '');
  // turn to lower case
  promptSafe = promptSafe.toLowerCase();

  return promptSafe;
}

export {
  savePrompt,
  cleanPrompt
};