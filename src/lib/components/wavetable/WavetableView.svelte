<script lang="ts">
  import { fetchTable } from "./fetch-tables"
  import { get } from "svelte/store"
  import { globalStore } from "src/lib/global"
  import { onMount } from "svelte"
  import { wavetableStore } from "./wavetable"
  import DownloadBtn from "../common/DownloadBtn.svelte"
  import ImportBtn from "../common/ImportBtn.svelte"
  import Modal from "./Modal.svelte"
  import type { ComponentType, SvelteComponent } from "svelte"
  import View2d from "./View2d.svelte"

  export let width = 380
  export let height = 250
  export let color = 0xabdc96

  $: bufferStore = wavetableStore.bufferStore
  $: frameStore = wavetableStore.frameStore
  $: nameStore = wavetableStore.nameStore

  let frameCount = 1
  let cachedFrameCount = frameCount

  let modalOpen = false

  type Comp = ComponentType<SvelteComponent>
  type Views = "2D" | "3D" | "SP"
  export let view: Views = "2D"

  const views: Record<Views, { promise: () => Promise<{ default: Comp }>; component: Comp | null }> = {
    "2D": {
      promise: () => new Promise(r => r),
      component: View2d,
    },
    "3D": {
      promise: () => import("./View3d.svelte"),
      component: null,
    },
    SP: {
      promise: () => import("./ViewSpectral.svelte"),
      component: null,
    },
  }

  updateWavetable()
  function updateWavetable() {
    cachedFrameCount = frameCount
    frameCount = Math.floor(get(wavetableStore.bufferStore).length / $globalStore.windowSize)

    wavetableStore.frameStore.update(frame => Math.floor(((frame - 1) * frameCount) / cachedFrameCount) + 1)
  }

  async function onPickStockWavetable({ detail: [collectionName, tableName] }: CustomEvent<[string, string]>) {
    const buffer = await fetchTable(collectionName, tableName)

    nameStore.set(tableName)
    updateImportedWavetable(buffer)
  }

  function updateImportedWavetable(buffer: Float32Array) {
    bufferStore.set(buffer)
    updateWavetable()
  }

  function nextView() {
    // prettier-ignore
    switch (view) {
      case "2D": view = "3D"; break
      case "3D": view = "SP"; break
      case "SP": view = "2D" ;break
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

<div>
  <section class="topbar">
    <DownloadBtn />
    <ImportBtn on:input={e => updateImportedWavetable(e.detail)} />

    <div style:display="flex" style:flex="1">
      <button>{"<"}</button>
      <button on:click={() => (modalOpen = true)} style:flex="1" style:text-align="center">{$nameStore}</button>
      <button>{">"}</button>
    </div>

    {#if modalOpen}
      <Modal on:change={onPickStockWavetable} on:close={() => (modalOpen = false)} />
    {/if}
  </section>

  <div class="window" aria-hidden="true" style:width="{width}px" style:height="{height}px" on:click={nextView}>
    <span class="viewmode" style:color="#{color.toString(16).slice(0, 6)}">{view}</span>
    {#if isLoaded}
      <svelte:component this={currentView} {color} {width} {height} />
    {/if}
  </div>

  <label>
    Frame
    <input type="range" min="1" max={frameCount} step="1" bind:value={$frameStore} />
  </label>
</div>

<style>
  .topbar {
    display: flex;
  }

  .window {
    background: #222;
    position: relative;
    cursor: pointer;
    padding: 8px;
    border-radius: 8px;
  }

  .viewmode {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    width: fit-content;
    padding: 2px 8px;
    border: 2px solid currentColor;
    user-select: none;
    border-radius: 5px;
  }
</style>
