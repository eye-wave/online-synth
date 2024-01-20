<script lang="ts">
  import { float32ToAudioBuffer } from "./lib/utils/buffer"
  import { generateBasicShapes } from "./lib/components/wavetable/basic-shapes"
  import { globalStore } from "./global"
  import Piano from "./lib/components/Piano.svelte"
  import Synth from "./lib/components/Synth.svelte"
  import WavetableView from "./lib/components/wavetable/WavetableView.svelte"

  const basicShapes = generateBasicShapes($globalStore.audioContext.sampleRate)
  const wavetable = float32ToAudioBuffer(basicShapes, $globalStore.audioContext)

  let pressedKeys: boolean[] = []
  let frame = 3
  let tune = 440

  $: globalStore.setTuningFrequency(tune)
</script>

<Synth
  {wavetable}
  {frame}
  on:noteOn={e => (pressedKeys[e.detail] = true)}
  on:noteOff={e => (pressedKeys[e.detail] = false)}
  let:stopPlayingNote
  let:startPlayingNote
>
  <WavetableView {frame} wavetable={basicShapes} />

  <label>
    Frame
    <input type="range" min="1" max="4" step="1" bind:value={frame} />
  </label>

  <label>
    tune
    <input type="number" bind:value={tune} />
  </label>

  <Piano value={pressedKeys} on:keyDown={e => startPlayingNote(e.detail)} on:keyUp={e => stopPlayingNote(e.detail)} />
</Synth>

<section>
  <p>This app does not use oscillators for audio generation. Instead, it uses audio buffer created from scratch.</p>
  <h3>Todo</h3>

  <ul>
    <li>Add wave normalization ( square is kinda quiet )</li>
  </ul>
</section>
