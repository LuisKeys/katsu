import { connect, execute, close } from "../db/db_commands";

interface User {
  id: string;
  profile: {
    email: string;
  };
}

interface App {
  client: {
    chat: {
      postMessage: (message: { channel: string; text: string }) => void;
    };
  };
}

/**
 * Checks for reminders based on the current time.
 * @returns {Promise<void>} A promise that resolves once the reminders have been checked.
 */
const checkReminders = async (users: { members: User[] }, app: App): Promise<void> => {
  let sql = "";
  await connect();
  // Get reminders for the current time
  sql = getSQLCurReminders();

  const reminders = await execute(sql);
  for (const reminder of reminders.rows) {
    const title = reminder.title;
    const email = reminder.email;
    const id = reminder.id;
    if (users) {
      for (const user of users.members) {
        if (user.profile.email) {
          if (user.profile.email.toLowerCase() === email.toLowerCase()) {
            app.client.chat.postMessage({
              channel: user.id,
              text: `------ :alarm_clock: Reminder: ${title} ------`,
            });
            // Update reminder
            sql = getSQLUpdateReminder(id);
            await execute(sql);

            // Delete reminder with no repeat
            sql = getSQLDeleteDueRemindersId(id);
            await execute(sql);
          }
        }
      }
    }
  }

  // Clean old reminders
  sql = getSQLDeleteDueReminders();
  await execute(sql);

  await close();
};

const getSQLCurReminders = (): string => {
  let sql = "";
  sql = "SELECT s.id, s.title, m.email ";
  sql += "FROM schedule s, members m ";
  sql += "WHERE m.id = s.member_id ";
  sql += " AND EXTRACT(DAY FROM s.starts_at) = EXTRACT(DAY FROM NOW()) ";
  sql += " AND EXTRACT(HOUR FROM s.starts_at) = EXTRACT(HOUR FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM s.starts_at) BETWEEN EXTRACT(MINUTE FROM NOW()) ";
  sql += " AND EXTRACT(MINUTE FROM NOW()) + 10; ";
  return sql;
};

const getSQLDeleteDueReminders = (): string => {
  let sql = "";
  sql = `delete from schedule where lower(repeat) = 'none' and starts_at < now()`;
  return sql;
};

const getSQLDeleteDueRemindersId = (id: number): string => {
  let sql = "";
  sql = `delete from schedule where lower(repeat) = 'none' and id = ${id}`;
  return sql;
};

const getSQLUpdateReminder = (id: number): string => {
  let sql = "";
  sql = " UPDATE schedule ";
  sql += "SET starts_at  = DATE_TRUNC('day', now()) + INTERVAL '1 day' + (starts_at  - DATE_TRUNC('day', starts_at )) ";
  sql += `where id = ${id} `;
  sql += `and lower(repeat) <> 'none';`;
  return sql;
};

export { checkReminders };
