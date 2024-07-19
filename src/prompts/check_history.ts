import { QueryResult } from "pg";
import { connect, close, execute } from "../db/db_commands";
import { cleanPrompt } from "./save_prompt";
import { convSqlResToResultObject, ResultObject } from "../result/result_object";

const checkPrompt = async (prompt: string): Promise<string | null> => {
  const promptSafe = cleanPrompt(prompt);
  let sql = `select sql from v_prompts_history where prompt_cmp = '${promptSafe}' `;
  sql += `and rows_count > 0 `;
  sql += `and created_date >= current_date - interval '20' day `;
  sql += `order by created_date desc `;
  sql += `limit 1 `;

  await connect();
  const sqlRes: QueryResult | null = await execute(sql);
  await close();

  if (sqlRes && sqlRes.rows.length === 0) {
    return null;
  } else if (sqlRes) {
    return sqlRes.rows[0].sql;
  } else {
    return null;
  }
};

const listHistory = async (result: ResultObject): Promise<ResultObject | null> => {
  let sql = `SELECT prompt as "My most used prompts" FROM (`;
  sql += `SELECT prompt, COUNT(*) AS prompt_count `;
  sql += `FROM prompts_history `;
  sql += `WHERE userid = ${result.userId} `;
  sql += `GROUP BY prompt `;
  sql += `ORDER BY prompt_count desc `;
  sql += `limit 20) t; `;

  await connect();
  const sqlRes: QueryResult | null = await execute(sql);
  await close();

  result = convSqlResToResultObject(sqlRes, result);

  return result;
};

export {
  checkPrompt,
  listHistory
};
