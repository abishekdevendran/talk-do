// src/lib/server/auth.ts
import { Lucia } from 'lucia';
import { dev } from '$app/environment';
import * as schema from './schema';
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { GitHub } from 'arctic';
import { drizzle } from 'drizzle-orm/node-postgres';
import { pool } from './database';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';

const db = drizzle(pool);
const adapter = new DrizzlePostgreSQLAdapter(db, schema.sessionTable, schema.userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.github_id,
			username: attributes.username
		};
	}
});

export const github = new GitHub(
	GITHUB_CLIENT_ID,
	GITHUB_CLIENT_SECRET
);

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	github_id: number;
	username: string;
}
