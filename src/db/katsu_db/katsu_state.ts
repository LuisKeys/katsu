import { OpenAI } from 'openai';
import { ResultObject } from '../../result/result_object';

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
  result: ResultObject;
  role: string;
  title: string;
  userId: number;
}

interface DataSource {
  sourceId: number;
  name: string;
  description: string;
  type: string;
  host: string;
  user: string;
  password: string;
  port: number;
  db: string;
  tables: string;
}

interface KatsuState {
  users: User[];
  dataSources: DataSource[];
  openai: OpenAI;
  isDebug: boolean;
}

export { User, DataSource, KatsuState };