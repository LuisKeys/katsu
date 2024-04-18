const db = require("../db/db_commands");

/**
 * Checks for reminders based on the current time.
 * @returns {Promise<void>} A promise that resolves once the reminders have been checked.
 */
const checkReminders = async (users, app) => {
  let sql = "";
  await db.connect();
  // Get reminders for the current time
  sql = getSQLCurReminders();

  const reminders = await db.execute(sql);  
  for (const reminder of reminders.rows) {
    const title = reminder.title;
    const email = reminder.email;
    const id = reminder.id;
    if(users) {
      for(const user of users.members) {
        if(user.profile.email) {
          if(user.profile.email.toLowerCase() === email.toLowerCase()) {
            app.client.chat.postMessage({
              channel: user.id,
              text: `Reminder: ${title}`
            });
            // Update reminder
            sql = getSQLUpdateReminder(id);
            await db.execute(sql);

          }
        }
      }
    }
  }  

  // Clean old reminders
  sql = getSQLDeleteDueReminders();
  await db.execute(sql);

  await db.close();
};

const getSQLCurReminders = () => {
  let sql = "";
  sql = "SELECT s.id, s.title, m.email ";
  sql += "FROM schedule s, members m ";
  sql += "WHERE m.id = s.member_id ";
  sql += " AND EXTRACT(DAY FROM s.starts_at AT TIME ZONE 'UTC+3') = EXTRACT(DAY FROM NOW()) ";
  sql += " AND EXTRACT(HOUR FROM s.starts_at AT TIME ZONE 'UTC+3') = EXTRACT(HOUR FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM s.starts_at AT TIME ZONE 'UTC+3') BETWEEN EXTRACT(MINUTE FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM NOW()) + 10; ";
  return sql;
}

const getSQLDeleteDueReminders = () => {
  let sql = "";
  sql = `delete from schedule where lower(repeat) = 'none' and starts_at AT TIME ZONE 'UTC+3' < now()`;
  return sql;
}

const getSQLUpdateReminder = (id) => {
  let sql = "";
  sql = " UPDATE schedule ";
  sql += "SET starts_at  = DATE_TRUNC('day', now()) + INTERVAL '1 day' + (starts_at  - DATE_TRUNC('day', starts_at )) ";
  sql += `where id = ${id} `;
  return sql;
}

module.exports = { checkReminders };
