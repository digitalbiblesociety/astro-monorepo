export default function (locale) {
	return {
		header: "Population",
		cell: ({ value }) => (value) ? value.toLocaleString(locale) : '',
		accessor: "population",
	}
}