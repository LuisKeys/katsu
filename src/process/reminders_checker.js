const db = require("../db/db_commands");

/**
 * Checks for reminders based on the current time.
 * @returns {Promise<void>} A promise that resolves once the reminders have been checked.
 */
const checkReminders = async (users) => {
  let sql = "";
  await db.connect();
  // Get reminders for the current time
  sql = "SELECT s.title, m.email ";
  sql += "FROM schedule s, members m ";
  sql += "WHERE m.id = s.member_id ";
  sql += " AND EXTRACT(HOUR FROM s.starts_at AT TIME ZONE 'UTC+3') = EXTRACT(HOUR FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM s.starts_at AT TIME ZONE 'UTC+3') BETWEEN EXTRACT(MINUTE FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM NOW()) + 10; ";

  const reminders = await db.execute(sql);
  
  for (const reminder of reminders.rows) {
    const title = reminder.title;
    const email = reminder.email;
    console.log(`Reminder for ${email}: ${title}`);
    if(users) {
      console.log(`users found`);
    }
  }  

  // Clean old reminders
  sql = `delete from schedule where lower(repeat) = 'none' and starts_at AT TIME ZONE 'UTC+3' < now()`;
  await db.execute(sql);

  await db.close();
};

module.exports = { checkReminders };
