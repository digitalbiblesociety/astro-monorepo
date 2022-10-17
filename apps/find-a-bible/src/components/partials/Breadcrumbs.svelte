<script>
	export let breadcrumbs
</script>

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