export function groupBy(arr, criteria) {
	const newObj = arr.reduce(function (acc, currentValue) {
	  if (!acc[currentValue[criteria]]) {
		acc[currentValue[criteria]] = [];
	  }
	  acc[currentValue[criteria]].push(currentValue);
	  return acc;
	}, {});
	return newObj;
}

export async function fetchLibrary () {
	const libs = await import.meta.glob('../data/*.json', { as: 'raw' });
	const lib = Object.keys(libs).filter(lib => lib.includes(import.meta.env.PUBLIC_LIBRARY))
	return await libs[lib]().then((library) => {
			return JSON.parse(library)
	});
}