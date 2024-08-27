import { KatsuState } from "../../state/katsu_state";
import { closeKDB, executeKDB, openKDB } from '../../db/katsu_db/katsu_db';

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
  const prompt = state.users[userIndex].prompt;
  const userId = state.users[userIndex].userId;
  const dataSourceIndex = state.users[userIndex].dataSourceIndex;
  const dataSourceId = state.dataSources[dataSourceIndex].dataSourceId;
  const sql = state.users[userIndex].sql;
  const promptType = state.users[userIndex].promptType;
  const rowsCount = state.users[userIndex].result.rows.length;

  if (rowsCount === 0) {
    return;
  }

  const encodedSql = Buffer.from(sql).toString('base64');

  const insertStatement = `
    INSERT INTO prompts_history
    (prompt, "sql", rows_count, date, "type", "user_id", data_source_id)
    VALUES(
    '${cleanPrompt(prompt)}', 
    '${encodedSql}', 
    ${rowsCount}, 
    ${Date.now()}, 
    '${promptType}', 
    '${userId}',
    '${dataSourceId}'
    );
  `;

  const db = await openKDB();
  await executeKDB(db, insertStatement);
  await closeKDB(db);
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