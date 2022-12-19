<script>
	import { audioData } from './audioData.js';
	
	let listIsShowing = false;
	
	const showPlayList = () => listIsShowing = !listIsShowing
</script>


<section id="playlist-cont">
	<button class="accordion"
					class:active={listIsShowing}
					on:click={showPlayList}>&#9776; Playlist</button>

	<ul class:show-list={listIsShowing}>
		{#each audioData as {name, url}, i}
		<li data-track-id={i}
				on:click>
			{name}</li>
		{/each}
	</ul>
</section>