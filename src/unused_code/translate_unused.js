
/**
 * Retrieves the table name based on the given prompt.
 * @param {string} prompt - The prompt to search for the table name.
 * @returns {string} - The found table name.
 */
function getTable(prompt) {
  const pluralList = addSToList(objects);
  const combinedList = [...objects, ...pluralList];  
  const foundObject = objects.find(object => prompt.includes(object));
  const table = capitalizeFirstLetter(foundObject || "");
  return table; // Return blank if foundObject is undefined
}

/**
 * Adds an 's' to each string in the given array.
 * @param {string[]} strings - The array of strings to modify.
 * @returns {string[]} The modified array with 's' added to each string.
 */
function addSToList(strings) {
  const newList = strings.map(string => string + 's');
  return newList;
}

/**
 * Replaces all occurrences of 'opportunities' with 'opportunity' in the given text.
 * @param {string} text - The text to be processed.
 * @returns {string} - The processed text with replacements.
 */
function replace(text) {
  replaced = text.replace(/opportunities/g, 'opportunity');
  return replaced;
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param {string} string - The input string.
 * @returns {string} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

