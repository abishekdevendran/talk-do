<script lang="ts">
	import TodoList from '$lib/components/TodoList.svelte';
	import { enhance } from '$app/forms';
	export let data;
</script>

<h1>Talk-do</h1>
<form method="post" use:enhance>
	Welcome back, {data.username}!
	<button>Sign out</button>
</form>
<div>
	<TodoList />
</div>
