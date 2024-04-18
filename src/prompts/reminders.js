const db = require("../db/db_commands");
const createRmndr = require("./reminder_create");
const deleteRmndr = require("./reminder_delete");

/**
 * Retrieves the action of a reminder statement.
 *
 * @param {Object} openai - The OpenAI object.
 * @param {Object} openAIAPI - The OpenAI API object.
 * @param {string} prompt - The reminder statement.
 * @returns {Promise<string>} The action of the reminder statement.
 */
const getReminderAction = async (openai, openAIAPI, prompt) => {
  let fullPrompt = "which is the action of the following reminder statement:\n";
  fullPrompt += `${prompt}\n`;
  fullPrompt += `The possible actions are:\n`;
  fullPrompt += `-create\n`;
  fullPrompt += `-delete\n`;
  fullPrompt += `-list\n`;
  fullPrompt +=
    "Only answer with the action without any additional description or explanation";

  const action = await openAIAPI.ask(openai, fullPrompt);

  return action;
};

/**
 * Creates an insert SQL statement for PostgreSQL based on the provided prompt.
 *
 * @param {object} openai - The OpenAI object.
 * @param {object} openAIAPI - The OpenAI API object.
 * @param {string} prompt - The prompt to be included in the SQL statement.
 * @returns {Promise<void>} - A promise that resolves when the SQL statement is executed.
 */
const createReminder = async (openai, openAIAPI, prompt, memberId) => {
  // Get the reminder full prompt
  let fullPrompt = createRmndr.getCreateReminderPrompt(prompt, memberId);

  // Execute the SQL statement
  await execSQL(openai, openAIAPI, fullPrompt);

  // Get reminder text
  let text = await getReminderText(openai, openAIAPI, prompt);

  // Get reminder result
  let result = await getReminderResult(text, "created");

  return result;
};

/**
 * Deletes a reminder.
 *
 * @param {Object} openai - The OpenAI object.
 * @param {string} openAIAPI - The OpenAI API key.
 * @param {string} prompt - The prompt for the reminder.
 * @param {string} memberId - The ID of the member.
 * @returns {Promise<void>} - A promise that resolves when the reminder is deleted.
 */
const deleteReminder = async (openai, openAIAPI, prompt, memberId) => {
  // Get reminder text
  let text = await getReminderText(openai, openAIAPI, prompt);

  // Get the reminder full prompt
  let fullPrompt = deleteRmndr.getDeleteReminderPrompt(text, memberId);

  // Execute the SQL statement
  await execSQL(openai, openAIAPI, fullPrompt);

  
  // Get reminder result
  let result = await getReminderResult(text, "removed");

  return result;
};

/**
 * Lists reminders for a specific member.
 *
 * @param {Object} openai - The OpenAI object.
 * @param {string} openAIAPI - The OpenAI API key.
 * @param {string} prompt - The prompt for listing reminders.
 * @param {string} memberId - The ID of the member.
 * @returns {Promise<void>} - A promise that resolves when the reminders are listed.
 */
const listReminders = async (openai, openAIAPI, prompt, memberId) => {};

const getReminderText = async (openai, openAIAPI, prompt) => {
  fullPrompt =
    "which is the text or subject of the following reminder statement:\n";
  fullPrompt += `${prompt}\n`;
  fullPrompt +=
    "Only answer with the text without any additional description or explanation";

  const text = await openAIAPI.ask(openai, fullPrompt);

  return text;
};

const execSQL = async (openai, openAIAPI, fullPrompt) => {
  const sql = await openAIAPI.ask(openai, fullPrompt);  

  await db.connect();
  await db.execute(sql);
  await db.close();
};

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

module.exports = {
  createReminder,
  deleteReminder,
  getReminderAction,
  listReminders,
};
