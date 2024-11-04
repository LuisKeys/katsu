import { KatsuState, User } from "../../state/katsu_state";
import { askAI } from "../../llm/openai/openai_api";
import { createQuestionPrompt } from "../../llm/prompt_generators/question_prompt_gen";
import { getNonResultMsg } from "../../result/result_messages";
import { getResult } from "../../result/get_result";
import { getLastPage } from "./page_calc";
import { resetResult } from "../../result/result_object";

const questionHandler = async (userState: User, state: KatsuState): Promise<void> => {
  const result = userState.result;

  await questionIntent(userState, false, state);
  if (result.rows.length === 0) {
    await questionIntent(userState, true, state);
  }

  if (result.notAuthorized) { //TODO use return text filled instead?
    result.text = 'You are not authorized to access this data.\nIf this is an error, please contact your administrator.';
  } else if (result.rows.length === 0) {
    result.text = getNonResultMsg(userState.prompt);
  } else {
    result.pageNum = 1;
    result.lastPage = getLastPage(result);
    result.fields = result.fields.map(field => field.toTitleCase());
  }
};

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

const questionIntent = async (userState: User, isSecondIntent: boolean, state: KatsuState): Promise<void> => {
  resetResult(userState);

  let sql = userState.sql;
  if (sql === "") {
    userState.context = createQuestionPrompt(state, userState, isSecondIntent);
    sql = await askAI(state, userState.context);
  }

  userState.sql = cleanSQL(sql);
  if (process.env.KATSU_DEBUG === "true") {
    console.log("SQL: ", userState.sql);
  }
  await getResult(state, userState);
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
