import sqlite from 'sqlite3';
import { User, DataSource, KatsuState } from './katsu_state';

/**
 * Opens a connection to the Katsu database.
 * @returns {sqlite.Database} The opened database connection.
 */
const open = () => {
  const db = new sqlite.Database('../../../db/katsu.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the Katsu database.');
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
    console.log('Closed the Katsu database connection.');
  });
}

async function loadKatsuState(dbPath: string): Promise<KatsuState> {
  const db = open()

  const users: User[] = await new Promise<User[]>((resolve, reject) => {
    db.all<User[]>(`
      SELECT userId, email, firstName, lastName, role, title, department, avatar
      FROM users
    `, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  const dataSources: DataSource[] = await new Promise<User[]>((resolve, reject) => {
    db.all<User[]>(
      `SELECT sourceId, name, description, type, host, user, password, port, db, tables
      FROM data_sources`, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });

  close(db);

  // Convert tables from comma-separated string to array of strings
  for (const dataSource of dataSources) {
    dataSource.tables = dataSource.tables ? dataSource.tables.split(',') : [];
  }

  return { users, dataSources };
}

export {
  close,
  execute,
  loadKatsuState,
  open
};