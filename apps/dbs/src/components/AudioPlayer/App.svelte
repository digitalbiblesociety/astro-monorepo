<script>
	import { audioData } from './audioData.js';
	
	import TrackHeading from './TrackHeading.svelte';
	import ProgressBarTime from './ProgressBarTime.svelte';
	import Controls from './Controls.svelte';
	import VolumeSlider from './VolumeSlider.svelte';
	import PlayList from './Playlist.svelte';
	
	// Get Audio track
	let trackIndex = 0;
	let audioFile = new Audio(audioData[trackIndex].url);
	let trackTitle = audioData[trackIndex].name;
	
	const loadTrack = () => {
		audioFile = new Audio(audioData[trackIndex].url);
		audioFile.onloadedmetadata = () => {
			totalTrackTime = audioFile.duration;
			updateTime();
		}
		trackTitle = audioData[trackIndex].name;
	}
	
	const autoPlayNextTrack = () => {
		if (trackIndex <= audioData.length-1) {
			trackIndex += 1;
			loadTrack();
			audioFile.play();
		} else {
			trackIndex = 0;
			loadTrack();
			audioFile.play();
		}
	}
	
	// Track Duration and Progress Bar
	let totalTrackTime;
	$: console.log(totalTrackTime)
	audioFile.onloadedmetadata = () => {
		totalTrackTime = audioFile.duration;
		updateTime();
	}
	
	let totalTimeView = "loading...";
	let currentTimeView = "0:00:00";
	let progress = 0;
	let trackTimer;
	
	function updateTime() {
		progress = audioFile.currentTime * (100 / totalTrackTime);
		
		let currentHours = Math.floor((audioFile.currentTime / 60) / 60);
		let currentMinutes = Math.floor(audioFile.currentTime / 60);
		let currentSeconds = Math.floor(audioFile.currentTime - currentMinutes * 60);
		
		let durationHours = Math.floor( (totalTrackTime / 60) / 60 );
		let durationMinutes = Math.floor( (totalTrackTime / 60) % 60 );
		let durationSeconds =  Math.floor(totalTrackTime - (durationHours*60*60) - (durationMinutes * 60));
		
		if(currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
		if(durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
		if(currentMinutes < 10) currentMinutes = `0${currentMinutes}`;
		if(durationMinutes < 10) durationMinutes = `0${durationMinutes}`;
		
		currentTimeView = `${currentHours}:${currentMinutes}:${currentSeconds}`;
		totalTimeView = `${durationHours}:${durationMinutes}:${durationSeconds}`;
		
		if (audioFile.ended) {
			toggleTimeRunning();
		}
	}
	
	const toggleTimeRunning = () => {
		if (audioFile.ended) {
			isPlaying = false;
			clearInterval(trackTimer);
			console.log(`Ended = ${audioFile.ended}`);	
		} else {
			trackTimer = setInterval(updateTime, 100);
		}
	}
	
	// Controls
	let isPlaying = false;
	$: console.log(`isPlaying = ${isPlaying}`)
	
	const playPauseAudio = () => {
		if (audioFile.paused) {
			toggleTimeRunning()
			audioFile.play();
			isPlaying = true;
		} else {
			toggleTimeRunning()
			audioFile.pause();
			isPlaying = false;
		}	 	
	}
	
	const rewindAudio = () => audioFile.currentTime -= 10;
	const forwardAudio = () => audioFile.currentTime += 10;
	
	// Volume Slider
	let vol = 50;
	const adjustVol = () => audioFile.volume = vol / 100;
	
	// Playlist
	const handleTrack = (e) => {
		if (!isPlaying) {
			trackIndex = Number(e.target.dataset.trackId);
			loadTrack();
			playPauseAudio(); // auto play
		} else {
			isPlaying = false;
			audioFile.pause();
			trackIndex = Number(e.target.dataset.trackId);
			loadTrack();
			playPauseAudio(); // auto play
		}
	}
</script>

	<TrackHeading {trackTitle} />
	<section class="flex items-center gap-6 bg-white/90 py-4 px-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
		<ProgressBarTime {currentTimeView} {totalTimeView} {progress} />
		<Controls {isPlaying} on:rewind={rewindAudio} on:playPause={playPauseAudio} on:forward={forwardAudio} />
		<VolumeSlider bind:vol on:input={adjustVol} />	
	</section>	
	<PlayList on:click={handleTrack} />
