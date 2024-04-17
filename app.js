/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 */

// Required External Modules
const { App } = require("@slack/bolt");
const answerPhrase = require("./src/prompts/answer_phrases");
const getMember = require("./src/members/get_member");
const messages = require("./src/slack/messages");
const promptHandler = require("./src/prompts/prompt_handler");
const resultObject = require("./src/prompts/result_object");
require("dotenv").config();

let users;

const isDebug = process.env.KATSU_DEBUG == "true";

if (isDebug) {
  console.log("Debug mode is on.");

  // Test the promptHandler
  const test = async () => {
    const memberId = await getMember.getMemberId("luis@accelone.com");
    const isValid = memberId != -1;
    if (!isValid) {
      console.log(
        "You are not a registered user. Please contact the administrator to register."
      );
      return;
    } else {
      let prompts = ["list all the active engagements", "list all sow files for alliance", "sort by found_files"];
      // prompts = ["list all the active engagements", "list all sow files for alliance", "help link", "sort by engagement name", "export to excel"];
      prompts = ["help"];

      for (let i = 0; i < prompts.length; i++) {
        let prompt = prompts[i];
        let result = await promptHandler.promptHandler(
          prompt,
          memberId,
          false,
          "luis"
        );

        let hey = answerPhrase.getAnswerPhrase("Luis") + "!\n";
        hey += prompt + "\n";
        let output = resultObject.render(result);
        output = hey + "```" + output + "```";

        console.log(output);
      }
    }
  };

  test();

} else {
  // Bolt app Initialization
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  // Load workspace users
  const loadUsers = async () => {
    users = await app.client.users.list();
    messages.setApp(app, users);
  };

  loadUsers();  
  
  (async () => {
    // Start your app
    await app.start(3000);

    console.log("⚡ Bolt app is running on port 3000");
  })();
}
