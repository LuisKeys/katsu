const tableLib = require('cli-table3');

/**
 * Generates a text table from the given result set.
 *
 * @param {Object} result - The result set containing columns and rows.
 */
const getTableFromResult = function(result) {
  let nameFound = false;
  let header = result.fields.map(field => field.name)

  // check if there are more than 4 columns
  if (result.fields.length > 4) {
    // search for name
    for (let i = 0; i < result.fields.length; i++) {
      if (result.fields[i].name === 'name') {
        // if name found, limit to name column
        header = ['name'];
        nameFound = true;
        break;
      }
    }
    
    // if name not found, limit to 4 columns
    if (!nameFound) {
      slicedFields = result.fields.slice(0, 4);            
      header = slicedFields.map(field => field.name);
    }
  }  
  

  let table = new tableLib({
    head: header,
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });

  for (let i = 0; i < result.rows.length; i++) {
    let row = result.rows[i];
    let values = [];
    for (let j = 0; j < header.length; j++) {
      const field = header[j];
      values.push(row[field]);
    }
    table.push(values);
  }

  console.log(table.toString());
}

module.exports = { getTableFromResult };

