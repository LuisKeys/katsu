import sqlite from 'sqlite3';
import { QueryResultRow } from 'pg';

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

const db_all = async (db: sqlite.Database, query: string): Promise<QueryResultRow[]> => {
  return new Promise(function (resolve, reject) {
    db.all<QueryResultRow>(query, function (err, rows) {
      if (err) { return reject(err); }
      resolve(rows);
    });
  });
}


export {
  close,
  execute,
  db_all,
  open
};