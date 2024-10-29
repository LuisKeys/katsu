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
  const userState = state.users[userIndex];
  const userResult = userState.result;
  if (userState.promptType !== "HELP") userResult.text = ''; //TODO Improve whole logic to remove this line
  const formattedResult = formatAPIResult(userResult);

  const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
  const startIndex = (formattedResult.pageNum - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, formattedResult.rows.length);
  let dataRows = formattedResult.rows.slice(startIndex, endIndex);

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
    if (apiResultObject.rows.length == 1 && userState.promptType === "QUESTION") {
      await formatOneLineResult(state, userIndex);
      apiResultObject.text = userResult.text;
      userResult.rows = [];
      // state.users[userIndex].result.rows = [];
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
