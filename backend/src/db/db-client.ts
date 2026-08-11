import pg from 'pg';
import envConfig from '../config/env-config';

export const pool = new pg.Pool({
  host: envConfig.db_host,
  port: envConfig.db_port,
  user: envConfig.db_user,
  password: envConfig.db_password,
  database: envConfig.db_database,
});
