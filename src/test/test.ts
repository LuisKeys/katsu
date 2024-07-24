import { getUserIndex } from "../users/get_user";
import { KatsuState } from "../state/katsu_state";
const { promptHandler } = require("../prompts/prompt_handler");
import { logResult } from "../result/result_object";

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
    let prompts = ["The top 10 opportunities by revenue."];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      state.users[userIndex].prompt = prompt;
      state = await promptHandler(state, userIndex);

      logResult(state, userIndex);
    }
  }
};

export { executeTest };