const db = require("../db/db_commands");


/**
 * Creates an insert SQL statement for PostgreSQL based on the provided prompt.
 * 
 * @param {object} openai - The OpenAI object.
 * @param {object} openAIAPI - The OpenAI API object.
 * @param {string} prompt - The prompt to be included in the SQL statement.
 * @returns {Promise<void>} - A promise that resolves when the SQL statement is executed.
 */
const createReminder = async (openai, openAIAPI, prompt, memberId) => {
  let fullPrompt = 'create an insert sql statement  for postresql for the following table \n';
  fullPrompt += 'TABLE schedule (\n';
  fullPrompt += ' id SERIAL PRIMARY KEY\n';
  fullPrompt += ' title VARCHAR(400) NOT null\n';
  fullPrompt += ' starts_at TIMESTAMP NOT NULL\n';
  fullPrompt += ' repeat VARCHAR(20)\n';
  fullPrompt += ' member_id int\n';
  fullPrompt += ' )\n';
  fullPrompt += ' - None\n';
  fullPrompt += ' - Daily\n';
  fullPrompt += ' The  possible values for the field \'repeat\' are:\n';
  fullPrompt += ' - Weekly\n';
  fullPrompt += ' - Monthly\n';
  fullPrompt += ' based on this prompt\n';
  fullPrompt += `${prompt}\n`;
  fullPrompt += `member_id=${memberId}\n`;  
  fullPrompt += ' Only display the sql statement without any additional explanation or description';
 
  const sql = await openAIAPI.ask(
    openai,
    fullPrompt
  );

  console.log(sql);

  await db.connect();
  await db.execute(sql);
  await db.close(); 

  fullPrompt = 'which is the text or subject of the following reminder statement:\n';
  fullPrompt += `${prompt}\n`;
  fullPrompt += 'Only answer with the text without any additional description or explanation'

  const text = await openAIAPI.ask(
    openai,
    fullPrompt
  );

  // Create response
  const headerTitle = "Reminder"
  result = {rows:[], fields:[]};
  field = {name:headerTitle};
  result.fields.push(field); 
  
  let record = {};
  record[headerTitle] = `Your reminder '${text}' has been created successfully`;
  result.rows.push(record);    

  return result;  
}

module.exports = { createReminder };
