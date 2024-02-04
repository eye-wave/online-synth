<script lang="ts">
  import ImportIcon from "ico/import.svg?component"
  import { createEventDispatcher } from "svelte"
  import { IO } from "pkg/wavetable_synth"
  import { wavetableStore } from "../wavetable/wavetable"

  let files: FileList

  type ImportBtnEvents = {
    input: Float32Array
  }

  const dispatch = createEventDispatcher<ImportBtnEvents>()

  async function handleFileChange() {
    const file = files.item(0)
    if (!file) return
    const arrayBuffer = await file.arrayBuffer()
    const decodedBuffer = IO.decode_wav(new Uint8Array(arrayBuffer), 2048)

    wavetableStore.nameStore.set(file.name)

    dispatch("input", decodedBuffer)
  }
</script>

<label for="fileInput">
  <ImportIcon height="24" />
  <input bind:files type="file" id="fileInput" accept=".wav" on:change={handleFileChange} />
</label>

<style>
  input {
    display: none;
  }
</style>
