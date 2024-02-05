// This file contains the logic to translate natural language to SQL

// Required External Modules


/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, prompt) {

  let header= "Create an SQL statement with the following prompt and do not add any additional text or explanation in the answer, ";
  header += "validating the results with these table names ";
  header += "account, contact, lead, opportunity, project, engagement, engagement_role, time_entries, engagement_approver.";
  header += "Valid field names are Name, Id, isDeleted. For the SELECT use Name as field. Provide the result sorted by Name ascending.";

  fullprompt = header + prompt  

  var sqlStatement = await openaiapi.ask(
    openai,
    fullprompt
  );

  sqlStatement = replace(sqlStatement);

  return sqlStatement;
}

const replace = function (sql) {

  const labelNames = ["project", "engagement", "engagement_role", "time_entries", "engagement_approver"];
  const realNames = ["Project__c","Project__c","Project_Role__c","Time_Entry__c","Engagement_Approver__c"];
  const tuples = labelNames.map((label, index) => [label, realNames[index]]);

  var replacedSql = sql.replace(new RegExp(tuples.map(([find]) => find).join('|'), 'g'), match => {
    const tuple = tuples.find(([find]) => find === match);
    return tuple ? tuple[1] : match;
  });

  replacedSql = replacedSql.replace(/ /g, '+');
  replacedSql = replacedSql.replace(/%/g, '%25');
  replacedSql = replacedSql.replace(/\n/g, '+');
  replacedSql = replacedSql.replace('+Name+', '+FIELDS(+standard+)');
  replacedSql = replacedSql.replace(';', '');
  
  return replacedSql;  
}

module.exports = { generateSQL };
