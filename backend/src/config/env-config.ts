import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production' && process.env.DISABLE_DOTENV !== 'true') {
	dotenv.config();
}

const dbPortRaw = process.env.DB_PORT;
const dbPort = dbPortRaw ? Number.parseInt(dbPortRaw, 10) : 5432;

export default {
	node_env_isproduction: process.env.NODE_ENV === 'production',
	port: process.env.PORT ?? '3000',
	enable_swagger: process.env.ENABLE_SWAGGER === 'true',
	db_host: process.env.DB_HOST ?? 'localhost',
	db_port: Number.isNaN(dbPort) ? 5432 : dbPort,
	db_user: process.env.DB_USER ?? 'postgres',
	db_password: process.env.DB_PASSWORD ?? 'postgres',
	db_database: process.env.DB_DATABASE ?? 'recipe'
};