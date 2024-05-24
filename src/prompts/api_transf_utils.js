const getAPIOutput = function(resultObject) {
  let output = {};
  output.pageNum = resultObject.pageNum;  
  output.lastPage = resultObject.lastPage;

  delete result.table;
  delete result.slackFields;

  return output;
}

module.exports = {
  getAPIOutput
};

const transfResultObj = function(resultObject, output) {
  const fields = resultObject.fields;
  let rows = [];
  let dispFields = resultObject.dispFields;

  // Add header
  if (dispFields.length > 0) {      
    let header = [];
    for (i = 0; i < dispFields.length; i++) {        
      header.push(dispFields[i]);
    }

    rows.push(header);

    // Add rows
    for (i = 0; i < resultObject.rows.length; i++) {
      let row = resultObject.rows[i];
      let newRow = [];

      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        if (dispFields.includes(field.name)) {            
          newRow.push(row[field.name]);
        }
      }

      rows.push(newRow);
    }
  } else {
    // Get header
    let header = [];
    const row = resultObject.rows[0];
    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];        
      header.push(field.name);
    }

    rows.push(header);

    for (i = 0; i < resultObject.rows.length; i++) {
      const row = resultObject.rows[i];
      let newRow = [];

      for (let j = 0; j < fields.length; j++) {
        const field = fields[j];
        newRow.push(row[field.name]);
      }

      rows.push(newRow);
    }

  }

  output.rows = rows;

  delete output.dispFields;
  delete output.fields;    
  return output;
}

module.exports = {
  getAPIOutput,
  transfResultObj
};

