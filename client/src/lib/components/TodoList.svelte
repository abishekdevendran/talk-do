<script lang="ts">
	let newItem = '';

	let todoList = [
		{ text: 'Write my first post', status: true },
		{ text: 'Upload the post to the blog', status: false },
		{ text: 'Publish the post at Facebook', status: false }
	];

	function addToList() {
		todoList = [...todoList, { text: newItem, status: false }];
		newItem = '';
	}

	function removeFromList(index: number) {
		todoList.splice(index, 1);
		todoList = todoList;
	}
</script>

<input bind:value={newItem} type="text" placeholder="new todo item.." />
<button on:click={addToList}>Add</button>

<br />
{#each todoList as item, index}
	<input bind:checked={item.status} type="checkbox" />
	<span class:checked={item.status}>{item.text}</span>
	<button on:click={() => removeFromList(index)}>❌</button>
	<br />
{/each}

<style>
	.checked {
		text-decoration: line-through;
	}
</style>
