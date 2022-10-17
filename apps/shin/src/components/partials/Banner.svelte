<script>
	export let breadcrumbs
	export let background
	export let translations
	export let tabs
</script>
<div class="relative overflow-hidden xl:rounded-tl-xl xl:rounded-tr-xl text-center h-44">
	<div class="relative flex flex-col h-full text-white z-30">
		{#if breadcrumbs}
			{#if breadcrumbs.length > 0}
				<nav class="flex py-2 md:pl-4" aria-label="Breadcrumb">
					<div class="flex sm:hidden">
						<a
							href="{breadcrumbs[breadcrumbs.length - 2].link}"
							class="group inline-flex space-x-3 text-sm pl-4">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
								<path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							<span>{breadcrumbs[breadcrumbs.length - 2].title}</span>
						</a>
					</div>
					<div class="hidden sm:block">
						<ol role="list" class="flex items-center space-x-2">
							<li class="hidden md:flex">
								<div>
									<a href="/">
										<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
											<path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
										</svg>
										<span class="sr-only">Home</span>
									</a>
								</div>
							</li>
							{#each breadcrumbs as breadcrumb, index}
								<li>
									<div class="flex items-center">
										<svg
											class="h-5 w-5 flex-shrink-0"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20"
											aria-hidden="true">
											<path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z">
											</path>
										</svg>
	
										{#if index + 1 == breadcrumbs.length}
											<span
												class="ml-2 text-sm max-w-xs md:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
												{breadcrumb.title}
											</span>
										{:else}
											<a
												href="{breadcrumb.link}"
												class="ml-2 text-sm">
												{breadcrumb.title}
											</a>
										{/if}
									</div>
								</li>
							{/each}
						</ol>
					</div>
				</nav>
			{/if}
		{/if}

		<div class="flex flex-col flex-grow justify-center items-center">
			<h1 class="text-4xl font-extrabold leading-8 tracking-wider sm:text-2xl">{translations?.title ?? ''}</h1>
			<h2 class="text-xl">{translations?.subtitle ?? ''}</h2>
		</div>

		{#if tabs}
			<nav class="flex flex-row justify-center divide-x divide-gray-200 rounded-tl-lg rounded-tr-lg w-1/2 lg:w-1/3 mx-auto">
				{#each tabs as tab,i}
				<a href={`/${tab.url}`} 
				class:rounded-tl-lg={i == 0}
				class:rounded-tr-lg={i == (tabs.length - 1)}
				class="flex flex-grow justify-center bg-gray-50 bg-opacity-50 text-gray-800 border-transparent hover:border-emerald-600 hover:bg-emerald-600 hover:text-gray-200 whitespace-nowrap py-2 border-b-2 text-sm">
					{tab.title}
					{#if tab.count}
						<span class="bg-gray-100 text-gray-900 hidden ml-3 py-0.5 px-2.5 rounded-full text-xs md:inline-block">{tab.count}</span>
					{/if}
				  </a>
				{/each}
			</nav>
		{/if}
		<slot name="tabs"></slot>
	</div>

	<picture>
		<!-- <source srcset="{background}.webp" type="image/webp"> -->
		<source srcset="/img/banner/{background}.jpg" type="image/jpeg">
		<!-- svelte-ignore a11y-missing-attribute -->
		<img class="object-cover h-full w-full inset-0 absolute z-10" src="/img/{background}.jpg" role="presentation" />
	</picture>

	<div class="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-r from-primary-500 via-primary-800 to-secondary-500 opacity-80 z-20"></div>
</div>