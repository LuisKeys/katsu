import { KatsuState } from '../state/katsu_state';
import { APIResultObject, ResultObject } from './result_object';
import { formatOneLineResult } from '../nl/format_nl_result';

/**
 * Transforms a `ResultObject` into an `APIResultObject`.
 * @param resultObject - The input `ResultObject` to be transformed.
 * @returns The transformed `APIResultObject`.
 */
const transfResAPI = async function (state: KatsuState, userIndex: number): Promise<APIResultObject> {

  let result = state.users[userIndex].result;
  let dataRows: string[][] = [];
  const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
  const currentPage = result.pageNum;

  // Data rows
  const startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize, result.rows.length);

  dataRows.push(result.fields);
  endIndex = Math.min(endIndex, result.rows.length + startIndex);
  for (let i = startIndex; i < endIndex; i++) {
    dataRows.push(result.rows[i]);
  }

  if (result.fileURL != "") {
    dataRows = [];
    result.text = "";
  }

  if (result.text != "") {
    dataRows = [];
    result.fileURL = "";
  }

  if (dataRows.length > 0) {
    result.text = "";
    result.fileURL = "";
  }

  const apiResultObject: APIResultObject = {
    lastPage: result.lastPage,
    pageNum: result.pageNum,
    fields: result.fields,
    rows: dataRows,
    text: result.text,
    docURL: result.fileURL
  };

  if (apiResultObject.rows.length === 2 && state.users[userIndex].promptType === "QUESTION") {
    state = await formatOneLineResult(state, userIndex);
    apiResultObject.text = state.users[userIndex].result.text;
    state.users[userIndex].result.rows = [];
    apiResultObject.rows = [];
  }

  return apiResultObject;
}

const logAPIResultObject = function (apiResultObject: APIResultObject) {
  console.log("API Result Object:");
  console.log("Last Page: " + apiResultObject.lastPage);
  console.log("Page Num: " + apiResultObject.pageNum);
  console.log("Text: " + apiResultObject.text);
  console.log("Doc URL: " + apiResultObject.docURL);
  console.log("Fields: " + apiResultObject.fields);
  for (let i = 0; i < apiResultObject.rows.length; i++) {
    console.log("Row " + i + ": " + apiResultObject.rows[i]);
  }
}

export { logAPIResultObject, transfResAPI };
