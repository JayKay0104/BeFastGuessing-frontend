<script>
	import {
		categories,
		selectedCategory,
		playlists,
		selectedPlaylist,
		fetchCategories,
		getPlaylistsByCategory,
		getGameForPlaylistId,
		currentRound,
		currentSample,
		currentSelectedSong,
		game,
		currentRoundName,
		started,
		finished,
		madeGuess,
		resultArray
	} from '../../stores/spotifyStore.js';
	import Category from '../../components/Category.svelte';
	import Playlist from '../../components/Playlist.svelte';
	import StartGame from '../../components/StartGame.svelte';
	import Playing from '../../components/Playing.svelte';
	import Result from '../../components/Result.svelte';
	import { onMount } from 'svelte';

	onMount(() => fetchCategories());

	$: console.log($categories);
	$: console.log('selected Category:' + $selectedCategory);
	$: console.log($selectedPlaylist);
	$: console.log($playlists);
	$: console.log('Current Sample:' + $currentSample);
	$: console.log($currentSample);
	$: console.log($currentSelectedSong);
	$: console.log($game);
	$: console.log('Current Round ' + $currentRoundName);
	$: console.log($currentRoundName);
	$: console.log('started: ' + $started);
	$: console.log($currentRound);
	$: console.log('finished:' + $finished);

	function resetSelection() {
		selectedCategory.set(null);
		selectedPlaylist.set(null);
	}

	function stopGame() {
		resetSelection();
		started.set(false);
		currentRound.set(1);

		$resultArray = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];
		madeGuess.set(false);
	}
</script>

{#if $categories && $selectedCategory === null}
	<h1>Select the Categories</h1>
	<br />
{:else if $selectedCategory != null && $started === false}
	<div>
		<h1>Select the Playlist</h1>
		<button on:click={resetSelection}> Reset selected category and playlist</button>
		<br />
	</div>
{:else if $started}
	<div>
		<h1>Playing</h1>
		<button on:click={stopGame}> Stop the game</button>
		<br />
	</div>
{/if}
<main>
	<div class="grid grid-cols-4 gap-4 ml-10">
		{#if $categories && $selectedCategory === null}
			{#each $categories as category}
				<div on:click={() => getPlaylistsByCategory(category)}>
					<Category {category} />
				</div>
			{/each}
		{:else if $selectedCategory && $selectedPlaylist === null}
			{#each $playlists as playlist}
				<div on:click={() => getGameForPlaylistId(playlist)}>
					<Playlist {playlist} />
				</div>
			{/each}
		{:else if $selectedPlaylist !== null && $game !== null && $started === false}
			<StartGame />
		{:else if $started && $finished === false}
			<Playing
				sample={$currentSample}
				selectedSong={$currentSelectedSong}
				round={$currentRound}
				playerID={1}
			/>
		{:else if $started === true && $finished === true}
			<p>Game finished</p>
		{:else}
			<p>loading...</p>
		{/if}
	</div>
	<div class="grid grid-cols-4 gap-4 my-20">
		{#if $madeGuess}
			{#each $resultArray as result}
				<div>
					<Result {result} />
				</div>
			{/each}
		{:else}
			<p></p>
		{/if}
	</div>
</main>
