const db = require("../db/db_commands");

/**
 * Checks for reminders based on the current time.
 * @returns {Promise<void>} A promise that resolves once the reminders have been checked.
 */
const checkReminders = async () => {
  let sql = "";
  await db.connect();
  // Get reminders for the current time
  sql = "SELECT *  FROM schedule ";
  sql += " WHERE EXTRACT(HOUR FROM starts_at) = EXTRACT(HOUR FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM starts_at) BETWEEN EXTRACT(MINUTE FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM NOW()) + 10; ";
  
  const reminders = await db.execute(sql);
  console.log(sql);
  console.log(reminders.rows);
  
  // Clean old reminders
  sql = `delete from schedule where lower(repeat) = 'none' and starts_at < now()`;

  // console.log(sql);
  // await db.execute(sql);

  await db.close();
};

module.exports = { checkReminders };

