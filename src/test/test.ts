import { KatsuState } from "../state/katsu_state";
const { promptHandler } = require("../prompts/prompt_handler");
import { logAPIResultObject, userResultToAPIResult } from "../result/api_result_format";

const testPromptHandler = async (state: KatsuState) => {
  console.log("Executing test...");
  const userIndex = state.users.findIndex(user => user.email === "luis.paradela@accelone.com");
  const isValid = userIndex != -1;
  if (!isValid) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
    return;
  } else {
    let prompts = ["provide the latest 10 leads"];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      state.users[userIndex].prompt = prompt;
      if (state.isDebug) {
        console.log("*********************");
        console.log("Prompt: ", prompt);
      }

      state = await promptHandler(state, userIndex);

      const apiResult = await userResultToAPIResult(state.users[userIndex], state);
      logAPIResultObject(apiResult);
    }
  }
};

export { testPromptHandler as executeTest };