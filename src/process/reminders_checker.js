const db = require("../db/db_commands");

/**
 * Checks for reminders based on the current time.
 * @returns {Promise<void>} A promise that resolves once the reminders have been checked.
 */
const checkReminders = async () => {
  let sql = "";
  await db.connect();
  // Get reminders for the current time
  sql = "SELECT * ";
  sql += "FROM schedule ";
  sql +=
    " WHERE EXTRACT(HOUR FROM starts_at AT TIME ZONE 'UTC+3') = EXTRACT(HOUR FROM NOW()) ";
  sql +=
    " AND EXTRACT(MINUTE FROM starts_at AT TIME ZONE 'UTC+3') BETWEEN EXTRACT(MINUTE FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM NOW()) + 10; ";

  const reminders = await db.execute(sql);

  for (const reminder of reminders.rows) {
    title = reminder.title;
    memberId = reminder.member_id;
  }

  // Clean old reminders
  sql = `delete from schedule where lower(repeat) = 'none' and starts_at AT TIME ZONE 'UTC+3' < now()`;
  await db.execute(sql);

  await db.close();
};

module.exports = { checkReminders };
