
/**
 * This module provides a function to find the sort field based on a prompt and a result object.
 * @module sort_field_finder
 */

/**
 * Finds the sort field based on a prompt and a result object.
 * @param {string} prompt - The prompt to search for in the field names.
 * @param {object} result - The result object containing the fields.
 * @returns {object|null} - The sort field object if found, or null if not found.
 */
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
