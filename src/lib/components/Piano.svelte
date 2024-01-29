<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { isKeyBlack } from "../utils/note"

  export let offset = 24
  export let value = [] as boolean[]
  export let numberOfKeys = 65

  type ComponentEvents = {
    keyDown: number
    keyUp: number
  }

  const dispatch = createEventDispatcher<ComponentEvents>()
  const numberOfAllKeys = 127

  $: firstKey = Math.trunc(numberOfAllKeys / 2 - numberOfKeys / 2) - 24 + offset

  let mouseDown = false

  function handleMouseDown(key: number) {
    if (!value[key]) dispatch("keyDown", key)
    value[key] = true
  }

  function handleMouseUp(key: number) {
    if (value[key]) dispatch("keyUp", key)
    value[key] = false
  }
</script>

<svelte:window on:mousedown={() => (mouseDown = true)} on:mouseup={() => (mouseDown = false)} />

<div id="piano">
  {#each Array(numberOfKeys) as _, i}
    {@const key = i + firstKey}

    <div
      aria-hidden="true"
      on:mousedown={() => handleMouseDown(key)}
      on:mouseup={() => handleMouseUp(key)}
      on:mouseleave={() => value[key] && handleMouseUp(key)}
      on:mouseenter={() => mouseDown && handleMouseDown(key)}
      on:touchstart={() => handleMouseDown(key)}
      on:touchend={() => handleMouseUp(key)}
      class="piano-key"
      class:black={isKeyBlack(key)}
      class:active={value[key]}
    ></div>
  {/each}
</div>

<style>
  #piano {
    display: flex;

    --border-radius: 4px;
    --width: 25px;
    --height: 60px;
    --black-width: 0.8;
  }

  .piano-key {
    border-radius: var(--border-radius);
    width: var(--width);
    height: var(--height);
    background: #fff;
    margin-left: 2px;
    user-select: none;
    position: relative;

    display: flex;
    align-items: flex-end;
    justify-content: center;
  }

  .piano-key:after {
    content: "";
    opacity: 0;
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: #888;
    border-radius: var(--border-radius);
  }

  .piano-key:hover:after {
    opacity: 0.5;
  }

  .piano-key.active:after {
    background: #a4a;
    opacity: 1;
  }

  .black {
    background: #000;
    width: calc(var(--width) * var(--black-width));
    margin-left: calc(var(--width) * -0.5 * var(--black-width));
    margin-right: calc(var(--width) * -0.5 * var(--black-width));
    z-index: 1;
    height: calc(var(--height) * 0.6);
  }
</style>
