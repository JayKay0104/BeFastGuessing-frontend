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

	import StartGame from '../../components/StartGame.svelte';
	import Playing from '../../components/Playing.svelte';
	import Result from '../../components/Result.svelte';
	import { onMount } from 'svelte';

	// Websockets
	let socket;
	onMount(() => {
		socket = new WebSocket("ws://localhost:8000/ws")
		socket.addEventListener("open", ()=> {
			console.log("Opened")
		})

		socket.addEventListener('message', function (event) {
			console.log(event.data);
		});
	})

	

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

</script>

{#if $started === true && $finished === false}
    <div class="grid grid-cols-4 gap-4 ml-10">
        <Playing
        sample={$currentSample}
        selectedSong={$currentSelectedSong}
        round={$currentRound}
        playerID={2}
        />
    </div>
    
{:else}
	<p>Wait for game to start</p>
{/if}