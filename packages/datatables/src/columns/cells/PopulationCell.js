export default function (locale) {
	return {
		header: "Population",
		accessor: "po",
		cell: ({ value }) => (value) ? value.toLocaleString(locale) : ''
	}
}