import { OpenAI } from 'openai';
import { UserResult } from '../result/result_object';
import { QueryResult } from 'pg';

interface User {
  avatar: string;
  context: string;
  dataSourceIndex: number;
  department: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  prompt: string;
  promptType: string;
  result: UserResult;
  role: string;
  sql: string;
  title: string;
  userId: number;
  isCached: boolean;
  sqlError: string;
}

interface TableSampleData {
  tableName: string;
  result: QueryResult;
}

interface Datasource {
  sourceId: number;
  datasourceName: string;
  description: string;
  type: string;
  host: string;
  user: string;
  password: string;
  port: number;
  db: string;
  tables: string[];
  tablesSampleData: TableSampleData[];
  custom_prompt: string;
  helpList: string[];
  isSSL: boolean;
  dataSourceId: number;
}

interface KatsuState {
  users: User[];
  datasources: Datasource[];
  openai: OpenAI;
  isDebug: boolean;
  showWordsCount: boolean;
}

export { User, Datasource, KatsuState, TableSampleData };