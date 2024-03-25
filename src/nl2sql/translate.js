const finder = require("./entity_finder");
const dbFields = require("../db/db_get_fields");

/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, userPrompt) {

  // Get the entity from the prompt
  const entity = await finder.getEntity(openai, openaiapi, userPrompt);
  console.log('Entity:');
  console.log(entity);

  // Get the fields for the entity
  const fields = await dbFields.getViewFields(entity);

  // Get the prompt for the SQL statement
  const fullPrompt = getPrompt(openai, openaiapi, entity.view, fields, userPrompt);
  console.log('Full Prompt:');
  console.log(fullPrompt);

  let sql = await openaiapi.ask(
    openai,
    fullPrompt
  );

  return sql;
}

const getPrompt = function (openai, openaiapi, entity, fields, userPrompt) {
  let prompt = "Create a SELECT statement for PostgreSql to retrieve data from the " + entity + " table.";
  prompt += " Include the following fields to define the where statement: ";
  for(let i = 0; i < fields.length; i++) {
    prompt += fields[i] + ", ";
  }

  prompt+= " based on the following user prompt: " + userPrompt;
  prompt += " Limit the results to 50 rows.";  
  prompt += " Answer only with the SQL statement.";  

  return prompt;
}

module.exports = { generateSQL };

