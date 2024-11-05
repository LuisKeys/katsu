import { getPromptType } from "./utils/prompt_type";
import { KatsuState, User } from "../state/katsu_state";
import { getDataSource } from "./utils/datasource";
import { questionHandler } from "./handlers/question_handler";
import { excelExportHandler } from "./handlers/excel_handler";
import { sortHandler } from "./handlers/sort_handler";
import { pageHandler } from "./handlers/page_handler";
import { filesHandler } from "./handlers/files_handler";
import { helpHandler } from "./handlers/help_handler";
import { savePrompt } from "./utils/save_prompt";
import { checkPromptHistory } from "./utils/check_history";
import { promptTypes } from "../state/constants";

const promptHandler = async (userState: User, state: KatsuState) => {
  // Get the prompt type and data source
  // state.showWordsCount = true;
  userState.promptType = "";
  userState.sql = "";

  await checkPromptHistory(userState, state.datasources);
  let promptType = userState.promptType
  const isCached = userState.isCached
  if (!isCached) {
    await getPromptType(userState, state);
    promptType = userState.promptType
    console.log("Prompt type:", promptType);
    if (promptType === promptTypes.QUESTION) {
      await getDataSource(userState, state.datasources, state);
      const dataSourceIndex = userState.dataSourceIndex;
      console.log("Data source:", state.datasources[dataSourceIndex].datasourceName);
    }
  }

  switch (promptType) {
    case promptTypes.QUESTION: await questionHandler(userState, state); break;
    case promptTypes.EXCEL: await excelExportHandler(userState.result); break;
    case promptTypes.SORT: await sortHandler(userState, state); break;
    case promptTypes.PAGE: await pageHandler(userState, state); break;
    case promptTypes.FILE: await filesHandler(userState, state); break;
    case promptTypes.HELP: await helpHandler(userState, state.datasources); break;
  }
  // TODO so this is not history but cache?
  // TODO userId used as index not right. This is assuming there will be no gaps in the user ids
  if (!isCached) await savePrompt(userState, state.datasources);
  userState.isCached = false;
};

// TODO remove
// const promptHandlerOld = async (state: KatsuState, userId: number): Promise<KatsuState> => {
//   // Get the prompt type and data source 
//   // state.showWordsCount = true;
//   state.users[userId].promptType = "";
//   state.users[userId].sql = "";

//   state = await checkPrompt(state, userId);
//   let promptType = state.users[userId].promptType
//   const isCached = state.users[userId].isCached
//   if (!isCached) {
//     state = await getPromptType(state, userId);
//     promptType = state.users[userId].promptType
//     console.log("Prompt type:", promptType);
//     if (promptType === QUESTION) {
//       state = await getDataSource(state, userId);
//       const dataSourceIndex = state.users[userId].dataSourceIndex
//       console.log("Data source:", state.dataSources[dataSourceIndex].name);
//     }
//   }

//   state = await processPrompt(state, userId);

//   if (!isCached) { // TODO so this is not history but cache
//     await savePrompt(state, userId);
//   }

//   state.users[userId].isCached = false;

//   return state;
// };

export { promptHandler };
