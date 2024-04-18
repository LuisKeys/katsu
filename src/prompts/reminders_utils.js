const db = require("../db/db_commands");

/**
 * Retrieves the reminder text or subject based on the provided prompt.
 *
 * @param {Object} openai - The OpenAI object.
 * @param {Object} openAIAPI - The OpenAI API object.
 * @param {string} prompt - The prompt to generate the reminder text from.
 * @returns {Promise<string>} The reminder text.
 */
const getReminderText = async (openai, openAIAPI, prompt) => {
  fullPrompt =
    "which is the text or subject of the following reminder statement:\n";
  fullPrompt += `${prompt}\n`;
  fullPrompt +=
    "Only answer with the text without any additional description or explanation";

  const text = await openAIAPI.ask(openai, fullPrompt);

  return text;
};

/**
 * Executes an SQL query using the provided OpenAI instance and API, and the given full prompt.
 *
 * @param {Object} openai - The OpenAI instance.
 * @param {Object} openAIAPI - The OpenAI API.
 * @param {string} fullPrompt - The full prompt for the SQL query.
 * @returns {Promise<void>} - A promise that resolves when the SQL query is executed successfully.
 */
const execSQL = async (openai, openAIAPI, fullPrompt) => {
  const sql = await openAIAPI.ask(openai, fullPrompt);  

  await db.connect();
  result = await db.execute(sql);
  await db.close();
  return result;
};

/**
 * Retrieves the reminder result.
 *
 * @param {string} text - The reminder text.
 * @param {string} action - The action performed on the reminder.
 * @returns {Promise<Object>} The reminder result object.
 */
const getReminderResult = async (text, action) => {
  // Create response
  const headerTitle = "Reminder";
  result = { rows: [], fields: [] };
  field = { name: headerTitle };
  result.fields.push(field);

  let record = {};
  record[headerTitle] = `Your reminder '${text}' has been ${action} successfully`;
  result.rows.push(record);

  return result;
};

module.exports = { getReminderText, execSQL, getReminderResult };