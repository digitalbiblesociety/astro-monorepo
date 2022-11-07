import Banner from './src/Banner.astro'
import i18n from './src/i18n.js'
import LanguageSwitcher from './src/LanguageSwitcher.svelte'
import BibleLinks from './src/Partials/BibleLinks.astro'
import BibleAsideBar from './src/Partials/BibleAsideBar.astro'
import ScriptlessTable from './src/ScriptlessTable.astro'
import Map from './src/Map/Map.svelte'
import AudioBiblePlayer from './src/Media/AudioBiblePlayer.svelte'

export {
    AudioBiblePlayer,
    Banner,
    BibleLinks,
    BibleAsideBar,
    ScriptlessTable,
    LanguageSwitcher,
    Map,
    i18n
}