<script lang="ts">
  import { createEventDispatcher } from "svelte"
  import { globalConsts } from "src/lib/stores/constants"
  import ImportIcon from "ico/import.svg?component"
  import { decodeBuffer } from "src/lib/utils/buffer"

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
    const buffer = await decodeBuffer(audioContext, arrayBuffer).catch(console.error)
    if (!buffer) return

    const name = file.name
    dispatch("input", { buffer, name })
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      const target = e.target as HTMLInputElement
      target?.click()
    }
  }
</script>

<div aria-label="import audio" role="button" tabindex="0" class="btn" on:keydown={onKeydown}>
  <label for="fileInput">
    <ImportIcon height="24" />
    <input
      bind:files
      id="fileInput"
      style:display="none"
      type="file"
      {accept}
      on:change={handleFileChange}
    />
  </label>
</div>
