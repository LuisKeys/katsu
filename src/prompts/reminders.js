const remindersCreate = require("./reminder_create");
const remindersDelete = require("./reminder_delete");
const remindersUtils = require("./reminders_utils");
const remindersList = require("./reminders_list");

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
  let fullPrompt = remindersCreate.getCreateReminderPrompt(prompt, memberId);

  // Execute the SQL statement
  await remindersUtils.execSQL(openai, openAIAPI, fullPrompt);

  // Get reminder text
  let text = await remindersUtils.getReminderText(openai, openAIAPI, prompt);

  // Get reminder result
  let result = await remindersUtils.getReminderResult(text, "created");

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
  let text = await remindersUtils.getReminderText(openai, openAIAPI, prompt);

  // Get the reminder full prompt
  let fullPrompt = remindersDelete.getDeleteReminderPrompt(text, memberId);

  // Execute the SQL statement
  await remindersUtils.execSQL(openai, openAIAPI, fullPrompt);

  
  // Get reminder result
  let result = await remindersUtils.getReminderResult(text, "removed");

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
const listReminders = async (openai, openAIAPI, prompt, memberId) => {
  // Get the list reminders full prompt
  let fullPrompt = remindersList.getListRemindersPrompt(memberId);
  
  // Execute the SQL statement
  const result = await remindersUtils.execSQL(openai, openAIAPI, fullPrompt);  
  return result;
};

module.exports = {
  createReminder,
  deleteReminder,
  getReminderAction,
  listReminders,
};
