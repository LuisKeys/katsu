import { Client, ClientConfig } from "pg";
import { KatsuState } from "../state/katsu_state";
import { close, connect, execute } from "../db/db_commands";
import { DbConnData } from "../db/db_conn_data";
import { getLastPage } from "../prompts/handlers/page_calc";

const getResult = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  const dataSourceIndex = state.users[userIndex].dataSourceIndex;
  const dataSource = state.dataSources[dataSourceIndex];
  const dbConnData: DbConnData = {
    user: dataSource.user,
    host: dataSource.host,
    database: dataSource.db,
    password: dataSource.password,
    port: dataSource.port
  };
  const client: Client | null = await connect(dbConnData);
  if (client === null) {
    return state;
  }

  const sql = state.users[userIndex].sql;

  const result = await execute(sql, client);

  let userResult = state.users[userIndex].result;
  if (result !== null) {
    userResult.rows = result.rows;
    const fieldNamesList = result.fields.map(field => field.name);
    userResult.fields = fieldNamesList;
    userResult.pageNum = 1;
    userResult.lastPage = getLastPage(userResult);
  } else {
    userResult.rows = [];
    userResult.fields = [];
    userResult.text = "No results found.";
  }

  state.users[userIndex].result = userResult;

  close(client);

  return state;
}

export { getResult };