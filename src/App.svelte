<script lang="ts">
  import { globalStore } from "./global"
  import { float32ToAudioBuffer, generateWaveformData } from "./lib/buffer-utils"
  import Piano from "./lib/components/Piano.svelte"
  import Synth from "./lib/components/Synth.svelte"

  const sine = generateWaveformData($globalStore.audioContext.sampleRate, 10, [0.4])
  const wavetable = float32ToAudioBuffer(sine, $globalStore.audioContext)

  let pressedKeys: boolean[] = []
</script>

<Synth
  {wavetable}
  on:noteOn={e => (pressedKeys[e.detail] = true)}
  on:noteOff={e => (pressedKeys[e.detail] = false)}
  let:stopPlayingNote
  let:startPlayingNote
>
  <Piano value={pressedKeys} on:keyDown={e => startPlayingNote(e.detail)} on:keyUp={e => stopPlayingNote(e.detail)} />
</Synth>

<section>
  <p>This app does not use oscillators for audio generation. Instead, it uses audio buffer created from scratch.</p>
  <h3>Todo</h3>

  <ul>
    <li>Add wave normalization ( square is kinda quiet )</li>
  </ul>
</section>
