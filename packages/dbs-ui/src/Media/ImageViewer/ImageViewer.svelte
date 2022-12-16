<script>
import { onMount } from 'svelte';
import ImageGallery from './ImageGallery.svelte'
import ImageGalleryHeader from './ImageGalleryHeader.svelte'
import ImageGallerySidebar from './ImageGallerySidebar.svelte'

let art = []
let artists = []

onMount(async () => {
	art = await fetch('http://artmanager.test/api/art')
		.then((response) => response.json())

	artists = await fetch('http://artmanager.test/api/artists')
		.then((response) => response.json())

	art = art.map(artwork => {
		artwork.at = artists[artwork.at]
		return artwork
	});
})

export let t
</script>

<div class="h-full max-w-6xl mx-auto pt-12">
	<ImageGalleryHeader {art} {t} />
	<div class="flex flex-row">
		<ImageGallery {art} />
		<ImageGallerySidebar />
	</div>
</div>