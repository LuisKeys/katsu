/**
 * Cleans the given prompt by converting it to lowercase, removing extra spaces, and removing final punctuation marks.
 * @param {string} prompt - The prompt to be cleaned.
 * @returns {string} - The cleaned prompt.
 */
const cleanPrompt = function (prompt: string): string {
  // To lower case
  let promptCl: string = prompt.toLowerCase();
  // Remove any extra spaces
  promptCl = promptCl.trim();
  // Remove final point, comma or question mark
  promptCl = promptCl.replace(/[\.,\?]+$/, '');
  return promptCl;
};

export { cleanPrompt };
