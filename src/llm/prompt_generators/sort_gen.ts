import { User } from "../../state/katsu_state";

const createSortFieldPrompt = (userState: User): string => {
  const csvList = userState.result.fields.join(", ");
  let prompt = `Find the sort or order by field within the following list 
  for the following prompt:
  Prompt: "${userState.prompt}"
  List: ${csvList}
  Only provide the name of the one single field within the list.
  `;

  return prompt;
}

const createSortDirectionPrompt = (userState: User): string => {
  const userPrompt = userState.prompt;
  // const fields = userState.result.fields;
  let prompt = `Find the order by direction, within the following list 
  for the following prompt:
  Prompt: "${userPrompt}"
  List: 
  - asc
  - desc
  Only provide the direction name without any other explanation.
  If no direction is identified return "asc".
  `;

  return prompt;
}

export { createSortDirectionPrompt, createSortFieldPrompt };