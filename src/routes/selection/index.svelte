<script>
	import {
		categories,
		selectedCategory,
		playlists,
		selectedPlaylistId,
		fetchCategories,
		getPlaylistsByCategory,
		getGameForPlaylistId
	} from '../../stores/spotifyStore.js';
	import Category from '../../components/Category.svelte';
	import Playlist from '../../components/Playlist.svelte';
	import Playing from '../../components/Playing.svelte';
	import { onMount } from 'svelte';

	onMount(() => fetchCategories());

	$: console.log($categories);
	$: console.log($selectedCategory);
	$: console.log($selectedPlaylistId);
	$: console.log($playlists);

	function resetSelectedCategory() {
    	selectedCategory.set(null);
	};
</script>

{#if $categories && $selectedCategory === null}
	<h1>Select the Categories</h1>
	<br>
{:else}
<div>
	<h1>Select the Playlist (only one) </h1>
	<button on:click={resetSelectedCategory}> Reset selected category</button>
	<br>
</div>
{/if}
<main>
	<div class="grid grid-cols-4 gap-4">
		{#if $categories && $selectedCategory === null}
			{#each $categories as category}
				<div on:click={() => getPlaylistsByCategory(category)}>
					<Category {category} />
				</div>
			{/each}
		{:else if $selectedCategory}
			{#each $playlists as playlist}
				<div on:click={() => getGameForPlaylistId(playlist.id)}>
					<Playlist {playlist} />
				</div>
			{/each}
		{:else if $selectedPlaylistId !== null}
			<Playing></Playing>
		{:else}
			<p>loading...</p>
		{/if}
	</div>
</main>
