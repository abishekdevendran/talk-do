import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/database';

export const load = async (event) => {
	const temp = await db.query.userTable.findMany();
	console.log(temp);
	if (event.locals.user) redirect(302, '/');
};
