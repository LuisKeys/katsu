import { KatsuState, User } from "../../state/katsu_state";
import { ask, askAI } from "../../llm/openai/openai_api";
import { createFormatFieldsNamesPrompt } from "../../llm/prompt_generators/format_result_gen";
import { createQuestionPrompt } from "../../llm/prompt_generators/question_prompt_gen";
import { getNonResultMsg } from "../../result/result_messages";
import { getResult } from "../../result/get_result";
import { getLastPage } from "./page_calc";
import { resetResult } from "../../result/result_object";

const questionHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  const userState = state.users[userIndex];
  const result = userState.result;

  await questionIntent(state, userIndex, false);
  if (result.rows.length === 0) {
    await questionIntent(state, userIndex, true);
  }

  result.noDataFound = result.rows.length === 0;
  if (result.noDataFound) {
    result.text = getNonResultMsg(userState.prompt);
  } else {
    result.pageNum = 1;
    result.lastPage = getLastPage(result);
    result.fields = await getNiceFieldNames(state, userState, result.fields);
  }
  return state;
};

//Replace with string.toTitleCase?
const getNiceFieldNames = async (state: KatsuState, userState: User, fields: string[]): Promise<string[]> => {
  userState.context = `Output human-readable names for ${fields} in a comma-separated format`;
  // userState.context = createFormatFieldsNamesPrompt(result.fields); //TODO remove
  const niceFieldsComma = await askAI(state, userState.context);
  const niceFieldsList = niceFieldsComma.split(',').map(field => field.trim());
  return niceFieldsList;
}

//TODO remove
// const questionHandlerOld = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {

//   state = await questionIntent(state, userIndex, false);

//   if (state.users[userIndex].result.rows.length === 0) {
//     state = await questionIntent(state, userIndex, true);
//   }

//   if (state.users[userIndex].result.rows.length > 0) {
//     state.users[userIndex].result.pageNum = 1;
//     state.users[userIndex].result.lastPage = getLastPage(state.users[userIndex].result);

//     const llmPrompt = createFormatFieldsNamesPrompt(state.users[userIndex].result.fields);
//     state.users[userIndex].context = llmPrompt;
//     const fieldList = await ask(state, userIndex);
//     state.users[userIndex].result.fields = fieldList.split(',').map(field => field.trim());
//   }

//   state.users[userIndex].result.noDataFound = false;
//   if (state.users[userIndex].result.rows.length === 0) {
//     const userPrompt = state.users[userIndex].prompt;
//     state.users[userIndex].result.noDataFound = true;
//     state.users[userIndex].result.text = getNonResultMsg(userPrompt);
//   }

//   return state;
// };

const questionIntent = async (state: KatsuState, userIndex: number, isSecondIntent: boolean): Promise<void> => {
  const userState = state.users[userIndex];
  resetResult(userState);

  let sql = userState.sql;
  if (sql === "") {
    userState.context = createQuestionPrompt(state, state.users[userIndex], userIndex, isSecondIntent);
    sql = await ask(state, userIndex);
  }

  userState.sql = cleanSQL(sql);
  if (process.env.KATSU_DEBUG === "true") {
    console.log("SQL: ", userState.sql);
  }
  await getResult(state, userIndex);
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
