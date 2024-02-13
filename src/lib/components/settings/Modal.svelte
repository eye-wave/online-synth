<script lang="ts">
  import { audioInterfaceStore } from "src/lib/stores/audio"
  import { tuningStore } from "src/lib/stores/tuning"
  import Modal from "../common/Modal.svelte"

  export let open = false
  let dialog: HTMLDialogElement

  let tune = 440
  let volume = 0.4

  function onVolumeChange() {
    audioInterfaceStore.masterGainNode.gain.setValueAtTime(volume, 0)
  }

  $: tuningStore.retune(tune)
</script>

<Modal bind:dialog on:close bind:open>
  <label>
    tune
    <input type="number" min="100" max="800" bind:value={tune} />
  </label>

  <label>
    Volume {Math.round(volume * 100)}%
    <input
      type="range"
      min="0"
      max="1"
      step="0.01"
      on:change={onVolumeChange}
      bind:value={volume}
    />
  </label>
</Modal>
