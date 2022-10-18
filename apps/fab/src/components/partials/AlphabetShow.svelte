	<script>
		import { onMount } from "svelte"
		export let alphabet
	</script>
	{#if alphabet}
	<div class="flex h-48 w-full place-items-center">
		<h1 class="w-full text-center text-4xl">
			{alphabet.name}
			<div class="block text-base leading-loose">
				A writing system of the {alphabet.family} Family
			</div>
		</h1>
	</div>
	
	{#if alphabet.fonts}
		<div>
			{#each alphabet.fonts as font}
				<span>
					{font.name}
				</span>
			{/each}
		</div>
	{/if}
	
	<section class="body-font text-gray-600">
		<div class="container mx-auto px-5 py-24">
			<div class="mb-20 flex w-full flex-col text-center">
				<h1 class="title-font mb-4 text-2xl text-gray-900 dark:text-gray-200 sm:text-3xl">
					Script Features
				</h1>
				<div>
					{#if alphabet.open_type_tag}
						<div class="leading-relaxed text-gray-500">
							{alphabet.open_type_tag}
						</div>
					{/if}
					{#if alphabet.status}<div>status: {alphabet.status}</div>{/if}
					{#if alphabet.type}<div>type: {alphabet.type}</div>{/if}
					{#if alphabet.requires_font}
						<div>requires_font: {alphabet.requires_font} </div>
					{/if}
				</div>
				<p class="mx-auto text-base leading-relaxed lg:w-2/3">
					{#if alphabet.sample}<div>sample: {alphabet.sample}</div>{/if}
					{#if alphabet.sample_img}<div>
							sample_img: {alphabet.sample_img}
						</div>{/if}
				</p>
			</div>
			<div class="-m-4 flex flex-wrap text-center">
				{#if alphabet.baseline}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-24 text-4xl text-gray-400">
								[ <span class="text-primary-600">
									{#if alphabet.baseline === "bottom"}_ {/if}
									{#if alphabet.baseline === "unspecified"}? {/if}
									{#if alphabet.baseline === "hanging"}^ {/if}
									{#if alphabet.baseline === "centered"}- {/if}
									{#if alphabet.baseline === "vertical"}‾ {/if}
								</span>
								]
							</div>
	
							<p class="leading-relaxed">Baseline {alphabet.baseline}</p>
						</div>
					</div>
				{/if}
				{#if alphabet.diacritics}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 41.6 62.3"
								class="mb-3 inline-block h-12 w-12 text-primary-600"
								fill="currentColor">
								<path
									fill="#777"
									d="M41.6 39.7c0 15.7-10.9 22.6-21.2 22.6C9 62.3 0 53.9 0 40.3c0-14.2 9.3-22.5 21.1-22.5 12.3 0 20.5 8.9 20.5 21.9zM7.8 40c0 9.3 5.4 16.4 13 16.4 7.4 0 13-7 13-16.6-.1-7.2-3.7-16.3-12.9-16.3S8 32 8 40z">
								</path>
								<path d="M34.2 0L23.4 12.6H18L25.7 0h8.5z"></path>
							</svg>
							<p class="leading-relaxed">Utilizes Diacritics</p>
						</div>
					</div>
				{/if}
				{#if alphabet.white_space}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
								[ ]
							</div>
							<p class="leading-relaxed">Utilizes Whitespace</p>
						</div>
					</div>
				{/if}
				{#if alphabet.complex_positioning}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 52 87.2"
								class="mb-3 inline-block h-12 w-12 text-primary-600"
								fill="currentColor">
								<path
									fill="#777"
									d="M9.1 63.3V30q0-9.6 3.3-14.2 3.1-4.8 10-4.8 5.6 0 10 4.8a38.5 38.5 0 017.6 11l-2.8 1.6a32.6 32.6 0 00-6.4-9.2 11.1 11.1 0 00-7.5-3.2q-4.6 0-6.6 3.4-2 3.6-2 12v36c0 .5.2.8.6.8a5.2 5.2 0 002.6-.8 12 12 0 002.6-2l2.8 4.6a8.3 8.3 0 01-5 2 9.1 9.1 0 01-4.6-1.6 11.5 11.5 0 01-3.4-3.2 6.5 6.5 0 01-1.2-4z">
								</path>
								<path
									fill="#777"
									d="M46.4 63a8.2 8.2 0 01-3.2 6.7c-2 1.6-4.8 2.4-8.4 2.4a21.6 21.6 0 01-8-1.6 34.3 34.3 0 01-6.4-4.4l1.6-2.4Q27.2 68 32.4 68q4 0 6-1.8a6 6 0 002-4.6 6.6 6.6 0 00-1.6-4.2 15 15 0 00-3.6-3.6l-12 3.2-3-4.8 10.4-2.4a15 15 0 01-4.6-4 9 9 0 01-2-5.6 8 8 0 013.6-6.9c2.3-1.7 5.3-2.6 9-2.6a16.8 16.8 0 014 .4l1.4 5.2-4-.4q-4 0-6 1.7a4.7 4.7 0 00-2.4 4.4q0 3.6 4 7l12.2-3.2 3 4.8-10 2.4a13.2 13.2 0 015.2 3.8 8.2 8.2 0 012.4 6z">
								</path>
								<path
									d="M50.3 60a1.6 1.6 0 011.7 1.5A25.6 25.6 0 014.8 75.5L3 80.7a1.6 1.6 0 01-1.5 1 .7.7 0 01-.5 0 1.6 1.6 0 01-1-2L3 71a1.7 1.7 0 011.8-1.2l9 1.4a1.7 1.7 0 011.5 1.7 1.6 1.6 0 01-1.6 1.5l-5.9-.8a22.3 22.3 0 0041-12 1.6 1.6 0 011.6-1.8zM25.5 0a25.4 25.4 0 0121.6 11.8l1.7-5.3a1.6 1.6 0 012-1 1.6 1.6 0 011 2L49 16.2a1.6 1.6 0 01-1.5 1.2h-.3l-9-1.5a1.7 1.7 0 01-1.5-1.7 1.6 1.6 0 011.6-1.5l6 .9A22 22 0 0025.5 3.2 22.3 22.3 0 003.2 25.6a1.6 1.6 0 01-3.2 0A25.5 25.5 0 0125.5 0z">
								</path>
							</svg>
	
							<p class="leading-relaxed">Complex Positioning</p>
						</div>
					</div>
				{/if}
				{#if alphabet.contextual_forms}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 52 87.2"
								class="mb-3 inline-block h-12 w-12 text-primary-600"
								fill="currentColor">
								<path
									fill="#777"
									d="M9.1 63.3V30q0-9.6 3.3-14.2 3.1-4.8 10-4.8 5.6 0 10 4.8a38.5 38.5 0 017.6 11l-2.8 1.6a32.6 32.6 0 00-6.4-9.2 11.1 11.1 0 00-7.5-3.2q-4.6 0-6.6 3.4-2 3.6-2 12v36c0 .5.2.8.6.8a5.2 5.2 0 002.6-.8 12 12 0 002.6-2l2.8 4.6a8.3 8.3 0 01-5 2 9.1 9.1 0 01-4.6-1.6 11.5 11.5 0 01-3.4-3.2 6.5 6.5 0 01-1.2-4z">
								</path>
								<path
									fill="#777"
									d="M46.4 63a8.2 8.2 0 01-3.2 6.7c-2 1.6-4.8 2.4-8.4 2.4a21.6 21.6 0 01-8-1.6 34.3 34.3 0 01-6.4-4.4l1.6-2.4Q27.2 68 32.4 68q4 0 6-1.8a6 6 0 002-4.6 6.6 6.6 0 00-1.6-4.2 15 15 0 00-3.6-3.6l-12 3.2-3-4.8 10.4-2.4a15 15 0 01-4.6-4 9 9 0 01-2-5.6 8 8 0 013.6-6.9c2.3-1.7 5.3-2.6 9-2.6a16.8 16.8 0 014 .4l1.4 5.2-4-.4q-4 0-6 1.7a4.7 4.7 0 00-2.4 4.4q0 3.6 4 7l12.2-3.2 3 4.8-10 2.4a13.2 13.2 0 015.2 3.8 8.2 8.2 0 012.4 6z">
								</path>
								<path
									d="M50.3 60a1.6 1.6 0 011.7 1.5A25.6 25.6 0 014.8 75.5L3 80.7a1.6 1.6 0 01-1.5 1 .7.7 0 01-.5 0 1.6 1.6 0 01-1-2L3 71a1.7 1.7 0 011.8-1.2l9 1.4a1.7 1.7 0 011.5 1.7 1.6 1.6 0 01-1.6 1.5l-5.9-.8a22.3 22.3 0 0041-12 1.6 1.6 0 011.6-1.8zM25.5 0a25.4 25.4 0 0121.6 11.8l1.7-5.3a1.6 1.6 0 012-1 1.6 1.6 0 011 2L49 16.2a1.6 1.6 0 01-1.5 1.2h-.3l-9-1.5a1.7 1.7 0 01-1.5-1.7 1.6 1.6 0 011.6-1.5l6 .9A22 22 0 0025.5 3.2 22.3 22.3 0 003.2 25.6a1.6 1.6 0 01-3.2 0A25.5 25.5 0 0125.5 0z">
								</path>
							</svg>
	
							<p class="leading-relaxed">Contextual Forms</p>
						</div>
					</div>
				{/if}
				{#if alphabet.reordering}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 52 87.2"
								class="mb-3 inline-block h-12 w-12 text-primary-600"
								fill="currentColor">
								<path
									fill="#777"
									d="M9.1 63.3V30q0-9.6 3.3-14.2 3.1-4.8 10-4.8 5.6 0 10 4.8a38.5 38.5 0 017.6 11l-2.8 1.6a32.6 32.6 0 00-6.4-9.2 11.1 11.1 0 00-7.5-3.2q-4.6 0-6.6 3.4-2 3.6-2 12v36c0 .5.2.8.6.8a5.2 5.2 0 002.6-.8 12 12 0 002.6-2l2.8 4.6a8.3 8.3 0 01-5 2 9.1 9.1 0 01-4.6-1.6 11.5 11.5 0 01-3.4-3.2 6.5 6.5 0 01-1.2-4z">
								</path>
								<path
									fill="#777"
									d="M46.4 63a8.2 8.2 0 01-3.2 6.7c-2 1.6-4.8 2.4-8.4 2.4a21.6 21.6 0 01-8-1.6 34.3 34.3 0 01-6.4-4.4l1.6-2.4Q27.2 68 32.4 68q4 0 6-1.8a6 6 0 002-4.6 6.6 6.6 0 00-1.6-4.2 15 15 0 00-3.6-3.6l-12 3.2-3-4.8 10.4-2.4a15 15 0 01-4.6-4 9 9 0 01-2-5.6 8 8 0 013.6-6.9c2.3-1.7 5.3-2.6 9-2.6a16.8 16.8 0 014 .4l1.4 5.2-4-.4q-4 0-6 1.7a4.7 4.7 0 00-2.4 4.4q0 3.6 4 7l12.2-3.2 3 4.8-10 2.4a13.2 13.2 0 015.2 3.8 8.2 8.2 0 012.4 6z">
								</path>
								<path
									d="M50.3 60a1.6 1.6 0 011.7 1.5A25.6 25.6 0 014.8 75.5L3 80.7a1.6 1.6 0 01-1.5 1 .7.7 0 01-.5 0 1.6 1.6 0 01-1-2L3 71a1.7 1.7 0 011.8-1.2l9 1.4a1.7 1.7 0 011.5 1.7 1.6 1.6 0 01-1.6 1.5l-5.9-.8a22.3 22.3 0 0041-12 1.6 1.6 0 011.6-1.8zM25.5 0a25.4 25.4 0 0121.6 11.8l1.7-5.3a1.6 1.6 0 012-1 1.6 1.6 0 011 2L49 16.2a1.6 1.6 0 01-1.5 1.2h-.3l-9-1.5a1.7 1.7 0 01-1.5-1.7 1.6 1.6 0 011.6-1.5l6 .9A22 22 0 0025.5 3.2 22.3 22.3 0 003.2 25.6a1.6 1.6 0 01-3.2 0A25.5 25.5 0 0125.5 0z">
								</path>
							</svg>
	
							<p class="leading-relaxed">Reordering</p>
						</div>
					</div>
				{/if}
				{#if alphabet.direction}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
								{#if alphabet.direction === "ltr"}
									→
								{/if}
								{#if alphabet.direction === "rtl"}
									←
								{/if}
							</div>
	
							<p class="leading-relaxed">direction</p>
							{#if alphabet.direction_notes}<div>
									direction_notes: {alphabet.direction_notes}
								</div>{/if}
						</div>
					</div>
				{/if}
				{#if alphabet.ligatures}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
							</div>
	
							<p class="leading-relaxed">ligatures</p>
						</div>
					</div>
				{/if}
	
				{#if alphabet.unicode}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
							</div>
	
							<p class="leading-relaxed">unicode</p>
						</div>
						{#if alphabet.unicode_pdf}<div>
								unicode_pdf: {alphabet.unicode_pdf}
							</div>{/if}
					</div>
				{/if}
	
				{#if alphabet.case}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
								{alphabet.case}
							</div>
	
							<p class="leading-relaxed">case</p>
						</div>
					</div>
				{/if}
	
				{#if alphabet.split_graphs}
					<div class="flex w-full flex-col p-4 sm:w-1/3 md:w-1/5">
						<div class="flex-1 rounded-lg border-2 border-gray-200 px-4 py-6">
							<div class="mb-3 inline-block h-12 w-12 text-4xl text-primary-600">
								{alphabet.split_graphs}
							</div>
	
							<p class="leading-relaxed">split_graphs</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</section>
	{/if}