import { Client } from 'pg';
import { connectMetadataDB, close, execute, connectDatasource } from './db/db_commands';
import { KatsuState } from './state/katsu_state';
import { askAI } from './llm/openai/openai_api';

const isSqlAuthorized = async (sql: string, userId: number, datasourceName: string, state: KatsuState): Promise<boolean> => {
  const tables = await getDatasourceUserAuthorizedTables(userId, datasourceName);
  if (tables === '') return false;

  const checkAuthPrompt = `Check if the SQL tables ${tables} are in the following query, and respond only with "yes" or "no".
  Query:
  ${sql}`;

  const aiResult = await askAI(state, checkAuthPrompt);
  return aiResult === 'yes';
}

const getDatasourceUserAuthorizedTables = async function (userId: number, datasourceName: string): Promise<string> {
  const client: Client | null = await connectMetadataDB();
  if (!client) return '';

  const sql = `SELECT DISTINCT "table" FROM datasources_tables dt
  JOIN sec_roles_datasources_tables rdt ON dt.datasource_table_id = rdt.datasource_table_id
  JOIN (
    SELECT role_id FROM sec_groups_roles gr
    JOIN sec_users_groups ug ON gr.group_id = ug.group_id WHERE user_id = ${userId}
    UNION
    SELECT role_id FROM sec_users_roles WHERE user_id = ${userId}
    ) AS user_roles ON rdt.role_id = user_roles.role_id
    WHERE datasource_name = '${datasourceName}'
    ORDER BY 1`;

  const result = await execute(sql, client);
  await close(client);

  if (!result?.rows) return '';
  const tables: string = result.rows.map((row: any) => row.table).join(', ');
  return tables;
}

const getUserAuthorizedTables = async function (userId: number): Promise<[string, string][]> {
  const client: Client | null = await connectMetadataDB();
  if (!client) return [];

  const sql = `SELECT DISTINCT datasource_name, "table" FROM datasources_tables dt
  JOIN sec_roles_datasources_tables rdt ON dt.datasource_table_id = rdt.datasource_table_id
  JOIN (
    SELECT role_id FROM sec_groups_roles gr
    JOIN sec_users_groups ug ON gr.group_id = ug.group_id WHERE user_id = ${userId}
    UNION
    SELECT role_id FROM sec_users_roles WHERE user_id = ${userId}
    ) AS user_roles ON rdt.role_id = user_roles.role_id
    ORDER BY 1, 2`;

  console.log(sql);

  const result = await execute(sql, client);
  await close(client);

  if (!result?.rows) return [];
  const tables: [string, string][] = result.rows.map((row: any) => [row.datasource_name, row.table]);
  return tables;
}

export {
  isSqlAuthorized,
  getUserAuthorizedTables
}