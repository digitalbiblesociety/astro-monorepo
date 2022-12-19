<script>

import {mobileMenuOpen} from '~/components/store.js'

</script>
<button
type="button"
class="ml-2.5 inline-flex items-center justify-center rounded-md bg-primary-400 p-1 text-stone-100 hover:text-white focus:outline-none
focus:ring-2 focus:ring-inset focus:ring-stone-600 dark:bg-stone-800 dark:focus:ring-black md:hidden"
on:click="{() => mobileMenuOpen.set(!$mobileMenuOpen)}"
aria-controls="mobile-menu"
aria-label="Mobile Menu"
aria-expanded="{mobileMenuOpen ? 'true' : 'false'}">
<span class="sr-only">Open menu</span>
{#if $mobileMenuOpen}
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
		<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
	</svg>  
{:else}
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
	<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>  
{/if}
</button>