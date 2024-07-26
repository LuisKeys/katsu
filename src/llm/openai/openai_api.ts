import { ClientOptions, OpenAI } from 'openai';
import { KatsuState } from '../../state/katsu_state';

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
  if (state.showWordsCount) {
    showCost(state, userIndex);
  }

  const completion = await (state.openai.chat.completions.create)({
    messages: [{ role: "system", content: state.users[userIndex].context }],
    model: "gpt-4o-mini",
  });

  let answer: string = "";
  if (completion && completion.choices) {
    if (completion.choices.length > 0) {
      if (completion.choices[0].message.content) {
        answer = completion.choices[0].message.content;
      }
    }
  }

  if (state.isDebug) {
    console.log("Ask ended");
  }

  return answer;
};

const showCost = (state: KatsuState, userIndex: number): void => {
  const wordsCount = countWords(state.users[userIndex].context);
  const cost = calculateOpenAICost(wordsCount);
  console.log("Call cost: ", cost);
  if (cost > 0.00) {
    console.log("Calls with 1 dollar: ", Math.round(1 / cost));
  }
}

/**
 * Calculates the cost of using OpenAI based on the number of words.
 * @param {number} numWords - The number of words.
 * @returns {number} - The cost in dollars.
 */
const calculateOpenAICost = (numWords: number): number => {
  const numTokens = numWords / 2;
  const costPerMillionTokens = 0.15;
  const cost = (numTokens / 1000000) * costPerMillionTokens;
  return cost;
};

/**
 * Counts the number of words in a string.
 * @param {string} str - The input string.
 * @returns {number} - The number of words in the string.
 */
const countWords = (str: string): number => {
  // Remove leading and trailing white spaces
  const trimmedStr = str.trim();

  // Split the string into an array of words
  const words = trimmedStr.split(/\s+/);

  // Return the number of words
  return words.length;
};

export { ask, getOpenAI };
