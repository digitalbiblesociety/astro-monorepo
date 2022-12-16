import { writable } from "svelte/store"

export const imageFilterView = writable(0)
export const galleryViewMode = writable('grid')
export const selectedImageId = writable(0)
export const selectedArtwork = writable({})

export const fetchArtwork = async (id) => {
	const response = await fetch(`http://artmanager.test/api/art/${id}`);
	const result = await response.json();
	selectedArtwork.set(result);
}