<script>
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";

  export let name;
  export let value;
  export let delay = 0;
  export let animate = false;

  // Each component owns ONE store — $ works perfectly here
  const progress = tweened(0, { duration: 800, easing: cubicOut });

  $: if (animate) progress.set(value);
</script>

<div class="skill-item" in:fly={{ y: 14, duration: 500, delay }}>
  <div class="skill-label">
    <span>{name}</span>
    <span>{Math.round($progress)}%</span>
  </div>
  <div class="skill-track">
    <div class="skill-fill" style={`width: ${$progress}%;`} />
  </div>
</div>