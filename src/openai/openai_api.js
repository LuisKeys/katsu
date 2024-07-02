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
async function sendPromptToOpenAI(openai, prompt) {
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: prompt }],
        model: "gpt-3.5-turbo",
    });
    let answer = "";
    if (completion.choices) {
        if (completion.choices.length > 1) {
            if (completion.choices[0].message.content) {
                answer = completion.choices[0].message.content;
            }
        }
    }
    return answer;
}
/**
 * Asks a question to the OpenAI API and returns the response.
 * @param {OpenAI} openai - The OpenAI instance.
 * @param {string} prompt - The prompt to send to the OpenAI API.
 * @returns {Promise<string>} - The response from the OpenAI API.
 */
const ask = async (openai, prompt) => {
    const response = await sendPromptToOpenAI(openai, prompt);
    return response || '';
};
export { ask };
