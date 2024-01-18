<script lang="ts">
  import Piano from "./lib/Piano.svelte";
  import Synth from "./lib/Synth.svelte";
  import { float32ToAudioBuffer } from "./lib/buffer";
  import { generateWaveformData } from "./lib/generator";
  import { generateTuningTable } from "./lib/tune";
  
  export let audioContext:AudioContext

  let sampler:AudioBufferSourceNode

  const waves = ["sine","saw","square","triangle"]
  let selectedWave:string

  $: wave = generateWaveformData(audioContext)
  $: buffer = float32ToAudioBuffer(wave,audioContext)
  
  const tuneTable = generateTuningTable(523)

  function handleKeyDown(key:number) {
    if ( !tuneTable[key] ) return

    sampler = audioContext.createBufferSource()
    sampler.buffer = buffer
    sampler.loop = true

    sampler.playbackRate.setValueAtTime(tuneTable[key] / 100,0)
    sampler.connect(audioContext.destination)
    sampler.start()
  }

  function handleKeyUp(key:number) {
    sampler.stop()
  }

</script>

<select style="margin: 3rem;" bind:value={selectedWave} on:change={() => {
  if ( selectedWave === "sine" ) wave = generateWaveformData(audioContext)
  if ( selectedWave === "square" ) wave = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 2 === 0 ? 0.4 : 0) / ( i +1 )),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )

  if ( selectedWave === "saw" ) wave = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 1 === 0 ? 0.4 : 0) / ( i +1 )),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )

  if ( selectedWave === "triangle" ) wave = generateWaveformData(audioContext,100,
    Array(200).fill(0).map((_,i) => (i % 2 === 0 ? (8 / Math.PI ** 2) * (-1) ** (i / 2) / (i + 1) ** 2 : 0)),
    Array(200).fill(0).map(() => Math.random() * Math.PI * 2 * 0)
  )
}}>
  {#each waves as value}
    <option {value}>{value}</option>
  {/each}
</select>

<Synth {audioContext} />
<Piano 
  on:keyDown={e => handleKeyDown(e.detail)}
  on:keyUp={e => handleKeyUp(e.detail)}
{audioContext} />

<p style="color: #fff">This app does not use oscillators for audio generation. Instead, it uses audio buffer created from scratch.</p>
<h3>Todo</h3>

<ul>
  <li>Add wave normalization ( square is kinda quiet )</li>
</ul>

