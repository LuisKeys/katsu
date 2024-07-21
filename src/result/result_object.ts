import { ask } from "../openai/openai_api";
import { QueryResult, QueryResultRow } from "pg";
import { ClientOptions, OpenAI } from "openai";
import { KatsuState, User } from "../db/katsu_db/katsu_state";
import { getUserIndex } from "../users/get_user";

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

type ResultObject = {
  fields: string[];
  fileURL: string;
  lastPage: number;
  pageNum: number;
  prompt: string;
  promptType: string;
  rows: QueryResultRow[];
  sql: string;
  text: string;
  user: User | null;
};


const clientOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
};

const openai = new OpenAI(clientOptions);


/**
 * Creates a new result object.
 *
 * @param {*} result - The result value.
 * @param {Array} messages - An array of messages.
 * @param {string} promptType - The type of prompt.
 * @param {boolean} isDebug - Indicates if debug mode is enabled.
 * @returns {Object} - The result object containing the result and messages.
 */
const getNewResultObject = function () {
  const resultObject: ResultObject = {
    fields: [],
    pageNum: 0,
    promptType: "",
    rows: [],
    sql: "",
    text: "",
    user: null,
    fileURL: "",
    prompt: "",
    lastPage: 0
  };

  return resultObject;

}

const getResultObjectsBuffer = function (size: number) {
  let resultObjects: ResultObject[] = [];
  for (let i = 0; i < size; i++) {
    resultObjects.push(getNewResultObject());
  }
  return resultObjects;

}

const getResultObjectByUser = function (userId: number, results: ResultObject[]): ResultObject {
  for (let i = 0; i < results.length; i++) {
    if (results[i].user?.userId === userId) {
      return results[i];
    }
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].user !== null) {
      results[i].user!.userId = userId;
      return results[i];
    }
  }

  return results[0];
}

const getAnswer = async function (state: KatsuState, userIndex: number): Promise<string> {

  let answer = await ask(
    state,
    userIndex
  );

  return answer;
};

const convSqlResToResultObject = function (sqlRes: QueryResult | null, result: ResultObject): ResultObject {
  result.fields = [];

  if (sqlRes !== null) {
    for (let i = 0; i < sqlRes.fields.length; i++) {
      result.fields.push(sqlRes.fields[i].name);
    }

    result.rows = sqlRes.rows;
  }

  return result;
}
export { convSqlResToResultObject, getAnswer, getNewResultObject, getResultObjectsBuffer, getResultObjectByUser, ResultObject };
