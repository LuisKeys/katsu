

/**
 * @fileoverview This module exports two functions: getResultObject and render.
 * getResultObject creates a result object with the given result and messages.
 * render takes a result object and returns a formatted output string.
 * @module result_object
 */

const constants = require("./constants");
const formatTable = require("../formatter/format_result");

/**
 * Creates a result object with the given result and messages.
 *
 * @param {*} result - The result value.
 * @param {Array} messages - An array of messages.
 * @param {string} promptType - The type of prompt.
 * @param {boolean} isDebug - Indicates if debug mode is enabled.
 * @returns {Object} - The result object containing the result and messages.
 */
const getResultObject = function (result, messages, promptType, isDebug) {
  const resultObject = {
    rows:result.rows,
    fields:result.fields,
    messages:messages,
    promptType:promptType,
    table:"",
  };

  if (isDebug) {
    for(i = 0; i < messages.length; i++) {
      console.log(messages[i]);
    }
  }  

  resultObject.table = formatTable.getMarkDownTable(result, isDebug);

  return resultObject;
}

/**
 * Takes a result object and returns a formatted output string.
 *
 * @param {Object} resultObject - The result object.
 * @returns {string} - The formatted output string.
 */
const render = function (resultObject) {  
  let output = ""
  
  for(i = 0; i < resultObject.messages.length; i++) {
    output += resultObject.messages[i] + '\n\n';
  }

  if(resultObject.promptType != constants.EXPORT) {
    output += resultObject.table;
  }
  
  return output;
}

module.exports = { getResultObject, render };