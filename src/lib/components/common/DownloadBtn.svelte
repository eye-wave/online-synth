<script lang="ts">
  import { IO } from "pkg/wavetable_synth"
  import { globalStore } from "src/lib/global"
  import DownloadIcon from "ico/download.svg?component"

  export let wavetable: Float32Array
  export let wavetableName: string

  let sampleRate = $globalStore.audioContext.sampleRate

  function downloadWavetable() {
    const buffer = IO.encode_wav(wavetable, sampleRate)
    const blob = new Blob([buffer], { type: "audio/wav" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `${wavetableName}.wav`

    document.body.append(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(url)
  }
</script>

<button on:click={downloadWavetable}>
  <DownloadIcon />
  Save {wavetableName}.wav
</button>
