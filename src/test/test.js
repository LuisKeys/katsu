const getMember = require("../members/get_member");
const answerPhrase = require("../prompts/answer_phrases");
const resultObject = require("../prompts/result_object");
const promptHandler = require("../prompts/prompt_handler");

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
      let prompts = ["Who is tassi?"];      

      for (let i = 0; i < prompts.length; i++) {
        let prompt = prompts[i];
        let result = await promptHandler.promptHandler(
          prompt,
          memberId,
          false,
          "luis"
        );

        let hey = answerPhrase.getAnswerPhrase("Luis") + "!\n";
        let output = resultObject.render(result, true);
        output = hey + "```" + output + "```";

        console.log(output);
      }
    }
  };

module.exports = { test };