import { ResultObject } from "../prompts/result_object";
require("dotenv").config();
import { getUserId } from "../members/get_member";
const { getResultObjectsBuffer, ResultObject, setResultObjectByUser } = require("../prompts/result_object");
const { promptHandler } = require("../prompts/prompt_handler");

const size = process.env.RESULT_OBJECTS_BUFFER_SIZE;
var results: ResultObject[] = getResultObjectsBuffer(size);

// Test the promptHandler
const executeTest = async () => {
  console.log("Executing test...");
  const memberId = await getUserId("luis.paradela@accelone.com");
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

export { executeTest };