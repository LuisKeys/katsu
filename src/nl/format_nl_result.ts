import { KatsuState, User } from "../state/katsu_state";
import { createFormatResultPrompt } from "../llm/prompt_generators/format_result_gen";
import { ask, askAI } from "../llm/openai/openai_api";

const formatOneLineResult = async (state: KatsuState, userState: User, userIndex: number) => {
  userState.context = createFormatResultPrompt(state, userIndex);
  userState.result.text = await askAI(state, userState.context);
}

export { formatOneLineResult };