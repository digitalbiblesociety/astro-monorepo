<script>
	import { onMount } from "svelte"
	import { geoPath, geoNaturalEarth1 } from "d3"
	import { zoom, zoomIdentity } from "d3-zoom"
	import { select } from "d3-selection"
	
	export let locale = 'en'
	export let t
	export let color_buttons = true
	export let pins = null
	
	let pos = {
		lat: 0,
		lng: 0,
		scale: 150,
		translate: [0, 0],
	}
	
	let projection = geoNaturalEarth1()
	let path = geoPath(projection)
	let width = 1000
	let height = 450
	let viewBox = [0, 0, width, height]
	let map_data

	
	onMount(async () => {
		// Initalize Map
		const svg = select("#map").attr("viewBox", viewBox)
		let country_paths = svg.select(path)
	
		// Fetch the data
		let response = await fetch(`/map_50m.json`)
		map_data = await response.json()
	
		const zoomable = zoom().scaleExtent([1, 5]).translateExtent([[-100, -100], [width, height]]).on('zoom', zoomed);

  		// It's below the map because our circles from earlier need to be on top!
  		svg.call(zoomable);
	})

		function zoomed(event) {
		    let {k, x, y} = event.transform;
			const countryWrap = select("#countryWrap")
		    countryWrap.attr('transform', `translate(${x}, ${y}) scale(${k})`);
		}

	
	const countries = {
		BD: "#e3ece3",
		BE: "#75a375",
		BF: "#94b894",
		BG: "#6c9d6c",
		BA: "#7ca87c",
		BN: "#a7c4a7",
		BO: "#679a67",
		JP: "#c9dbc9",
		BI: "#70a070",
		BJ: "#82ac82",
		BT: "#d3e2d3",
		JM: "#75a375",
		BW: "#72a172",
		BR: "#6a9b6a",
		BS: "#679a67",
		BY: "#7aa77a",
		BZ: "#6f9f6f",
		RU: "#80aa80",
		RW: "#689b68",
		RS: "#689b68",
		LT: "#6c9d6c",
		LU: "#72a172",
		LR: "#6c9d6c",
		RO: "#669966",
		GW: "#a9c6a9",
		GT: "#679a67",
		GR: "#679a67",
		GQ: "#679967",
		GY: "#79a679",
		GE: "#6a9c6a",
		GB: "#78a578",
		GA: "#72a172",
		GN: "#a9c6a9",
		GM: "#abc7ab",
		GL: "#679a67",
		KW: "#9fbf9f",
		GH: "#73a273",
		OM: "#c5d8c5",
		_2: "#ffffff",
		_1: "#ffffff",
		_0: "#ffffff",
		JO: "#b4cdb4",
		HR: "#699b69",
		HT: "#6c9d6c",
		HU: "#6d9e6d",
		HN: "#6b9c6b",
		PR: "#679a67",
		PS: "#ffffff",
		PT: "#689a68",
		PY: "#679a67",
		PA: "#699b69",
		PG: "#669966",
		PE: "#689b68",
		PK: "#ccddcc",
		PH: "#699b69",
		PL: "#689a68",
		ZM: "#679a67",
		EH: "#f6f9f6",
		EE: "#93b793",
		EG: "#9bbc9b",
		ZA: "#6d9e6d",
		EC: "#669966",
		AL: "#9bbc9b",
		AO: "#6a9c6a",
		KZ: "#7da87d",
		ET: "#76a476",
		ZW: "#6c9d6c",
		ES: "#6f9f6f",
		ER: "#76a476",
		ME: "#6e9f6e",
		MD: "#679a67",
		MG: "#84ad84",
		MA: "#c8dac8",
		UZ: "#c4d8c4",
		MM: "#aec9ae",
		ML: "#b8d0b8",
		MN: "#c8dac8",
		MK: "#75a375",
		MW: "#6e9e6e",
		MR: "#ebf2eb",
		UG: "#6a9c6a",
		MY: "#a5c3a5",
		MX: "#699b69",
		VU: "#ffffff",
		FR: "#75a375",
		FI: "#6d9e6d",
		FJ: "#75a375",
		FK: "#689a68",
		NI: "#6a9c6a",
		NL: "#82ab82",
		NO: "#6b9d6b",
		NA: "#6a9c6a",
		NC: "#ffffff",
		NE: "#b8d0b8",
		NG: "#7da87d",
		NZ: "#7aa67a",
		NP: "#d5e3d5",
		CI: "#8ab18a",
		CH: "#6d9d6d",
		CO: "#abc7ab",
		CN: "#b8d0b8",
		CM: "#73a273",
		CL: "#6b9c6b",
		CA: "#74a274",
		CG: "#689a68",
		CF: "#aec9ae",
		CD: "#6a9b6a",
		CZ: "#a6c4a6",
		CY: "#6e9e6e",
		CR: "#6c9d6c",
		CU: "#6c9d6c",
		SZ: "#6d9e6d",
		SY: "#a9c6a9",
		KG: "#9cbd9c",
		KE: "#6c9d6c",
		SS: "#77a577",
		SR: "#7da97d",
		KH: "#d3e2d3",
		SV: "#6d9e6d",
		SK: "#6b9c6b",
		KR: "#8eb38e",
		SI: "#6e9f6e",
		KP: "#bcd3bc",
		SO: "#ffffff",
		SN: "#b1cbb1",
		SL: "#8db38d",
		SB: "#ffffff",
		SA: "#b6ceb6",
		SE: "#74a274",
		SD: "#c9dbc9",
		DO: "#689a68",
		DJ: "#b4cdb4",
		DK: "#6d9d6d",
		DE: "#77a477",
		YE: "#ffffff",
		AT: "#73a273",
		DZ: "#c9dbc9",
		US: "#71a071",
		LV: "#7aa67a",
		UY: "#79a579",
		LB: "#84ad84",
		LA: "#c7dac7",
		TW: "#ffffff",
		TT: "#79a679",
		TR: "#e7efe7",
		LK: "#b0cab0",
		TN: "#e7efe7",
		TL: "#ffffff",
		TM: "#abc7ab",
		TJ: "#cedfce",
		LS: "#6a9c6a",
		TH: "#d8e5d8",
		TF: "#ffffff",
		TG: "#8eb48e",
		TD: "#89b189",
		LY: "#c9dbc9",
		AE: "#abc7ab",
		VE: "#679967",
		AF: "#fbfcfb",
		IQ: "#c2d6c2",
		IS: "#689a68",
		IR: "#e0eae0",
		AM: "#669966",
		IT: "#6c9d6c",
		VN: "#aec9ae",
		AR: "#abc7ab",
		AU: "#77a477",
		IL: "#bfd4bf",
		IN: "#c4d8c4",
		TZ: "#77a477",
		AZ: "#b9d0b9",
		IE: "#689a68",
		ID: "#d3e2d3",
		UA: "#6c9d6c",
		QA: "#a1c1a1",
		MZ: "#7aa67a",
	}
	$: currentCountries = { ...countries }
	
	const wwl_2022 = {
		AF: "#b74c2e",
		KP: "#b74c2e",
		SO: "#b74c2e",
		LY: "#b74c2e",
		YE: "#b74c2e",
		ER: "#b74c2e",
		NG: "#b74c2e",
		PK: "#b74c2e",
		IR: "#b74c2e",
		IN: "#b74c2e",
		SA: "#b74c2e",
		MM: "#ee8134",
		SD: "#ee8134",
		IQ: "#ee8134",
		SY: "#ee8134",
		MV: "#ee8134",
		CN: "#ee8134",
		QA: "#ee8134",
		VN: "#ee8134",
		EG: "#ee8134",
		UZ: "#ee8134",
		DZ: "#ee8134",
		MR: "#ee8134",
		ML: "#ee8134",
		TM: "#ee8134",
		LA: "#ee8134",
		MA: "#ee8134",
		ID: "#ee8134",
		BD: "#ee8134",
		CO: "#ee8134",
		CF: "#ee8134",
		BF: "#ee8134",
		NE: "#ee8134",
		BT: "#ee8134",
		TN: "#ee8134",
		OM: "#ee8134",
		CU: "#ee8134",
		ET: "#ee8134",
		JO: "#ee8134",
		CD: "#ee8134",
		MZ: "#ee8134",
		TR: "#ee8134",
		MX: "#ee8134",
		CM: "#ee8134",
		TJ: "#ee8134",
		BN: "#ee8134",
		KZ: "#ee8134",
		NP: "#ee8134",
		KW: "#ee8134",
		MY: "#ee8134",
	}
	
	const newShade = (hexColor, magnitude) => {
		hexColor = hexColor.replace(`#`, ``)
		if (hexColor.length === 6) {
			const decimalColor = parseInt(hexColor, 16)
			let r = (decimalColor >> 16) + magnitude
			r > 255 && (r = 255)
			r < 0 && (r = 0)
			let g = (decimalColor & 0x0000ff) + magnitude
			g > 255 && (g = 255)
			g < 0 && (g = 0)
			let b = ((decimalColor >> 8) & 0x00ff) + magnitude
			b > 255 && (b = 255)
			b < 0 && (b = 0)
			return `#${(g | (b << 8) | (r << 16)).toString(16)}`
		} else {
			return hexColor
		}
	}
	
	const changeMapColor = (destination) => {
		for (let country in countries) {
			if (destination == "world_watch_list") {
				currentCountries[country] = wwl_2022[country] ?? "#fff"
			} else {
				currentCountries[country] = countries[country] ?? "#fff"
			}
		}
	}
	
	function addPin(container, height, radius, background, border) {
		const path = pinPath(height, radius)
		return container
			.append("path")
			.attr("d", path)
			.style("stroke", border)
			.style("fill", background)
	}
	
	function pinPath(height, radius) {
		const dyAC = height - radius
		const alpha = Math.acos(radius / dyAC)
		const deltaX = radius * Math.sin(alpha)
		const deltaY = (height * (height - radius * 2)) / dyAC
		return `M 0,0 
		L ${-deltaX},${-deltaY}
		A ${radius} ${radius} 1 1 1 ${deltaX},${-deltaY} 
		L 0,0 z`
	}
	
	const changeContinentFocus = (pos, region) => {
		viewBox = pos
	
		const world = {
			africa: [
				"AO",
				"BF",
				"BI",
				"BJ",
				"BW",
				"CD",
				"CF",
				"CG",
				"CI",
				"CM",
				"CV",
				"DJ",
				"DZ",
				"EG",
				"EH",
				"ER",
				"ET",
				"GA",
				"GH",
				"GM",
				"GN",
				"GQ",
				"GW",
				"KE",
				"KM",
				"LR",
				"LS",
				"LY",
				"MA",
				"MG",
				"ML",
				"MR",
				"MU",
				"MW",
				"MZ",
				"NA",
				"NE",
				"NG",
				"RE",
				"RW",
				"SC",
				"SD",
				"SH",
				"SL",
				"SN",
				"SO",
				"SS",
				"ST",
				"SZ",
				"TD",
				"TG",
				"TN",
				"TZ",
				"UG",
				"YT",
				"ZA",
				"ZM",
				"ZW",
			],
			asia: [
				"AF",
				"AM",
				"AZ",
				"BD",
				"BH",
				"BN",
				"BT",
				"CC",
				"CN",
				"CX",
				"GE",
				"HK",
				"ID",
				"IL",
				"IN",
				"IO",
				"IQ",
				"IR",
				"JO",
				"JP",
				"KG",
				"KH",
				"KP",
				"KR",
				"KW",
				"KZ",
				"LA",
				"LB",
				"LK",
				"MM",
				"MN",
				"MO",
				"MV",
				"MY",
				"NP",
				"OM",
				"PH",
				"PK",
				"PS",
				"QA",
				"SA",
				"SG",
				"SY",
				"TH",
				"TJ",
				"TM",
				"TR",
				"TW",
				"UZ",
				"VN",
				"YE",
			],
			europe: [
				"AD",
				"AL",
				"AT",
				"AX",
				"BA",
				"BE",
				"BG",
				"BY",
				"CH",
				"CY",
				"CZ",
				"DE",
				"DK",
				"EE",
				"ES",
				"FI",
				"FO",
				"FR",
				"GB",
				"GG",
				"GI",
				"GR",
				"HR",
				"HU",
				"IE",
				"IM",
				"IS",
				"IT",
				"JE",
				"LI",
				"LT",
				"LU",
				"LV",
				"MC",
				"MD",
				"ME",
				"MK",
				"MT",
				"NL",
				"NO",
				"PL",
				"PT",
				"RO",
				"RS",
				"RU",
				"SE",
				"SI",
				"SJ",
				"SK",
				"SM",
				"UA",
				"VA",
				"XK",
			],
			america_south: [
				"AR",
				"BO",
				"BR",
				"CL",
				"CO",
				"EC",
				"FK",
				"GF",
				"GY",
				"PE",
				"PY",
				"SR",
				"UY",
				"VE",
			],
			america_north: [
				"AG",
				"AI",
				"AW",
				"BB",
				"BL",
				"BM",
				"BQ",
				"BS",
				"BZ",
				"CA",
				"CR",
				"CU",
				"CW",
				"DM",
				"DO",
				"GD",
				"GL",
				"GP",
				"GT",
				"HN",
				"HT",
				"JM",
				"KN",
				"KY",
				"LC",
				"MF",
				"MQ",
				"MS",
				"MX",
				"NI",
				"PA",
				"PM",
				"PR",
				"SV",
				"SX",
				"TC",
				"TT",
				"US",
				"VC",
				"VG",
				"VI",
			],
			oceania: [
				"AS",
				"AU",
				"CK",
				"FJ",
				"FM",
				"GU",
				"KI",
				"MH",
				"MP",
				"NC",
				"NF",
				"NR",
				"NU",
				"NZ",
				"PF",
				"PG",
				"PN",
				"PW",
				"SB",
				"TK",
				"TL",
				"TO",
				"TV",
				"UM",
				"VU",
				"WF",
				"WS",
			],
		}

		console.log(region)
	
		for (let country in countries) {
			if (!world[region].includes(country)) {
				currentCountries[country] = countries[country] ?? "#999"
			}
		}
	}
	</script>
