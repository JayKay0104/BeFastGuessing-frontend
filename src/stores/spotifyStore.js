import { writable, derived } from 'svelte/store'

export const inSelection = writable(false);
export const selectedCategory = writable(null);
export const selectedPlaylist = writable(null);
export const spotifyUser = writable();
export const playlists = writable([]);
export const categories = writable([])
export const game = writable(null);

export const currentRound = writable(1);
export const currentRoundName = derived(currentRound, $currentRound => "Round_" + $currentRound.toString());
export const currentSample = writable([]);
export const currentSelectedSong = writable(null);

// TODO: check if this works and if not why and fix
// This does not seem to work. Deriving from an already derived variable is not working. Deriving directly from currentRound works but the frontend is not updated.
// Workaround is to update stores in the Playing component. 
// export const currentSample = derived(currentRoundName, ($currentRoundName, $game) => $game[$currentRoundName].sample);
// export const currentSelectedSong = derived(currentRoundName, ($currentRoundName, $game) => $game[$currentRoundName].selected);

// export const currentSample = derived(currentRound, ($currentRound, $game) => $game[$currentRound].sample);
// export const currentSelectedSong = derived(currentRound, ($currentRound, $game) => $game[$currentRound].selected);

export const started = writable(false);
export const finished = writable(false);

let loaded = false;

const playListsByCategoryId = {};

export const loginUser = async () => {
    await fetch(`http://localhost:8000/login/`)
      .then(r => r.json())
      .then(data => {
        spotifyUser.set(data);
      });
  }

export const fetchCategories = async () => {
    if (loaded) return;
    const url = `http://localhost:8000/categories/`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    categories.set(data);
    loaded = true;
};

export const getPlaylistsByCategory = async (category) => {
    if (category === undefined) return;
    selectedCategory.set(category);
    let id = category.id;
    if (playListsByCategoryId[id]) playlists.set(playListsByCategoryId[id]);
    try {
        const playlistEndpoint = 'http://localhost:8000/playlists/' + id;
        console.log(playlistEndpoint);
        const res = await fetch(playlistEndpoint);
        const data = await res.json();
        playListsByCategoryId[id] = data;
        playlists.set(playListsByCategoryId[id]);
    } catch (err) {
		console.error(err);
		return null;
	}
};

export const getGameForPlaylistId = async (playlist) => {
    if (playlist === undefined) return;
    selectedPlaylist.set(playlist);
    let playlistId = playlist.id;
    try {
        const gameEndpoint = 'http://localhost:8000/game/' + playlistId;
        console.log(gameEndpoint);
        const res = await fetch(gameEndpoint);
        const data = await res.json();
        currentSample.set(data.Round_1.sample)
        currentSelectedSong.set(data.Round_1.selected)
        game.set(data);
    } catch (err) {
		console.error(err);
		return null;
	}
};