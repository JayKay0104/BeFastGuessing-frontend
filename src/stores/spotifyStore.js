import { writable, derived } from 'svelte/store'

export const selectedCategory = writable(null);
export const selectedPlaylistId = writable(null);
export const spotifyUser = writable();
export const playlists = writable([]);

export const categories = writable([])
export const game = writable(null);

export const currentRound = writable(1);
export const currentRoundName = derived(currentRound, $currentRound => "Round_" + $currentRound.toString());
export const currentSample = writable([]);
export const currentSelectedSong = writable(null);

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

export const getGameForPlaylistId = async (playlistId) => {
    if (playlistId === undefined) return;
    selectedPlaylistId.set(playlistId);
    try {
        const gameEndpoint = 'http://localhost:8000/game/' + playlistId;
        console.log(gameEndpoint);
        const res = await fetch(gameEndpoint);
        const data = await res.json();
        currentSample.set(data.Round_1.sample)
        currentSelectedSong.set(data.Round_1.selected.preview_url)
        game.set(data);
    } catch (err) {
		console.error(err);
		return null;
	}
};