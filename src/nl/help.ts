import { DataSource } from "../state/katsu_state";
import { Client } from 'pg';
import { connectMetadataDB, execute, close } from "../db/db_commands";

const getHelp = async (dataSource: DataSource): Promise<string[]> => {
  const client: Client | null = await connectMetadataDB();
  if (client === null) return [];

  const sql = `SELECT sample_prompt FROM help WHERE data_source = '${dataSource.datasourceId}' ORDER BY sample_prompt asc`;
  const result = await execute(sql, client);
  await close(client);
  return result === null ? [] : result.rows.map(prompt => prompt.sample_prompt);
}

export { getHelp };
