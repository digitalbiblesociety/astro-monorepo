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
		<div class="font-medium text-gray-900 dark:text-gray-100">{title ?? ''}</div>
		<div class="text-gray-500 dark:text-gray-400">{subtitle ?? ''}</div>
	</div>
</a>