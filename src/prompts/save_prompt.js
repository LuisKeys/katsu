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
const savePrompt = async (memberId, prompt, sql, rowsCount, memberName) => {

  const promptSafe = prompt.replace(/'/g, "''");
  const sqlSafe = sql.replace(/'/g, "''");  
  let insetSQL = "insert into prompts_history ";
  insetSQL += "(userId, prompt, SQL, rows_count, member_name) ";
  insetSQL += `values (${memberId}, '${promptSafe}', '${sqlSafe}', ${rowsCount}, ${memberName}) `;
  
  await db.connect();
  const result = await db.execute(insetSQL, [memberId, promptSafe, sqlSafe, rowsCount]);
  await db.close(); 

}

module.exports = {
  savePrompt
}
