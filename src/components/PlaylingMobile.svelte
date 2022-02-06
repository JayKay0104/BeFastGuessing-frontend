<script>
	import { onMount } from 'svelte';

	import {
		currentRound,
		currentRoundName,
		game,
		currentSample,
		currentSelectedSong,
		finished,
		madeGuess,
		resultArray,
        bgColor
	} from '../stores/spotifyStore.js';

	import Result from '../components/Result.svelte';

	// create a prop
	export let sample;
    export let selectedSong;
	export let round;
	export let playerID;

	//let madeGuess;
	let summedResult = 0;
	let result;

	// Generate random number between 100 and 1 to shuffle between artist and titles
	// Odd number => Show titles otherwise artists
	let randomInt = getRandomInt(1, 100);

    onMount(() => getSample());

    function getSample() {
        madeGuess.set(false);
        currentSample.set($game[$currentRoundName].sample);
        currentSelectedSong.set($game[$currentRoundName].selected);
    }

	function sendGuess(songID, playerID, currentRound) {
		//madeGuess = true;
		madeGuess.set(true);
		fetch('http://localhost:8000/result/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				songID: songID,
				playerID: playerID,
				round: currentRound
			})
		})
			.then((response) => response.json())
			.then((response) => {
				result = Math.round(response[playerID][$currentRoundName]);
				summedResult = summedResult + result;
				$resultArray[playerID-1] = [result,summedResult];
				console.log($resultArray);
			});

		if (songID === $game[$currentRoundName].selected.id) {
			$bgColor = 'bg-[#50d71e]';
		} else {
			$bgColor = 'bg-[#7F0000]';
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
        <button
            disabled={$madeGuess}
            on:click={() => sendGuess(song.id, playerID, round)}
            class="{$bgColor} w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden"
            >{(i+1) + ' '}</button
        >

	{/each}
</div>
