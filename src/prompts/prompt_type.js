const constants = require("./constants");

/**
 * Module for determining the type of prompt.
 * @module prompt_type
 */

/**
 * Determines the type of prompt based on the given input.
 * @param {string} prompt - The prompt to be analyzed.
 * @returns {string} The type of prompt.
 */
const getPromptType = (prompt) => {
  const lcPrompt = prompt.toLowerCase();
  // Check help command
  if (lcPrompt.includes("help")) {
    return constants.HELP;
  }

   // Check prompt command
   if (lcPrompt.includes("prompt") || lcPrompt.includes("prompts")) {
    return constants.PROMPT;
  }

  // Check link command
  if (lcPrompt.includes("link") || lcPrompt.includes("links")) {
    return constants.LINK;
  }

  // Check file command
  if (lcPrompt.includes("excel")) {
    return constants.EXPORT;
  }

  // Order or sort command
  if (lcPrompt.includes("order by") || lcPrompt.includes("sort")) {
    return constants.SORT;
  }

  // Check for files command
  if (lcPrompt.includes("file") || lcPrompt.includes("files") || 
      lcPrompt.includes("folder") || lcPrompt.includes("document") || 
      lcPrompt.includes("doc") || lcPrompt.includes("presentation") ||
      lcPrompt.includes("ppt") || lcPrompt.includes("pdf")      
    ) {
    return constants.FILE;
  }

  // Reminder command
  if (lcPrompt.includes("reminder") || lcPrompt.includes("reminders")) {
    return constants.REMINDER;
  }

  // Page command
  if (lcPrompt.includes("page")) {
    return constants.PAGE;
  }

  // it is not a command then it could be a question
  return constants.QUESTION;
}

module.exports = { getPromptType };