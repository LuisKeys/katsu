// This file contains the logic to translate natural language to SQL

/**
 * Generates an SQL statement based on the provided prompt.
 * @param {string} prompt - The prompt to be used in the SQL statement.
 * @returns {string} The generated SQL statement.
 */
const generateSQL = async function (openai, openaiapi, prompt) {

  // Main goal
  let header= "Create an SQL statement with the following prompt and do not add any additional text or explanation in the answer, ";
  header += "validating the results with these table names ";
  //Valid tables
  header += "account, contact, lead, opportunity, project__c, engagement, Project_Role__c, time_entry__c, engagement_approver.";
  // Schema
  header += "Use the following schema for the tables and fields: ";
  // Opportunity
  header += "- Table:Opportunity";
  header += "  Fields:";
  header += "      Id";
  header += "      IsDeleted";
  header += "      AccountId";
  header += "      IsPrivate";
  header += "      Name";
  header += "      Description";
  header += "      StageName";
  header += "      Amount";
  header += "      Probability";
  header += "      ExpectedRevenue";
  header += "      CloseDate";
  header += "      IsClosed";
  header += "      IsWon";
  header += "      OwnerId";
  header += "      CreatedDate";
  header += "      LastModifiedDate";
  header += "      LastActivityDate";
  // Account
  header += "- Table:Account";
  header += "  Fields:";  
  header += "      Id";
  header += "      Name";
  header += "      Type";
  header += "      Phone";
  header += "      AccountNumber";
  header += "      Website";
  header += "      Industry";
  header += "      AnnualRevenue";
  header += "      CreatedDate";
  header += "      LastModifiedDate";
  header += "      IsPartner";
  header += "      Email__c";
  header += "      Quickbooks_Customer_Id__c";
  header += "      GDrive_Folder_Url__c";
  // Project__c
  header += "- Table:Project__c";
  header += "  Fields:";  
  header += "      Id";
  header += "      Name";
  header += "      CreatedDate";
  header += "      LastModifiedDate";
  header += "      Opportunity__c";
  header += "      Billing_Type__c";
  header += "      Project_Type__c";
  header += "      Pay_Terms__c";
  header += "      Start_Date__c";
  header += "      End_Date__c";
  header += "      Bill_Amount__c";
  header += "      Total_Project_Amount__c";
  header += "      Project_Bill_Type__c";
  header += "      Customer__c";
  header += "      Status__c";
  header += "      Customer_Email__c";
  // Contact
  header += "- Table:Contact";
  header += "  Fields:";  
  header += "      Id";
  header += "      AccountId";
  header += "      LastName";
  header += "      FirstName";
  header += "      Name";
  header += "      MailingCountry";
  header += "      MobilePhone";
  header += "      Email";
  header += "      Title";
  header += "      Department";
  header += "      CreatedDate";
  header += "      Status__c";
  header += "      Active_Engagement_Roles__c";
  header += "      Bamboo_Id__c";
  header += "      Hire_Date__c";
  header += "      Personal_Email__c";
  // Lead
  header += "- Table:Lead";
  header += "  Fields:";  
  header += "      Id";
  header += "      LastName";
  header += "      FirstName";
  header += "      Name";
  header += "      Company";
  header += "      Street";
  header += "      City";
  header += "      State";
  header += "      Country";
  header += "      Phone";
  header += "      MobilePhone";
  header += "      Email";
  header += "      Website";
  header += "      LeadSource";
  header += "      Status";
  header += "      IsConverted";
  header += "      CreatedDate";
  header += "      Assigned_contact__c";
  header += "      Opportunity_from_Lead__c";
  // Time_Entry__c
  header += "- Table:Time_Entry__c";
  header += "  Fields:";
  header += "      Id";
  header += "      Name:";
  header += "      CreatedDate";
  header += "      Date__c";
  header += "      Hours_Worked__c";
  header += "      EngagementName__c";
  header += "      Status__c";
  header += "      ContactName__c";
  // Project_Role__c
  header += "- Table:Project_Role__c";
  header += "  Fields:";
  header += "      Id";
  header += "      Name";
  header += "      CreatedDate";
  header += "      Role__c";
  header += "      Customer_Name__c";
  header += "      Active_Engagement__c";    
 
  // Specific values and comparissons rules
  header += "Valid values for 'status__c' field are 'active', 'inactive' and 'approved'.";
  header += "For string comparissons always must use 'like' clause and always must surround the comopared text with '%'.";
  header += "Do not never perform joins, always only simple queries on a single table.";

  // Sorting and limits
  header += "Provide the result sorted by Name ascending.";
  header += "Append LIMIT 50 at the end of the query.";

  // Dates
  header += "If dates are required then use  the 'CreatedDate' field for comparisson in the where clause.";  
  header += "The following format should be used for dates:'YYYY-MM-DD'.";    
  header += "Additionally use the following literals for date comparisson: ";    
  header += " - TODAY	Starts at 12:00:00 AM on the current day and continues for 24 hours.	SELECT Id FROM Account WHERE CreatedDate > TODAY";
  header += " - LAST_WEEK	Starts at 12:00:00 AM on the first day of the week before the current week and continues for seven days.	SELECT Id FROM Account WHERE CreatedDate > LAST_WEEK";
  header += " - THIS_WEEK	Starts at 12:00:00 AM on the first day of the current week and continues for seven days.	SELECT Id FROM Account WHERE CreatedDate < THIS_WEEK";
  header += " - LAST_MONTH	Starts at 12:00:00 AM on the first day of the month before the current month and continues for all the days of that month.	SELECT Id FROM Opportunity WHERE CloseDate > LAST_MONTH";
  header += " - THIS_MONTH	Starts at 12:00:00 AM on the first day of the current month and continues for all the days of that month.	SELECT Id FROM Account WHERE CreatedDate < THIS_MONTH";
  header += " - LAST_N_DAYS:n	Starts at 12:00:00 AM n days before the current day and continues up to the current second. (The range includes today. Using this date value includes records from n + 1 days ago up to the current day.) In standard filters, n can be 7, 30, 60, 90, or 120.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_DAYS:365";
  header += " - NEXT_N_DAYS:n	For standard date filters, starts at 12:00:00 AM on the day that the report is run and continues for n days. (The range includes today.) In standard filters, n can be 7, 30, 60, 90, or 120.";
  header += " - NEXT_N_WEEKS:n	Starts at 12:00:00 AM on the first day of the week after the current week and continues for n times seven days.	SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_WEEKS:4";
  header += " - LAST_N_WEEKS:n	Starts at 12:00:00 AM on the first day of the week that started n weeks before the current week, and continues up to 11:59 PM on the last day of the week before the current week.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_WEEKS:52";
  header += " - NEXT_N_MONTHS:n	Starts at 12:00:00 AM on the first day of the month after the current month and continues until the end of the nth month.	SELECT Id FROM Opportunity WHERE CloseDate > NEXT_N_MONTHS:2";
  header += " - LAST_N_MONTHS:n	Starts at 12:00:00 AM on the first day of the month that started n months before the current month and continues up to 11:59 PM on the last day of the month before the current month.	SELECT Id FROM Account WHERE CreatedDate = LAST_N_MONTHS:12";
  header += " - THIS_QUARTER	Starts at 12:00:00 AM on the first day of the current calendar quarter and continues to the end of the quarter.	SELECT Id FROM Account WHERE CreatedDate = THIS_QUARTER";
  header += " - LAST_QUARTER	Starts at 12:00:00 AM on the first day of the calendar quarter before the current calendar quarter and continues to the end of that quarter.	SELECT Id FROM Account WHERE CreatedDate = LAST_QUARTER";
  header += " - NEXT_N_QUARTERS:n	Starts at 12:00:00 AM on the first day of the calendar quarter after the current quarter and continues to the end of the calendar quarter n quarters in the future. (The range doesn’t include the current quarter.)	SELECT Id FROM Account WHERE CreatedDate < NEXT_N_QUARTERS:2";
  header += " - LAST_N_QUARTERS:n	Starts at 12:00:00 AM on the first day of the calendar quarter n quarters ago and continues to the end of the calendar quarter before the current quarter. (The range doesn’t include the current quarter.)	SELECT Id FROM Account WHERE CreatedDate = LAST_N_QUARTERS:2";
  header += " - THIS_YEAR	Starts at 12:00:00 AM on January 1 of the current year and continues through the end of December 31 of the current year.	SELECT Id FROM Opportunity WHERE CloseDate = THIS_YEAR";
  header += " - LAST_YEAR	Starts at 12:00:00 AM on January 1 of the year before the current year and continues through the end of December 31 of that year.	SELECT Id FROM Opportunity WHERE CloseDate > LAST_YEAR";
  header += " - NEXT_N_YEARS:n	Starts at 12:00:00 AM on January 1 of the year after the current year and continues through the end of December 31 of the nth year.	SELECT Id FROM Opportunity WHERE CloseDate = NEXT_N_YEARS:5";
  header += " - LAST_N_YEARS:n	Starts at 12:00:00 am on January 1, n+1 years ago. The range ends on December 31 of the year before the current year.	SELECT Id FROM Opportunity WHERE CloseDate = LAST_N_YEARS:5";
  
  header += "Finally the query must be strictly compliant with Salesforce SOQL for API and must  not be compliant with APEX code).";

  fullprompt = header + prompt  

  let sqlStatement = await openaiapi.ask(
    openai,
    fullprompt
  );

  console.log('Prompt:');
  console.log(prompt);
  console.log('Raw SQL statement:');
  console.log(sqlStatement);
  
  sqlStatement = replace(sqlStatement.toLowerCase());

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
  
  // Replace wrong table and fields name
  repSQL = repSQL.replace('project__cname__c', 'EngagementName__c');  
  repSQL = repSQL.replace('project__c_role__c', 'project_role__c'); 
  if (repSQL.includes('project_role__c')) {
    repSQL = repSQL.replace('name', 'contactname__c');
  }

  ContactName__c

  repSQL = replaceSelectFields(repSQL);
  
  return repSQL;  
}

/**
 * Replaces the fields between 'select' and 'from' with '+fields(all)+' in a SQL statement.
 * @param {string} sql - The SQL statement to be modified.
 * @returns {string} The modified SQL statement.
 */
const replaceSelectFields = function (sql) {
  const selectIndex = sql.indexOf('select');
  const fromIndex = sql.indexOf('from');
  
  if (selectIndex !== -1 && fromIndex !== -1 && selectIndex < fromIndex) {
    const fieldsToReplace = sql.substring(selectIndex + 6, fromIndex);
    const modifiedSql = sql.replace(fieldsToReplace, '+fields(all)+');
    return modifiedSql;
  }
  
  return sql;
}

module.exports = { generateSQL, replaceSelectFields };

