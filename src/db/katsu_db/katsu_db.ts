import sqlite, { sqlite3 } from 'sqlite3';
import { User, DataSource, KatsuState, TableSampleData } from './katsu_state';
import { ResultObject } from '../../result/result_object';
import OpenAI from 'openai';
import { QueryResult, QueryResultRow } from 'pg';

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

const getUsers = async (db: sqlite.Database): Promise<User[]> => {
  const sql = `
    SELECT user_id as userId, email, first_name as firstName, last_name as lastName, 
    role, title, department, avatar, password
    FROM users
  `;

  return new Promise<User[]>((resolve, reject) => {
    db.all<User[]>(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const users: User[] = rows.map((row) => convertDBRowToUser(row));
        resolve(users);
      }
    });
  });
};

const convertDBRowToUser = (row: any): User => {
  const result: ResultObject = {
    fields: [],
    fileURL: '',
    lastPage: 0,
    pageNum: 0,
    prompt: '',
    promptType: '',
    rows: [],
    sql: '',
    text: '',
    user: null
  };

  const user: User = {
    avatar: row.avatar,
    context: '',
    department: row.department,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    password: row.password,
    prompt: '',
    result: result,
    role: row.role,
    title: row.title,
    userId: row.user_id,
    dataSourceIndex: 0,
    promptType: ''
  };

  return user;
}

const convertDBRowTODataSource = (row: QueryResultRow, tablesSampleData: TableSampleData[]): DataSource => {
  return {
    sourceId: row.source_id,
    name: row.name,
    description: row.description,
    type: row.type,
    host: row.host,
    user: row.user,
    password: row.password,
    port: row.port,
    db: row.db,
    tables: row.tables,
    tablesSampleData: tablesSampleData
  };
}

/*
const getTablesSampleData = async (result: QueryResult): Promise<TableSampleData[]> => {
  let
  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i];
    const tablesSampleData = await getTableSampleData(row);
    return tablesSampleData;
  }

  const tables: string[] = row.tables.split(',').map((table: string) => table.trim());
  const tablesSampleData: TableSampleData[] = [];
  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];
    const result = await getDataSourcesRows(row, table);
    const dataSources = await getDataSources(result);
    tablesSampleData.push(tableSampleData);
  }
  return tablesSampleData;

}
*/

const getDataSourcesRows = async (db: sqlite.Database) => {
  const sql = `SELECT source_id as sourceId, name, description, type, host, user, password, port, db, tables
    FROM data_sources`;

  const result = await db_all(db, sql);

  return;
};

const getDataSources = async (db: sqlite.Database): Promise<DataSource[]> => {
  await getDataSourcesRows(db);
  let dataSources: DataSource[] = [];
  return dataSources;
}


const loadKatsuState = async (openai: OpenAI): Promise<KatsuState> => {
  const db = await open();

  const users: User[] = await getUsers(db);
  const dataSources: DataSource[] = await getDataSources(db);

  close(db);

  console.log('Loaded Katsu state.');
  return { users, dataSources, openai: openai, isDebug: false, showWordsCount: false };
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