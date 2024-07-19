import { OpenAI } from 'openai';
import { ResultObject } from '../../result/result_object';

interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
  department: string;
  avatar: string;
  password: string;
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
  openai: OpenAI | null;
  results: ResultObject[];
  prompt: string;
  user: User | null;
  isDebug: boolean;
}

export { User, DataSource, KatsuState };