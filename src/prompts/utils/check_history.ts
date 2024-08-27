import { KatsuState } from "../../state/katsu_state";
import { cleanPrompt } from "./save_prompt";
import { closeKDB, db_allKDB, executeKDB, openKDB } from '../../db/katsu_db/katsu_db';
import { exec } from "child_process";

const checkPrompt = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  const prompt = state.users[userIndex].prompt;
  const userId = state.users[userIndex].userId;
  const promptSafe = cleanPrompt(prompt);

  const isCleanCache = process.env.CLEAN_PROMPTS_CACHE === 'true';

  const db = await openKDB();

  if (isCleanCache) {
    const delSQL = `DELETE FROM prompts_history`;
    await executeKDB(db, delSQL);
  }

  const sql = `SELECT prompt_id, prompt, "sql", 
  rows_count, date, "type", user_id, data_source_id  
  FROM prompts_history 
  WHERE prompt = '${promptSafe}' 
  AND user_id = ${userId}
  LIMIT 1`

  const rows = await db_allKDB(db, sql);
  await closeKDB(db);
  state.users[userIndex].isCached = false;
  if (rows.length > 0) {
    const dataSourceId = rows[0].data_source_id;
    for (let i = 0; i < state.dataSources.length; i++) {
      if (state.dataSources[i].dataSourceId === dataSourceId) {
        state.users[userIndex].dataSourceIndex = i;
        break;
      }
    }

    const encodedSql = rows[0].sql;
    const decodedSql = Buffer.from(encodedSql, 'base64').toString('utf-8');
    state.users[userIndex].sql = decodedSql;
    state.users[userIndex].promptType = rows[0].type;
    state.users[userIndex].isCached = true;
  }

  return state;
};

const listHistory = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  /*
  let sql = `SELECT prompt as "My most used prompts" FROM (`;
  sql += `SELECT prompt, COUNT(*) AS prompt_count `;
  sql += `FROM prompts_history `;
  sql += `WHERE userid = ${result.user?.userId} `;
  sql += `GROUP BY prompt `;
  sql += `ORDER BY prompt_count desc `;
  sql += `limit 20) t; `;

  const client = await connect();
  if (client === null) {
    return null;
  }
  const sqlRes: QueryResult | null = await execute(sql, client);
  await close(client);

  result = convSqlResToResultObject(sqlRes, result);
  */

  return state;
};

export {
  checkPrompt,
  listHistory
};
