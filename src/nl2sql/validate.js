/**
 * Validates the SQL query based on the provided prompt, table name, and actions.
 * @param {string} prompt - The prompt for the SQL query.
 * @param {string} tableName - The name of the table.
 * @param {string[]} actions - The actions to be performed in the SQL query.
 * @returns {boolean} - Returns true if the SQL query is valid, otherwise false.
 */
function validateSQL(prompt, tableName, actions) {

  if (tableName == '' || tableName == null) {
    return false;
  }

  if (!checkPromptForActions(prompt, actions)) {
    return false;
  }

  return true;
}

/**
 * Checks if a prompt includes any of the specified actions.
 * @param {string} prompt - The prompt to check.
 * @param {string[]} actions - The actions to search for in the prompt.
 * @returns {boolean} - True if the prompt includes any of the actions, false otherwise.
 */
function checkPromptForActions(prompt, actions) {
  for (let i = 0; i < actions.length; i++) {
    if (prompt.includes(actions[i])) {
      return true;
    }
  }
  return false;
}

exports.validateSQL = validateSQL;