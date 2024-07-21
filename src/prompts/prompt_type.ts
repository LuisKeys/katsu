import { convertToCSV, getConstDescription } from "./constants";
import { KatsuState } from "../db/katsu_db/katsu_state";
import { ask } from "../openai/openai_api";

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
  const response = await ask(state, userIndex);
  console.log("Prompt Type: ", response);
  state.users[userIndex].promptType = response;
  return state;
};

const createTypePrompt = (state: KatsuState, userId: number): string => {
  const constList = getConstDescription();
  const csvList = convertToCSV(constList);

  let prompt = `Define the type of prompt within the following list 
  for the following prompt:
  Prompt: "${state.users[userId].prompt}"
  List: ${csvList}
  Only provide the name of the constant.
  `;

  return prompt;
}

export { getPromptType };