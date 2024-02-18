<script lang="ts">
  import { globalConsts } from "src/lib/stores/constants"
  import { IO } from "pkg/wavetable_synth"
  import { onDestroy } from "svelte"
  import { wavetableStore } from "../wavetable/wavetable"
  import DownloadIcon from "ico/download.svg?component"

  let href = ""

  $: nameStore = wavetableStore.nameStore

  const unsubscribe = wavetableStore.bufferStore.subscribe(buffer => updateBlobUrl(buffer))

  function updateBlobUrl(input: Float32Array) {
    try {
      const buffer = IO.encode_wav(input, globalConsts.audioContext.sampleRate)
      const blob = new Blob([buffer], { type: "audio/wav" })
      href = URL.createObjectURL(blob)
    } catch (error) {
      URL.revokeObjectURL(href)
    }
  }

  onDestroy(() => {
    unsubscribe()
    URL.revokeObjectURL(href)
  })
</script>

<a aria-label="download wavetable" class="btn" download="{$nameStore}.wav" {href}>
  <DownloadIcon height="24" />
</a>
