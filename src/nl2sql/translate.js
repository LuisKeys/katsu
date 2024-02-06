// This file contains the logic to translate natural language to SQL

/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, prompt) {

  let header= "Create an SQL statement with the following prompt and do not add any additional text or explanation in the answer, ";
  header += "validating the results with these table names ";
  header += "account, contact, lead, opportunity, project, engagement, engagement_role, time_entries, engagement_approver.";
  header += "For the strictly SELECT ALWAYS use 'FIELDS(ALL)' function only, and no other field or function must be used.";
  header += "If the table is engagement or project the 'status__c' field is alowed in the where otherwise the only field allowed is name with the 'like' clause.";  
  header += "The only valid values  for 'status__c' field are  'active' and 'inactive'.";  
  header += "Provide the result sorted by Name ascending.";
  header += "Append LIMIT 200 at the end of the query.";
  header += "If dates are required then use  the 'CreatedDate' field for comparisson in the where clause.";  
  header += "The following format should be used for dates:'YYYY-MM-DD'.";    
  header += "Additionally use the following literals for date comparisson: ";    
  header += " - YESTERDAY	Starts at 12:00:00 AM on the day before the current day and continues for 24 hours.	SELECT Id FROM Account WHERE CreatedDate = YESTERDAY";
  header += " - TODAY	Starts at 12:00:00 AM on the current day and continues for 24 hours.	SELECT Id FROM Account WHERE CreatedDate > TODAY";
  header += " - TOMORROW	Starts at 12:00:00 AM. on the day after the current day and continues for 24 hours.	SELECT Id FROM Opportunity WHERE CloseDate = TOMORROW";
  header += " - LAST_WEEK	Starts at 12:00:00 AM on the first day of the week before the current week and continues for seven days.	SELECT Id FROM Account WHERE CreatedDate > LAST_WEEK";
  header += " -   THIS_WEEK	Starts at 12:00:00 AM on the first day of the current week and continues for seven days.	SELECT Id FROM Account WHERE CreatedDate < THIS_WEEK";
  header += " - NEXT_WEEK	Starts at 12:00:00 AM on the first day of the week after the current week and continues for seven days.	SELECT Id FROM Opportunity WHERE CloseDate = NEXT_WEEK";
  header += " - LAST_MONTH	Starts at 12:00:00 AM on the first day of the month before the current month and continues for all the days of that month.	SELECT Id FROM Opportunity WHERE CloseDate > LAST_MONTH";
  header += " - THIS_MONTH	Starts at 12:00:00 AM on the first day of the current month and continues for all the days of that month.	SELECT Id FROM Account WHERE CreatedDate < THIS_MONTH";
  header += " - NEXT_MONTH	Starts at 12:00:00 AM on the first day of the month after the current month and continues for all the days of that month.	SELECT Id FROM Opportunity WHERE CloseDate = NEXT_MONTH";
  header += " - LAST_90_DAYS	Starts at 12:00:00 AM 90 days before the current day and continues up to the current second. (The range includes today. Using this date value includes records from 91 days ago up to the current day.)	SELECT Id FROM Account WHERE CreatedDate = LAST_90_DAYS";
  header += " - NEXT_90_DAYS	Starts at 12:00:00 AM on the day that the report is run and continues for 90 days. (The range includes today.)	SELECT Id FROM Opportunity WHERE CloseDate > NEXT_90_DAYS";
  header += " - LAST_N_DAYS:n	Starts at 12:00:00 AM n days before the current day and continues up to the current second. (The range includes today. Using this date value includes records from n + 1 days ago up to the current day.) In standard filters, n can be 7, 30, 60, 90, or 120.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_DAYS:365";
  header += " - NEXT_N_DAYS:n	For standard date filters, starts at 12:00:00 AM on the day that the report is run and continues for n days. (The range includes today.) In standard filters, n can be 7, 30, 60, 90, or 120.";
  header += " - N_DAYS_AGO:n	Starts at 12:00:00 AM on the day n days before the current day and continues for 24 hours. (The range doesn’t include today.)	SELECT Id FROM Opportunity WHERE CloseDate = N_DAYS_AGO:25";
  header += " - NEXT_N_WEEKS:n	Starts at 12:00:00 AM on the first day of the week after the current week and continues for n times seven days.	SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_WEEKS:4";
  header += " - LAST_N_WEEKS:n	Starts at 12:00:00 AM on the first day of the week that started n weeks before the current week, and continues up to 11:59 PM on the last day of the week before the current week.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_WEEKS:52";
  header += " - N_WEEKS_AGO:n	Starts at 12:00:00 AM on the first day of the week that started n weeks before the start of the current week and continues for seven days.	SELECT Id FROM Opportunity WHERE CloseDate = N_WEEKS_AGO:3";
  header += " - NEXT_N_MONTHS:n	Starts at 12:00:00 AM on the first day of the month after the current month and continues until the end of the nth month.	SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_MONTHS:2";
  header += " - LAST_N_MONTHS:n	Starts at 12:00:00 AM on the first day of the month that started n months before the current month and continues up to 11:59 PM on the last day of the month before the current month.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_MONTHS:12";
  header += " - N_MONTHS_AGO:n	Starts at 12:00:00 AM on the first day of the month that started n months before the start of the current month and continues for all the days of that month.	SELECT Id FROM Opportunity WHERE CloseDate = N_MONTHS_AGO:6";
  header += " - THIS_QUARTER	Starts at 12:00:00 AM on the first day of the current calendar quarter and continues to the end of the quarter.	SELECT Id FROM Account WHERE CreatedDate = THIS_QUARTER";
  header += " - LAST_QUARTER	Starts at 12:00:00 AM on the first day of the calendar quarter before the current calendar quarter and continues to the end of that quarter.	SELECT Id FROM Account WHERE CreatedDate = LAST_QUARTER";
  header += " - NEXT_QUARTER	Starts at 12:00:00 AM on the first day of the calendar quarter after the current calendar quarter and continues to the end of that quarter.	SELECT Id FROM Account WHERE CreatedDate < NEXT_QUARTER";
  header += " - NEXT_N_QUARTERS:n	Starts at 12:00:00 AM on the first day of the calendar quarter after the current quarter and continues to the end of the calendar quarter n quarters in the future. (The range doesn’t include the current quarter.)	SELECT Id FROM Account WHERE CreatedDate < NEXT_N_QUARTERS:2";
  header += " - LAST_N_QUARTERS:n	Starts at 12:00:00 AM on the first day of the calendar quarter n quarters ago and continues to the end of the calendar quarter before the current quarter. (The range doesn’t include the current quarter.)	SELECT Id FROM Account WHERE CreatedDate = LAST_N_QUARTERS:2";
  header += " - N_QUARTERS_AGO:n	Starts at 12:00:00 AM on the first day of the calendar quarter n quarters before the current calendar quarter and continues to the end of that quarter.	SELECT Id FROM Opportunity WHERE CloseDate = N_QUARTERS_AGO:3";
  header += " - THIS_YEAR	Starts at 12:00:00 AM on January 1 of the current year and continues through the end of December 31 of the current year.	SELECT Id FROM Opportunity WHERE CloseDate = THIS_YEAR";
  header += " - LAST_YEAR	Starts at 12:00:00 AM on January 1 of the year before the current year and continues through the end of December 31 of that year.	SELECT Id FROM Opportunity WHERE CloseDate > LAST_YEAR";
  header += " - NEXT_YEAR	Starts at 12:00:00 AM on January 1 of the year after the current year and continues through the end of December 31 of that year.	SELECT Id FROM Opportunity WHERE CloseDate < NEXT_YEAR";
  header += " - NEXT_N_YEARS:n	Starts at 12:00:00 AM on January 1 of the year after the current year and continues through the end of December 31 of the nth year.	SELECT Id FROM Opportunity WHERE CloseDate = NEXT_N_YEARS:5";
  header += " - LAST_N_YEARS:n	Starts at 12:00:00 am on January 1, n+1 years ago. The range ends on December 31 of the year before the current year.	SELECT Id FROM Opportunity WHERE CloseDate = LAST_N_YEARS:5";
  header += " - N_YEARS_AGO:n	Starts at 12:00:00 AM on January 1 of the calendar year n years before the current calendar year and continues through the end of December 31 of that year.	SELECT Id FROM Opportunity WHERE CloseDate = N_YEARS_AGO:2";
  
  header += "Finally the query must be strictly compliant with Salesforce SOQL for API and must  not be compliant with APEX code).";

  fullprompt = header + prompt  

  let sqlStatement = await openaiapi.ask(
    openai,
    fullprompt
  );
  
  sqlStatement = replace(sqlStatement);

  return sqlStatement;
}

/**
 * Replaces certain keywords and performs transformations on the given SQL string.
 * @param {string} sql - The SQL string to be modified.
 * @returns {string} - The modified SQL string.
 */
const replace = function (sql) {

  const labelNames = ["project", "engagement", "engagement_role", "time_entries", "engagement_approver"];
  const realNames = ["Project__c","Project__c","Project_Role__c","Time_Entry__c","Engagement_Approver__c"];
  const tuples = labelNames.map((label, index) => [label, realNames[index]]);

  let repSQL = sql.replace(new RegExp(tuples.map(([find]) => find).join('|'), 'g'), match => {
    const tuple = tuples.find(([find]) => find === match);
    return tuple ? tuple[1] : match;
  });

  repSQL = repSQL.toLowerCase();

  // Replacements to add all query fields (stadard + custom)
  repSQL = repSQL.replace('  ', ' ');  
  
  // Replacements for url formatting
  repSQL = repSQL.replace('  ', ' ');
  repSQL = repSQL.replace(/ /g, '+');
  repSQL = repSQL.replace(/%/g, '%25');
  repSQL = repSQL.replace(/\n/g, '+');
  repSQL = repSQL.replace(';', '');
  
  return repSQL;  
}

module.exports = { generateSQL };

