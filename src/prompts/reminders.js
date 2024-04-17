const createReminder = async (openai, openAIAPI, prompt) => {
  let fullPrompt = 'create an insert sql statement  for postresql for the following table \n';
  fullPrompt += 'TABLE schedule (\n';
  fullPrompt += ' id SERIAL PRIMARY KEY\n';
  fullPrompt += ' title VARCHAR(400) NOT null\n';
  fullPrompt += ' starts_at TIMESTAMP NOT NULL\n';
  fullPrompt += ' repeat VARCHAR(20)\n';
  fullPrompt += ' )\n';
  fullPrompt += ' - None\n';
  fullPrompt += ' - Daily\n';
  fullPrompt += ' The  possible values for the field \'repeat\' are:\n';
  fullPrompt += ' - Weekly\n';
  fullPrompt += ' - Monthly\n';
  fullPrompt += ' based on this prompt\n';
  fullPrompt += `${prompt}\n`;
  fullPrompt += ' Only display the sql statement without any additional explanation or description';
 
  sql = await openAIAPI.ask(
    openai,
    fullPrompt
  );

  console.log(sql);
}

module.exports = { createReminder };
