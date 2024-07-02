/**
 * This module provides a function to find the sort field based on a prompt and a result object.
 * @module sort_field_finder
 */

import { ResultObject } from "../prompts/result_object";

/**
 * Finds the sort field based on a prompt and a result object.
 * @param {string} prompt - The prompt to search for in the field names.
 * @param {object} result - The result object containing the fields.
 * @returns {string[]} - An array of sort field names if found, or an empty array if not found.
 */
const getSortfield = (result: ResultObject): string[] => {
  let sortFields: string[] = [];
  let sanitizedPrompt = result.prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
  let promptWords = sanitizedPrompt.split(" ").map((word) => word.trim());
  for (let i = 0; i < promptWords.length; i++) {
    let word = promptWords[i].toLowerCase();
    for (let field of result.fields) {
      if (word.toLowerCase() === field.toLowerCase()) {
        sortFields.push(field);
      }
    }
  }

  if (sortFields.length === 0) {
    // Try by field index
    for (let i = 0; i < promptWords.length; i++) {
      let word = promptWords[i].toLowerCase();
      if (!isNaN(Number(word))) {
        let index = parseInt(word);
        index--;
        if (index < 0) {
          index = 0;
        }
        if (index >= result.fields.length) {
          index = result.fields.length - 1;
        }
        sortFields.push(result.fields[index]);
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
const getSortDirection = (prompt: string): string => {
  let sanitizedPrompt = prompt.replace(/[^a-zA-Z0-9\s'"_]/g, "");
  if (sanitizedPrompt.includes("asc") || sanitizedPrompt.includes("ascendent")) {
    return "asc";
  }

  if (sanitizedPrompt.includes("desc") || sanitizedPrompt.includes("descendent")) {
    return "desc";
  }

  return "asc";
};

export { getSortfield, getSortDirection };
