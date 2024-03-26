const getSortfield = (prompt, result) => {
  let sortField = null;
  for (let field of result.fields) {
    if (prompt.includes(field.name)) {
      sortField = field;
      break;
    }
  }

  return sortField;
}

module.exports = { getSortfield };
