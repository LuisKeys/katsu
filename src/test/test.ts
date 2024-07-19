import { ResultObject } from "../result/result_object";
import { getUser } from "../users/get_user";
import { KatsuState } from "../db/katsu_db/katsu_state";
const { getResultObjectsBuffer, ResultObject, setResultObjectByUser } = require("../result/result_object");
const { promptHandler } = require("../prompts/prompt_handler");

const size = process.env.RESULT_OBJECTS_BUFFER_SIZE;
var results: ResultObject[] = getResultObjectsBuffer(size);

// Test the promptHandler
const executeTest = async (state: KatsuState) => {
  console.log("Executing test...");
  const user = await getUser("luis.paradela@accelone.com", state);
  state.user = user;
  const isValid = user != null;
  if (!isValid) {
    console.log(
      "You are not a registered user. Please contact the administrator to register."
    );
    return;
  } else {
    let prompts = ["Who is employee paradela?"];

    for (let i = 0; i < prompts.length; i++) {
      let prompt = prompts[i];
      state.prompt = prompt;
      state = await promptHandler(state);

      console.log(state.results);
    }
  }
};

export { executeTest };