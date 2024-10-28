import { Client } from "pg";
import { KatsuState } from "../state/katsu_state";
import { close, connectDatasourceRows, execute, getError } from "../db/db_commands";
import { getLastPage } from "../prompts/handlers/page_calc";

const getResult = async (state: KatsuState, userIndex: number): Promise<void> => {
  const userState = state.users[userIndex];
  const dataSource = state.dataSources[userState.dataSourceIndex];
  const client: Client | null = await connectDatasourceRows(dataSource);
  if (client === null) return;

  const result = await execute(userState.sql, client);
  close(client);
  userState.sqlError = getError();

  const userResult = userState.result;
  userResult.rows = [];
  if (result !== null) {
    for (const row of result.rows) {
      const resultRow = [];
      for (const field of result.fields) {
        let fieldValue = row[field.name];
        if (fieldValue instanceof Date) {
          fieldValue = fieldValue.toISOString();
        } else if (typeof fieldValue === 'number' && Number.isFinite(fieldValue)) {
          fieldValue = fieldValue.toFixed(2);
        }
        resultRow.push(fieldValue);
      }
      userResult.rows.push(resultRow);
    }

    userResult.fields = result.fields.map(field => field.name);
    userResult.pageNum = 1;
    userResult.lastPage = getLastPage(userResult);
  } else {
    userResult.rows = [];
    userResult.fields = [];
    userResult.pageNum = 0;
    userResult.lastPage = 0;
    userResult.text = "No results found.";
  }
}

// TODO delete
// const getResultOld = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
//   const dataSourceIndex = state.users[userIndex].dataSourceIndex;
//   const dataSource = state.dataSources[dataSourceIndex];
//   const dbConnData: DbConnData = {
//     user: dataSource.user,
//     host: dataSource.host,
//     database: dataSource.db,
//     password: dataSource.password,
//     port: dataSource.port,
//     isSSL: dataSource.isSSL
//   };
//   const client: Client | null = await connect(dbConnData);
//   if (client === null) return state;

//   const sql = state.users[userIndex].sql;
//   const result = await execute(sql, client);
//   state.users[userIndex].sqlError = getError();

//   let userResult = state.users[userIndex].result;
//   userResult.rows = [];
//   if (result !== null) {
//     for (let i = 0; i < result.rows.length; i++) {
//       const row = result.rows[i];
//       let resultRow = [];
//       for (let j = 0; j < result.fields.length; j++) {
//         const field = result.fields[j];
//         if (row[field.name] instanceof Date) {
//           row[field.name] = row[field.name].toISOString();
//         }
//         if (typeof row[field.name] === 'number' && Number.isFinite(row[field.name])) {
//           row[field.name] = row[field.name].toFixed(2);
//         }
//         resultRow.push(row[field.name]);
//       }
//       userResult.rows.push(resultRow);
//     }

//     const fieldNamesList = result.fields.map(field => field.name);
//     userResult.fields = fieldNamesList;
//     userResult.pageNum = 1;
//     userResult.lastPage = getLastPage(userResult);
//   } else {
//     userResult.rows = [];
//     userResult.fields = [];
//     userResult.pageNum = 0;
//     userResult.lastPage = 0;
//     userResult.text = "No results found.";
//   }

//   state.users[userIndex].result = userResult;

//   close(client);

//   return state;
// }

export { getResult };