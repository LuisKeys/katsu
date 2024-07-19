interface User {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
  department: string;
  avatar: string;
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
  tables: string[];
}

interface KatsuState {
  users: User[];
  dataSources: DataSource[];
}

export { User, DataSource, KatsuState };