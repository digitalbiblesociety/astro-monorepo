import { writable } from "svelte/store"
import { localStore } from "./localstore.js"

export const cartID = localStore("cartID", "")
export const selected = writable([])
export const locale = writable("en")
export const cartQuantity = localStore("cartQuantity", 0)

export const mobileMenuOpen = writable(false)
export const articlePage = writable(1)