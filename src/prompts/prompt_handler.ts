import { getPromptType } from "./utils/prompt_type";
import { KatsuState } from "../state/katsu_state";
import { getDataSource } from "./utils/data_source";
import { questionHandler } from "./handlers/question_handler";
import { excelExportHandler } from "./handlers/excel_handler";
import { sortHandler } from "./handlers/sort_handler";
import { pageHandler } from "./handlers/page_handler";
import { filesHandler } from "./handlers/files_handler";
import { helpHandler } from "./handlers/help_handler";
import { savePrompt } from "./utils/save_prompt";
import { checkPromptHistory } from "./utils/check_history";
import { EXCEL, FILE, HELP, PAGE, QUESTION, SORT } from "../state/constants";

const promptHandler = async (state: KatsuState, userId: number) => {
  // Get the prompt type and data source 
  // state.showWordsCount = true;
  const userState = state.users[userId];
  userState.promptType = "";
  userState.sql = "";

  await checkPromptHistory(state, userId);
  let promptType = userState.promptType
  const isCached = userState.isCached
  if (!isCached) {
    state = await getPromptType(state, userId);
    promptType = userState.promptType
    console.log("Prompt type:", promptType);
    if (promptType === QUESTION) {
      state = await getDataSource(state, userId);
      const dataSourceIndex = userState.dataSourceIndex;
      console.log("Data source:", state.dataSources[dataSourceIndex].datasourceName);
    }
  }

  switch (promptType) {
    case QUESTION: await questionHandler(userState, state); break;
    case EXCEL: await excelExportHandler(state, userId); break;
    case SORT: await sortHandler(state, userId); break;
    case PAGE: await pageHandler(state, userId); break;
    case FILE: await filesHandler(state, userId); break;
    case HELP: await helpHandler(userState, state.dataSources); break;
  }
  // TODO so this is not history but cache?
  // TODO userId used as index not right. This is assuming there will be no gaps in the user ids
  if (!isCached) await savePrompt(userState, state.dataSources);
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
