const getListRemindersPrompt = (memberId) => {
  let fullPrompt = 'create a select sql statement for postresql for the following table \n';
  fullPrompt += 'TABLE schedule (\n';
  fullPrompt += ' title VARCHAR(400) NOT null\n';
  fullPrompt += ' starts_at TIMESTAMP NOT NULL\n';
  fullPrompt += ' repeat VARCHAR(20)\n';
  fullPrompt += ' member_id int\n';
  fullPrompt += ' )\n';
  fullPrompt += `For the select  statement use fields:\n`;
  fullPrompt += ' title\n';
  fullPrompt += ' repeat\n';
  fullPrompt += `For the where statement use:\n`;
  fullPrompt += `the member_id=${memberId}\n`;  
  fullPrompt += ' Only display the sql statement without any additional explanation or description';
  
  return fullPrompt;
}

module.exports = { getListRemindersPrompt };