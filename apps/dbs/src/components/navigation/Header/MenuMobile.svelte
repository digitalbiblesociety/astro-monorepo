<script>
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
	Transition,
} from "@rgossiaux/svelte-headlessui"

import { mobileMenuOpen } from "~/components/store.js"

export let pages
</script>

{#if $mobileMenuOpen == true}
	<!-- Mobile menu, show/hide based on menu state. -->
	<nav aria-label="Global" id="mobile-menu">
		<div class="space-y-1 bg-gray-100 px-2 pt-2 pb-3 text-gray-800 dark:bg-stone-900 dark:text-gray-200">
			<!-- Current: "bg-gray-100 text-gray-900", Default: "text-gray-900 hover:bg-gray-50 hover:text-gray-900"
		  <a href="#" class="bg-gray-100 text-gray-900 block rounded-md py-2 px-3 text-base font-medium" aria-current="page">Dashboard</a> -->
			{#each pages as page}
				{#if !page.nested}
					<a
						href="{page.href}"
						on:click="{() => ($mobileMenuOpen = !$mobileMenuOpen)}"
						class="block w-full rounded-md py-2 px-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700">
						{page.title}
					</a>
				{:else}
					<Disclosure let:open>
						<DisclosureButton
							class="flex w-full place-items-center justify-center rounded-md py-2 px-3 text-center text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700">
							{page.title}
							

							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" style={open ? "transform: rotate(180deg);" : ""}>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
							</svg>

						</DisclosureButton>
						<!-- This example uses Tailwind's transition classes -->
						<Transition
							enter="transition duration-100 ease-out"
							enterFrom="transform scale-95 opacity-0"
							enterTo="transform scale-100 opacity-100"
							leave="transition duration-75 ease-out"
							leaveFrom="transform scale-100 opacity-100"
							leaveTo="transform scale-95 opacity-0">
							<DisclosurePanel
								class="flex flex-col place-items-center justify-center">
								{#each page.nested as link}
									<a
										target="{link.target}"
										href="{link.href}"
										on:click="{() => ($mobileMenuOpen = !$mobileMenuOpen)}"
										class="flex w-full items-center rounded-md py-2 px-3 text-sm font-medium text-gray-900 hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-700">
										<div class="mx-auto flex w-1/2">
											{#if link.icon}
												<div
													class="{link.class} mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md ">
													{@html link.icon}
												</div>
											{/if}
											<div class="ml-4">
												<p
													class="text-sm font-semibold text-gray-700 dark:text-gray-200 dark:hover:text-white">
													{link.title}
												</p>
												<p
													class="-mt-0.5 text-xs leading-4 text-gray-600 dark:text-gray-200 dark:hover:text-white">
													{link.long}
												</p>
											</div>
										</div>
									</a>
								{/each}
							</DisclosurePanel>
						</Transition>
					</Disclosure>
				{/if}
			{/each}
		</div>
	</nav>
{/if}
