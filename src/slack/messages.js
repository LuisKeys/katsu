let app;
let users;

const constants = require("../prompts/constants");
const messagesUtils = require("./messages_utils");

const initSlack = (appObj, usersList) => {
  app = appObj;
  users = usersList;

    //Listening for slash command invocation
    app.command("/katsu", async ({ ack, payload, context }) => {
      // Acknowledge the command request
      ack();
  
      const prompt = payload.text;
  
      try {
        const profile = users.members.filter(
          (member) => member.id === payload.user_id
        )[0].profile;
        const answer = await messagesUtils.getAnswer(prompt, profile);
        const output = answer.output;
        const token = process.env.SLACK_BOT_TOKEN;
        let promptType = constants.HELP;
        if(answer.response) {
          promptType = answer.response.promptType;
        }

        await sendMessage(token, payload.channel_id, output, promptType);
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
      const answer = await messagesUtils.getAnswer(prompt, profile);
      const output = answer.output;
      const token = process.env.SLACK_BOT_TOKEN;
      const channelId = body.container.channel_id;
      const promptType = answer.response.promptType;

      await sendMessage(token, channelId, output, promptType);
    }
  );

    // Listening for a message event
    app.message("katsu", async ({ message, say }) => {
      try {
        let prompt = message.text.replace("katsu", "");
  
        const profile = users.members.filter(
          (member) => member.id === message.user
        )[0].profile;
  
        const answer = await messagesUtils.getAnswer(prompt, profile);
        const output = answer.output;
        await say(output);
      } catch (error) {
        console.error(error);
      }
    }); 

}

/**
   * Sends a message to a specified channel using the Slack API.
   *
   * @param {string} token - The Slack API token.
   * @param {string} channelId - The ID of the channel to send the message to.
   * @param {string} output - The message content to send.
   * @returns {Promise<void>} - A promise that resolves when the message is sent successfully.
   */
  const sendMessage = async (token, channelId, output, promptType) => {
    const msgObject = messagesUtils.getMessageObject(output, promptType)
    await app.client.chat.postMessage({
      token: token,
      channel: channelId,
      blocks: msgObject,
      // Text in the notification
      text: "Message from KATSU",
    });
  };

module.exports = { initSlack };