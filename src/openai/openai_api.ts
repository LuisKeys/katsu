import { ClientOptions, OpenAI } from 'openai';
import { KatsuState } from '../db/katsu_db/katsu_state';

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
 * Asks a question to the OpenAI API and returns the response.
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
const ask = async (state: KatsuState, userIndex: number): Promise<string> => {

  const completion = await (state.openai?.chat.completions.create || (() => { }))({
    messages: [{ role: "system", content: state.users[userIndex].prompt }],
    model: "gpt-4o-mini",
  });

  let answer: string = "";
  if (completion && completion.choices) {
    if (completion.choices.length > 1) {
      if (completion.choices[0].message.content) {
        answer = completion.choices[0].message.content;
      }
    }
  }

  return answer;
};

export { ask, getOpenAI };
