import sqlite from 'sqlite3';
import { User, DataSource, KatsuState } from './katsu_state';

/**
 * Opens a connection to the Katsu database.
 * @returns {sqlite.Database} The opened database connection.
 */
const open = async () => {
  const db = new sqlite.Database('./db/katsu.db', (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  return db;
}

/**
 * Executes the given SQL statement on the provided SQLite database.
 * 
 * @param db - The SQLite database object.
 * @param sql - The SQL statement to execute.
 */
const execute = (db: sqlite.Database, sql: string) => {
  db.serialize

  db.run(sql, (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Executed SQL statement.');
  });
}

/**
 * Closes the Katsu database connection.
 * @param {sqlite.Database} db - The SQLite database object.
 */
const close = (db: sqlite.Database) => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
  });
}

const getUsers = async (db: sqlite.Database): Promise<User[]> => {
  const sql = `
    SELECT user_id as userId, email, first_name as firstName, last_name as lastName, 
    role, title, department, avatar, password
    FROM users
  `
  db.all<User[]>(sql, (err, rows) => {
    if (err) {
      return null;
    } else {
      let users: User[] = [];
      rows.forEach((row) => {
        users.push(row);
      });
      return users;
    }
  });

  return [];
};

const getDataSources = async (db: sqlite.Database): Promise<DataSource[]> => {
  const sql = `SELECT source_id as sourceId, name, description, type, host, user, password, port, db, tables
    FROM data_sources`;

  db.all<DataSource[]>(sql, (err, rows) => {
    if (err) {
      return null;
    } else {
      let dataSources: DataSource[] = [];
      rows.forEach((row) => {
        dataSources.push(row);
      });
      return dataSources;
    }
  });

  return [];
};


const loadKatsuState = async (): Promise<KatsuState> => {
  const db = await open();

  const users: User[] = await getUsers(db);
  const dataSources: DataSource[] = await getDataSources(db);

  close(db);

  console.log('Loaded Katsu state.');
  return { users, dataSources };
}

/**
 * Converts a string of comma-separated table names into an array of table names.
 * @param tablesString - The string of comma-separated table names.
 * @returns {string[]} An array of table names.
 */
const getTablesList = (dataSource: DataSource): string[] => {
  const tablesString = dataSource.tables;
  return tablesString.split(',').map(table => table.trim());
}

export {
  close,
  execute,
  getTablesList,
  loadKatsuState,
  open
};