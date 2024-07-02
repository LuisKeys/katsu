import { connect, close, execute } from "../db/db_commands";
import { cleanPrompt } from "./save_prompt";

const checkPrompt = async (prompt: string): Promise<string | null> => {
  const promptSafe = cleanPrompt(prompt);
  let sql = `select sql from v_prompts_history where prompt_cmp = '${promptSafe}' `;
  sql += `and rows_count > 0 `;
  sql += `and created_date >= current_date - interval '20' day `;
  sql += `order by created_date desc `;
  sql += `limit 1 `;

  await connect();
  const result = await execute(sql);
  await close();

  if (result.rows.length === 0) {
    return null;
  } else {
    return result.rows[0].sql;
  }
};

const listHistory = async (memberId: number): Promise<any> => {
  let sql = `SELECT prompt as "My most used prompts" FROM (`;
  sql += `SELECT prompt, COUNT(*) AS prompt_count `;
  sql += `FROM prompts_history `;
  sql += `WHERE userid = ${memberId} `;
  sql += `GROUP BY prompt `;
  sql += `ORDER BY prompt_count desc `;
  sql += `limit 20) t; `;

  await connect();
  const result = await execute(sql);
  await close();

  return result;
};

export {
  checkPrompt,
  listHistory
};
