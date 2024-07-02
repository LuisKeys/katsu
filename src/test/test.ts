import { ResultObject } from "../prompts/result_object";
require("dotenv").config();
const getMember = require("../members/get_member");
const answerPhrase = require("../prompts/answer_phrases");
const { getResultObjectsBuffer, ResultObject, setResultObjectByUser } = require("../prompts/result_object");
const { promptHandler } = require("../prompts/prompt_handler");

const size = process.env.RESULT_OBJECTS_BUFFER_SIZE;
var results: ResultObject[] = getResultObjectsBuffer(size);

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
    let prompts = ["Who is employee paradela?"];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      let result = await promptHandler(
        prompt,
        memberId,
        false,
        results
      );

      console.log(result);
      results = setResultObjectByUser(memberId, result, results);
    }
  }
};

module.exports = { test };