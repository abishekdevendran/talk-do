import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const client = new pg.Client({
	connectionString: process.env.DATABASE_URL
});
await client.connect();
const db = drizzle(client);
await migrate(db, { migrationsFolder: 'drizzle' });
await client.end();
console.log('Migrated successfully 🎉');
