// @ts-ignore
import { Client, QueryResult } from 'pg';

let gerror = '';

const getError = function (): string {
  return gerror;
};

/**
 * Connects to the database.
 * @async
 */
const connect = async function (): Promise<void> {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Connect to the database
    await client.connect();
  } catch (error) {
    await client.end();
    console.error("Error with database operation", error);
  }
};

/**
 * Executes the given SQL statement on the connected PostgreSQL database.
 * @async
 * @param {string} sql - The SQL statement to execute.
 * @returns {Promise<QueryResult>} - The result of the SQL query.
 */
const execute = async function (sql: string): Promise<QueryResult | null> {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Perform database operations here
    gerror = '';
    await client.connect();
    const rows = await client.query(sql);
    return rows;
  } catch (error: any) {
    console.error("Error with sql", sql);
    console.error("Error with database operation", error);
    gerror = error["message"];
    return null;
  } finally {
    await client.end();
  }
};

/**
 * Closes the database connection.
 * @async
 */
const close = async function (): Promise<void> {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: Number(process.env.POSTGRES_PORT),
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // Disconnect the database
    await client.connect();
  } catch (error) {
    console.error("Error with database operation", error);
  } finally {
    await client.end();
  }
};

/**
 * Logs the result of a database query.
 * @param {QueryResult} result - The result of a database query.
 */
const logResult = function (result: QueryResult): void {
  for (let row of result.rows) {
    console.log(row);
  }
};

export {
  close,
  connect,
  execute,
  getError,
  logResult
};
