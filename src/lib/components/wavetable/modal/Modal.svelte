<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { wavetableStore } from "../wavetable"
  import Modal from "../../common/Modal.svelte"
  import HeartBtn from "./HeartBtn.svelte"

  export let open = false

  type ModalEvents = {
    close: void
    change: [string, string]
  }

  const dispatch = createEventDispatcher<ModalEvents>()

  let tables = wavetableStore.tableMap
</script>

<Modal on:close bind:open>
  <table>
    <thead>
      <tr>
        <th>Fav</th>
        <th>Name</th>
        <th>Pack</th>
      </tr>
      {#each tables as collection}
        <details open>
          <summary>
            {collection.name}
          </summary>
          <table>
            {#each collection.tables as table}
              <tr>
                <th>
                  <HeartBtn />
                </th>
                <th>
                  <button on:click={() => dispatch("change", [collection.name, table])}
                    >{table}</button
                  >
                </th>
                <th>{collection.name}</th>
              </tr>
            {/each}
          </table>
        </details>
      {/each}
    </thead>
  </table>
</Modal>
