export default function (locale, t) {
	return {
		header: t?.population ?? "Population",
		id: 'po',
		accessor: "po",
		cell: ({ value }) => (value) ? value.toLocaleString(locale) : ''
	}
}