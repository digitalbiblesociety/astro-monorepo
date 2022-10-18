<script>
	import { onMount } from "svelte"
	import { articlePage as page } from '../../store'
	const wp_url = import.meta.env.WORDPRESS_URL
	
	let articles = []
	let article_pages = []
	let article_count = 0
	
	let articles_per_page = 6
	let breadcrumbs
	let title
	
	let current_page = $page.url.searchParams.get("page") || 1
	
	function timeToRead(content) {
		var totalWords = content.trim().split(/\s+/).length
		var timeToRead = totalWords / 200
		return Math.ceil(timeToRead)
	}
	
	onMount(async () => {
		let response = await fetch(`${wp_url}posts?per_page=${articles_per_page}&page=${current_page}&categories_exclude=5`)
		article_count = response.headers.get("X-WP-Total")
		article_pages = new Int8Array(roundUp(article_count / articles_per_page, 0))
		articles = await response.json()
		console.log(articles)
	})
	
	async function loadPosts(event) {
		current_page = event.target ? event.target.dataset.page : 1
		articles = await fetch(`${wp_url}posts?per_page=${articles_per_page}&page=${current_page}&categories_exclude=5`).then((resp) => resp.json())
	}
	
	function roundUp(num, precision) {
		precision = Math.pow(10, precision)
		return Math.ceil(num * precision) / precision
	}
	</script>
	
	<div class="relative px-4 pt-8 pb-16 sm:px-6 lg:px-8">
		<div class="mx-auto px-4 mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
			{#if articles.length !== 0}
				{#each articles as article}
					<a
						class="flex flex-col overflow-hidden rounded-lg border border-gray-300 shadow-lg
								dark:border-gray-800 dark:bg-stone-600"
						href="{`/about/projects/${article.slug}`}">
						{#if article.featured_media_src_url}
							<div class="flex-shrink-0">
								<img
									class="h-48 w-full object-cover"
									src="{article.featured_media_src_url}"
									alt="${article.slug}" />
							</div>
						{/if}
						<div class="flex flex-1 flex-col justify-between p-6">
							<div class="flex-1">
								<div class="mt-2">
									<p
										class="text-xl font-semibold text-gray-900 dark:text-gray-200">
										{@html article.title.rendered}
									</p>
									<p class="mt-3 text-base text-gray-500 dark:text-gray-300">
										{@html article.excerpt.rendered}
									</p>
								</div>
							</div>
	
							<div class="mt-6 flex items-center">
								{#if article.author_avatar_url}
									<div class="flex-shrink-0">
										<img
											class="h-10 w-10 rounded-full"
											src="{article.author_avatar_url}"
											alt="{article.title.rendered}" />
									</div>
								{/if}
								<div class="ml-3">
									{#if article.author_full_name}
										<div
											class="text-sm font-medium text-gray-900 dark:text-gray-300">
											{article.author_full_name}
										</div>
									{/if}
									<div
										class="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
										<p
											class="text-sm font-medium text-blue-400 dark:text-gray-200">
											<span class="hover:underline">
												{new Date(article.date).toDateString()}
											</span>
										</p>
										<span aria-hidden="true">&middot;</span>
										<span class="info">
											{timeToRead(article.content.rendered)} min read
										</span>
									</div>
								</div>
							</div>
						</div>
					</a>
				{/each}
			{/if}
		</div>
	</div>
	
	<nav
		class="mb-12 flex items-center justify-between border-b border-gray-200 px-4 py-3 sm:px-6"
		aria-label="current_page">
		<div class="hidden sm:block">
			<p class="text-sm text-gray-700 dark:text-gray-200">
				{$t("common.Showing")}
				<span class="font-medium">
					{current_page !== 1
						? articles_per_page * current_page - articles_per_page
						: 1}
				</span>
				-
				<span class="font-medium">
					{current_page !== 1
						? articles_per_page * current_page
						: articles_per_page * current_page}
				</span>
				&nbsp; | &nbsp;
				<span class="font-medium">{article_count}</span>
				{$t("common.Articles")}
			</p>
		</div>
	
		<div class="flex flex-1 justify-between text-sm sm:justify-end">
			{#if current_page > 1}
				<div
					on:click="{loadPosts}"
					data-page="{Number(current_page) - 1}"
					class="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-stone-700 dark:text-gray-200">
					{$t("common.Previous")}
				</div>
			{/if}
			{#if current_page < article_pages.length}
				<div
					on:click="{loadPosts}"
					data-page="{Number(current_page) + 1}"
					class="ml-3 cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:bg-stone-700 dark:text-gray-200">
					{$t("common.Next")}
				</div>
			{/if}
		</div>
	</nav>
	