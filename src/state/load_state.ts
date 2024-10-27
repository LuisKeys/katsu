import OpenAI from 'openai';
import { Client, QueryResultRow } from 'pg';
import { ResultObject } from '../result/result_object';
import { User, DataSource, KatsuState, TableSampleData } from './katsu_state';
import { connectMetadataDB, close, execute, connect } from '../db/db_commands';
import { getHelp } from '../nl/help';

const loadKatsuState = async (openai: OpenAI): Promise<KatsuState> => {
  const client: Client | null = await connectMetadataDB();
  if (client === null) throw new Error("Failed to connect to metadata DB.");

  const users: User[] = await getUsers(client);
  const dataSources: DataSource[] = await getDataSources(client);

  await close(client);
  console.log('Loaded Katsu state.');
  return { users, dataSources, openai: openai, isDebug: false, showWordsCount: false };
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
    const result: ResultObject = {
      fields: [],
      fileURL: '',
      lastPage: 0,
      pageNum: 0,
      prompt: '',
      promptType: '',
      rows: [],
      sql: '',
      text: '',
      noDataFound: false
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

const getDataSources = async (client: Client): Promise<DataSource[]> => {
  const sql = `SELECT source_id AS "sourceId", name, description, type, host, user, password, port, db, tables, custom_prompt, is_ssl,  
  (SELECT array_agg("table") FROM datasources_tables WHERE datasource_name = name) AS tables
  FROM datasources WHERE is_enabled ORDER BY name`;

  const result = await execute(sql, client);
  if (result === null) return [];

  const dataSources: DataSource[] = [];
  for (const row of result.rows) {
    const dataSource = convertDBRowTODataSource(row);
    dataSource.helpList = await getHelp(client, dataSource);
    dataSource.tablesSampleData = await getTablesSampleData(dataSource);
    dataSources.push(dataSource);
  }
  return dataSources;

  async function getTablesSampleData(datasource: DataSource): Promise<TableSampleData[]> {
    const tablesSampleData: TableSampleData[] = [];
    const dbConnData = {
      user: datasource.user,
      host: datasource.host,
      database: datasource.db,
      password: datasource.password,
      port: datasource.port,
      isSSL: datasource.type === 'postgresql' && datasource.isSSL
    };

    const client: Client | null = await connect(dbConnData);
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

  function convertDBRowTODataSource(row: QueryResultRow): DataSource {
    return {
      sourceId: row.sourceId,
      name: row.name,
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
}

export {
  loadKatsuState,
};