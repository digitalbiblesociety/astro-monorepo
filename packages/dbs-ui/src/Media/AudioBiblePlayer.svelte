<script>
	import { onMount } from 'svelte';

	export let key;
	export let country_id;
	export let equivalents;

	let bibles;
	let current_fileset;
	let current_books = {visible:false,data:[]};
	let current_book;
	let current_chapter;
	let player;

	onMount(async () => {
		let initial_path = `https://4.dbt.io/api/bibles?v=4&key=${key}&media=audio`;
		if (country_id) {
			initial_path += '&country=' + country_id;
		}

		bibles = await fetch(initial_path).then(function (response) {
			return response.json();
		});

		let last_page = bibles.meta.pagination.last_page;
		let current_page = 1;
		let results
		while (current_page >= last_page) {
			current_page++;
			results = await fetch(initial_path + 'page=' + current_page).then(function (response) {
				return response.json();
			});
			bibles.data.concat(results.data);
		}
	});

	// https://4.dbt.io/api/bible/filesets/:filesetId/:fileid/playlist.m3u8?v=4
	async function fetchAudioFileSet(bibleId, filesets) {
		for (const fileset of filesets) {
			if (fileset.codec === 'mp3') {
				current_fileset = fileset.id;
				break;
			}
		}

		let books = await fetch(`https://4.dbt.io/api/bibles/${bibleId}/book?v=4&key=${key}`).then(
			function (response) {
				return response.json();
			}
		);
		current_books.data = books['data'];
		current_books.visible = true
	}

	function setCurrentChapters(book) {
		current_book = null;
		current_book = book;
	}

	async function setCurrentChapter(bible, book, chapter) {
		current_chapter = await fetch(
			`https://4.dbt.io/api/bibles/filesets/${bible}/${book}/${chapter}?v=4&key=${key}`
		).then(function (response) {
			return response.json();
		});
		current_chapter = current_chapter['data'][0].path;
	}
</script>

