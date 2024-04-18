const getDeleteReminderPrompt = (text, memberId) => {
  let fullPrompt = 'create a delete sql statement  for postresql for the following table \n';
  fullPrompt += 'TABLE schedule (\n';
  fullPrompt += ' id SERIAL PRIMARY KEY\n';
  fullPrompt += ' title VARCHAR(400) NOT null\n';
  fullPrompt += ' starts_at TIMESTAMP NOT NULL\n';
  fullPrompt += ' repeat VARCHAR(20)\n';
  fullPrompt += ' member_id int\n';
  fullPrompt += ' )\n';
  fullPrompt += ' The  possible values for the field \'repeat\' are:\n';
  fullPrompt += ' - None\n';
  fullPrompt += ' - Daily\n';
  fullPrompt += ' - Weekly\n';
  fullPrompt += ' - Monthly\n';
  fullPrompt += `For the where statement use:\n`;
  fullPrompt += `the title=${text}\n`;
  fullPrompt += `and the member_id=${memberId}\n`;  
  fullPrompt += ' Only display the sql statement without any additional explanation or description';
  
  return fullPrompt;
}

module.exports = { getDeleteReminderPrompt };