// @ts-ignore
import { Client, QueryResult } from 'pg';
import { DbConnData } from './db_conn_data';
import { DataSource } from "../state/katsu_state";

let gerror = '';

const getError = function (): string {
  return gerror;
};

const connectDatasource = async function (dataSource: DataSource): Promise<Client | null> {
  let client = new Client({
    user: dataSource.user,
    host: dataSource.host,
    database: dataSource.db,
    password: dataSource.password,
    port: dataSource.port,
    ssl: dataSource.isSSL ? { rejectUnauthorized: false } : undefined
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.end();
    console.error("Error with database operation", error);
    return null;
  }
}

const connect = async function (dbConnData: DbConnData): Promise<Client | null> {
  let client = new Client({
    user: dbConnData.user,
    host: dbConnData.host,
    database: dbConnData.database,
    password: dbConnData.password,
    port: dbConnData.port,
    ssl: dbConnData.isSSL ? { rejectUnauthorized: false } : undefined
  });

  try {
    await client.connect();
    return client;
  } catch (error) {
    await client.end();
    console.error("Error with database operation", error);
    return null;
  }
};

/**
 * Executes the given SQL statement on the connected PostgreSQL database.
 * @async
 * @param {string} sql - The SQL statement to execute.
 * @returns {Promise<QueryResult>} - The result of the SQL query.
 */
const execute = async function (sql: string, client: Client): Promise<QueryResult | null> {
  try {
    // Perform database operations here
    gerror = '';
    const rows = await client.query(sql);
    return rows;
  } catch (error: any) {
    console.error("Error with sql", sql);
    console.error("Error with database operation", error);
    gerror = error["message"];
    return null;
  }
};

const close = async function (client: Client): Promise<void> {
  try {
    await client.end();
  } catch (error) {
    console.error("Error with disconnect database operation", error);
  }
};

const connectMetadataDB = async function (): Promise<Client | null> {
  const dbConnData = {
    host: process.env.METADATA_DB_HOST || 'localhost',
    port: Number(process.env.METADATA_DB_PORT) || 5432,
    user: process.env.METADATA_DB_USER || 'postgres',
    database: process.env.METADATA_DB_NAME || '',
    password: process.env.METADATA_DB_PASSWORD || '',
    isSSL: process.env.IS_ISSL === 'true'
  };

  const client: Client | null = await connect(dbConnData);
  return client;
}

export {
  close,
  connect,
  connectDatasource,
  execute,
  getError,
  connectMetadataDB
};
