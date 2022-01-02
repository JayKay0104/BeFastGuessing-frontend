<script>
	// create a prop
	export let sample;
    export let selectedSong;
    export let round;
</script>

<article>
	<h1>{"Round "+round}</h1>
    <p>{"1: " + sample[0].artist_title}</p>
    <p>{"2: " + sample[1].artist_title}</p>
    <p>{"3: " + sample[2].artist_title}</p>
    <p>{"4: " + sample[3].artist_title}</p>
    <div>
        <audio src={selectedSong} autoplay=true></audio>
    </div>
</article>
