

const formatTable = require("../formatter/format_result");

/**
 * Creates a result object with the given result and messages.
 *
 * @param {*} result - The result value.
 * @param {Array} messages - An array of messages.
 * @returns {Object} - The result object containing the result and messages.
 */
const getResultObject = function (result, messages, isDebug) {
  const resultObject = {
    rows:result.rows,
    fields:result.fields,
    messages:messages
  };

  if (isDebug) {
    for(i = 0; i < messages.length; i++) {
      console.log(messages[i]);
    }

    formatTable.getTableFromResult(result);
  }  

  return resultObject;
}

module.exports = { getResultObject };