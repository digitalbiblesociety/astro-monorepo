<script>
	import { fetchArtwork, imageFilterView, galleryViewMode } from './ImageStore.js'

	export let art
</script>

<section id="gallery">
	<ul>
		{#each art.filter(function(artwork){return artwork?.tp == $imageFilterView}).slice(0, 20) as artwork}
		<li>
			<div>
				<img src={'https://dbs-art.s3.amazonaws.com/picture/thumb/' + artwork.fn} alt="" />
				<button on:click={() => fetchArtwork(artwork.id)}>
					<span class="sr-only">{artwork.tt}</span>
				</button>
			</div>
			<p>{artwork.tt}</p>
			<span>{artwork.at}</span>
		</li>
		{/each}
	</ul>
</section>

<style>

#gallery {
	padding-bottom: 4rem; 
	margin-top: 2rem; 
	width: 100%;
}

#gallery ul li div {
	display: block;
	overflow: hidden;
	background-color: #F3F4F6;
	border-radius: 0.5rem;
}

#gallery ul li p {
	display: block; 
	margin-top: 0.5rem; 
	font-size: 0.875rem;
	line-height: 1.25rem; 
	font-weight: 500; 
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap; 
	pointer-events: none;
}

#gallery ul li span {
	display: block; 
	font-size: 0.875rem;
	line-height: 1.25rem;
	font-weight: 500;
	pointer-events: none;
}

#gallery ul {
	display: grid; 
	grid-template-columns: repeat(5, minmax(0, 1fr)); 
	column-gap: 1rem; 
	row-gap: 2rem; 
}

#gallery ul li {
	position: relative;
}

#gallery button {
	position: absolute; 
	top: 0;
	right: 0;
	bottom: 0;
	left: 0; 
}

#gallery img {
	object-fit: cover;
	width: 100%;
	height: 120px;
	pointer-events: none;
}


</style>