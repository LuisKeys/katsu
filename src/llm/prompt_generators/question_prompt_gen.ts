import { KatsuState } from "../../state/katsu_state";
import { getTablesList } from "../../state/load_state";
import { convertResultToCSV } from "../../result/result_to_csv";

const createQuestionPrompt = (state: KatsuState, userIndex: number): string => {
  const userPrompt = state.users[userIndex].prompt;
  const tablesList = getTablesListFormatted(state, userIndex);
  const tableSampleDataLiat = getTablesSampleDataList(state, userIndex);
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
    - Avoid adding contacts to opportunities, unless the prompt explicitly asks for it\n
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
