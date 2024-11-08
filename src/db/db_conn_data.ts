interface DbConnData {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  isSSL: boolean;
}

export { DbConnData };