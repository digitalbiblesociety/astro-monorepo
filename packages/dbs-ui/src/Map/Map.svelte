<script>
	import countryShapes from "./country-shapes.json"
	import Map from "./WorldMap.svelte"

	export let locale
	export let t

	const createData = () => {
		return countryShapes.map(d => [
		d.properties.geounit,
		Math.random() < 0.13 ? Math.random() : 0,
		Math.random(),
	])
	}
	let data = createData()
	</script>
	
	<div class="wrapper bg-gradient-to-br from-blue-900 to-teal-500 dark:from-purple-900 dark:via-indigo-900 dark:to-stone-900 rounded-2xl">
		<Map {data} locale={locale} t={t}
			nameAccessor="{d => d[0]}"
			rAccessor="{d => d[1]}"
			colorAccessor="{d => d[2]}" />
	</div>
	<svelte:window on:click="{() => (data = createData())}" on:touchend="{() => (data = createData())}" />
	
	<style>
	.wrapper {
		margin: -1em;
		padding: 1em;
	}
	.note {
		position: absolute;
		top: 0;
		font-style: italic;
	}
	</style>