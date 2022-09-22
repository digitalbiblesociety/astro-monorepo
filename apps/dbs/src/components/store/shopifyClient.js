import { get } from "svelte/store"
import Client from "shopify-buy"
import { cartID } from "../store.js"

export const client = Client.buildClient({
	domain: "store-dbs.myshopify.com",
	storefrontAccessToken: "706adfab82b426c39d1e6691ee006b18",
})

export const fetchCart = async () => {
	let cartReference = get(cartID)
	let cart
	if (cartReference) {
		cart = client.checkout.fetch(cartReference).then((checkout) => {
			cart = checkout
			return cart
		})
	} else {
		cart = client.checkout.create().then((checkout) => {
			cart = checkout
			cartID.set(btoa(cart.id))
			return cart
		})
	}
	return cart
}