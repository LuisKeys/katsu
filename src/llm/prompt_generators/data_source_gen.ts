import { DataSource, KatsuState } from "../../state/katsu_state";

const createDataSourcePrompt = (state: KatsuState, userId: number): string => {
  const csvList = convertToCSV(state.dataSources);
  const user = state.users[userId];

  let prompt = `Define the datasource within the following list 
  for the following prompt:
  Prompt: "${state.users[userId].prompt}"
  and the following user profile:
  User profile:
  - department: ${user.department}
  - role: ${user.role}
  - title: ${user.title}
  Data Sources:
  List: ${csvList}
  Only provide the name of the data source.
  `;

  return prompt;
}

const convertToCSV = (dataSources: DataSource[]): string => {
  const header = "name,description";
  const rows = dataSources.map(dataSource => `${dataSource.datasource_name},${dataSource.description.replace(/"/g, '""')}`);
  return [header, ...rows].join("\n");
}

export { createDataSourcePrompt };