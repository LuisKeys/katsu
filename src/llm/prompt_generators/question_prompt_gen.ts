import { KatsuState } from "../../state/katsu_state";
import { getTablesList } from "../../state/load_state";
import { convertResultToCSV } from "../../result/result_to_csv";

const createQuestionPrompt = (state: KatsuState, userIndex: number, isSecondIntent: boolean): string => {
  const userPrompt = state.users[userIndex].prompt;
  const tablesList = getTablesListFormatted(state, userIndex);
  const tableSampleDataLiat = getTablesSampleDataList(state, userIndex);
  const custom_prompt = state.dataSources[state.users[userIndex].dataSourceIndex].custom_prompt;
  let secondIntentContext = "";
  if (isSecondIntent) {
    secondIntentContext = `since previous intenet returned no records avoid joins with the table that returned no records.`;
  }

  const llmPrompt = `
    given the following tables list: \n
    ${tablesList} \n
    and the the following CSV exports 
    for each table with the columns and the first lines: \n
    ${tableSampleDataLiat} \n
    provide the SQL to get the information for the following prompt: \n
    ${userPrompt} \n
    Follow the next rules: \n 
    - If a user name is mentioned, use the first_name and last_name fields to get the user_id.\n
    - If no other order by is indicated then order by the result by name in ascending order.\n
    - Add all the required joins to get all the names of related tables.\n
    - Use lower case comparisson for every text field in the where clause.\n
    - IN the answer only provide the SQL statement for a postgresql db, and no other explanation or additional detail.\n
    - Avoid displaying the main entity id field in the select clause, unless the prompt explicitly asks for it.\n
    - Do not use any table not provided in the tables list.\n
    - Do not use any field not provided in the tables list.\n
    - For names use a 'like' operator with a wildcard at the end.\n
    - Unless more detail is specified, use no more than 5 columns.\n
    - Avoid the description field as much as possible.\n
    - Limit the company field to 30 characters.\n
    - Limit the title to 30 characters.\n
    - Do not use lower function for boolean fields.\n
    - If a sum is required, group by the rest of the fields.\n
    ${custom_prompt}	
    ${secondIntentContext}	
  `;
  return llmPrompt;
}

const getTablesSampleDataList = (state: KatsuState, userIndex: number): string => {
  const dataSourceIndex = state.users[userIndex].dataSourceIndex;
  const dataSource = state.dataSources[dataSourceIndex];

  let sampleDataList = "";
  dataSource.tablesSampleData.forEach(tableSampleData => {
    const tableCSV = convertResultToCSV(tableSampleData.result);
    sampleDataList += `${tableSampleData.tableName}\n`;
    sampleDataList += tableCSV;
    sampleDataList += "\n\n";
  });

  return sampleDataList;
}

const getTablesListFormatted = (state: KatsuState, userIndex: number): string => {
  const dataSourceIndex = state.users[userIndex].dataSourceIndex;
  const tablesList = getTablesList(state.dataSources[dataSourceIndex]);

  return tablesList.map(table => `|${table}|`).join("\n");
}

export { createQuestionPrompt };
