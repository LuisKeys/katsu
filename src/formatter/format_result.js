const tableLib = require('cli-table3');

/**
 * Generates a text table from the given result set.
 *
 * @param {Object} result - The result set containing columns and rows.
 */
const getTableFromResult = function(result) {
  let limit = false;
  if (result.fields.length > 4) {
    limit = true;
  }
  header = result.fields.map(field => field.name)
  
  if (limit) {
    header = header.slice(0, 3);
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

