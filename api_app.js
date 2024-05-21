
/**
 * Module for initializing the API application.
 * @module apiApp
 */

const express = require("express");

require("dotenv").config();

/**
 * Initializes the API application.
 * @function apiApp
 */
const apiApp = function () {
  console.log("API mode is on.");

  const app = express();
  const port = process.env.PORT || 3000;

  /**
   * Handles the root route.
   * @name GET /
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  /**
   * Starts the server and listens on the specified port.
   * @function
   * @param {number} port - The port number to listen on.
   */
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
};

module.exports = { apiApp };
