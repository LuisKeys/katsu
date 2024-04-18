/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 */

// Required External Modules
const { App } = require("@slack/bolt");
const messages = require("./src/slack/messages");
const testFunctions = require("./src/test/test");
const clean = require("./src/files/clean");
const remindersChecker = require("./src/process/reminders_checker");

require("dotenv").config();

let users;
const isDebug = process.env.KATSU_DEBUG == "true";

// Timer
setInterval(backProcessTick, 5000);

// Handler function
const backProcessHandler = async (users) => {

  // Check reminders
  await remindersChecker.checkReminders(users);

  // clean reports
  await clean.cleanReports();
}

// Timer ick function
function backProcessTick() { 
  backProcessHandler(users)
  .then(() => {
      
  })
  .catch((error) => {
      console.error("Error occurred:", error);
  });

}

const test = async() => {
  await testFunctions.test()
}

if (isDebug) {
  console.log("Debug mode is on.");

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
    messages.initSlack(app, users);
  };

  loadUsers();  
  
  (async () => {
    // Start your app
    await app.start(3000);

    console.log("⚡ Bolt app is running on port 3000");
  })();
}
