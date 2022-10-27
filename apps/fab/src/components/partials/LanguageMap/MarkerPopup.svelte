<script>
	export let language;
	export let locale;
</script>

<a href={`/${locale}/languages/${language.iso}`}>
	{language.name}
	{language.autonym}
</a>