import { Client } from 'pg';
import { connectMetadataDB, close, execute, connectDatasource } from './db/db_commands';

const checkTablesAuthorized = async function (userId: number, internalPrompt: string): Promise<string | null> {
  if (!isUserAuthorized(userId, internalPrompt)) {
    return 'You are not authorized to access this data.\nIf this is an error, please contact your administrator.';
  }
  return null;
}

const isUserAuthorized = async function (userId: number, internalPrompt: string): Promise<boolean> {
  internalPrompt = 'SELECT * FROM db.table'; //TODO remove
  const internalPromptTables = await getInternalPromptTables(internalPrompt);
  const userAuthorizedTables = await getUserAuthorizedTables(userId);
  return true; //TODO
  // return internalPromptTables.every(table => userAuthorizedTables.includes(table));
}

const getInternalPromptTables = async function (internalPrompt: string): Promise<string[]> {
  return ['crm.contacts', 'crm.accounts'];
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
  const authorizedTables: [string, string][] = result.rows.map((row: any) => [row.datasource_name, row.table]);
  return authorizedTables;
}

export {
  checkTablesAuthorized,
  getUserAuthorizedTables
}