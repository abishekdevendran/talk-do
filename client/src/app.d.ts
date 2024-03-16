// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

const lucia = import('lucia');
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: lucia.User | null;
			session: lucia.Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
