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
  let sortFields = [];
  let sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
  let promptWords = sanitizedPrompt.split(" ").map((word) => word.trim());
  for (i = 0; i < promptWords.length; i++) {
    let word = promptWords[i].toLowerCase();
    for (let field of result.fields) {
      if(word.toLowerCase() === field.name.toLowerCase()) {
        sortFields.push(field.name);
      }
    }
  }

  if (sortFields.length === 0) {
    // Try by field index
    for (i = 0; i < promptWords.length; i++) {
      let word = promptWords[i].toLowerCase();
      if (!isNaN(word)) {
        let index = parseInt(word);
        index--;
        if(index < 1) {
          index = 1;
        }
        if (index > result.fields.length) {
          index = 1;
        }
        if (index < result.fields.length) {
          sortFields.push(result.fields[index].name);
        }
      }
    }    
  }

  return sortFields;

};

/**
 * Determines the sort direction based on the given prompt.
 *
 * @param {string} prompt - The prompt to analyze.
 * @returns {string} The sort direction ("asc" for ascending, "desc" for descending).
 */
const getSortDirection = (prompt) => {
  let sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
  if (sanitizedPrompt.includes("asc") || sanitizedPrompt.includes("ascendent")) {
    return "asc";
  }

  if (sanitizedPrompt.includes("desc") || sanitizedPrompt.includes("descendent")) {
    return "desc";
  }

  return "asc";
}

module.exports = { 
  getSortfield,
  getSortDirection
};
