<script>
	import { Render, Subscribe } from 'svelte-headless-table';

	export let headerRows
</script>


<thead class="bg-stone-50 dark:bg-stone-900">
	{#each headerRows as headerRow (headerRow.id)}
	  <Subscribe attrs={headerRow.attrs()} let:attrs>
		<tr {...attrs}>
		  {#each headerRow.cells as cell (cell.id)}
			<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
			  <th
				class="px-3 py-3.5 text-left text-sm font-semibold text-stone-900 dark:text-stone-200"
				{...attrs}
				on:click={props.sort.toggle}
				class:sorted={props.sort.order !== undefined}
			  >
				<div class="flex flex-row cursor-pointer">
				  <Render of={cell.render()} />
				  {#if props.sort.order === 'asc'}
				  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
					<path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
				  </svg>				  
				  {:else if props.sort.order === 'desc'}
				  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
					<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
				  </svg>	  
				  {/if}
				</div>
				<!--
				{#if !props.group.disabled}
				  <button on:click|stopPropagation={props.group.toggle}>
					{#if props.group.grouped}
					  ungroup
					{:else}
					  group
					{/if}
				  </button>
				{/if}
				-->
				<!--
				{#if props.filter !== undefined}
				  <Render of={props.filter.render} />
				{/if}
				-->
			  </th>
			</Subscribe>
		  {/each}
		</tr>
	  </Subscribe>
	{/each}
  </thead>