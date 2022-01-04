<script>
    import {
		currentRound, 
        currentRoundName,
        game,
        currentSample,
        currentSelectedSong,
        started,
        finished
	} from '../stores/spotifyStore.js';
	// create a prop
	export let sample;
    export let selectedSong;
    export let round;

    let selected;

    function checkAnswerCorrect() {
        if (selected == undefined) return false;
        return selectedSong.id == selected.id;
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
            currentSample.set($game[$currentRoundName].sample);
            currentSelectedSong.set($game[$currentRoundName].selected);
        }
    }
</script>

<div class="grid grid-cols-1 gap-4">
    <div class="content-center"><span class="align-middle">{"Round "+round}</span></div>
    {#each sample as song, i}
        {#if round % 2 }
            <button on:click={() => selected = song} class='w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden'>{i+": "+song.artist}</button>
        {:else}
            <button on:click={() => selected = song} class='w-full bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden'>{i+": "+song.title}</button>
        {/if}
    {/each}
    <div>
        <audio src={selectedSong.preview_url} autoplay=true on:ended={() => changeRound()}></audio>
    </div>
</div>