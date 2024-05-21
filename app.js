/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 */

// Required External Modules
const slack = require("./slack_app");
const api = require("./api_app");

require("dotenv").config();

const isAPImode = process.env.API_MODE == "true";

if (!isAPImode) {
  slack.slackApp();
}
else {
  api.apiApp();
}

