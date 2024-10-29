import { KatsuState } from "../state/katsu_state";
import { createFormatResultPrompt } from "../llm/prompt_generators/format_result_gen";
import { ask } from "../llm/openai/openai_api";

const formatOneLineResult = async (state: KatsuState, userIndex: number) => {
  const llmPrompt = createFormatResultPrompt(state, userIndex);
  state.users[userIndex].context = llmPrompt;
  const text = await ask(state, userIndex);
  state.users[userIndex].result.text = text;
}

export { formatOneLineResult };