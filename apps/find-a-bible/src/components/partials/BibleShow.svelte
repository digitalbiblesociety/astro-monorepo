<script>
	import { onMount } from "svelte"
	import { groupBy,toArray } from 'lodash';
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

	function fileSize(size) {
    	var i = Math.floor(Math.log(size) / Math.log(1024));
    	return (size / Math.pow(1024, i)).toFixed(2) * 1 + "\xa0" + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	}
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