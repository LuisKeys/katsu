import { QueryResultRow } from "pg";

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

type APIResultObject = {
  lastPage: number;
  pageNum: number;
  rows: String[][];
  text: string;
  docURL: string;
};

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
    fields: [],
    pageNum: 0,
    promptType: "",
    rows: [],
    sql: "",
    text: "",
    fileURL: "",
    prompt: "",
    lastPage: 0
  };

  return resultObject;

}

export { APIResultObject, getNewResultObject, ResultObject };
