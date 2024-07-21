/**
 * Transforms the result object by extracting fields and generating rows.
 * @param {Object} resultObject - The result object to be transformed.
 * @param {Object} output - The output object to store the transformed result.
 * @returns {Object} The transformed output object.
 */
const transfResultObj = function (resultObject: any, output: any): any {
  let dispFields = resultObject.dispFields;
  let rows: any[] = [];
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

  output.prompt = resultObject.prompt;

  delete output.dispFields;
  return output;
};

const getFields = function (fields: any): any[] {
  let newFields: any[] = [];
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    newFields.push(field.name);
  }

  return newFields;
};

const getRowsAllFields = function (resultObject: any): any[] {
  let rows: any[] = [];
  // All the fields
  // Add header
  let header: any[] = [];
  const fields = resultObject.fields;
  for (let j = 0; j < fields.length; j++) {
    const field = fields[j];
    header.push(field.name);
  }

  rows.push(header);

  // Add rows
  for (let i = 0; i < resultObject.rows.length; i++) {
    const row = resultObject.rows[i];
    let newRow: any[] = [];

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      newRow.push(row[field.name]);
    }

    rows.push(newRow);
  }

  return rows;
};

const getRowsResDspFields = function (resultObject: any, dispFields: any): any[] {
  let rows: any[] = [];
  // Display fields
  let header: any[] = [];
  for (let i = 0; i < dispFields.length; i++) {
    header.push(dispFields[i]);
  }

  rows.push(header);

  // Add rows
  for (let i = 0; i < resultObject.rows.length; i++) {
    let row = resultObject.rows[i];
    let newRow: any[] = [];

    const fields = resultObject.fields;

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      if (dispFields.includes(field.name)) {
        newRow.push(row[field.name]);
      }
    }

    rows.push(newRow);
  }

  return rows;
};

const getAPIOutput = function (resultObject: any): any {
  let output: any = {};
  output.pageNum = resultObject.pageNum;
  output.lastPage = resultObject.lastPage;

  delete resultObject.table;
  delete resultObject.slackFields;

  return output;
};

export {
  getAPIOutput,
  transfResultObj
};
