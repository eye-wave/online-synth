<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte"
  import { fetchWavetableCollections, type WavetableCollection } from "./fetch-tables"

  type ModalEvents = {
    close: void
    change: [string, string]
  }

  const dispatch = createEventDispatcher<ModalEvents>()

  let tables: WavetableCollection[] = []
  let dialog: HTMLDialogElement

  function close() {
    dialog.close()
    dispatch("close")
  }

  onMount(async () => {
    dialog.showModal()
    tables = await fetchWavetableCollections()
  })
</script>

<dialog bind:this={dialog}>
  <button on:click={close}>Close me please</button>

  <ul>
    {#each tables as collection}
      <h2>{collection.name}</h2>
      <ul>
        {#each collection.tables as table}
          <li>
            <button on:click={() => dispatch("change", [collection.name, table])}>{table}</button>
          </li>
        {/each}
      </ul>
    {/each}
  </ul>
</dialog>

<style>
  dialog::backdrop {
    background: #00000060;
    backdrop-filter: blur(1rem);
  }
</style>
