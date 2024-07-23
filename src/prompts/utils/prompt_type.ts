import { KatsuState } from "../../state/katsu_state";
import { createTypePrompt } from "../../llm/prompt_generators/prompt_type_gen";

/**
 * Module for determining the type of prompt.
 * @module prompt_type
 */

/**
 * Retrieves the prompt type from the given state.
 * @param state The KatsuState object.
 * @returns The prompt type as a string.
 */
const getPromptType = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  let context = createTypePrompt(state, userIndex);
  state.users[userIndex].context = context;
  // const response = await ask(state, userIndex);
  const response = "QUESTION";  // For testing purposes
  state.users[userIndex].promptType = response;
  return state;
};

export { getPromptType };