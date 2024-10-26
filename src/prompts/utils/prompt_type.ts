import { KatsuState } from "../../state/katsu_state";
import { createTypePrompt } from "../../llm/prompt_generators/prompt_type_gen";
import { ask } from "../../llm/openai/openai_api";

const getPromptType = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  let context = createTypePrompt(state, userIndex);
  state.users[userIndex].context = context;
  const response = await ask(state, userIndex);
  // const response = "QUESTION";  // For testing purposes
  state.users[userIndex].promptType = response;
  return state;
};

export { getPromptType };