<div class="relative">

	
	{#if color_buttons}
		<div class="flex flex-row justify-center relative bottom-0">
			<button
				class="my-1 mx-4 cursor-pointer rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-3"
				on:click="{() => changeMapColor('default')}">
				{t.christian_percentage}
			</button>
			<button
				class="my-1 mx-4 cursor-pointer rounded bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-3"
				on:click="{() => changeMapColor('world_watch_list')}">
				{t.world_watch_list}
			</button>
		</div>
	{/if}
	
	<svg id="map" class="mx-auto w-full h-[20rem]" viewBox={[0, 0, width, height]}>
		{#if map_data}
		<g id="countryWrap">
			{#each map_data as data, i}
				<path
					id="{data.properties.country_id}"
					class="cursor-pointer"
					center="{data.properties.center}"
					d="{path(data)}"
					on:click="{() => window.location.href = `/${locale}/countries/${data.properties.country_id}`}"
					fill="{currentCountries[data.properties.country_id]}"
					stroke="#222">
				</path>
			{/each}
		</g>
			{#if pins}
				{#each pins as pin}
					<g
						transform="translate({projection([pin.longitude, pin.latitude])})"
						on:click="{() => window.location.href = `/${locale}/organizations/${pin.id}`}">
						<circle
							r="7"
							fill="{pin.primary_color}"
							stroke="#222"
							stroke-width="2">
						</circle>
					</g>
				{/each}
			{/if}
		{/if}
	</svg>
	
</div>