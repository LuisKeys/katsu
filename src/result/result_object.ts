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

export { APIResultObject, ResultObject };
