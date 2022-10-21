<script>
	import countryShapes from "./country-shapes.js"
	import Map from "./WorldMap.svelte"
  
	export let locale

	const createData = () => {
	  return countryShapes.map(d => [
		d.properties.geounit,
		Math.random() < 0.13 ? Math.random() : 0,
		Math.random(),
	  ])
	}
	let data = createData()
  </script>
  
  <div class="wrapper h-[50vh] bg-gradient-to-br from-blue-900 to-teal-500">
	<Map
	  {data}
	  locale={locale}
	  nameAccessor="{d => d[0]}"
	  rAccessor="{d => d[1]}"
	  colorAccessor="{d => d[2]}" />
  </div>
  <svelte:window
	on:click="{() => (data = createData())}"
	on:touchend="{() => (data = createData())}" />
  
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