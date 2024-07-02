import * as constants from "./constants";
import * as db from "../db/db_commands";
import * as dbSortResult from "../db/sort_result";
import * as filesClean from "../files/clean";
import * as filesIndex from "../files/files_index";
import * as finder from "../nl/entity_finder";
import * as nl2sql from "../nl/translate";
import openAI from "openai";
import * as openAIAPI from "../openai/openai_api";
import * as pageCalc from "./page_calc";
import * as pageNL from "../nl/page";
import * as reminders from "./reminders";
import * as sortFieldFinder from "../nl/sort_field_finder";
import * as word from "../word/create_word";
import { Result, ResultData, ResultObject } from "./result_object";

/**
 * This module contains the handlers for different prompts types.
 * @module handlers
 */


const openai = new openAI();

/**
 * Handles the question prompt.
 * @async
 * @param {string} prompt - The question prompt.
 * @returns {Promise} - A promise that resolves to the result of the database query.
 */
const questionHandler = async (prompt: string): Promise<any> => {
  let resultData: ResultData = {
    dispFields: [], requiresAnswer: false, messages: [],
    sql: "",
    result: undefined
  };
  resultData.result = { rows: [], fields: [] };
  resultData.sql = "";
  resultData.requiresAnswer = true;
  resultData.messages = [];
  // Get the entities from the prompt
  const entities = await finder.getEntities(prompt);
  // const entities = ["leads", "contacts"];
  // If it is only one entity, get the SQL
  if (entities.length === 1) {
    resultData = await getSQL(prompt, false, "");

    // Reflection
    if (resultData.result === null || resultData.result.rows.length === 0) {
      const error = db.getError();
      resultData = await getSQL(prompt, true, error);
    }
  } else {
    // If there are multiple entities, ask the user to specify the entity    
    resultData.result.fields = [{ name: "source" }];
    resultData.result.rows = [];
    let msg = "Please specify where do you want me to search from the following options:";
    for (let i = 0; i < entities.length; i++) {
      let record: any = {};
      record.source = entities[i];
      resultData.result.rows.push(record);
      msg += entities[i] + ", ";
    }

    msg = msg.slice(0, -2);
    msg += ".";

    resultData.messages.push(msg);
  }

  return resultData;
};

const getSQL = async (prompt: string, reflection: boolean, error: string): Promise<any> => {
  const resultSQL = await nl2sql.generateSQL(
    openai,
    openAIAPI,
    prompt,
    reflection,
    error
  );
  const sql = resultSQL.sql;
  console.log(sql);

  let resultData = { result: null, dispFields: [], sql: "", entity: "", requiresAnswer: false };
  if (sql === "") {
    return resultData;
  }
  await db.connect();
  const result = await db.execute(sql);
  await db.close();
  resultData = {
    result: result,
    dispFields: resultSQL.dispFields,
    sql: sql,
    entity: resultSQL.entity,
    requiresAnswer: false
  };
  return resultData;
};

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
const linkHandler = async (prompt: string): Promise<any> => {
  // Link prompt
  let result;
  await db.connect();
  if (prompt.includes(constants.ALL)) {
    result = await db.execute("SELECT name, URL FROM links order by name");
  } else {
    result = await db.execute("SELECT words FROM links");
    const sql = await nl2sql.getLinkSQL(prompt, result.rows);
    result = await db.execute(sql);
  }
  await db.close();

  return result;
};

/**
 * Handles the sort prompt.
 * @async
 * @param {string} prompt - The sort prompt.
 * @param {object} result - The result object.
 * @returns {Promise} - A promise that resolves to the sorted result object.
 */
const sortHandler = async (prompt: string, result: any): Promise<any> => {
  // Sort prompt
  let sortFields: string[] = [];
  sortFields = sortFieldFinder.getSortfield(prompt, result);
  if (sortFields.length > 0) {
    const sortDir = sortFieldFinder.getSortDirection(prompt);
    result.rows = dbSortResult.sortResult(result, sortFields, sortDir);
  }

  return result;
};

const filesHandler = async (prompt: string): Promise<any> => {
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
  let files: Array<Object> = filesIndex.exploreFolder(filesDir as string);

  files = filesIndex.searchFiles(files, wordsList);

  filesClean.cleanReports();

  files = filesIndex.copyFilesToReports(files);

  const headerTitle = "Found_Files";
  let result: Result = {
    rows: [], fields: [],
    requiresAnswer: false
  };
  const field = { name: headerTitle };
  result.fields.push(field);

  for (let i = 0; i < files.length; i++) {
    // File name
    let record: any = {};
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
const pageHandler = (prompt: any, result: ResultObject): number => {
  // Pages prompt
  const cmd = pageNL.getPageCommand(prompt);
  let page = 1;
  switch (cmd) {
    case pageNL.PAGE_LAST:
      page = pageCalc.getLastPage(result);
      break;
    case pageNL.PAGE_NEXT:
      page = pageCalc.getNextPage(result.pageNum, result);
      break;
    case pageNL.PAGE_PREV:
      page = pageCalc.getPrevPage(result.pageNum);
      break;
    case pageNL.PAGE_NUMBER:
      page = pageNL.getPageNumber(prompt);
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
  pageHandler,
  remindersHandler,
};
