

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
    messages:messages,
    table:"",
  };

  if (isDebug) {
    for(i = 0; i < messages.length; i++) {
      console.log(messages[i]);
    }
  }  

  resultObject.table = formatTable.getTableFromResult(result, isDebug);

  return resultObject;
}

const render = function (resultObject) {  
  let output = ""
  
  for(i = 0; i < resultObject.messages.length; i++) {
    output += resultObject.messages[i] + '\n';
  }

  output += resultObject.table;
  return output;
}

module.exports = { getResultObject, render };