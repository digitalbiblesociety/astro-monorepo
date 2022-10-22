export default function (locale, t) {
	return {
		header: t?.population ?? "Population",
		accessor: "po",
		cell: ({ value }) => (value) ? value.toLocaleString(locale) : ''
	}
}