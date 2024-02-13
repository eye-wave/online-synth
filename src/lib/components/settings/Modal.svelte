<script lang="ts">
  import { tuningStore } from "src/lib/stores/tuning"
  import Modal from "../common/Modal.svelte"

  export let open = false

  let tune = 440
  let dialog: HTMLDialogElement

  $: tuningStore.retune(tune)
</script>

<Modal bind:dialog on:close bind:open>
  <label>
    tune
    <input type="number" bind:value={tune} />
  </label>
</Modal>
