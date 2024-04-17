let app;
let users;

const setApp = (appObj, usersList) => {
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

}

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

module.exports = { setApp };