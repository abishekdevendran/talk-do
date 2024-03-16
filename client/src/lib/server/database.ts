import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { DATABASE_URL } from '$env/static/private';

export const pool = new pg.Pool({
  connectionString: DATABASE_URL
});
export const db = drizzle(pool, { schema });
