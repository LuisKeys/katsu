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
      let prompts = ["list all the active engagements", "list all sow files for alliance", "sort by found_files"];
      // prompts = ["list all the active engagements", "list all sow files for alliance", "help link", "sort by engagement name", "export to excel"];
      // prompts = ["help"];
      prompts = ["create a reminder with text 'send email to luis' to happen in one hour and repeat weekly"];

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

module.exports = { test };