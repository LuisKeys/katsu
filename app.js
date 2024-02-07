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

const test = async () => {

const prompt = "What are the top 5 opportunities by amount?";
const sql = await nl2sql.generateSQL(openai, openaiapi, prompt);
  
console.log(sql);
//const response = await sf_api.getData(sql);    
}

test();

//listening for slash command invocation
app.command("/askme", async ({ ack, payload, context }) => {
  // Acknowledge the command request
  ack();

  const prompt = payload.text;

  try {
    const sql = await nl2sql.generateSQL(openai, openaiapi, prompt);
  
    console.log(sql);
    const response = await sf_api.getData(sql);    
    let output = prompt + ':\n';
    

    // Walk through response elements and concatenate them in the output string
    const linesLimit = 50;
    let lineCounter = 0;
    let totalLines = 0;
    for(let i = 0; i < response.length; i++) {
      const element = response[i];
      lineCounter++;
      totalLines++;
      output += element + '\n';    
        
      if(lineCounter >= linesLimit || response.length === totalLines) {
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
                text: output, // Output message
              },
            },
          ],
          // Text in the notification
          text: "Message from Test App",
        });

        // Reset the output and counter
        lineCounter = 0;
        output = '';
      }
      
    };    

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
