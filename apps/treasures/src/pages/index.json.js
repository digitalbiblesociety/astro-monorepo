export async function get({params, request}) {
	const libs = await import.meta.glob('../data/*.json', { as: 'raw' });
	const lib = Object.keys(libs).filter(lib => lib.includes(import.meta.env.PUBLIC_LIBRARY))
	return {
		body: await libs[lib]().then((library) => {
			return library
		}),
	};
}