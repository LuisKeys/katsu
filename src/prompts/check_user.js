const db = require("../db/db_commands");

/**
 * Checks if a user with the given email exists in the members table.
 * @param {string} email - The email of the user to check.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
 */
const checkUser = async (email) => {
  const sql = `SELECT email FROM members WHERE email = '${email}'`;
  await db.connect();
  const result = await db.execute(sql);
  await db.close();  
  return result.rows.length > 0;
}    

module.exports = {
  checkUser
}
