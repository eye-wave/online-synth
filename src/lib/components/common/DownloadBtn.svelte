<script lang="ts">
  import { globalStore } from "src/lib/stores/global"
  import { IO } from "pkg/wavetable_synth"
  import { onDestroy } from "svelte"
  import { wavetableStore } from "../wavetable/wavetable"
  import DownloadIcon from "ico/download.svg?component"

  let href = ""

  $: nameStore = wavetableStore.nameStore

  const unsubscribe = wavetableStore.bufferStore.subscribe(buffer => updateBlobUrl(buffer))

  function updateBlobUrl(input: Float32Array) {
    const buffer = IO.encode_wav(input, globalStore.audioContext.sampleRate)
    const blob = new Blob([buffer], { type: "audio/wav" })

    href = URL.createObjectURL(blob)
  }

  onDestroy(() => {
    unsubscribe()
    URL.revokeObjectURL(href)
  })
</script>

<a download="{$nameStore}.wav" {href}>
  <DownloadIcon height="24" />
</a>

<style>
  a {
    display: inline-block;
    color: currentColor;
  }
</style>
