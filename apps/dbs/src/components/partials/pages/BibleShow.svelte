<script>
	import { onMount } from "svelte"
	import pkg from 'lodash';
  	const { toArray, groupBy } = pkg;
	import Banner from './Banner.svelte'
	export let bible

	export let translations = {
		'link_sections': {
			'print': {
				title: 'Purchase a "Print Version" of this Bible'
			},
			'pdf': {
				title: 'Direct Downloads of Ancient and Modern Texts'
			},
			'web': {
				title: 'Websites we know of that host this Bible.'
			},
			'audio': {
				title: 'Audio Bibles available for download'
			},
			'audio_web': {
				title: 'Audio Bibles to listen to online'
			},
			'app': {
				title: 'Bible Apps for your Mobile Devices.'
			},
			'archive': {
				title: 'Bibles available in a Library or Collection'
			},
			'historic': {
				title: 'Historic Bible Scans'
			},
			'cat': {
				title: 'A Storage Site for Bible Data'
			},
			'video_web': {
				title: 'Video Bibles to watch online'
			},
		}

	};

	let bible_links = {}
	onMount(async () => {
	bible_links.inscript = await fetch(
		`https://inscript.bible.cloud/content/texts/${bible.id}/info.json`,
		{ method: "HEAD" }
	).then(function (response) {
		return response.ok
	})

	bible_links.pdf = await fetch(
		`https://dbs-web.s3.us-west-2.amazonaws.com/downloads/pdf/${bible.id}/${bible.id}_us_letter.pdf`, { method: "HEAD" }).then(function (response) {
		return response.ok
	})

	bible_links.html_zip = await fetch(
		`https://dbs-web.s3.us-west-2.amazonaws.com/downloads/html_zips/${bible.id}.zip`,
		{ method: "HEAD" }
	).then(function (response) {
		return response.ok
	})

	bible_links.epub = await fetch(
		`https://dbs-web.s3.us-west-2.amazonaws.com/downloads/epub/${bible.id}.epub`,
		{ method: "HEAD" }
	).then(function (response) {
		return response.ok
	})
})

	function fileSize(size) {
    	var i = Math.floor(Math.log(size) / Math.log(1024));
    	return (size / Math.pow(1024, i)).toFixed(2) * 1 + "\xa0" + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	}

	let links = [
		{url: 'https://inscript.com/', title: 'inScript'},
		{url: `https://dbs-web.s3.us-west-2.amazonaws.com/downloads/pdf/${bible.id}/${bible.id}_us_letter.pdf`, title: 'PDF'},
		{url: 'https://dbs-web.s3.us-west-2.amazonaws.com/downloads/epub/${bible.id}.epub', title: 'epub'},
	]

