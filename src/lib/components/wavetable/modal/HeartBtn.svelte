<script lang="ts">
  import { createEventDispatcher } from "svelte"

  export let value = false

  const heartEmpty =
    "m12 21l-1.45-1.3q-2.525-2.275-4.175-3.925T3.75 12.812Q2.775 11.5 2.388 10.4T2 8.15Q2 5.8 3.575 4.225T7.5 2.65q1.3 0 2.475.55T12 4.75q.85-1 2.025-1.55t2.475-.55q2.35 0 3.925 1.575T22 8.15q0 1.15-.387 2.25t-1.363 2.412q-.975 1.313-2.625 2.963T13.45 19.7zm0-2.7q2.4-2.15 3.95-3.687t2.45-2.675q.9-1.138 1.25-2.026T20 8.15q0-1.5-1-2.5t-2.5-1q-1.175 0-2.175.662T12.95 7h-1.9q-.375-1.025-1.375-1.687T7.5 4.65q-1.5 0-2.5 1t-1 2.5q0 .875.35 1.763t1.25 2.025q.9 1.137 2.45 2.675T12 18.3m0-6.825"
  const heartEmptyPlus =
    "m11 21-3.2-2.9q-1.8-1.6-3-2.9t-2.2-2.4q-.8-1-1.2-2.1T1 8.5q0-2.4 1.6-4T6.5 3q1.3 0 2.5.6T11 5q.8-1 2-1.6t2.5-.5q2 0 3.4 1.1t1.9 3h-2.2q-.4-1-1.3-1.5T15.5 5q-1.3 0-2.2.7t-1.7 1.8h-1.2q-.8-1.1-1.7-1.8T6.5 5Q5.1 5 4 6T3 8.5q0 .8.3 1.6t1.3 2q.9 1.1 2.5 2.6t3.9 3.6l1.5-1.3 1.4-1.3.3.3.4.4.5.5.3.3-1.5 1.2-1.5 1.3zm7-4v-3h-3v-2h3V9h2v3h3v2h-3v3z"
  const heartFull =
    "m12 21-1.4-1.3q-2.6-2.3-4.2-4t-2.7-2.9q-1-1.3-1.3-2.4T2 8.1q0-2.3 1.6-3.9t3.9-1.6q1.3 0 2.5.6t2 1.5q.8-1 2-1.5t2.5-.6q2.4 0 4 1.6t1.5 4q0 1.1-.4 2.2t-1.4 2.4l-2.6 3q-1.6 1.7-4.2 3.9z"
  const heartFullMinus =
    "M15 14v-2h8v2zm-4 7-3.2-2.9q-1.8-1.6-3-2.9t-2.2-2.4q-.8-1-1.2-2.1T1 8.5q0-2.4 1.6-4T6.5 3q1.3 0 2.5.5t2 1.6q.8-1 2-1.6t2.5-.5q2.1 0 3.6 1.3t1.8 3l-1-.3h-.8q-2.5 0-4.3 1.7T13 13q0 1.3.5 2.5t1.5 2l-1.2 1-1.4 1.2z"

  let hover = false
  $: currentPath = value
    ? hover
      ? heartFullMinus
      : heartFull
    : hover
      ? heartEmptyPlus
      : heartEmpty

  const dispatch = createEventDispatcher<{ change: boolean }>()

  function change() {
    value = !value
    dispatch("change", value)
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      change()
    }
  }
</script>

<svg
  class="fav-btn"
  on:click={change}
  on:keydown={onKeydown}
  on:mouseenter={() => (hover = true)}
  on:mouseleave={() => (hover = false)}
  role="button"
  tabindex="0"
  viewBox="0 0 24 24"
  xmlns="http://www.w3.org/2000/svg"
>
  <path fill="currentColor" d={currentPath} />
</svg>

<style>
  .fav-btn {
    display: flex;
    transition: transform 200ms;
  }

  .fav-btn:active {
    transition: transform 80ms;
    transform: scale(1.2);
  }
</style>
