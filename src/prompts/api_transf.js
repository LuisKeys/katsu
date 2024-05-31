const { formatAPIResult } = require('../formatter/format_api_result.js');
const {getAPIOutput, transfResultObj} = require('./api_transf_utils.js');

/**
 * Transforms the result object into a desired output format suitable for the API.
 * @param {Object} resultObject - The result object to be transformed.
 * @returns {Object} - The transformed output object.
 */
const transfResAPI = function (resultObject) {
  

  let output = getAPIOutput(resultObject);

  if (resultObject.rows.length == 0) {
    output.rows = [];
  } else {
    output = transfResultObj(resultObject, output);
    output = formatAPIResult(output);
    return output;
  }
};

module.exports = { transfResAPI };