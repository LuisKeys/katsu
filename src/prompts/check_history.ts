import { QueryResult } from "pg";
import { connect, close, execute } from "../db/db_commands";
import { cleanPrompt } from "./save_prompt";
import { convSqlResToResultObject, ResultObject } from "../result/result_object";
import { KatsuState } from "../state/katsu_state";

const checkPrompt = async (state: KatsuState, userIndex: number): Promise<KatsuState> => {
  /*
  const promptSafe = cleanPrompt(prompt);
  let sql = `select sql from v_prompts_history where prompt_cmp = '${promptSafe}' `;
  sql += `and rows_count > 0 `;
  sql += `and created_date >= current_date - interval '20' day `;
  sql += `order by created_date desc `;
  sql += `limit 1 `;

  const client = await connect();
  if (client === null) {
    return null;
  }

  const sqlRes: QueryResult | null = await execute(sql, client);
  await close(client);

  if (sqlRes && sqlRes.rows.length === 0) {
    return null;
  } else if (sqlRes) {
    return sqlRes.rows[0].sql;
  } else {
    return null;
  }
  */
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
