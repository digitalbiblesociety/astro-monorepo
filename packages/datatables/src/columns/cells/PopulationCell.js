export default function (locale) {
	return {
		header: "Population",
		cell: ({ value }) => value.toLocaleString(locale),
		accessor: "population",
	}
}