const db = require("../db/db_commands");

/**
 * Checks if a user with the given email exists in the members table.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
 */
const getMemberId = async (email) => {
  const sql = `SELECT id FROM members WHERE email = '${email}'`;
  await db.connect();
  const result = await db.execute(sql);
  await db.close(); 
  
  if (result.rows.length > 0) {
    return result.rows[0].id;  
  }

  return -1;
}    

module.exports = {
  getMemberId
}
