import { convertToCSV, getConstDescription } from "../../state/constants";
import { KatsuState } from "../../state/katsu_state";

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

export { createTypePrompt };