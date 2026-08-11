import pg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import envConfig from '../config/env-config';
import { pool } from './db-client';
import type { Recipe, CreateRecipeRequest } from '../models/recipe';

export async function initializeDatabase(): Promise<void> {
  // Step 1: Create the database if it doesn't exist (must connect to 'postgres' default DB)
  const adminClient = new pg.Client({
    host: envConfig.db_host,
    port: envConfig.db_port,
    user: envConfig.db_user,
    password: envConfig.db_password,
    database: 'postgres', // Connect to the default database to create the target database
  });

  await adminClient.connect();
  try {
    const result = await adminClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [envConfig.db_database]
    );
    if (result.rowCount === 0) {
      // Database name comes from config, not user input — safe to interpolate
      console.log(`Database "${envConfig.db_database}" does not exist. Creating...`);
      await adminClient.query(`CREATE DATABASE "${envConfig.db_database}"`);
    }
  } finally {
    console.log('Closing admin client connection...');
    await adminClient.end();
  }

  // Step 2: Create the recipes table in the target database
  console.log(`Connecting to database "${envConfig.db_database}" to create the recipes table...`);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipes (
      id          UUID        PRIMARY KEY,
      name        TEXT        NOT NULL,
      ingredients TEXT[]      NOT NULL
    )
  `);
}

export async function insertRecipe(request: CreateRecipeRequest): Promise<Recipe> {
  const id = uuidv4();
  const { rows } = await pool.query<Recipe>(
    `INSERT INTO recipes (id, name, ingredients)
     VALUES ($1, $2, $3)
     RETURNING id, name, ingredients`,
    [id, request.name, request.ingredients]
  );
  return rows[0];
}
