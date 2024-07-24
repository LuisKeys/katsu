import { KatsuState } from "../../state/katsu_state";

const createSortFieldPrompt = (state: KatsuState, userId: number): string => {
  const userPrompt = state.users[userId].prompt;
  const fields = state.users[userId].result.fields;
  const csvList = fields.join(", ");
  let prompt = `Find the sort or order by field within the following list 
  for the following prompt:
  Prompt: "${userPrompt}"
  List: ${csvList}
  Only provide the name of the one single field within the list.
  `;

  return prompt;
}

const createSortDirectionPrompt = (state: KatsuState, userId: number): string => {
  const userPrompt = state.users[userId].prompt;
  const fields = state.users[userId].result.fields;
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