import { ClientOptions, OpenAI } from 'openai';
import { KatsuState } from '../../state/katsu_state';

const getOpenAI = (): OpenAI => {
  const clientOptions: ClientOptions = {
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  };

  return new OpenAI(clientOptions);
};

const askAI = async (state: KatsuState, context: string): Promise<string> => {
  if (state.showWordsCount) showCost(context);

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const completion = await (state.openai.chat.completions.create)({
    messages: [{ role: "system", content: context }],
    model: model,
  });
  if (state.isDebug) console.log("Ask ended");

  const answer = completion?.choices?.[0]?.message?.content || "";
  return answer;
};

/**
 * Asks a question to the OpenAI API and returns the response.
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
const ask = async (state: KatsuState, userIndex: number): Promise<string> => {
  const context = state.users[userIndex].context;
  if (state.showWordsCount) showCost(context);

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const completion = await (state.openai.chat.completions.create)({
    messages: [{ role: "system", content: context }],
    model: model,
  });
  if (state.isDebug) console.log("Ask ended");

  const answer = completion?.choices?.[0]?.message?.content || "";
  return answer;
};

const showCost = (context: string): void => {
  const wordsCount = countWords(context);
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
  const numTokens = numWords / .75;
  const costPerMillionTokens = 5.00;
  const cost = (numTokens / 1000000) * costPerMillionTokens;
  return cost;
};

const countWords = (str: string): number => {
  const words = str.trim().split(/\s+/);
  return words.length;
};

export { ask, askAI, getOpenAI };
