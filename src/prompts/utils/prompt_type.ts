import { KatsuState, User } from "../../state/katsu_state";
import { createTypePrompt } from "../../llm/prompt_generators/prompt_type_gen";
import { askAI } from "../../llm/openai/openai_api";

const getPromptType = async (userState: User, state: KatsuState) => {
  userState.context = createTypePrompt(userState.prompt);
  userState.promptType = await askAI(state, userState.context);;
  // const userState.promptType = "QUESTION";  // For testing purposes
};

export { getPromptType };