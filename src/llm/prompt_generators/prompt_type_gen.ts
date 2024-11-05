import { convertToCSV, getConstDescription } from "../../state/constants";

const createTypePrompt = (userPrompt: string): string => {
  const constList = getConstDescription();
  const csvList = convertToCSV(constList);

  const prompt = `Define the type of prompt within the following list 
  for the following prompt:
  Prompt: "${userPrompt}"
  List: ${csvList}
  Only provide the name of the constant.
  `;

  return prompt;
}

export { createTypePrompt };