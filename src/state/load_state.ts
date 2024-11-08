import OpenAI from 'openai';
import { Client, QueryResultRow } from 'pg';
import { User, Datasource, KatsuState, TableSampleData } from './katsu_state';
import { connectMetadataDB, close, execute, connectDatasource } from '../db/db_commands';
import { getHelp } from '../nl/help';
import { UserResult } from '../result/result_object';

const loadKatsuState = async (openai: OpenAI): Promise<KatsuState> => {
  const client: Client | null = await connectMetadataDB();
  if (client === null) throw new Error("Failed to connect to metadata DB.");

  const users: User[] = await getUsers(client);
  const dataSources: Datasource[] = await getDataSources(client);

  await close(client);
  console.log('Loaded Katsu state.');
  return { users, datasources: dataSources, openai: openai, isDebug: false, showWordsCount: false };
}

const getUsers = async (client: Client): Promise<User[]> => {
  const sql = `
    SELECT user_id AS "userId", email, first_name AS "firstName", last_name AS "lastName", 
    role, title, department, avatar, password
    FROM users
  `;

  const result = await execute(sql, client);
  if (!result?.rows) return [];
  return result.rows.map(convertDBRowToUser);

  function convertDBRowToUser(row: any): User {
    const result: UserResult = {
      fields: [],
      fileURL: '',
      lastPage: 0,
      pageNum: 0,
      prompt: '',
      promptType: '',
      rows: [],
      sql: '',
      text: '',
      notAuthorized: false
    };

    const user: User = {
      avatar: row.avatar,
      context: '',
      department: row.department,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      password: row.password,
      prompt: '',
      result: result,
      role: row.role,
      title: row.title,
      dataSourceIndex: 0,
      promptType: '',
      sql: '',
      userId: row.userId,
      isCached: false,
      sqlError: ''
    };
    return user;
  }
};

const getDataSources = async (client: Client): Promise<Datasource[]> => {
  const sql = `SELECT datasource_id AS "sourceId", datasource_name as "datasourceName",
  description, type, host, user, password, port, db, custom_prompt, is_ssl,  
  (SELECT array_agg("table") FROM datasources_tables dt WHERE dt.datasource_name = d.datasource_name) AS tables
  FROM datasources d WHERE is_enabled ORDER BY datasource_name`;

  const result = await execute(sql, client);
  if (result === null) return [];

  const dataSources: Datasource[] = [];
  for (const row of result.rows) {
    const dataSource = convertDBRowTODataSource(row);
    dataSource.helpList = await getHelp(client, dataSource);
    dataSource.tablesSampleData = await getTablesSampleData(dataSource);
    dataSources.push(dataSource);
  }
  return dataSources;
}

async function getTablesSampleData(datasource: Datasource): Promise<TableSampleData[]> {
  const tablesSampleData: TableSampleData[] = [];
  const client: Client | null = await connectDatasource(datasource);

  if (client !== null) {
    for (const table of datasource.tables) {
      const sql = `SELECT * FROM ${table} LIMIT 3`;
      const result = await execute(sql, client);
      if (result !== null) {
        let tableSampleData: TableSampleData = {
          tableName: table,
          result: result
        };
        tablesSampleData.push(tableSampleData);
      }
    }
    close(client);
  }
  return tablesSampleData;
}

function convertDBRowTODataSource(row: QueryResultRow): Datasource {
  return {
    sourceId: row.sourceId,
    datasourceName: row.datasourceName,
    description: row.description,
    type: row.type,
    host: row.host,
    user: row.user,
    password: row.password,
    port: row.port,
    db: row.db,
    tables: (row.tables as string[]) || [],
    tablesSampleData: [],
    custom_prompt: row.custom_prompt,
    helpList: [],
    isSSL: row.type === 'postgresql' && row.is_ssl === 1,
    dataSourceId: row.sourceId
  };
}

export {
  loadKatsuState,
};