const db = require("../db/db_commands");

/**
 * Saves a prompt to the prompts_history table.
 * 
 * @param {string} memberId - The user's id.
 * @param {string} prompt - The prompt text.
 * @param {string} sql - The SQL query.
 * @param {number} rowsCount - The number of rows affected by the SQL query.
 * @returns {Promise<void>} - A Promise that resolves when the prompt is saved.
 */
const savePrompt = async (memberId, prompt, sql, rowsCount, memberName, promptType) => {

  const promptSafe = prompt.replace(/'/g, "''");
  const sqlSafe = sql.replace(/'/g, "''");  
  let insertSQL = "insert into prompts_history ";
  insertSQL += "(userId, prompt, SQL, rows_count, member_name, prompt_cmp, prompt_type) ";
  const promptClean = cleanPrompt(prompt);  
  insertSQL += `values (${memberId}, '${promptSafe}', '${sqlSafe}', ${rowsCount}, '${memberName}', '${promptClean}', '${promptType}') `;
  
  await db.connect();
  await db.execute(insertSQL, [memberId, promptSafe, sqlSafe, rowsCount]);
  await db.close(); 
}

/**
 * Cleans the given prompt by replacing single quotes with double quotes,
 * removing all spaces, and converting it to lowercase.
 *
 * @param {string} prompt - The prompt to be cleaned.
 * @returns {string} The cleaned prompt.
 */
const cleanPrompt = (prompt) => {
  let promptSafe = prompt.replace(/'/g, "''");
  // clean all spaces
  promptSafe = promptSafe.replace(/\s/g, '');
  // remove all special characters
  promptSafe = promptSafe.replace(/[^a-zA-Z0-9]/g, '');
  // turn to lower case
  promptSafe = promptSafe.toLowerCase();

  return promptSafe;
}

module.exports = {
  savePrompt,
  cleanPrompt
}