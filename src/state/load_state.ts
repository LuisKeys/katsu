import OpenAI from 'openai';
import sqlite from 'sqlite3';
import { Client, QueryResultRow } from 'pg';
import { ResultObject } from '../result/result_object';
import { User, DataSource, KatsuState, TableSampleData } from './katsu_state';
import { close, connect, execute } from '../db/db_commands';
import { closeKDB, db_allKDB, openKDB } from '../db/katsu_db/katsu_db';
import { getHelp } from '../nl/help';

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
    noDataFound: false
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
    dataSourceIndex: 0,
    promptType: '',
    sql: '',
    userId: row.userId
  };

  return user;
}

const convertDBRowTODataSource = (row: QueryResultRow, tablesSampleData: TableSampleData[]): DataSource => {
  let isSSL = false;
  if (row.type === 'postgresql' && row.is_ssl === 1) {
    isSSL = true;
  }
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
    tablesSampleData: tablesSampleData,
    custom_prompt: row.custom_prompt,
    helpList: [],
    isSSL: isSSL,
    dataSourceId: row.sourceId
  };
}

const getTablesSampleData = async (row: QueryResultRow): Promise<TableSampleData[]> => {
  let tablesSampleData: TableSampleData[] = [];

  let isSSL = false;

  if (row.type === 'postgresql' && row.is_ssl === 1) {
    isSSL = true;
  }

  const dbConnData = {
    user: row.user,
    host: row.host,
    database: row.db,
    password: row.password,
    port: row.port,
    isSSL: isSSL
  };
  const client: Client | null = await connect(dbConnData);
  if (client === null) {
    return tablesSampleData;
  }

  const tables: string[] = row.tables.split(',').map((table: string) => table.trim());
  for (const table of tables) {
    const sql = `SELECT * FROM ${table} LIMIT 3`;
    const result = await execute(sql, client);
    if (result !== null) {
      let tableSampleData: TableSampleData = {
        tableName: table,
        result: result
      };
      tablesSampleData.push(tableSampleData);
    }
  }

  close(client);

  return tablesSampleData;
}

const getDataSourcesRows = async (db: sqlite.Database): Promise<QueryResultRow[]> => {
  const sql = `SELECT source_id as sourceId, name, description, type, host, user, password, port, db, tables, custom_prompt, is_ssl  
    FROM data_sources WHERE is_enabled = 1`;

  const result = await db_allKDB(db, sql);
  return result;
};

const getDataSources = async (db: sqlite.Database): Promise<DataSource[]> => {
  const rows = await getDataSourcesRows(db);
  let dataSources: DataSource[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const tablesSampleData = await getTablesSampleData(row);
    const dataSource = convertDBRowTODataSource(row, tablesSampleData);
    const helpList = await getHelp(dataSource);
    dataSource.helpList = helpList;
    dataSources.push(dataSource);
  }
  return dataSources;
}


const loadKatsuState = async (openai: OpenAI): Promise<KatsuState> => {
  const db = await openKDB();

  const users: User[] = await getUsers(db);
  const dataSources: DataSource[] = await getDataSources(db);

  closeKDB(db);

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
};

export {
  loadKatsuState,
  getTablesList
};