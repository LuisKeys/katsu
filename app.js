  /**
   * This is the main file for the AskMe App POC.
   * It initializes the Slack Bolt app, authenticates with DB,
   * and listens for a slash command invocation to send a test message.
   * It also has a test() method to test the nl2sql and openAIAPI modules local.
   */

  // Required External Modules
  const { App } = require("@slack/bolt");
  const openAI = require("openai");
  const fs = require("fs");
  const promptHandler = require("./prompt_handler");
  const resultObject = require("./src/prompts/result_object");
  require("dotenv").config();

  openai = new openAI();

  // // Test the promptHandler
  // const test = async () => {
  // let prompt = "help";  
  // // let prompt = "List the roles where employee 'geronimo' works. List the customer name and the role.";
  // let result = await promptHandler.promptHandler(prompt, false);
  // let output = resultObject.render(result);  
  // prompt = "Export to an excel file.";  
  // result = await promptHandler.promptHandler(prompt, false);
  // output = resultObject.render(result);
  // }

  // test();

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
      let output = prompt + ':\n';
      const response = await promptHandler.promptHandler(prompt, false);
      output += resultObject.render(response);
      output = "\`\`\`" + output + "\`\`\`";      

      // Walk through response elements and concatenate them in the output string
      await app.client.chat.postMessage({
        token: context.botToken,
        // Channel to send message to
        channel: payload.channel_id,
        // Include a button in the message (or whatever blocks you want!)
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: output // Output message
              // Added backticks to format the output as multine code
            },
          },
        ],
        // Text in the notification
        text: "Message from KATSU",
      });
      
    } catch (error) {
      console.error(error);
    }
  });

  (async () => {
    // Start your app
    await app.start(3000);

    console.log("⚡ Bolt app is running on port 3000");
  })();
