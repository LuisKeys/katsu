import { ask } from "../openai/openai_api";
import { Entity } from "../nl/entity_finder";
import openAI from "openai";
import { QueryResult } from "pg";
import { ClientOptions, OpenAI } from "openai";

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

const clientOptions: ClientOptions = {
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
};

const openai = new OpenAI(clientOptions);

type ResultObject = {
  dispFields: string[];
  entity: Entity
  fields: string[];
  fileURL: string;
  lastPage: number;
  pageNum: number;
  prompt: string;
  promptType: string;
  requiresAnswer: boolean;
  rows: any[];
  sql: string;
  table: string;
  text: string;
  userId: number;
};

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
    dispFields: [],
    entity: { name: "", view: "", dispFields: [] },
    fields: [],
    pageNum: 0,
    promptType: "",
    requiresAnswer: false,
    rows: [],
    sql: "",
    table: "",
    text: "",
    userId: 0,
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
    if (results[i].userId === userId) {
      return results[i];
    }
  }

  for (let i = 0; i < results.length; i++) {
    if (results[i].userId === 0) {
      results[i].userId = userId;
      return results[i];
    }
  }

  return results[0];
}

const setResultObjectByUser = function (userId: number, result: ResultObject, results: ResultObject[]): ResultObject[] {
  for (let i = 0; i < results.length; i++) {
    if (results[i].userId === userId) {
      results[i] = result;
    }
  }
  return results;
}

const getAnswer = async function (table: string) {
  let prompt = "convert the following tabular result into a friendly text in one short paragraph:";
  prompt += table;

  let answer = await ask(
    openai,
    prompt
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
export { convSqlResToResultObject, getNewResultObject, getResultObjectsBuffer, getResultObjectByUser, ResultObject, setResultObjectByUser };
