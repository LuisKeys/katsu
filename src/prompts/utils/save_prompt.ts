import { DataSource, KatsuState, User } from "../../state/katsu_state";
import { Client } from "pg";
import { connectMetadataDB, execute, close } from "../../db/db_commands";

const savePrompt = async (userState: User, dataSources: DataSource[]): Promise<void> => {
  const rowsCount = userState.result.rows.length;
  if (rowsCount === 0) return;

  const encodedSql = Buffer.from(userState.sql).toString('base64');
  const dataSourceId = dataSources[userState.dataSourceIndex].dataSourceId;
  const insertSql = `
    INSERT INTO prompts_history
    (prompt, "sql", rows_count, date, "type", "user_id", data_source_id)
    VALUES(
    '${cleanPrompt(userState.prompt)}', 
    '${encodedSql}',
    ${rowsCount}, 
    ${Date.now()}, 
    '${userState.promptType}', 
    '${userState.userId}',
    '${dataSourceId}'
    );
  `;

  const client: Client | null = await connectMetadataDB();
  if (client !== null) {
    await execute(insertSql, client);
    await close(client);
  }
}

//TODO remove
// const savePromptOld = async (state: KatsuState, userIndex: number): Promise<void> => {
//   const prompt = state.users[userIndex].prompt;
//   const userId = state.users[userIndex].userId;
//   const dataSourceIndex = state.users[userIndex].dataSourceIndex;
//   const dataSourceId = state.dataSources[dataSourceIndex].dataSourceId;
//   const sql = state.users[userIndex].sql;
//   const promptType = state.users[userIndex].promptType;
//   const rowsCount = state.users[userIndex].result.rows.length;

//   if (rowsCount === 0) {
//     return;
//   }

//   const encodedSql = Buffer.from(sql).toString('base64');

//   const insertStatement = `
//   INSERT INTO prompts_history
//   (prompt, "sql", rows_count, date, "type", "user_id", data_source_id)
//   VALUES(
//     '${cleanPrompt(prompt)}', 
//     '${encodedSql}', 
//     ${rowsCount}, 
//     ${Date.now()}, 
//     '${promptType}', 
//     '${userId}',
//     '${dataSourceId}'
//     );
//     `;

//   const db = await openKDB();
//   await executeKDB(db, insertStatement);
//   await closeKDB(db);
// }

/**
 * Cleans the given prompt by replacing single quotes with double quotes,
 * removing all spaces, and converting it to lowercase.
 */
const cleanPrompt = (prompt: string): string => {
  let promptSafe = prompt.replace(/'/g, "''");
  // clean spaces
  promptSafe = promptSafe.replace(/\s/g, '');
  // remove special characters
  promptSafe = promptSafe.replace(/[^a-zA-Z0-9]/g, '');
  promptSafe = promptSafe.toLowerCase();

  return promptSafe;
}

export {
  savePrompt,
  cleanPrompt
};