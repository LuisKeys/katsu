import { KatsuState } from "../../state/katsu_state";

const createPageCMDPrompt = (userPrompt: string): string => {
  let prompt = `Find the sort or order by field within the following list 
  for the following prompt:
  Prompt: "${userPrompt}"
  Command List:
  - FIRST_PAGE
  - LAST_PAGE 
  - NEXT_PAGE 
  - PREV_PAGE
  - PAGE_NUMBER

  Only provide the name of the command within the list.
  If no command is identified return FIRST_PAGE. 
  `;

  return prompt;
}

export { createPageCMDPrompt };

