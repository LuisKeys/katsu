// This file contains the logic to translate natural language to SQL

// Required External Modules


/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
generateSQL = async function (openai, openaiapi, prompt) {

  let header= "Create an SQL statement with the following prompt and to not add any additional text or explanation in the answer, ";
  header += "validating the results with these table names ";
  header += "account, contact, lead, opportunity, project, engagement, engagement role, time entrie, Engagement Approver.";
  header += "Valid field names are Name, Id, isDeleted. For the SELECT use Name as field. Provide the result sorted by Name ascending.";

  fullprompt = header + prompt

  const sqlStatement = await openaiapi.ask(
    openai,
    fullprompt
  );

  return sqlStatement;
}

module.exports = { generateSQL };