</script>
{#if bible}
<Banner 
	background="banner_bibles"
	translations={{
		title: bible.title ?? '',
		subtitle: bible.title_vernacular ?? '',
		breadcrumbs: [
			{
				title: "Bibles",
				link: `/bibles`,
			},
			{
				title: bible.title,
				link: `#`,
			},
		],
	}} />
		  <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 z-30">

			  <dl class="rounded-lg bg-white shadow-lg flex flex-row justify-center py-2">

				{#if bible.iso}
				<div class="flex flex-col border-t border-gray-100 px-6 py-2 text-center sm:border-0">
				  <div class="mt-2 leading-6 text-gray-500">Language</div>
				  
					  <a 
						  class="text-lg font-extrabold text-primary-600" 
						  href="/languages/{bible.iso}">
							{bible.language.name}
							{bible.language.autonym ?? ''}
						</a>
				  
				</div>
				{/if}
	
				  {#if bible.alphabet}
				  <div class="flex flex-col border-b border-gray-100 px-6 py-2 text-center sm:border-0 sm:border-l sm:border-r">
					  <div class="mt-2 leading-6 text-gray-500">Alphabet</div>
					  <a class="text-lg font-extrabold text-primary-600"
					  href="/alphabets/{bible.script}">
					  {bible.alphabet.name ?? bible.script}
					  </a>
					</div>
					{/if}
	
				  {#if bible.date}
				  <div class="flex flex-col border-t border-b border-gray-100 px-6 py-2 text-center sm:border-0 sm:border-l sm:border-r">
					  <dt class="mt-2 leading-6 text-gray-500">Date</dt>
					  <dd class="text-lg font-extrabold text-primary-600">{bible.date}</dd>
				  </div>
				  {/if}
	
				{#if bible.country}
				<div class="flex flex-col border-t border-gray-100 px-6 py-2 text-center sm:border-0 sm:border-l">
				  <dt class="mt-2 leading-6 text-gray-500">Country</dt>
				  
					  <a 
						  class="text-lg font-extrabold text-primary-600" 
						  href="/countries/{bible.country_id}">
						  {bible.country.name}
					  </a>
				  
				</div>
				{/if}	
			  </dl>

			  {#if bible.copyright}
				 <div class="mt-4 text-center text-sm text-gray-500">{bible.copyright}</div>
			  {/if}
			  {#if bible.description}
			  	<div class="prose mx-auto">{@html bible.description}</div>
			  {/if}


		  </div>

		  <section class="overflow-hidden text-gray-600">
			<div class="container mx-auto px-5">
					<div class="col-span-2">


						<div class="bg-gray-50 my-4 rounded shadow-md">
						<div class="px-4 py-5 border-b border-gray-200 sm:px-6">
							<h3 class="text-lg leading-6 font-medium text-gray-900">Direct Downloads & Online Study Apps</h3>
							<p class="mt-1 text-sm text-gray-500"></p>
						</div>
						<div>

								<div class="bg-gray-100 flex flex-row justify-between p-4">
									<div class="flex w-1/5 text-center justify-center place-items-center"></div>
									<div class="w-4/5 grid grid-cols-2">

										{#if bible_links.inscript}
											<a target="_blank" rel="noopener noreferrer"
												class="p-2 bg-gray-200 hover:bg-gray-300 m-2 rounded flex flex-row justify-between"
												href="https://inscript.org/?w1=bible&t1=local%3A{bible.id}&v1=JN1_1">
												<span class="px-2 flex-grow truncate">Study Bible</span>
												<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
												</svg>
											</a>
										{/if}
					
									{#if bible_links.pdf}
									<a target="_blank" rel="noopener noreferrer"
									class="p-2 bg-gray-200 hover:bg-gray-300 m-2 rounded flex flex-row justify-between"
									href="https://dbs-web.s3.us-west-2.amazonaws.com/downloads/pdf/{bible.id}/{bible.id}_us_letter.pdf">
									PDF
										<svg
										class="mr-4 inline-block h-5 w-5"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 10 10">
										<path
											fill="currentColor"
											d="M.2 9.8c-.55-.57.04-1.35 1.65-2.18l1.02-.52.4-.9c.2-.49.53-1.29.71-1.78l.33-.89-.23-.66a4.86 4.86 0 0 1-.2-2.46c.24-.6 1.01-.53 1.32.1a4.15 4.15 0 0 1-.07 2.53l-.23.93.2.36a12.54 12.54 0 0 0 .74 1.05l.54.7.68-.1c2.16-.28 2.9.21 2.9.92 0 .9-1.7.97-3.12-.06a4.37 4.37 0 0 1-.54-.46s-.89.18-1.33.3c-.45.13-.68.21-1.34.44l-.38.6a6.44 6.44 0 0 1-1.7 2.02A1.12 1.12 0 0 1 .2 9.8Zm.86-.32a6.66 6.66 0 0 0 1.36-1.67l.18-.29-.8.42C.57 8.58.01 9.18.3 9.54c.17.21.36.2.76-.06Zm7.98-2.32a.49.49 0 0 0-.08-.84 2.17 2.17 0 0 0-1.17-.16c-.42.03-1.1.12-1.22.15l.54.37a7.04 7.04 0 0 0 1.15.5c.39.12.61.1.78-.02Zm-3.2-1.39a8.12 8.12 0 0 1-.7-.92 5.16 5.16 0 0 1-.38-.6s-.19.63-.34 1.01L3.93 6.5l-.14.28s.75-.25 1.12-.35c.4-.11 1.21-.28 1.21-.28ZM4.8 1.47a1.87 1.87 0 0 0-.06-1c-.35-.4-.77-.07-.7.86a6.6 6.6 0 0 0 .2 1.2l.19.6.13-.46c.07-.25.18-.79.24-1.2Z">
										</path>
										</svg>
									</a>
					
									{/if}
									{#if bible_links.html_zip}
										<a
											class="p-2 bg-gray-200 hover:bg-gray-300 m-2 rounded flex flex-row justify-between"
											href="https://dbs-web.s3.us-west-2.amazonaws.com/downloads/html_zips/{bible.id}.zip">
											HTML Download

											<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
												<path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
											</svg>
										</a>
									{/if}
									{#if bible_links.epub}
										<a
											class="p-2 bg-gray-200 hover:bg-gray-300 m-2 rounded flex flex-row justify-between"
											href="https://dbs-web.s3.us-west-2.amazonaws.com/downloads/epub/{bible.id}.epub">
											ePub
											<svg
												class="mr-4 inline-block h-5 w-5"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 16 16">
												<path
													fill="currentColor"
													d="M8 12.7 3.3 8 8 3.3l1.6 1.6L6.4 8 8 9.6l4.7-4.7-4-4.1a.9.9 0 0 0-1.3 0L.8 7.4c-.4.3-.4.9 0 1.2l6.6 6.6c.3.4.9.4 1.2 0l6.6-6.6c.4-.3.4-.9 0-1.2l-1-1L8 12.7z">
												</path>
											</svg>
										</a>
									{/if}

									</div>
								</div>

						</div>
						</div>
					</div>
	
			</div>
		</section>



	<section class="overflow-hidden text-gray-600">
		<div class="container mx-auto px-5">
				<div class="col-span-2">
					{#each toArray(groupBy(bible.links, 'type')) as link_group_type}
					{#if translations['link_sections'][link_group_type[0].type]}
					<div class="bg-gray-50 my-4 rounded shadow-md">
					<div class="px-4 py-5 border-b border-gray-200 sm:px-6">
						<h3 class="text-lg leading-6 font-medium text-gray-900">{ translations['link_sections'][link_group_type[0].type]['title'] }</h3>
						<p class="mt-1 text-sm text-gray-500">{ translations['link_sections'][link_group_type[0].type]['description'] ?? '' }</p>
					</div>
					<div>
						{#each toArray(groupBy(link_group_type, 'provider')) as link_group_provider}
							<div class="bg-gray-100 flex flex-row justify-between p-4">
								<div class="flex w-1/5 text-center justify-center place-items-center">{link_group_provider[0].provider}</div>
								<div class="w-4/5 grid grid-cols-2">
									{#each link_group_provider as link}
										<a class="p-2 bg-gray-200 hover:bg-gray-300 m-2 rounded flex flex-row justify-between" href={link.url}>
											<span class="px-2 flex-grow truncate">{link.title}</span>
											{#if link.filesize}
												<span class="text-xs justify-center place-self-center">{fileSize(link.filesize)}</span>
											{/if}
											{#if ['pdf','epub','mobi','zip'].includes(link.url.split('.').pop())}
												<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
												</svg>
											{:else}
												<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
													<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
												</svg>
											{/if}
										</a>
									{/each}
								</div>
							</div>
						{/each}
					</div>
					</div>
					{/if}
					{/each}
				</div>

		</div>
	</section>
{/if}