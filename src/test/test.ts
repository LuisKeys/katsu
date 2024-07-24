import { getUserIndex } from "../users/get_user";
import { KatsuState } from "../state/katsu_state";
const { promptHandler } = require("../prompts/prompt_handler");
import { APIResultObject, logResult } from "../result/result_object";
import { logAPIResultObject, transfResAPI } from "../result/api_transf";

// Test the promptHandler
const executeTest = async (state: KatsuState) => {
  console.log("Executing test...");
  const userIndex = await getUserIndex("luis.paradela@accelone.com", state);
  const isValid = userIndex != -1;
  if (!isValid) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
    return;
  } else {
    let prompts = ["provide the contact data for Luis Paradela."];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      state.users[userIndex].prompt = prompt;
      state = await promptHandler(state, userIndex);

      const apiResultObject: APIResultObject = await transfResAPI(state, userIndex);

      logAPIResultObject(apiResultObject);
    }
  }
};

export { executeTest };