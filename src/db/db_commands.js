const { Client } = require('pg');

/**
 * Connects to the database.
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
 * @param {string} sql - The SQL statement to execute.
 */
const execute = async function (sql) {
  try {
    // Perform database operations here
    const rows = await client.query(sql);
    return rows;
  } catch (error) {
    console.error("Error with database operation", error);    
  }
};

/**
 * Closes the database connection.
 */
const close = async function () {
  try {
    // Disconnect the database
    await client.end();

  } catch (error) {
    console.error("Error with database operation", error);
  }
};


module.exports = {
  execute,
  connect,
  close
};
