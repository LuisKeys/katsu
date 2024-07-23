import { APIResultObject, ResultObject } from './result_object';

/**
 * Transforms a `ResultObject` into an `APIResultObject`.
 * @param resultObject - The input `ResultObject` to be transformed.
 * @returns The transformed `APIResultObject`.
 */
const transfResAPI = function (resultObject: ResultObject): APIResultObject {

  let rows: string[][] = [];
  // Header row
  rows.push(resultObject.fields);
  // Data rows
  if (resultObject.rows.length > 0) {
    rows = resultObject.rows.map((row) => {
      return Object.values(row).map((val) => {
        return val.toString();
      });
    });
  }

  const apiResultObject: APIResultObject = {
    lastPage: resultObject.lastPage,
    pageNum: resultObject.pageNum,
    rows: rows,
    text: resultObject.text,
    docURL: resultObject.fileURL
  };

  return apiResultObject;
}

export { transfResAPI };
