import { apiApp } from "./api_app";
import dotenv from "dotenv";

/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 */

// Required External Modules

dotenv.config();

apiApp();
