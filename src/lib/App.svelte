<script lang="ts">
  import { float32ToAudioBuffer } from "./utils/buffer"
  import { globalStore } from "./global"
  import { Wavetables } from "pkg/synth"
  import Piano from "./components/Piano.svelte"
  import Synth from "./components/Synth.svelte"
  import WavetableView from "./components/wavetable/WavetableView.svelte"

  let sampleRate = $globalStore.audioContext.sampleRate
  let baseFrequency = $globalStore.BASE_FREQUENCY
  let currentTable = "Basic Shapes"

  let frame = 3

  let wavetable = Wavetables.generate_basic_shapes_table(sampleRate, baseFrequency)
  let wavetableAudio = float32ToAudioBuffer(wavetable, $globalStore.audioContext)

  $: frameCount = Math.floor(wavetable.length / framesize)
  $: framesize = Math.floor(sampleRate / $globalStore.BASE_FREQUENCY)

  type WavetableGenerator = () => Float32Array

  const tables = new Map<string, WavetableGenerator>([
    ["Basic Shapes", () => Wavetables.generate_basic_shapes_table(sampleRate, baseFrequency)],
    ["Sine to Saw", () => Wavetables.generate_nth_wavetable(sampleRate, baseFrequency, 1)],
    ["Sine to Square", () => Wavetables.generate_nth_wavetable(sampleRate, baseFrequency, 2)],
    ["3th Peaks", () => Wavetables.generate_nth_wavetable(sampleRate, baseFrequency, 3)],
    ["4th Peaks", () => Wavetables.generate_nth_wavetable(sampleRate, baseFrequency, 4)],
    ["10th Peaks", () => Wavetables.generate_nth_wavetable(sampleRate, baseFrequency, 10)],
  ])

  function updateWavetable() {
    frame = 1
    const current = tables.get(currentTable)

    if (current) {
      wavetable = current()
      wavetableAudio = float32ToAudioBuffer(wavetable, $globalStore.audioContext)
    }
  }

  let pressedKeys: boolean[] = []
  let tune = 440

  $: globalStore.setTuningFrequency(tune)
</script>

<Synth
  wavetable={wavetableAudio}
  {frame}
  on:noteOn={e => (pressedKeys[e.detail] = true)}
  on:noteOff={e => (pressedKeys[e.detail] = false)}
  let:stopPlayingNote
  let:startPlayingNote
>
  <WavetableView {frame} {framesize} {wavetable} />

  <label>
    Frame
    <input type="range" min="1" max={frameCount} step="1" bind:value={frame} />
  </label>

  <label>
    tune
    <input type="number" bind:value={tune} />
  </label>

  <label>
    Wavetable
    <select bind:value={currentTable} on:change={updateWavetable}>
      {#each tables as [value]}
        <option {value}>{value}</option>
      {/each}
    </select>
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
