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
  // Check if the prompt is a request for help
  if (lcPrompt.includes("help")) {
    return constants.HELP;
  }

   // Check if the prompt is a link
  if (lcPrompt.includes("link") || lcPrompt.includes("links")) {
    return constants.LINK;
  }

  // Check if the prompt is a file
  if (lcPrompt.includes("excel")) {
    return constants.EXPORT;
  }

  // Order or sort statement
  if (lcPrompt.includes("order by") || lcPrompt.includes("sort")) {
    return constants.SORT;
  }

  // Check for files prompt
  if (lcPrompt.includes("file") || lcPrompt.includes("files") || 
      lcPrompt.includes("folder") || lcPrompt.includes("document") || 
      lcPrompt.includes("doc") || lcPrompt.includes("presentation") ||
      lcPrompt.includes("ppt") || lcPrompt.includes("pdf")      
    ) {
    return constants.FILE;
  }

  // Reminder prompt
  if (lcPrompt.includes("reminder") || lcPrompt.includes("reminders")) {
    return constants.REMINDER;
  }

  // Reminder prompt
  if (lcPrompt.includes("page")) {
    return constants.PAGE;
  }

  // Check if the prompt is a statement
  return constants.QUESTION;
}

module.exports = { getPromptType };