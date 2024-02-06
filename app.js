/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with Salesforce,
 * and listens for a slash command invocation to send a test message.
 */

// Required External Modules
const { App } = require("@slack/bolt");
require("dotenv").config();
const sf_api = require("./src/salesforce/sf_api");
const sf_parser = require("./src/salesforce/sf_parser");
const nl2sql = require("./src/nl2sql/translate");
const OpenAI = require("openai");
const openaiapi = require("./src/openai/openai_api");
const fs = require("fs");

openai = new OpenAI();

// Bolt app Initialization
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

//listening for slash command invocation
app.command("/askme", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  const prompt = payload.text;

  try {
    const sql = await nl2sql.generateSQL(openai, openaiapi, prompt);
  
    console.log(sql);
    const response = await sf_api.getData(sql);
    console.log(response);
    let output = '';

    // Walk through response elements and concatenate them in the output string
    const linesLimit = 30;
    let lineCounter = 0;
    response.forEach(element => {
      lineCounter++;
      if(lineCounter < linesLimit)
        output += element + '\n';      
    });
  
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: output,
          },
        },
      ],
      // Text in the notification
      text: "Message from Test App",
    });
    //console.log(result);    
  } catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log("⚡ Bolt app is running on port 3000");
})();
