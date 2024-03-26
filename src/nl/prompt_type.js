const getPromptType = (prompt) => {
  const lcPrompt = prompt.toLowerCase();
  // Check if the prompt is a request for help
  if (lcPrompt.includes("help")) {
    return "help";
  }

  // Check if the prompt is a question
  if (lcPrompt.includes("graph") || lcPrompt.includes("chart")) {
    return "graph";
  }

  // Check if the prompt is a link
  if (lcPrompt.includes("link") || lcPrompt.includes("links")) {
    return "link";
  }

  // Check if the prompt is a file
  if (lcPrompt.includes("file") || lcPrompt.includes("csv")) {
    return "file";
  }

  // Check if the prompt is a statement
  return "question";
}

module.exports = { getPromptType };