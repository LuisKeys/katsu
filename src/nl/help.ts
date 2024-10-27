import { DataSource } from "../state/katsu_state";
import { Client } from 'pg';
import { execute } from "../db/db_commands";

const getHelp = async (client: Client, dataSource: DataSource): Promise<string[]> => {
  const sql = `SELECT sample_prompt FROM help WHERE data_source = '${dataSource.name}' ORDER BY sample_prompt asc`;
  const result = await execute(sql, client);
  return result === null ? [] : result.rows.map(prompt => prompt.sample_prompt);
}

export { getHelp };
