
type CountryScope = 'all' | 'MX' | 'IN' | 'EC'
export const scope: CountryScope = import.meta.env.COUNTRY_SCOPE

type ColorScope = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'red' | 'orange' | 'amber' |  'yellow' | 
	'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
export const colorPrimary: ColorScope = import.meta.env.COLOR_PRIMARY
export const colorSecondary: ColorScope = import.meta.env.COLOR_SECONDARY