const sortResult = function(result, field) {
  for(let i = 0; i < result.rows.length; i++) {
    for(let j = i + 1; j < result.rows.length; j++) {
      a = result.rows[i][field.name]
      b = result.rows[j][field.name]
      if(a > b) {
        let temp = result.rows[i];
        result.rows[i] = result.rows[j];
        result.rows[j] = temp;
      }
    }
  }

  return result.rows;
}

module.exports = { sortResult };