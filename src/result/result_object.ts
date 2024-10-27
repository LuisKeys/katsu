import { QueryResultRow } from "pg";
import { KatsuState, User } from "../state/katsu_state";

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

type APIResultObject = {
  fields: string[];
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
  rows: string[][];
  sql: string;
  text: string;
  noDataFound: boolean;
};

const convResultObjToCSV = function (state: KatsuState, userIndex: number): string {
  const result = state.users[userIndex].result;
  const fields = result.fields;

  let csv = fields.join(", ");
  csv += "\n";
  for (const row of result.rows) {
    let line = "";
    for (let i = 0; i < row.length; i++) {
      csv += row[i];
      if (i !== row.length - 1) {
        csv += ", ";
      }
    }
    csv += "\n";
  }

  return csv;
};


/**
 * Logs the result of a user in the Katsu state.
 * @param state - The Katsu state object.
 * @param userIndex - The index of the user whose result should be logged.
 */
const logResult = function (state: KatsuState, userIndex: number): void {
  const result = state.users[userIndex].result;
  const fields = result.fields;

  console.log("Result:");
  console.log(fields.join(", "));
  for (const row of result.rows) {
    let line = "";
    for (let i = 0; i < row.length; i++) {
      line += row[i];
      if (i !== row.length - 1) {
        line += ", ";
      }
    }
    console.log(line);
  }
};

const resetResult = (userState: User): void => {
  Object.assign(userState.result), {
    pageNum: 0,
    lastPage: 0,
    rows: [],
    fields: [],
    text: "",
    fileURL: "",
    noDataFound: false
  };
  userState.sqlError = "";
}

export {
  APIResultObject,
  ResultObject,
  convResultObjToCSV,
  logResult,
  resetResult,
};
