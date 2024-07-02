"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPromptType = void 0;
var constants = require("./constants");
/**
 * Module for determining the type of prompt.
 * @module prompt_type
 */
/**
 * Determines the type of prompt based on the given input.
 * @param {string} prompt - The prompt to be analyzed.
 * @returns {string} The type of prompt.
 */
var getPromptType = function (prompt) {
    var lcPrompt = prompt.toLowerCase();
    var type = constants.QUESTION;
    // Check help command
    if (lcPrompt.includes("help")) {
        type = constants.HELP;
    }
    // Check LLM command
    if (lcPrompt.includes("gpt") || lcPrompt.includes("llm")) {
        type = constants.LLM;
    }
    // Check prompt command
    if (lcPrompt.includes("prompt") || lcPrompt.includes("prompts")) {
        type = constants.PROMPT;
    }
    // Check link command
    if (lcPrompt.includes("link") || lcPrompt.includes("links")) {
        type = constants.LINK;
    }
    // Check file command
    if (lcPrompt.includes("excel")) {
        type = constants.EXCEL;
    }
    // Order or sort command
    if (lcPrompt.includes("order by") || lcPrompt.includes("sort")) {
        type = constants.SORT;
    }
    // Check for files command
    if (lcPrompt.includes("file") ||
        lcPrompt.includes("files") ||
        lcPrompt.includes("folder") ||
        lcPrompt.includes("document") ||
        lcPrompt.includes("doc") ||
        lcPrompt.includes("presentation") ||
        lcPrompt.includes("ppt") ||
        lcPrompt.includes("pdf")) {
        type = constants.FILE;
    }
    // Page command
    if (lcPrompt.includes("page")) {
        type = constants.PAGE;
    }
    console.log("Prompt Type: ", type);
    // it is not a command then it could be a question
    return type;
};
exports.getPromptType = getPromptType;
