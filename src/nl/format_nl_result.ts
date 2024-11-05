import { KatsuState, User } from "../state/katsu_state";
import { createFormatResultPrompt } from "../llm/prompt_generators/format_result_gen";
import { askAI } from "../llm/openai/openai_api";

const formatOneLineResult = async (userState: User, state: KatsuState) => {
  userState.context = createFormatResultPrompt(userState.result);
  userState.result.text = await askAI(state, userState.context);
}

export { formatOneLineResult };