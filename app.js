// AskMe App POC

const { App } = require("@slack/bolt");
require('dotenv').config()

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

//listening for slash command invocation
app.command('/askme', async ({ ack, payload, context }) => {
  // Acknowledge the command request
  //console.log(payload);
  //console.log(context);
  ack();

  try {
    const result = await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Hey amigo!, this is a test msg :-D'
          }
        }
      ],
      // Text in the notification
      text: 'Message from Test App'
    });
    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log('⚡ Bolt app is running on port 3000');
})();