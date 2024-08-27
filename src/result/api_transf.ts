import { APIResultObject } from './result_object';
import { KatsuState } from '../state/katsu_state';
import { formatOneLineResult } from '../nl/format_nl_result';
import { formatAPIResult } from '../formatter/format_api_result';

/**
 * Transforms a `ResultObject` into an `APIResultObject`.
 * @param resultObject - The input `ResultObject` to be transformed.
 * @returns The transformed `APIResultObject`.
 */
const transfResAPI = async function (state: KatsuState, userIndex: number): Promise<APIResultObject> {

  let result = state.users[userIndex].result;

  const formattedResult = formatAPIResult(result);

  let dataRows: string[][] = [];
  const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
  const currentPage = formattedResult.pageNum;

  // Data rows
  const startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize, formattedResult.rows.length);

  endIndex = Math.min(endIndex, formattedResult.rows.length + startIndex);
  for (let i = startIndex; i < endIndex; i++) {
    dataRows.push(formattedResult.rows[i]);
  }

  if (formattedResult.fileURL != "") {
    dataRows = [];
    formattedResult.text = "";
  }

  if (formattedResult.text != "") {
    dataRows = [];
    formattedResult.fileURL = "";
  }

  if (dataRows.length > 0) {
    formattedResult.text = "";
    formattedResult.fileURL = "";

  }

  const apiResultObject: APIResultObject = {
    lastPage: formattedResult.lastPage,
    pageNum: formattedResult.pageNum,
    fields: formattedResult.fields,
    rows: dataRows,
    text: formattedResult.text,
    docURL: formattedResult.fileURL
  };

  if (!formattedResult.noDataFound) {
    if (apiResultObject.rows.length == 1 && state.users[userIndex].promptType === "QUESTION") {
      state = await formatOneLineResult(state, userIndex);
      apiResultObject.text = state.users[userIndex].result.text;
      state.users[userIndex].result.rows = [];
      apiResultObject.rows = [];
      apiResultObject.fields = [];
    }
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
  console.log("Rows: " + apiResultObject.rows.length);
  for (let i = 0; i < apiResultObject.rows.length; i++) {
    apiResultObject.lastPage = apiResultObject.lastPage;
    console.log("Row " + i + ": " + apiResultObject.rows[i]);
  }
}

export { logAPIResultObject, transfResAPI };
