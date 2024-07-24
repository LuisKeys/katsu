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
  const endIndex = Math.min(startIndex + pageSize, result.rows.length);

  for (let i = startIndex; i < endIndex; i++) {
    dataRows.push(result.rows[i]);
  }
  const apiResultObject: APIResultObject = {
    lastPage: result.lastPage,
    pageNum: result.pageNum,
    rows: dataRows,
    text: result.text,
    docURL: result.fileURL
  };

  if (apiResultObject.rows.length === 1) {
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
  for (let i = 0; i < apiResultObject.rows.length; i++) {
    console.log("Row " + i + ": " + apiResultObject.rows[i]);
  }
}

export { logAPIResultObject, transfResAPI };
