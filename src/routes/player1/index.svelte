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
		resultArray,
		bgColor
	} from '../../stores/spotifyStore.js';

	
	import StartGame from '../../components/StartGame.svelte';
	import Playing from '../../components/Playing.svelte';
	import PlaylingMobile from '../../components/PlaylingMobile.svelte';
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
				else if(Object.keys(socket_data)[0] == 'change_round'){
					changeRound();
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
	$: console.log('Current Round ' + $currentRoundName);
	$: console.log($currentRoundName);
	$: console.log('started: ' + $started);
	$: console.log($currentRound);
	$: console.log($finished);
	$: console.log('finished:' + $finished);

	function changeRound() {
		bgColor.set('bg-blue-500');
		// Only update round till final round is reached to avoid error when deriving currentRoundName
		if ($currentRound < 10) {
			currentRound.set($currentRound + 1);
		}

		// If last round was player finish game
		if (
			$currentRound + 1 > 10 ||
			$game[$currentRoundName].sample == null ||
			$game[$currentRoundName].sample == ''
		) {
			finished.set(true);
		} else {
			//madeGuess = false;
			madeGuess.set(false);
			currentSample.set($game[$currentRoundName].sample);
			currentSelectedSong.set($game[$currentRoundName].selected);
		}
	}

</script>

{#if $started === true && $finished === false}
    <div class="grid grid-cols-4 gap-4 ml-10">
        <PlaylingMobile
        sample={$currentSample}
        selectedSong={$currentSelectedSong}
        round={$currentRound}
        playerID={2}
        />
    </div>
    
{:else}
	<p>Wait for game to start</p>
{/if}