<script>
	import Datatable from '~/components/datatable/Datatable.svelte'

	export let locale
	export let organization

	const bibles = organization.bibles.map(bible => {
		return {
			id: bible.id,
			tt: bible.title,
			tv: bible.title_vernacular,
			iso: bible.iso,
			dt: bible.date,
			ln: bible.language.name
		}
	})
</script>
	
{#if organization}

<div class="relative flex flex-col -mb-9 pb-5 xl:rounded-tl-xl xl:rounded-tr-xl text-gray-100 text-2xl text-center h-32"
	style="background-image: linear-gradient(to bottom right, {organization.colors.primary}, {organization.colors.secondary});">
	<div class="start">
	</div>
	<h1 class="text-center text-3xl font-extrabold leading-8 tracking-wider text-white-900 xl:text-4xl">{organization.name}</h1>
	<div class="absolute top-0 right-4 sm:right-0 flex">
		<a class="p-1" href={organization.url_website}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
			  </svg>
		</a>
		<a class="p-1" href={organization.url_facebook}>
			
		</a>
		<a class="p-1" href={organization.url_donate}>
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
			</svg>
		</a>
		<a class="p-1" href={organization.url_twitter}>
		
		</a>
	</div>
</div>

	<div class="max-w-5xl mx-auto">

		{#if bibles.length != 0}
			<Datatable inputData={bibles} locale={locale} tableType="bibles" client:visible />
		{/if}

	</div>
{/if}