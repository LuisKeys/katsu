import * as constants from "./constants";
import * as excel from "../excel/create_excel";
import * as handlers from "./handlers";
import * as pageCalc from "./page_calc";
import { ResultObject } from "./result_object";
import * as savePrompt from "./save_prompt";

/**
 * Handles the llmHandler call.
 *
 * @param {string} promptTr - The prompt transaction.
 * @param {string} memberId - The member ID.
 * @param {string} memberName - The member name.
 * @returns {Promise<[string, any]>} - A promise that resolves to an array containing the file URL and the result object.
 */
const llmHandlerCall = async (promptTr: string, memberId: number, result: ResultObject, promptType: string): Promise<ResultObject> => {
  result.dispFields = [];
  result.rows = [];
  const fileURL = await handlers.llmHandler(promptTr);
  await savePrompt.savePrompt(
    memberId,
    promptTr,
    "",
    0,
    promptType
  );

  result.fileURL = fileURL;
  return result;
};

/**
 * Handles the Excel handler call.
 *
 * @param {string} promptTr - The prompt transaction.
 * @param {number} memberId - The member ID.
 * @param {string} memberName - The member name.
 * @returns {string} - The file URL.
 */
const excelHandlerCall = async (promptTr: string, memberId: number, result: ResultObject): Promise<string> => {
  let fileURL = "";
  if (result.rows.length > 0) {
    fileURL = excel.createExcel(result[memberId]);
    await savePrompt.savePrompt(
      memberId,
      promptTr,
      "",
      0,
      result.promptType
    );
  }
  return fileURL;
};

/**
 * Formats the result based on the provided parameters.
 *
 * @param {Object} result - The result object.
 * @param {string} memberId - The member ID.
 * @param {string} promptType - The prompt type.
 * @param {Object} resultData - The result data object.
 * @param {number} pageNum - The page number.
 * @param {boolean} isDebug - Indicates whether debug mode is enabled.
 * @returns {Object} - The formatted result object.
 */
const formatResult = async (
  result: Object,
  memberId: string,
  promptType: string,
  resultData: Object,
  pageNum: number,
  isDebug: boolean
): Promise<Object> => {
  let resultObject: any = {};
  resultObject.docUrl = "";
  let lastPage = 1;
  let messages: string[] = [];
  let docUrl = "";
  if (result[memberId] && result[memberId].rows.length > 0) {
    // Data found
    if (result[memberId].rows.length > constants.PAGE_SIZE) {
      lastPage = pageCalc.getLastPage(result[memberId]);
      messages.push("Page " + pageNum[memberId] + " of " + lastPage);
    }

    // Export URL
    if (promptType === constants.EXCEL) {
      messages.push(fileURL);
      docUrl = fileURL;
    }

    resultObject = await resultObj.getResultObject(
      result[memberId],
      messages,
      promptType,
      resultData[memberId].dispFields,
      pageNum[memberId],
      isDebug
    );
    resultObject.lastPage = lastPage;
    resultObject.docUrl = docUrl;
  } else {
    await noDataFound(
      result,
      memberId,
      messages,
      promptType,
      resultData[memberId].dispFields,
      pageNum[memberId],
      isDebug,
      lastPage,
      docUrl
    );
  }

  return resultObject;
};

/**
 * Handles the case when no data is found for a request.
 *
 * @param {Object} result - The result object.
 * @param {string} memberId - The member ID.
 * @param {Array} messages - The array of messages.
 * @param {string} promptType - The prompt type.
 * @param {string} header - The header.
 * @param {number} pageNum - The page number.
 * @param {boolean} isDebug - Indicates if debug mode is enabled.
 * @param {boolean} lastPage - Indicates if it's the last page.
 * @param {string} docUrl - The documentation URL.
 * @returns {Object} - The result object.
 */
const noDataFound = async function (
  result: Object,
  memberId: string,
  messages: string[],
  promptType: string,
  header: string,
  pageNum: number,
  isDebug: boolean,
  lastPage: boolean,
  docUrl: string
): Promise<Object> {
  messages.push(
    "No data found for your request.\nPlease provide more context or try a different prompt.\nYou can also type 'Help' to get a list of sample prompts."
  );
  let resultObject: any = {};

  result[memberId] = {
    rows: [{ "": "" }],
    fields: [{ name: "No data found for your request." }],
  };

  resultObject = await resultObj.getResultObject(
    result[memberId],
    messages,
    promptType,
    header,
    pageNum,
    isDebug
  );
  resultObject.lastPage = lastPage;
  resultObject.docUrl = docUrl;

  return resultObject;
};

export {
  excelHandlerCall,
  formatResult,
  llmHandlerCall,
};
