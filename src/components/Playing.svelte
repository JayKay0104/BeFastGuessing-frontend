<script>
	import { onMount } from 'svelte';

	import {
		currentRound,
		currentRoundName,
		game,
		currentSample,
		currentSelectedSong,
		started,
		finished
	} from '../stores/spotifyStore.js';

	//TODO: Import Result and display it nicely below the song titles
	import Result from '../components/Result.svelte';

	// create a prop
	export let sample;
	export let selectedSong;
	export let round;
	export let playerID;

	let selected;
	let madeGuess;
	let summedResult = 0;
	let result;

	let bgColor = 'bg-blue-500';

	// Generate random number between 100 and 1 to shuffle between artist and titles
	// Odd number => Show titles otherwise artists
	let randomInt = getRandomInt(1, 100);

	onMount(() => sendStartRound());

	function sendGuess(songID, playerID, currentRound) {
		madeGuess = true;
		fetch('http://localhost:8000/result/', {
			method: 'POST',
			body: JSON.stringify({
				songID: songID,
				playerID: playerID,
				round: currentRound
			})
		})
			.then((response) => response.json())
			.then((response) => {
				result = Math.round(response);
				summedResult = summedResult + result;
				console.log(response);
			});

		if (songID === $game[$currentRoundName].selected.id) {
			bgColor = 'bg-[#50d71e]';
		} else {
			bgColor = 'bg-[#7F0000]';
		}
	}

	async function sendStartRound() {
		bgColor = 'bg-blue-500';
		fetch('http://localhost:8000/start/' + $game[$currentRoundName].selected.id)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
			});
		randomInt = getRandomInt(1, 100);
	}

	function changeRound() {
		// Only update round till final round is reached to avoid error when deriving currentRoundName
		if (round < 10) {
			currentRound.set(round + 1);
		}

		// If last round was player finish game
		if (
			round + 1 > 10 ||
			$game[$currentRoundName].sample == null ||
			$game[$currentRoundName].sample == ''
		) {
			finished.set(true);
		} else {
			madeGuess = false;
			currentSample.set($game[$currentRoundName].sample);
			currentSelectedSong.set($game[$currentRoundName].selected);
			sendStartRound();
		}
	}

	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
</script>

<div class="grid grid-rows-5 grid-cols-1 gap-4">
	<div class="content-center"><span class="align-middle">{'Round ' + round}</span></div>
	{#each sample as song, i}
		{#if round % 2}
			<button
				disabled={madeGuess}
				on:click={() => sendGuess(song.id, playerID, round)}
				class="w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden"
				>{i + ': ' + song.first_artist}</button
			>
		{:else}
			<button
				disabled={madeGuess}
				on:click={() => sendGuess(song.id, playerID, round)}
				class="w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden"
				>{i + ': ' + song.artists_title}</button
			>
		{/if}
	{/each}
	<div>
		<audio src={selectedSong.preview_url} autoplay="true" on:ended={() => changeRound()} />
	</div>
	<div>
		{#if madeGuess}
			<Result {result} />
			<h1>Total: {summedResult}</h1>
		{/if}
	</div>
</div>
