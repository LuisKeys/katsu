// @ts-ignore
import { Client, QueryResult } from 'pg';
import { DbConnData } from './db_conn_data';

let gerror = '';

const getError = function (): string {
  return gerror;
};

/**
 * Connects to the database.
 * @async
 */
const connect = async function (dbConnData: DbConnData): Promise<Client | null> {
  const client = new Client({
    user: dbConnData.user,
    host: dbConnData.host,
    database: dbConnData.database,
    password: dbConnData.password,
    port: dbConnData.port,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to the database
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

/**
 * Closes the database connection.
 * @async
 */
const close = async function (client: Client): Promise<void> {
  try {
    // Disconnect the database
    await client.end();
  } catch (error) {
    console.error("Error with disconnect database operation", error);
  }
};

export {
  close,
  connect,
  execute,
  getError
};
