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

			// Evaluate the sent data and apply game logic
			try{
				var socket_data = JSON.parse(event.data);

				if (Object.keys(socket_data)[0] == 'game') {
					game.set(socket_data.game);
				}
				else if(Object.keys(socket_data)[0] == 'start'){
					started.set(true);
        			finished.set(false);
					console.log('started');
				}
				else if (Object.keys(socket_data)[0] == 'result'){
					resultArray.set(socket_data.result);
				}
			}
			catch (e){
				console.log(e);
			}

		});
	})

	$: console.log($game);

	// TODO:
	// Make own PlayingPlayers component without music and where onmount ist not called

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