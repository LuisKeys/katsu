import { APIResultObject, ResultObject } from './result_object';

/**
 * Transforms a `ResultObject` into an `APIResultObject`.
 * @param resultObject - The input `ResultObject` to be transformed.
 * @returns The transformed `APIResultObject`.
 */
const transfResAPI = function (resultObject: ResultObject): APIResultObject {

  let dataRows: string[][] = [];
  const pageSize = process.env.PAGE_SIZE ? parseInt(process.env.PAGE_SIZE) : 10;
  const currentPage = resultObject.pageNum;

  // Data rows
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, resultObject.rows.length);

  for (let i = startIndex; i < endIndex; i++) {
    dataRows.push(resultObject.rows[i]);
  }
  const apiResultObject: APIResultObject = {
    lastPage: resultObject.lastPage,
    pageNum: resultObject.pageNum,
    rows: dataRows,
    text: resultObject.text,
    docURL: resultObject.fileURL
  };

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
