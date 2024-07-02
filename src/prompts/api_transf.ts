import { formatAPIResult } from '../formatter/format_api_result';
import { getAPIOutput, transfResultObj } from './api_transf_utils';
import { ResultObject } from './result_object';

/**
 * Transforms the result object into a desired output format suitable for the API.
 * @param {Object} resultObject - The result object to be transformed.
 * @returns {Object} - The transformed output object.
 */
const transfResAPI = function (resultObject: ResultObject): ResultObject {
  let output = getAPIOutput(resultObject);

  if (resultObject.rows.length == 0) {
    output.rows = [];
  } else {
    output = transfResultObj(resultObject, output);
    output = formatAPIResult(output);
    return output;
  }

  return output;
};

export { transfResAPI };
