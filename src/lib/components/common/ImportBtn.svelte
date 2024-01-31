<script lang="ts">
  // import { IO } from "pkg/wavetable_synth"
  // import { createEventDispatcher } from "svelte"

  // let files: FileList

  // type ImportBtnEvents = {
  //   input: Float32Array
  // }

  // const dispatch = createEventDispatcher<ImportBtnEvents>()

  // async function handleFileChange() {
  //   // const file = files.item(0)
  //   // if (!file) return
  //   // const arrayBuffer = await file.arrayBuffer()
  //   // const decodedBuffer = IO.decode_wav(new Uint8Array(arrayBuffer))
  //   // dispatch("input", decodedBuffer)
  // }
</script>

<label for="fileInput">
  Choose a WAV file to import
  <!-- <input bind:files type="file" id="fileInput" accept=".wav,.mp3" on:change={handleFileChange} /> -->
</label>

<!-- <style>
  input {
    display: none;
  }
</style> -->
