<script>
import { scope } from '~/utils/env'

export let path;
export let item;
export let icon;
</script>

<li class="flow-root">
	<a href={path} class="-m-3 flex justify-center py-2 px-1 transition duration-150 ease-in-out hover:bg-stone-100 dark:hover:bg-stone-900">
		<div class="hidden mt-2 flex-shrink-0 text-stone-400 sm:block">
			{#if icon}
				<div>{ @html icon }</div>
			{:else}
				{#if item.ci && (scope == 'all')}
					<svg class="mr-1 inline-block h-5 w-5 drop-shadow-md"><use href="/img/flags.svg#{item.ci}" xlink:href="#{item.ci}"></use></svg>
				{/if}
			{/if}
		</div>
		<div class="min-w-0 flex-1 ml-1">
			<h4 class="truncate text-stone-900 dark:text-stone-200">{item.tt}</h4>
			{#if item.tt !== item.tv && (item.tv != undefined)}
				<p class="truncate mt-1 text-sm text-stone-500 dark:text-stone-300">{item.tv}</p>
			{/if}
		</div>
	</a>
</li>