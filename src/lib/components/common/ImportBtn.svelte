<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { globalConsts } from "src/lib/stores/constants"
  import ImportIcon from "ico/import.svg?component"

  const accept = ".aac,.flac,.mp3,.ogg,.opus,.wav,.webm"

  let files: FileList

  type ImportBtnEvents = {
    input: {
      name: string
      buffer: Float32Array
    }
  }

  const dispatch = createEventDispatcher<ImportBtnEvents>()

  async function handleFileChange() {
    const file = files.item(0)
    if (!file) return

    const { audioContext } = globalConsts
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
    const buffer = audioBuffer.getChannelData(0)
    const name = file.name

    dispatch("input", { buffer, name })
  }
</script>

<label for="fileInput">
  <ImportIcon height="24" />
  <input bind:files type="file" id="fileInput" {accept} on:change={handleFileChange} />
</label>

<style>
  input {
    display: none;
  }
</style>
