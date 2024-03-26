/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 * It also has a test() method to test the nl2sql and openAIAPI modules local.
 */

// Required External Modules
const { App } = require("@slack/bolt");
require("dotenv").config();
const nl2sql = require("./src/nl2sql/translate");
const nlPromptType = require("./src/nl/prompt_type");
const OpenAI = require("openai");
const openAIAPI = require("./src/openai/openai_api");
const db = require("./src/db/db_commands");
const fs = require("fs");
const format_table = require("./src/formatter/format_result");

openai = new OpenAI();

// Testing block
const promptHandler = async () => {    
  const prompt = "Get candidate viewer link";
  const promptType = nlPromptType.getPromptType(prompt);  
  let sql = '';  
  let result;

  if (promptType === 'question') {    
    sql = await nl2sql.generateSQL(openai, openAIAPI, prompt);
    await db.connect();
  } else if (promptType === 'file') {
    // TODO Write the file
  } else if (promptType === 'link') {

    await db.connect();
    result = await db.execute('SELECT words FROM links');
    sql = await nl2sql.getLinkSQL(prompt, result.rows);
  } else if (promptType === 'help') {
    // TODO Show help
  }

  result = await db.execute(sql);
  await db.close();  
  console.log('SQL:');
  console.log(sql);
  format_table.getTableFromResult(result);  
}

promptHandler();

// // Bolt app Initialization
// const app = new App({
//   token: process.env.SLACK_BOT_TOKEN,
//   signingSecret: process.env.SLACK_SIGNING_SECRET,
// });

// //listening for slash command invocation
// app.command("/askme", async ({ ack, payload, context }) => {
//   // Acknowledge the command request
//   ack();

//   const prompt = payload.text;

//   try {
//     const sql = await nl2sql.generateSQL(openai, openAIAPI, prompt);
  
//     console.log(sql);
//     const response = await sf_api.getData(sql);    
//     let output = prompt + ':\n';
    

//     // Walk through response elements and concatenate them in the output string
//     const linesLimit = 50;
//     let lineCounter = 0;
//     let totalLines = 0;
//     for(let i = 0; i < response.length; i++) {
//       const element = response[i];
//       lineCounter++;
//       totalLines++;
//       output += element + '\n';    
        
//       if(lineCounter >= linesLimit || response.length === totalLines) {
//         const result = await app.client.chat.postMessage({
//           token: context.botToken,
//           // Channel to send message to
//           channel: payload.channel_id,
//           // Include a button in the message (or whatever blocks you want!)
//           blocks: [
//             {
//               type: "section",
//               text: {
//                 type: "mrkdwn",
//                 text: output, // Output message
//               },
//             },
//           ],
//           // Text in the notification
//           text: "Message from Test App",
//         });

//         // Reset the output and counter
//         lineCounter = 0;
//         output = '';
//       }
      
//     };    

//     //console.log(result);    
//   } catch (error) {
//     console.error(error);
//   }
// });

// (async () => {
//   // Start your app
//   await app.start(3000);

//   console.log("⚡ Bolt app is running on port 3000");
// })();
