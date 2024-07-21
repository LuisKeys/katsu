import * as excel from "../excel/create_excel";
import * as handlers from "./handlers";
import * as pageCalc from "./page_calc";
import * as savePrompt from "./save_prompt";
import { KatsuState } from "../db/katsu_db/katsu_state";
import { ResultObject } from "../result/result_object";

/**
 * Handles the llmHandler call.
 *
 * @param {string} promptTr - The prompt transaction.
 * @param {string} memberId - The member ID.
 * @param {string} memberName - The member name.
 * @returns {Promise<[string, any]>} - A promise that resolves to an array containing the file URL and the result object.
 */
const llmHandlerCall = async (state: KatsuState, userIndex: number): Promise<ResultObject> => {
  const result: ResultObject = state.users[userIndex].result;
  result.rows = [];
  const fileURL = await handlers.llmHandler(state, userIndex);
  await savePrompt.savePrompt(
    result
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
const excelHandlerCall = async (result: ResultObject): Promise<string> => {
  let fileURL = "";
  if (result.rows.length > 0) {
    fileURL = excel.createExcel(result);
    await savePrompt.savePrompt(
      result
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
const formatResult = function (result: ResultObject): ResultObject {
  const pageSize: number = Number(process.env.PAGE_SIZE)
  let resultObject: any = {};
  let lastPage = 1;
  let messages: string[] = [];
  if (result && result.rows.length > 0) {
    // Data found
    if (result.rows.length > pageSize) {
      lastPage = pageCalc.getLastPage(result);
    }

    return resultObject;
  };

  return resultObject;
}


export {
  excelHandlerCall,
  formatResult,
  llmHandlerCall,
};
