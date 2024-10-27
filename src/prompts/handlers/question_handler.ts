import { KatsuState } from "../../state/katsu_state";
import { ask } from "../../llm/openai/openai_api";
import { createFormatFieldsNamesPrompt } from "../../llm/prompt_generators/format_result_gen";
import { createQuestionPrompt } from "../../llm/prompt_generators/question_prompt_gen";
import { getNonResultMsg } from "../../result/result_messages";
import { getResult } from "../../result/get_result";
import { getLastPage } from "./page_calc";
import { resetResult } from "../../result/result_object";

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

  state = await questionIntent(state, userIndex, false);

  if (state.users[userIndex].result.rows.length === 0) {
    state = await questionIntent(state, userIndex, true);
  }

  if (state.users[userIndex].result.rows.length > 0) {
    state.users[userIndex].result.pageNum = 1;
    state.users[userIndex].result.lastPage = getLastPage(state.users[userIndex].result);

    const llmPrompt = createFormatFieldsNamesPrompt(state, userIndex);
    state.users[userIndex].context = llmPrompt;
    const fieldList = await ask(state, userIndex);
    state.users[userIndex].result.fields = fieldList.split(',').map(field => field.trim());
  }

  state.users[userIndex].result.noDataFound = false;
  if (state.users[userIndex].result.rows.length === 0) {
    const userPrompt = state.users[userIndex].prompt;
    state.users[userIndex].result.noDataFound = true;
    state.users[userIndex].result.text = getNonResultMsg(userPrompt);
  }

  return state;
};

const questionIntent = async (state: KatsuState, userIndex: number, isSecondIntent: boolean): Promise<KatsuState> => {
  const userState = state.users[userIndex]
  resetResult(userState);

  let sql = userState.sql;
  if (sql === "") {
    const llmPrompt = createQuestionPrompt(state, userIndex, isSecondIntent);
    userState.context = llmPrompt;
    sql = await ask(state, userIndex);
  }

  sql = cleanSQL(sql);
  if (process.env.KATSU_DEBUG === "true") {
    console.log("SQL: ", sql);
  }
  userState.sql = sql;
  state = await getResult(state, userIndex);
  return state;
}

const cleanSQL = (sql: string): string => {
  sql = sql.replace(/"/g, "'");
  sql = sql.replace(/\\n/g, " ");
  sql = sql.replace(/`/g, " ");
  sql = sql.replace("sql", " ");
  return sql;
}

export {
  questionHandler
};
