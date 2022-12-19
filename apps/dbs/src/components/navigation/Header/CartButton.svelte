<script>
import { cartQuantity } from "~/components/store.js"
import { onMount } from 'svelte';

let locale = ``;

onMount(() => locale = window.location.pathname.split("/")[1]);

if ($cartQuantity < 0) {
	cartQuantity.set(0)
}
</script>

<div class="flow-root">
	<a class="relative flex items-center p-2" href={`/${locale}/store/cart`}>

		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-6 w-6 flex-shrink-0 text-stone-100 group-hover:text-stone-500 dark:text-stone-200">
			<path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
		</svg>

			{#if $cartQuantity}
			<span
				class="absolute bottom-0 right-0 -mb-1 h-5 w-5 rounded-full bg-primary-400 text-center text-sm font-medium text-stone-50 group-hover:text-stone-500"
				class:w-8="{$cartQuantity > 99}">
				{$cartQuantity < 1000 ? $cartQuantity : "1K+"}
			</span>
			{/if}


		<span class="sr-only">items in cart, view bag</span>
	</a>
</div>
