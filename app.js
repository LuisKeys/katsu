/**
 * This is the main file for the AskMe App POC.
 * It initializes the Slack Bolt app, authenticates with DB,
 * and listens for a slash command invocation to send a test message.
 * It also has a test() method to test the nl and openAIAPI modules local.
 */

// Required External Modules
const { App } = require("@slack/bolt");
const openAI = require("openai");
const fs = require("fs");
const promptHandler = require("./prompt_handler");
const resultObject = require("./src/prompts/result_object");
const getMember = require("./src/members/get_member");
const answerPhrase = require("./src/prompts/answer_phrases");
require("dotenv").config();

openai = new openAI();

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
      const prompt = "list all sow files for alliance.";
      // const prompt = "list all the active engagements";
      // const prompt = "help link";
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
  };

  loadUsers();

  /**
   * Retrieves the answer based on the given prompt and user profile.
   * @param {string} prompt - The prompt to be answered.
   * @param {object} profile - The user's profile object.
   * @returns {Promise<string>} The answer to the prompt.
   */
  const getAnswer = async (prompt, profile) => {
    const memberId = await getMember.getMemberId(profile.email);
    const isValid = memberId != -1;

    if (!isValid) {
      return "You are not a registered user. Please contact the administrator to register.";
    }

    const response = await promptHandler.promptHandler(
      prompt,
      memberId,
      false,
      profile.first_name
    );
    let hey = answerPhrase.getAnswerPhrase(profile.first_name) + "!\n";
    hey += prompt + "\n";
    let output = resultObject.render(response);
    output = hey + "```" + output + "```";

    return output;
  };

  // Listening for a message event
  app.message("katsu", async ({ message, say }) => {
    try {
      let prompt = message.text.replace("katsu", "");

      const profile = users.members.filter(
        (member) => member.id === message.user
      )[0].profile;

      const output = await getAnswer(prompt, profile);
      await say(output);
    } catch (error) {
      console.error(error);
    }
  });

  //Listening for slash command invocation
  app.command("/katsu", async ({ ack, payload, context }) => {
    // Acknowledge the command request
    ack();

    const prompt = payload.text;

    try {
      const profile = users.members.filter(
        (member) => member.id === payload.user_id
      )[0].profile;
      const output = await getAnswer(prompt, profile);
      const token = process.env.SLACK_BOT_TOKEN;
      await sendMessage(token, payload.channel_id, output);
    } catch (error) {
      console.error(error);
    }
  });

  // Listening for the export excel action
  app.action(
    { action_id: "exportToExcel" },
    async ({ body, client, ack, logger }) => {
      await ack();

      const profile = users.members.filter(
        (member) => member.id === body.user.id
      )[0].profile;

      const prompt = "export to excel";
      const output = await getAnswer(prompt, profile);
      const token = process.env.SLACK_BOT_TOKEN;
      const channelId = body.container.channel_id;

      await sendMessage(token, channelId, output);
    }
  );

  /**
   * Sends a message to a specified channel using the Slack API.
   *
   * @param {string} token - The Slack API token.
   * @param {string} channelId - The ID of the channel to send the message to.
   * @param {string} output - The message content to send.
   * @returns {Promise<void>} - A promise that resolves when the message is sent successfully.
   */
  const sendMessage = async (token, channelId, output) => {
    await app.client.chat.postMessage({
      token: token,
      channel: channelId,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: output, // Output message
          },
        },
        {
          type: "divider",
        },
        {
          type: "actions",
          block_id: "exportToExcel",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "Export to Excel",
                emoji: true,
              },
              value: "exportToExcel",
              action_id: "exportToExcel",
            },
          ],
        },
      ],
      // Text in the notification
      text: "Message from KATSU",
    });
  };

  (async () => {
    // Start your app
    await app.start(3000);

    console.log("⚡ Bolt app is running on port 3000");
  })();
}
