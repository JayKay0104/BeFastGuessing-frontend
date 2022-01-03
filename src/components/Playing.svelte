<script>
    import {
		currentRound
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
        currentRound.set(round+1)
    }
</script>

<div>
    <div class="content-center"><span class="align-middle">{"Round "+round}</span></div>
    {#each sample as song, i}
    <button on:click={() => selected = song} class='relative mt-4 bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden'>{i+": "+song.artist_title}</button>
    {/each}
    <div>
        <audio src={selectedSong.preview_url} autoplay=true on:ended={() => currentRound.set(round+1)}></audio>
    </div>
</div>