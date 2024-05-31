/**
 * Transforms the result object by extracting fields and generating rows.
 * @param {Object} resultObject - The result object to be transformed.
 * @param {Object} output - The output object to store the transformed result.
 * @returns {Object} The transformed output object.
 */
const transfResultObj = function(resultObject, output) {  
  let dispFields = resultObject.dispFields;  
  let rows = [];
  // Add header
  if (dispFields.length > 0) {
    rows = getRowsResDspFields(resultObject, dispFields);
  } else {
    rows = getRowsAllFields(resultObject);
  }

  output.fields = getFields(resultObject.fields);
  output.rows = rows;
  output.promptType = resultObject.promptType;  
  output.docUrl = resultObject.docUrl;

  delete output.dispFields;  
  return output;
}

const getFields = function(fields) {
  let newFields = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    newFields.push(field.name);
  }

  return newFields;
}

const getRowsAllFields = function(resultObject) {
  let rows = [];
  // All the fields
  // Add header
  let header = [];
  const fields = resultObject.fields;  
  for (let j = 0; j < fields.length; j++) {
    const field = fields[j];        
    header.push(field.name);
  }

  rows.push(header);

  // Add rows
  for (i = 0; i < resultObject.rows.length; i++) {
    const row = resultObject.rows[i];
    let newRow = [];

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      newRow.push(row[field.name]);
    }

    rows.push(newRow);
  }

  return rows;
}

const getRowsResDspFields = function(resultObject, dispFields) {
  let rows = [];
  // Display fields
  let header = [];
  for (i = 0; i < dispFields.length; i++) {        
    header.push(dispFields[i]);
  }

  rows.push(header);

  // Add rows
  for (i = 0; i < resultObject.rows.length; i++) {
    let row = resultObject.rows[i];
    let newRow = [];

    fields = resultObject.fields;

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      if (dispFields.includes(field.name)) {            
        newRow.push(row[field.name]);
      }
    }

    rows.push(newRow);
  }

  return rows;
}

const getAPIOutput = function(resultObject) {
  let output = {};
  output.pageNum = resultObject.pageNum;  
  output.lastPage = resultObject.lastPage;

  delete result.table;
  delete result.slackFields;

  return output;
}

module.exports = {
  getAPIOutput,
  transfResultObj
};

