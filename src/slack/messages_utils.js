const answerPhrase = require("../prompts/answer_phrases");
const getMember = require("../members/get_member");
const promptHandler = require("../prompts/prompt_handler");
const resultObject = require("../prompts/result_object");

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

  /**
   * Returns a message object for Slack.
   * @returns {Array} The message object for Slack.
   */
  const getMessageObject = () => {
    msgObject = [
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
    ]

    return msgObject;
  }
  
  module.exports = {
    getAnswer,
    getMessageObject
  };
