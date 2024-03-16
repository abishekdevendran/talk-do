// routes/login/github/callback/+server.ts
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { github, lucia } from '$lib/server/auth';

import type { RequestEvent } from '@sveltejs/kit';
import { userTable } from '$lib/server/schema';
import { db } from '$lib/server/database';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		console.error('Failing step 1');
		console.error('code:', code);
		console.error('state:', state);
		console.error('storedState:', storedState);
		return new Response(null, {
			status: 400
		});
	}
	console.error('Passing step 1');

	try {
		const tokens = await github.validateAuthorizationCode(code);
		console.error('Passing step 2');
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		console.error('Passing step 3');
		const githubUser: GitHubUser = await githubUserResponse.json();

		// Replace this with your own DB client.
		// const existingUser = await db.table('user').where('github_id', '=', githubUser.id).get();
		const existingUser = await db.query.userTable.findFirst({
			where: (users, { eq }) => eq(users.github_id, githubUser.id)
		});
		console.error('Passing step 4');

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			// Replace this with your own DB client.
			// await db.table('user').insert({
			// 	id: userId,
			// 	github_id: githubUser.id,
			// 	username: githubUser.login
			// });

			await db.insert(userTable).values({
				id: userId,
				github_id: githubUser.id,
				username: githubUser.login
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
}
