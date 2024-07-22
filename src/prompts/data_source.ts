import { DataSource, KatsuState } from "../state/katsu_state";
import { ask } from "../openai/openai_api";

const getDataSource = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  if (state.dataSources.length === 1) {
    state.users[userIndex].dataSourceIndex = 0;
    return state;
  } else {
    let context = createDataSourcePrompt(state, userIndex);
    state.users[userIndex].context = context;
    const response = await ask(state, userIndex);
    state.users[userIndex].dataSourceIndex = state.dataSources.findIndex(dataSource => dataSource.name === response);
    return state;
  }
}

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
  const rows = dataSources.map(dataSource => `${dataSource.name},${dataSource.description.replace(/"/g, '""')}`);
  return [header, ...rows].join("\n");
}

export { getDataSource };