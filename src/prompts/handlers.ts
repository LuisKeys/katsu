import * as constants from "./constants";
import { ClientOptions, OpenAI } from "openai";
import * as db from "../db/db_commands";
import * as dbSortResult from "../db/sort_result";
import * as filesClean from "../files/clean";
import { exploreFolder, FileObject, searchFiles, copyFilesToReports } from "../files/files_index";
import * as finder from "../nl/entity_finder";
import * as nl2sql from "../nl/translate";
import * as openAIAPI from "../openai/openai_api";
import * as pageCalc from "./page_calc";
import * as pageNL from "../nl/page";
import { QueryResult, QueryResultRow } from "pg";
import * as sortFieldFinder from "../nl/sort_field_finder";
import * as word from "../word/create_word";
import openAI from "openai";
import { convSqlResToResultObject, ResultObject } from "../result/result_object";

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
const questionHandler = async (result: ResultObject): Promise<ResultObject> => {
  result.sql = "";
  result.requiresAnswer = true;
  // Get the entities from the prompt
  const entities = await finder.getEntities(result.prompt);
  // const entities = ["leads", "contacts"];
  // If it is only one entity, get the SQL
  if (entities.length === 1) {
    result = await getSQL(result);
  }

  return result;
};

const getSQL = async (result: ResultObject): Promise<ResultObject> => {
  result = await nl2sql.generateSQL(
    openai,
    result
  );
  console.log(result.sql);

  return result;
}

/**
 * Handles the LLM prompt.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI API.
 * @returns {Promise<any>} - A promise that resolves to the result of the OpenAI API call.
 */
const llmHandler = async (prompt: string): Promise<any> => {
  let finalPrompt = prompt;
  finalPrompt +=
    "Format the output for a word document,  including '\n' char for new lines. Provide only the answer without any additional introduction or conclusion.";
  // LLM prompt
  let result = await openAIAPI.ask(openai, finalPrompt);

  let url = "";

  if (result.length > 100) {
    url = await word.createWord(result);
  } else {
    url = result;
  }

  return url;
};

/**
 * Handles the link prompt.
 * @async
 * @param {string} prompt - The link prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const linkHandler = async (result: ResultObject | null): Promise<ResultObject | null> => {
  // Link prompt
  let sqlRes: QueryResult | null;
  await db.connect();
  if (result !== null && result.prompt.includes(constants.ALL)) {
    sqlRes = await db.execute("SELECT name, URL FROM links order by name");
  } else {
    sqlRes = await db.execute("SELECT words FROM links");
    if (result !== null && sqlRes !== null) {
      const sql = nl2sql.getLinkSQL(result.prompt, sqlRes.rows);
      sqlRes = await db.execute(sql);
    }
  }
  await db.close();

  if (sqlRes !== null && result !== null) {
    result = convSqlResToResultObject(sqlRes, result);
  }

  return result;
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

const filesHandler = async (result: ResultObject): Promise<any> => {
  const prompt = result.prompt;
  let fullPrompt = "get the subject words for the prompt: '";
  fullPrompt += prompt;
  fullPrompt +=
    "'.Only answer with a list of single words separated with comma.";
  fullPrompt += "Ignore the words file, files, doc, documents or similar";

  const words = await openAIAPI.ask(openai, fullPrompt);

  const wordsList = words.split(",").map((word) => word.trim());

  const filesDir = process.env.FILES_FOLDER;
  // clean up not indexable files and folders
  // filesClean.cleanFiles(filesDir);
  // filesClean.cleanEmptyDirs(filesDir);
  // get file list
  let files: FileObject[] = exploreFolder(filesDir as string);

  let searchedFiles: FileObject[] = searchFiles(files, wordsList);

  filesClean.cleanReports();

  copyFilesToReports(searchedFiles);

  const headerTitle = "Found_Files";
  result.fields = [];
  result.fields.push(headerTitle);

  for (let i = 0; i < files.length; i++) {
    // File name
    let record: QueryResultRow = {};
    record[headerTitle] = files[i]["fileName"];
    result.rows.push(record);
    // URL
    record = {};
    record[headerTitle] = files[i]["urlPath"];
    result.rows.push(record);
    // separator
    record = {};
    record[headerTitle] = "----------------------------------------";
    result.rows.push(record);
  }

  return result;
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
  linkHandler,
  sortHandler,
  filesHandler,
  llmHandler,
  pageHandler
};
