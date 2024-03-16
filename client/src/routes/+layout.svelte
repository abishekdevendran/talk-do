<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
</script>

<ModeWatcher />
<ThemeSwitcher />
<slot />
