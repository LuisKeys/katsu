
/**
 * @module db_commands
 * @description This module provides functions for connecting to a PostgreSQL database, executing SQL statements, and closing the database connection.
 */

const { Client } = require('pg');

let gerror = '';

const getError = function () {
  return gerror;
}

/**
 * Connects to the database.
 * @async
 */
const connect = async function () {
  try {
    // Create a new pool instance
    client = new Client({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT,
    });
    
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
 * @returns {Promise<object>} - The result of the SQL query.
 */
const execute = async function (sql) {
  try {
    // Perform database operations here
    error = '';
    const rows = await client.query(sql);
    return rows;
  } catch (error) {
    console.error("Error with database operation", error);        
    gerror = error.message;
    return null;
  }
};

/**
 * Closes the database connection.
 * @async
 */
const close = async function () {
  try {
    // Disconnect the database
    await client.end();

  } catch (error) {
    console.error("Error with database operation", error);
  }
};

/**
 * Logs the result of a database query.
 * @param {object} result - The result of a database query.
 */
const logResult = function (result) {
  for (let row of result.rows) {
    console.log(row);
  }  
};

module.exports = {
  close,
  connect,
  execute,
  getError,
  logResult
};
