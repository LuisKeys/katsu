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
  const checkUser = require("./src/prompts/check_user");
  require("dotenv").config();

  openai = new openAI();

  let users

  // Test the promptHandler
  // const test = async () => {
  //   let prompt = "Help.";
  //   let result = await promptHandler.promptHandler(prompt, true);
  //   let output = resultObject.render(result);  

  //   // prompt = "Export to an excel file.";  
  //   // result = await promptHandler.promptHandler(prompt, false);
  //   // output = resultObject.render(result);
  // }

  // test();

  // Bolt app Initialization
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  const loadUsers = async () => {
    users = await app.client.users.list();    
  }
  
  loadUsers();

  const getAnswer = async (prompt, mail) => {
    isValid = await checkUser.checkUser(mail);

    if (!isValid) {
      return "You are not a registered user. Please contact the administrator to register.";
    }      
    
    const response = await promptHandler.promptHandler(prompt, false);
    const hey = "Certainly *" + profile.first_name + "*!\n";
    let output = resultObject.render(response);
    output = hey + "\`\`\`" + output + "\`\`\`";      

    return output;
  }

  // Listening for a message event
  app.message('katsu', async ({ message, say }) => {
    try {
      let prompt = message.text.replace("katsu","");

      const profile = users.members.filter(member => member.id === message.user)[0].profile;       

      const output = await getAnswer(prompt, profile.email);

      await say(output);
      
    } catch (error) {
      console.error(error);
    }
  });    

  //listening for slash command invocation
  app.command("/katsu", async ({ ack, payload, context }) => {
    // Acknowledge the command request
    ack();

    const prompt = payload.text;

    try {
      const profile = users.members.filter(member => member.id === payload.user_id)[0].profile;       
      const output = await getAnswer(prompt, profile.email);

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
