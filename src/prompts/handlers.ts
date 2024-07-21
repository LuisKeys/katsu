import * as constants from "./constants";
import { ClientOptions, OpenAI } from "openai";
import * as db from "../db/db_commands";
import * as dbSortResult from "../db/sort_result";
import * as filesClean from "../files/clean";
import { exploreFolder, FileObject, searchFiles, copyFilesToReports } from "../files/files_index";
import * as openAIAPI from "../openai/openai_api";
import * as pageCalc from "./page_calc";
import * as pageNL from "../nl/page";
import { QueryResult, QueryResultRow } from "pg";
import * as sortFieldFinder from "../nl/sort_field_finder";
import * as word from "../word/create_word";
import openAI from "openai";
import { convSqlResToResultObject, ResultObject } from "../result/result_object";
import { KatsuState } from "../db/katsu_db/katsu_state";
import { getUserIndex } from "../users/get_user";

/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */

const clientOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
};

const openai = new OpenAI(clientOptions);

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (state: KatsuState, userIndex: number): Promise<ResultObject> => {

  return state.users[userIndex].result;
};

/**
 * Handles the LLM prompt.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI API.
 * @returns {Promise<any>} - A promise that resolves to the result of the OpenAI API call.
 */
const llmHandler = async (state: KatsuState, userIndex: number): Promise<any> => {
  let finalPrompt = state.users[userIndex].prompt;
  finalPrompt +=
    "Format the output for a word document,  including '\n' char for new lines. Provide only the answer without any additional introduction or conclusion.";
  // LLM prompt
  let result = await openAIAPI.ask(state, userIndex);

  let url = "";

  if (result.length > 100) {
    url = await word.createWord(result);
  } else {
    url = result;
  }

  return url;
};


/**
 * Handles the sort prompt.
 * @async
 * @param {string} prompt - The sort prompt.
 * @param {object} result - The result object.
 * @returns {Promise} - A promise that resolves to the sorted result object.
 */
const sortHandler = async (result: ResultObject | null): Promise<ResultObject | null> => {
  // Sort prompt
  if (result != null) {
    const sortFields = sortFieldFinder.getSortfield(result);
    if (sortFields.length > 0) {
      const sortDir = sortFieldFinder.getSortDirection(result.prompt);
      result.rows = dbSortResult.sortResult(result, sortFields, sortDir);
    }
  }

  return result;
};

const filesHandler = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {

  return state;
};


/**
 * Handles the page prompt.
 *
 * @param {Object} prompt - The page prompt object.
 * @param {Object} result - The result object.
 * @returns {Promise<Object>} The updated result object.
 */
const pageHandler = (result: ResultObject | null): number => {
  // Pages prompt
  if (result === null) {
    return 0
  }
  const cmd = pageNL.getPageCommand(result.prompt);
  let page = 1;
  switch (cmd) {
    case pageNL.PAGE_LAST:
      page = pageCalc.getLastPage(result);
      break;
    case pageNL.PAGE_NEXT:
      page = pageCalc.getNextPage(result);
      break;
    case pageNL.PAGE_PREV:
      page = pageCalc.getPrevPage(result.pageNum);
      break;
    case pageNL.PAGE_NUMBER:
      page = pageNL.getPageNumber(result.prompt);
      if (page < 1) {
        page = 1;
      }
      if (page > pageCalc.getLastPage(result)) {
        page = pageCalc.getLastPage(result);
      }
      break;
    default:
      page = 1;
      break;
  }

  return page;
};

export {
  questionHandler,
  sortHandler,
  filesHandler,
  llmHandler,
  pageHandler
};
