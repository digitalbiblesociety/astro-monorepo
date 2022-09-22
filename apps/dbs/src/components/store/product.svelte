<script>
	import { onMount } from "svelte"
	import { client, fetchCart } from "./shopifyClient"
	import {locale, cartQuantity } from "~/components/store.js"
	
	export let handle;
	
	let t
	let quantity = 1
	let current_variation = ""
	let product
	let cart
	let current_price
	let selected_img
	
	onMount(async () => {
		cart = await fetchCart()
	})
	
	client.product.fetchByHandle(handle).then((current_product) => {
		product = current_product
		current_variation = product.variants[0].id
		selected_img = product.variants[0].image.src
		current_price = price(product.variants[0].price)
	})

	function addToCart() {
		const checkout_params = {
			variantId: btoa(current_variation),
			quantity: quantity,
		}
		cartQuantity.set($cartQuantity + quantity)
		client.checkout
			.addLineItems(btoa(cart.id), checkout_params)
			.then((checkout) => {
				window.location.assign("/en/store/cart")
			})
	}
	

	
	function price(itemPrice) {
		const amount = Number(itemPrice).toFixed(2)
		return amount + " " + "USD"
	}
</script>

	{JSON.stringify(cart)}
	
	{#if product}
		<div class="pt-6 pb-16 sm:pb-24">
			<nav aria-label="Breadcrumb" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<ol class="flex items-center space-x-4">
					<li>
						<div class="flex items-center">
							<span
								class="mr-4 text-sm font-medium text-gray-900 dark:text-gray-400">
								{product.productType}
							</span>
							<svg
								viewBox="0 0 6 20"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
								class="h-5 w-auto text-gray-300">
								<path
									d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z"
									fill="currentColor">
								</path>
							</svg>
						</div>
					</li>
	
					<li class="text-sm">
						<span
							aria-current="page"
							class="font-medium text-gray-500 hover:text-gray-600 dark:text-gray-200">
							{product.title}
						</span>
					</li>
				</ol>
			</nav>
	
			<div class="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
				<div class="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
					<div class="lg:col-span-5 lg:col-start-8">
						<div class="flex justify-between">
							<h1 class="text-xl font-medium text-gray-900 dark:text-gray-200">
								{product.title}
							</h1>
							<p class="text-xl font-medium text-gray-900 dark:text-gray-200">
								{current_price}
							</p>
						</div>
						<div class="mt-10">
							<div
								class="prose prose-sm mt-4 text-center text-gray-500 dark:text-gray-300">
								<p>{@html product.description}</p>
							</div>
						</div>
					</div>
	
					<div
						class="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
						<h2 class="sr-only">Images</h2>
	
						<div class="grid grid-cols-1 lg:grid-cols-2 lg:gap-2">
							<img
								src="{product.images[0].src}"
								alt="{product.images[0].altText}"
								class="mx-auto max-h-96 rounded-lg lg:col-span-2 lg:row-span-2" />
						</div>
					</div>
	
					<div class="mt-8 lg:col-span-5">
						<form>
							<div class="mt-8">
								<div class="flex items-center justify-between">
									<h2
										class="text-sm font-medium text-gray-900 dark:text-gray-200">
										Medium
									</h2>
								</div>
	
								<fieldset class="mt-2">
									<legend class="sr-only">Select a Variation</legend>
									<div class="flex">
										{#if product.variants.length > 1}
											{#each product.variants as variant}
												<input
													value="{variant.id}"
													type="radio"
													name="variant[]"
													class="sr-only"
													disabled="{variant.quantityAvailable === 0}" />
												<label
													for="{variant.id}"
													on:click="{() => {
														current_variation = variant.id
														current_price = price(variant.priceV2.amount)
													}}"
													class="{current_variation == variant.id
														? 'bg-primary-600 text-white'
														: 'text-gray-800 dark:text-gray-300'} mx-1 flex cursor-pointer flex-col items-center justify-center rounded-md p-3 text-sm font-medium uppercase focus:outline-none dark:bg-gray-800 sm:flex-1">
													{variant.title}
													<div class="text-sm">
														{price(variant.priceV2.amount)}
													</div>
												</label>
											{/each}
										{:else}
											<div class="product-page-price is-solo"></div>
										{/if}
									</div>
								</fieldset>
							</div>
	
							<label
								class="mt-4 text-sm font-medium text-gray-900 dark:text-gray-200">
								Quantity
								<input
									class="mt-4 w-full rounded-md border dark:border-gray-700 dark:bg-gray-800"
									type="number"
									name="quantity"
									min="0"
									max="{product.variants[0].quantityAvailable}"
									bind:value="{quantity}" />
							</label>
	
							<button
								type="submit"
								on:click|preventDefault="{addToCart}"
								class="button mt-6 w-full py-2"
								class:opacity-50="{product.variants.length > 1 &&
									current_variation === ''}"
								disabled="{product.variants.length > 1 &&
									current_variation === ''}">
								{product.variants.length > 1 && current_variation === ""
									? "Select a Variation"
									: "Add to cart"}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	{/if}	