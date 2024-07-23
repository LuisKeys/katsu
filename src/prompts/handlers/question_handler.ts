import { get } from "http";
import { ask } from "../../llm/openai/openai_api";
import { createQuestionPrompt } from "../../llm/prompt_generators/question_prompt_gen";
import { KatsuState } from "../../state/katsu_state";
import { getResult } from "../../result/get_result";

/**
 * This module contains the handler for question prompts type.
 * @module question handler
 */

/**
 * Handles the question prompt.
 *
 * @param state - The current state of the application.
 * @param userIndex - The index of the current user.
 * @returns The updated state of the application.
 */
const questionHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  state.users[userIndex].result.pageNum = 1;
  state.users[userIndex].result.lastPage = 1;
  const llmPrompt = createQuestionPrompt(state, userIndex);
  state.users[userIndex].context = llmPrompt;
  state.showWordsCount = true;
  let sql = await ask(state, userIndex);
  sql = sql.replace(/"/g, "'");
  sql = sql.replace(/\\n/g, " ");
  sql = sql.replace(/`/g, " ");
  sql = sql.replace("sql", " ");
  state.users[userIndex].sql = sql;
  state = await getResult(state, userIndex);

  return state;
};

export {
  questionHandler
};
