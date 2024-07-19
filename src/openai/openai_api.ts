import { ClientOptions, OpenAI } from 'openai';

/**
 * Retrieves an instance of the OpenAI client.
 * @returns {OpenAI} The OpenAI client instance.
 */
const getOpenAI = (): OpenAI => {
  const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  };

  const openai = new OpenAI(clientOptions);

  return openai;
};

/**
 * @fileoverview This module provides functions for interacting with the OpenAI API.
 * @module openai_api
 */


/**
 * Sends the prompt to the OpenAI API and returns the response.
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
async function sendPromptToOpenAI(openai: OpenAI, prompt: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: prompt }],
    model: "gpt-3.5-turbo",
  });

  let answer: String = "";
  if (completion.choices) {
    if (completion.choices.length > 1) {
      if (completion.choices[0].message.content) {
        answer = completion.choices[0].message.content;
      }
    }
  }

  return answer as string;
}

/**
 * Asks a question to the OpenAI API and returns the response.
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
const ask = async (openai: OpenAI, prompt: string): Promise<string> => {
  const response: string | null = await sendPromptToOpenAI(openai, prompt);
  return response || '';
};

export { ask, getOpenAI };
