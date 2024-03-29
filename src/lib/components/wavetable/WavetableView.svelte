<script lang="ts">
  import { globalConsts } from "src/lib/stores/constants"
  import { onMount } from "svelte"
  import { wavetableStore } from "./wavetable"
  import DownloadBtn from "../common/DownloadBtn.svelte"
  import ImportBtn from "../common/ImportBtn.svelte"
  import type { ComponentType, SvelteComponent } from "svelte"
  import View2d from "./View2d.svelte"
  import ArrowIcon from "ico/arrow.svg?component"

  export let width = 380
  export let height = 250
  export let color = 0xabdc96

  $: bufferStore = wavetableStore.bufferStore
  $: frameStore = wavetableStore.frameStore
  $: nameStore = wavetableStore.nameStore

  let frameCount = 1
  $: frameCount = Math.floor($bufferStore.length / globalConsts.windowSize)

  let modalOpen = false
  let Modal: ComponentType<SvelteComponent> | null = null

  type Comp = ComponentType<SvelteComponent>
  type Views = "2D" | "3D" | "SP"
  export let view: Views = "2D"

  const views: Record<
    Views,
    { promise: () => Promise<{ default: Comp }>; component: Comp | null }
  > = {
    "2D": { promise: () => new Promise(r => r), component: View2d },
    "3D": { promise: () => import("./View3d.svelte"), component: null },
    SP: { promise: () => import("./ViewSpectral.svelte"), component: null },
  }

  function onPickStockWavetable({
    detail: [collectionName, tableName],
  }: CustomEvent<[string, string]>) {
    wavetableStore.setStockTable(collectionName, tableName).catch(console.error)
  }

  function updateImportedWavetable({ name, buffer }: { name: string; buffer: Float32Array }) {
    wavetableStore.setTable(name, buffer)
  }

  function nextView() {
    // prettier-ignore
    switch (view) {
      case "2D": view = "3D"; break
      case "3D": view = "SP"; break
      case "SP": view = "2D"; break
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

  async function openModal() {
    if (!Modal) {
      const { default: Component } = await import("./modal/Modal.svelte")
      Modal = Component
    }
    modalOpen = true
  }
</script>

<div>
  <section class="topbar">
    <DownloadBtn />
    <ImportBtn on:input={e => updateImportedWavetable(e.detail)} />

    <div style:display="flex" style:flex="1">
      <button aria-label="previous wavetable" class="btn" on:click={() => wavetableStore.prev()}>
        <ArrowIcon style="transform:rotate(180deg)" />
      </button>
      <button aria-label="wavetable browser" class="btn" style:flex="1" on:click={openModal}
        >{$nameStore}</button
      >
      <button aria-label="next wavetable" class="btn" on:click={() => wavetableStore.next()}>
        <ArrowIcon />
      </button>
    </div>

    {#if modalOpen}
      <svelte:component this={Modal} on:change={onPickStockWavetable} bind:open={modalOpen} />
    {/if}
  </section>

  <div
    aria-hidden="true"
    class="window"
    on:click={nextView}
    style:width="{width}px"
    style:height="{height}px"
  >
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
