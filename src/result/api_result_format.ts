import { APIResult as APIResult } from './result_object';
import { KatsuState, User } from '../state/katsu_state';
import { formatOneLineResult } from '../nl/format_nl_result';
import { formatAPIResult } from '../formatter/format_api_result';

const userResultToAPIResult = async function (userState: User, state: KatsuState): Promise<APIResult> {
  const userResult = userState.result;

  if (userState.promptType === "HELP") {
    userResult.fields = [];
    userResult.rows = [];
  }

  const apiResult: APIResult = {
    promptType: userState.promptType,
    text: userResult.text,
    fields: userResult.fields,
    rows: userResult.rows,
    lastPage: userResult.lastPage,
    pageNum: userResult.pageNum,
    docURL: userResult.fileURL
  };

  if (userResult.rows.length > 0) {
    formatAPIResult(userResult);
    const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
    const startIndex = (userResult.pageNum - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, userResult.rows.length);
    apiResult.rows = userResult.rows.slice(startIndex, endIndex);
  }

  if (apiResult.docURL != "") {
    apiResult.rows = [];
    apiResult.text = "";
  }

  if (apiResult.rows.length > 0) {
    apiResult.text = "";
    apiResult.docURL = "";

    if (apiResult.rows.length == 1 && userState.promptType === "QUESTION") {
      await formatOneLineResult(userState, state);
      apiResult.text = userResult.text;
      userResult.rows = [];
      apiResult.rows = [];
      apiResult.fields = [];
    }
  }

  if (apiResult.text != "") {
    apiResult.rows = [];
    apiResult.docURL = "";
  }

  return apiResult;
}

const logAPIResultObject = function (apiResultObject: APIResult) {
  try {
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
  catch (error: any) {
    console.log("Error logging API result object: ", error["message"]);
  }
}

export {
  logAPIResultObject, userResultToAPIResult

};
