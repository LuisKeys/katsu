"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var api_app_1 = require("./api_app");
var dotenv_1 = require("dotenv");
/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 */
// Required External Modules
dotenv_1.default.config();
(0, api_app_1.apiApp)();
