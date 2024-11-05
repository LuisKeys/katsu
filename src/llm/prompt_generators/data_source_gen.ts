import { Datasource, User } from "../../state/katsu_state";

const createDatasourcePrompt = (userState: User, datasources: Datasource[]): string => {
  const csvList = convertToCSV(datasources);

  let prompt = `Define the datasource within the following list 
  for the following prompt:
  Prompt: "${userState.prompt}"
  and the following user profile:
  User profile:
  - department: ${userState.department}
  - role: ${userState.role}
  - title: ${userState.title}
  Data Sources:
  List: ${csvList}
  Only provide the name of the data source.
  `;

  return prompt;
}

const convertToCSV = (dataSources: Datasource[]): string => {
  const header = "name,description";
  const rows = dataSources.map(dataSource => `${dataSource.datasourceName},${dataSource.description.replace(/"/g, '""')}`);
  return [header, ...rows].join("\n");
}

export { createDatasourcePrompt };