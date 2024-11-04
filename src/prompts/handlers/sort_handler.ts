import { sortResult } from "./sort_result";
import { KatsuState, User } from "../../state/katsu_state";
import { createSortDirectionPrompt, createSortFieldPrompt } from "../../llm/prompt_generators/sort_gen";
import { askAI } from "../../llm/openai/openai_api";

const sortHandler = async (userState: User, state: KatsuState) => {
  const result = userState.result;
  const sortField = await getSortfield(userState, state);
  const sortDir = await getSortDirection(userState, state);
  sortResult(userState.result, sortField, sortDir);

  result.pageNum = 1;
  userState.result = result;
};

const getSortfield = async (userState: User, state: KatsuState): Promise<string> => {
  userState.context = createSortFieldPrompt(userState);
  const sortField = await askAI(state, userState.context);
  return sortField;
};

const getSortDirection = async (userState: User, state: KatsuState): Promise<string> => {
  userState.context = createSortDirectionPrompt(userState);
  const sortDirection = await askAI(state, userState.context);
  return sortDirection;
};

export {
  sortHandler
};
