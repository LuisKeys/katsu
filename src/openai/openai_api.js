// This file contains the code to send a prompt to the OpenAI API and return the response.

/**
 * Sends the prompt to the OpenAI API and returns the response.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {string} - The response from the OpenAI API.
 */
async function sendPromptToOpenAI(openai, prompt) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0].message.content;
}

const ask = async (openai, prompt) => {
  const response = await sendPromptToOpenAI(openai, prompt);    
  return response;
};

module.exports = { ask };
