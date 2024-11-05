import { KatsuState, User } from "../state/katsu_state";

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

type APIResult = {
  promptType: string;
  fields: string[];
  lastPage: number;
  pageNum: number;
  rows: String[][];
  text: string;
  docURL: string;
};

type UserResult = {
  fields: string[];
  fileURL: string;
  lastPage: number;
  pageNum: number;
  prompt: string;
  promptType: string;
  rows: string[][];
  sql: string;
  text: string;
  notAuthorized: boolean;
};

const convResultObjToCSV = function (userResult: UserResult): string {
  const fields = userResult.fields;

  let csv = fields.join(", ");
  csv += "\n";
  for (const row of userResult.rows) {
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

const logUserResult = function (userResult: UserResult): void {
  const fields = userResult.fields;

  console.log("Result:");
  console.log(fields.join(", "));
  for (const row of userResult.rows) {
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
  APIResult,
  UserResult,
  convResultObjToCSV,
  logUserResult as logResult,
  resetResult,
};
