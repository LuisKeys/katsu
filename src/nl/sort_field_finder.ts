import { KatsuState, User } from "../state/katsu_state";
import { createSortDirectionPrompt, createSortFieldPrompt } from "../llm/prompt_generators/sort_gen";
import { askAI } from "../llm/openai/openai_api";

const getSortfield = async (userState: User, state: KatsuState): Promise<string> => {
  userState.context = createSortFieldPrompt(userState);
  const sortField = await askAI(state, userState.context);
  return sortField;
};

const getSortDirection = async (userState: User, state: KatsuState): Promise<string> => {
  userState.context = createSortDirectionPrompt(userState);
  const sortField = await askAI(state, userState.context);
  return sortField;
};

export { getSortfield, getSortDirection };
