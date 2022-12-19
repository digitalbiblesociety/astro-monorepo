<script>
	export let currentTimeView;
	export let totalTimeView;
	export let progress;
</script>


<div class="w-full flex justify-between">
	<span id="progress-time">{currentTimeView}</span>
	<span id="track-duration">{totalTimeView}</span>
</div>

<div class="w-full h-4 my-2 flex items-center border-stone-200 border cursor-pointer">
	<div class="w-0 h-4 bg-blue-500" style="width: {progress}%"></div>
</div>
