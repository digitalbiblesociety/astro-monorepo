<script>
	import { Menu, MenuButton, MenuItems, MenuItem } from "@rgossiaux/svelte-headlessui"
	import {KNOWN_LANGUAGES} from '../../config.mjs';

	export let url;
</script>

	<Menu>
		<MenuButton class="flex rounded-md p-1 md:px-2.5 text-sm border border-gray-100 bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200" aria-label="Language Select">
			 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 dark:placeholder-gray-400 md:mr-2">
				<path d="M7.75 2.75a.75.75 0 00-1.5 0v1.258a32.987 32.987 0 00-3.599.278.75.75 0 10.198 1.487A31.545 31.545 0 018.7 5.545 19.381 19.381 0 017 9.56a19.418 19.418 0 01-1.002-2.05.75.75 0 00-1.384.577 20.935 20.935 0 001.492 2.91 19.613 19.613 0 01-3.828 4.154.75.75 0 10.945 1.164A21.116 21.116 0 007 12.331c.095.132.192.262.29.391a.75.75 0 001.194-.91c-.204-.266-.4-.538-.59-.815a20.888 20.888 0 002.333-5.332c.31.031.618.068.924.108a.75.75 0 00.198-1.487 32.832 32.832 0 00-3.599-.278V2.75z" />
				<path fill-rule="evenodd" d="M13 8a.75.75 0 01.671.415l4.25 8.5a.75.75 0 11-1.342.67L15.787 16h-5.573l-.793 1.585a.75.75 0 11-1.342-.67l4.25-8.5A.75.75 0 0113 8zm2.037 6.5L13 10.427 10.964 14.5h4.073z" clip-rule="evenodd" />
			  </svg>
		</MenuButton>
	
		<MenuItems
			class="absolute w-28 rounded-md bg-white drop-shadow-lg dark:bg-gray-800">
			{#each Object.keys(KNOWN_LANGUAGES) as iso}
				<MenuItem
					class="block cursor-pointer py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
					on:click="{() => window.location.href = `/${iso}/${url}`}">
					{ KNOWN_LANGUAGES[iso] }
				</MenuItem>
			{/each}
		</MenuItems>
	</Menu>
	