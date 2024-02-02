<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { IO } from "pkg/wavetable_synth"

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
    dispatch("input", decodedBuffer)
  }
</script>

<label for="fileInput">
  Choose a WAV file to import
  <input bind:files type="file" id="fileInput" accept=".wav" on:change={handleFileChange} />
</label>

<style>
  input {
    display: none;
  }
</style>
