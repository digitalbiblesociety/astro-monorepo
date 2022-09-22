<script>
	import { onMount } from "svelte"
	import { fetchCart, client } from "./shopifyClient"
	import { cartQuantity, cartID } from "../store.js"

	let cart = {}
	onMount(async () => {
		cart = await fetchCart()
	})
	
	function changeQuantity(itemID, quantity) {
		const lineItemsToUpdate = [{ id: btoa(itemID), quantity: parseInt(quantity) }]
	
		cart.lineItems.forEach((lineItem) => {
			if (lineItem.id === itemID) {
				let diff = Math.abs(lineItem.quantity - quantity)
				cartQuantity.set(
					quantity > lineItem.quantity
						? $cartQuantity + diff
						: $cartQuantity - diff
				)
			}
		})
	
		client.checkout
			.updateLineItems(btoa(cart.id), lineItemsToUpdate)
			.then((checkout) => {
				cart = checkout
			})
	}
	
	function removeItem(itemID) {
		// Clear Local Storage
		cart.lineItems.forEach((lineItem) => {
			if (lineItem.id === itemID) {
				cartQuantity.set($cartQuantity - lineItem.quantity)
			}
		})
	
		client.checkout
			.removeLineItems(btoa(cart.id), [btoa(itemID)])
			.then((checkout) => {
				cart = checkout
			})
	}
	
	function checkout() {
		//window.location.assign(cart.webUrl);
	}
	</script>
	
	<div class="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 lg:max-w-7xl lg:px-8">
		<h1
			class="flex items-center text-2xl font-bold text-gray-900 dark:text-gray-200 ">
			shopping {JSON.stringify(cart,null, 4)}
		</h1>
		<div
			class="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
			<section aria-labelledby="cart-heading" class="lg:col-span-7">
				<h2 id="cart-heading" class="sr-only">items</h2>
	
				<ul
					class="divide-y divide-gray-200 border-t border-b border-gray-200 dark:divide-gray-800 dark:border-gray-800">
					{#if cart.lineItems}
						{#each Object.keys(cart.lineItems) as key}
							{#if key !== "type"}
								<li class="flex py-6 sm:py-10">
									<div class="flex-shrink-0">
										<img
											src="{cart.lineItems[key]['variant'].image.src}"
											alt="{cart.lineItems[key]['variant'].image.altText}"
											class="h-auto w-24" />
									</div>
	
									<div class="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
										<div
											class="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
											<div>
												<div class="flex justify-between">
													<h3 class="text-sm">
														<span
															class="font-medium text-gray-700 hover:text-gray-800 dark:text-gray-300">
															{cart.lineItems[key].title}
														</span>
													</h3>
												</div>
												<div class="mt-1 flex text-sm">
													<p
														class="ml-4 border-l border-gray-200 pl-4 text-gray-500 dark:border-gray-800">
														<!-- -->
													</p>
												</div>
												<p
													class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-200">
													${cart.lineItems[key]["variant"]?.price}
												</p>
											</div>
	
											<div class="mt-4 sm:mt-0 sm:pr-9">
												<label for="quantity-0" class="sr-only">
													quantity
												</label>
												<input
													type="number"
													on:change="{(e) =>
														changeQuantity(
															cart.lineItems[key].id,
															e.target.value
														)}"
													value="{cart.lineItems[key]['quantity']}"
													class="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 sm:text-sm" />
	
												<div class="absolute top-0 right-0">
													<button
														type="button"
														on:click="{() => removeItem(cart.lineItems[key].id)}"
														class="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
														<span class="sr-only">
															remove
														</span>
														X
													</button>
												</div>
											</div>
										</div>
	
										<p
											class="mt-4 flex flex-col text-sm text-gray-700 dark:text-gray-300">
											{#if cart.lineItems[key].customAttributes}
												{#each Object.keys(cart.lineItems[key].customAttributes) as attr}
													{#if attr !== "type"}
														{#if cart.lineItems[key].customAttributes[attr].key == "bibles"}
															{#each JSON.parse(cart.lineItems[key].customAttributes[attr].value) as bible}
																<a href="/bibles/{bible.id}">
																	<div
																		class="mt-2 max-w-sm overflow-hidden text-ellipsis text-sm text-gray-900 dark:text-gray-300">
																		{Object.values(bible)}
																	</div>
																</a>
															{/each}
														{/if}
													{/if}
												{/each}
											{/if}
										</p>
									</div>
								</li>
							{/if}
						{/each}
					{/if}
				</ul>
			</section>
	
			<!-- Order summary -->
			<section
				aria-labelledby="summary-heading"
				class="mt-16 rounded-lg bg-gray-50 px-4 py-6 dark:bg-gray-800 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
				<h2
					id="summary-heading"
					class="text-lg font-medium text-gray-900 dark:text-gray-200">
					order_summary
				</h2>
	
				<dl class="mt-6 space-y-4">
					<div class="flex items-center justify-between">
						<dt class="text-sm text-gray-600">subtotal</dt>
						<dd class="text-sm font-medium text-gray-900 dark:text-gray-200">
							${cart.subtotalPrice}
						</dd>
					</div>
					<div
						class="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
						<!--
						<dt class="flex items-center text-sm text-gray-600">
							<span>shipping_estimate</span>
							<span class="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500">
								<span class="sr-only">
									shipping_learn
								</span>
								?
							</span>
						</dt>
						-->
						<dd class="text-xs font-medium text-gray-800">
							shipping_checkout
						</dd>
					</div>
				</dl>
	
				<div class="mt-8">
					<button
						on:click="{() => checkout()}"
						class="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-lg font-medium text-white drop-shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
						
						checkout
					</button>
				</div>
				<button
					class="mt-4 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-400 py-1 px-3 text-sm font-medium text-white drop-shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
					onclick="history.back()">
					
					shopping_continue
				</button>
			</section>
		</div>
	</div>
	