<div class="container mx-auto py-12 px-8 relative" style="height:calc(100vh - 8rem)">
	<div class="flex w-full rounded-lg h-full lg:overflow-hidden overflow-auto flex-row shadow-2xl">
		<div class="lg:w-1/2 text-stone-800 flex flex-col">
			<div class="p-8 shadow-md relative bg-stone-600 text-white">
				<div class="flex items-center">
					<svg
						class="h-10 block mx-auto object-cover object-top"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 501 120"
					>
						<g clip-path="url(#a)" fill="#fff">
							<path d="M92 33H79v46h13V33Zm43 22 5-4a12 12 0 0 0 1-11l-2-3c-1-2-2-3-4-3l-4-1h-26v46h22l6-1 6-2a10 10 0 0 0 4-9c1-3 0-6-2-8-1-2-4-3-6-4Zm-18-12h9l2 1a3 3 0 0 1 1 3l-1 3-2 1h-9v-8Zm13 24-3 1h-10v-8h10a3 3 0 0 1 3 1l1 3a4 4 0 0 1-1 3Zm36-34h-12v46h33V68h-21V33Zm43 27h17V50h-17v-6h19V33h-32v46h33V68h-20v-8Zm58-5 5-4 2-7a13 13 0 0 0-3-7l-3-3-4-1h-22v46h21l5-1a12 12 0 0 0 7-7l1-4-2-8-7-4Zm4 14-2 3a8 8 0 0 1-6 3h-17V37h19l2 2 2 3a10 10 0 0 1 0 6 8 8 0 0 1-4 5l-3 1h-6l-5 3h13l3 1 2 2a9 9 0 0 1 2 6v3Zm45-10 3-3 3-4a16 16 0 0 0-1-10c0-2-1-3-3-5l-4-3-5-1h-20v46h5V37h14l4 1 3 2a11 11 0 0 1 3 7 12 12 0 0 1-3 7l-2 3-4 1h-4l2 4 9 13 2 4h5l-11-18 4-2Zm35-26-20 46h5l16-41 17 41h4l-19-46h-3Zm38 0h-4v46h4V33Zm82 23a6 6 0 0 0-10 2l-6-1a9 9 0 0 0-3-7l4-5a7 7 0 1 0-1-1l-5 5c-2-1-4-2-6-1V33h-4v38l-31-38h-3v46h4V41l30 38h4V66l5-1 3 5a5 5 0 1 0 2-1l-3-5c2-1 3-3 3-5l7 1 1 3a6 6 0 1 0 9-7ZM60 55l5-4a12 12 0 0 0-4-17l-4-1H30v52a3 3 0 0 0 5 3l14-9h3l7-1 5-2a10 10 0 0 0 5-9l-2-8-7-4ZM43 43h9l2 1a3 3 0 0 1 1 3l-1 3-3 1h-8v-8Zm12 24-3 1h-9v-8h10a3 3 0 0 1 2 1l1 3a4 4 0 0 1-1 3Z" />
						</g>
						<defs>
							<clipPath id="a">
								<path fill="#fff" transform="translate(30 32)" d="M0 0h442v56H0z" />
							</clipPath>
						</defs>
					</svg>
				</div>
		<!--
		  <h1 class="text-lg mt-6">Built in collaboration with Faith Comes By Hearing</h1>
		  <p class="text-stone-200 text-sm"></p>
		  -->
				<div class="mt-6 flex">
					<div class="relative ml-auto flex-1 pl-8 sm:block hidden">
						<input
							placeholder="Search"
							type="text"
							class="w-full border rounded border-stone-400 h-full focus:outline-none pl-4 pr-8 text-stone-700 text-sm text-stone-500"
						/>
						<svg
							stroke="currentColor"
							class="w-4 h-4 absolute right-0 top-0 mt-3 mr-2 text-stone-500"
							stroke-width="2"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							viewBox="0 0 24 24"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="M21 21l-4.35-4.35" />
						</svg>
					</div>
				</div>
			</div>
			<div class="overflow-y-scroll flex-grow">
				{#if bibles && !current_books.visible}
					{#each bibles.data as bible}
						<button
							on:click={() => fetchAudioFileSet(bible.abbr, bible.filesets['dbp-prod'])}
							class="bg-stone-100 px-8 py-6 flex items-center border-b border-stone-300 w-full"
						>
							<div class="flex ml-4">
								<div class="flex flex-col pl-4">
									<h2 class="text-sm">{bible.name}</h2>
									<h3 class="text-stone-500 text-sm">{bible.vname ?? ''}</h3>
								</div>
							</div>
						</button>
					{/each}
				{/if}

				{#if current_books && current_books.visible}
				<button on:click={() => current_books.visible = false} class="bg-stone-100 px-8 py-6 flex items-center border-b border-stone-300 w-full">
					<div class="flex flex-row ml-4">
						<svg class="mr-2 h-6 w-6 text-stone-400" x-description="Heroicon name: solid/arrow-narrow-left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
							<path fill-rule="evenodd" d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd"></path>
						  </svg>
						Back
					</div>
				</button>
					{#each current_books.data as book}
						<button
							on:click={() => setCurrentChapters(book)}
							class="bg-stone-100 px-8 py-6 flex items-center border-b border-stone-300 w-full">
							<div class="flex ml-4">
								<div class="flex flex-col pl-4">
									<h2 class="text-sm">{book.name}</h2>
									<h3 class="text-stone-500 text-sm">{book.book_id ?? ''}</h3>
								</div>
							</div>
						</button>
					{/each}
				{/if}
			</div>
		</div>
		<div class="lg:w-1/2 bg-stone-600 text-white flex flex-col">
			<div class="p-8 bg-stone-700">
				{#if current_chapter}
					<audio bind:this={player} src={current_chapter} controls>
						<track kind="captions" />
					</audio>
				{/if}

				{#if current_book}
					<div class="flex ml-4">
						{current_book.book_id}

						<div class="flex flex-col pl-4">
							<h2 class="text-sm">{current_book.name}</h2>
							<h3 class="text-stone-500 text-sm">{current_book.book_group}</h3>
						</div>
					</div>
				{/if}
			</div>
			<div class="p-8 flex flex-1 items-start overflow-auto">
				<div class="flex-shrink-0 text-sm sticky top-0" />
				<div class="flex-1 pl-10">
					{#if current_book}
						<div class="flex flex-row flex-wrap">
							{#each current_book.chapters as chapter}
								<button
									on:click={() => setCurrentChapter(current_fileset, current_book.book_id, chapter)}
									class="w-12 h-12">
									{chapter}
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
