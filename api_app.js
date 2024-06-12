/**
 * Module for initializing the API application.
 * @module apiApp
 */

const express = require("express");
const promptHandler = require("./src/prompts/prompt_handler");
const { authUser } = require("./src/authentication/auth_user");
const { generateToken } = require("./src/authentication/token");
const { validateToken } = require("./src/authentication/token");
const { getPayloadFromToken } = require("./src/authentication/token");
const { transfResAPI } = require("./src/prompts/api_transf");

require("dotenv").config();

const port = process.env.PORT || 3020;
const api_root = "/api/v1/";

/**
 * Initializes the API application.
 * @function apiApp
 */
const apiApp = function () {
  console.log("API mode is on.");

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  /**
   * Handles the auth route.
   * @name POST /auth
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  app.post(api_root + "auth", (req, res) => {
    const { user, password } = req.body;

    try {
      if (authUser(user, password)) {
        const token = generateToken(user);
        res.status(200).json({ token });
        return;
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

  /**
   * Handles the auth route.
   * @name POST /prompt
   * @function
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  app.post(api_root + "prompt", async (req, res) => {
    const { token, prompt } = req.body;

    try {
      if (!validateToken(token)) {
        throw new Error("Invalid token");
      }

      let result = await new Promise((resolve, reject) => {
        const user = getPayloadFromToken(token);
        const memberId = process.env.AUTH_MEMBER_ID;
        askPrompt(prompt, user, memberId, openai, openaiapi)
          .then((result) => resolve(result))
          .catch((error) => reject(error));
      });

      result = transfResAPI(result);
        
      res.status(200).json({ answer: result });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  });

  /**
   * Starts the server and listens on the specified port.
   * @function
   * @param {number} port - The port number to listen on.
   */
  app.listen(port, () => {
    console.log(`api listening at http://localhost:${port}`);
  });
};

const askPrompt = async (prompt, user, memberId, openai, openaiapi) => {
  if (user != process.env.AUTH_USER) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
  } else {
    const userName = process.env.AUTH_USER;    
    let result = await promptHandler.promptHandler(
      prompt,
      memberId,
      false,
      userName,
      openai,
      openaiapi
    );
    
    return result;
  }
};

module.exports = { apiApp };
