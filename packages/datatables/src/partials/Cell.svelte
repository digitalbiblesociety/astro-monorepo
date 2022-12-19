<script>
	export let title
	export let subtitle = ''
	export let href = ''
	export let icon = undefined
	export let className = ''
</script>

<a href={href} class="hover:underline flex flex-row items-center">
	{#if icon}
		{@html icon}
	{/if}
	<div class={ className }>
		<div class="font-medium text-stone-900 dark:text-stone-100">{title ?? ''}</div>
		<div class="text-stone-500 dark:text-stone-400">{subtitle ?? ''}</div>
	</div>
</a>