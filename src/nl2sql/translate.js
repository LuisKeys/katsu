const finder = require("./entity_finder");
const dbFields = require("../db/db_get_fields");

/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, prompt) {

  // Get the entity from the prompt
  const entity = await finder.getEntity(openai, openaiapi, prompt);
  console.log('Entity:');
  console.log(entity);

  // Get the fields for the entity
  const fields = await dbFields.getViewFields(entity);
  console.log('Fields:');
  console.log(fields);

  // let sql = await openaiapi.ask(
  //   openai,
  //   fullprompt
  // );


  console.log('Prompt:');
  console.log(prompt);
  
  return "";
}

module.exports = { generateSQL };

