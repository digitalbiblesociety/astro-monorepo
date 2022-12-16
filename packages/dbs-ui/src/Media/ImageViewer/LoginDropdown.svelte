<script>
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
</script>

<Menu>
	<MenuButton class="flex rounded-md mt-3 text-sm dark:border-stone-800 text-stone-700 dark:text-stone-200" aria-label="Language Select">

		<div>
			<button type="button" class="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
				<span class="sr-only">Open user menu</span>
				<img class="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80" alt="">
			</button>
		</div>

	</MenuButton>
	<MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
		<MenuItem class="block px-4 py-2 text-sm text-stone-700">Sign out</MenuItem>
		<MenuItem class="block px-4 py-2 text-sm text-stone-700">Your profile</MenuItem>
	</MenuItems>
</Menu>