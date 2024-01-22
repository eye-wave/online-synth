<script lang="ts">
  import { onMount } from "svelte"
  import type { ComponentType, SvelteComponent } from "svelte"
  import View2d from "./View2d.svelte"

  export let width = 480
  export let height = 360
  export let wavetable: Float32Array
  export let frame: number
  export let framesize: number
  export let color = 0x6bdb9620

  type Comp = ComponentType<SvelteComponent>
  type Views = "2d" | "3d" | "sp"
  export let view: Views = "2d"

  const views: Record<Views, { promise: () => Promise<{ default: Comp }>; component: Comp | null }> = {
    "2d": {
      promise: () => new Promise(r => r),
      component: View2d,
    },
    "3d": {
      promise: () => import("./View3d.svelte"),
      component: null,
    },
    sp: {
      promise: () => import("./ViewSpectral.svelte"),
      component: null,
    },
  }

  function nextView() {
    switch (view) {
      case "2d":
        view = "3d"
        break
      case "3d":
        view = "sp"
        break
      case "sp":
        view = "2d"
        break
    }

    loadComponent()
  }

  let currentView: Comp | null = View2d
  let isLoaded = true

  onMount(loadComponent)

  async function loadComponent() {
    if (views[view].component === null) {
      isLoaded = false
      const component = await views[view].promise()
      views[view].component = component.default
      isLoaded = true
    }

    currentView = views[view].component
  }
</script>

<div style:width="{width}px" style:height="{height}px">
  <button on:click={nextView}>{view}</button>
  {#if isLoaded}
    <svelte:component this={currentView} {framesize} {color} {wavetable} {width} {height} {frame} />
  {:else}
    <p>Loading...</p>
  {/if}
</div>
