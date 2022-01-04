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

	// create a prop
	export let sample;
    export let selectedSong;
    export let round;

    let selected;
    let madeGuess;
    let summedResult = 0;
    let result;

    onMount(() => sendStartRound());

    function checkAnswerCorrect() {
        if (selected == undefined) return false;
        return selectedSong.id == selected.id;
    }

    function sendGuess(songID){
        madeGuess = true;
        fetch( 'http://localhost:8000/result/'+ songID )
        .then( response => response.json() )
        .then( response => {
            result = response;
            summedResult = summedResult + response;
            console.log(response);
        } );
    }

    async function sendStartRound(){
        fetch( 'http://localhost:8000/start/'+$game[$currentRoundName].selected.id)
        .then( response => response.json() )
        .then( response => {
            console.log(response);
        } );
    }

    function changeRound() {
        
        // Only update round till final round is reached to avoid error when deriving currentRoundName
        if (round < 10){
            currentRound.set(round+1);
        }

        // If last round was player finish game
        if ((round+1) > 10 || $game[$currentRoundName].sample == null || $game[$currentRoundName].sample == ""){
            finished.set(true);
        }
        else{
            madeGuess=false;
            currentSample.set($game[$currentRoundName].sample);
            currentSelectedSong.set($game[$currentRoundName].selected);
            sendStartRound();
        }
    }
</script>

<div class="grid grid-rows-5 grid-cols-1 gap-4">
    <div class="content-center"><span class="align-middle">{"Round "+round}</span></div>
    {#each sample as song, i}
        {#if round % 2 }
            <button disabled={madeGuess} on:click={() => sendGuess(song.id)} class='w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden'>{i+": "+song.artist}</button>
        {:else}
            <button disabled={madeGuess} on:click={() => sendGuess(song.id)} class='w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden'>{i+": "+song.title}</button>
        {/if}
    {/each}
    <div>
        <audio src={selectedSong.preview_url} autoplay=true on:ended={() => changeRound()}></audio>
    </div>
    <div >
        {#if madeGuess }
            <h1>{result}</h1>
            <h1>Total: {summedResult}</h1>
        {/if}
    </div>
</div>
