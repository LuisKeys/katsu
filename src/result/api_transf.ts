import { resolveObjectURL } from 'buffer';
import { formatAPIResult } from '../formatter/format_api_result';
import { ResultObject } from './result_object';

/**
 * Transforms the result object into a desired output format suitable for the API.
 * @param {Object} resultObject - The result object to be transformed.
 * @returns {Object} - The transformed output object.
 */
const transfResAPI = function (resultObject: ResultObject): ResultObject {
  // let output = getAPIOutput(resultObject);

  return resultObject;
}

export { transfResAPI };
