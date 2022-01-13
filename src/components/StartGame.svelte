<script>
	import {
		selectedCategory,
		selectedPlaylist,
        started,
        finished
	} from '../stores/spotifyStore.js';
    import Category from './Category.svelte';
	import Playlist from './Playlist.svelte';

    // TODO
    // Send start, finished and selected category and playlist to backend server
    // Backendserver must then push out notification that game has started and game object
    
    function startGame() {
        started.set(true);
        finished.set(false);
    }
</script>

<div class="flex flex-col auto-cols-max gap-4">
    <div>
        <h2>Selected Category</h2>
    <Category category={$selectedCategory}/>
    </div>
    <div>
        <h2>Selected Playlist</h2>
    <Playlist playlist={$selectedPlaylist}/>
    </div>
    <div class="content-center">
        <br/>
        <button class='relative bg-blue-500 text-white p-6 rounded text-2xl font-bold overflow-hidden' on:click={startGame}>Start the Game!</button>
    </div>
</div>