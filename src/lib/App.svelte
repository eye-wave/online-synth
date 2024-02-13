<script lang="ts">
  import { float32ToAudioBuffer } from "./utils/buffer"
  import { globalStore } from "./stores/global"
  import { wavetableStore } from "./components/wavetable/wavetable"
  import Piano from "./components/Piano.svelte"
  import Synth from "./components/synth/Synth.svelte"
  import WavetableView from "./components/wavetable/WavetableView.svelte"
  import SettingsButton from "./components/settings/Button.svelte"

  $: bufferStore = wavetableStore.bufferStore
  $: wavetableAudio = float32ToAudioBuffer($bufferStore, globalStore.audioContext)

  let pressedKeys: boolean[] = []
</script>

<Synth
  let:startPlayingNote
  let:stopPlayingNote
  on:noteOff={e => (pressedKeys[e.detail] = false)}
  on:noteOn={e => (pressedKeys[e.detail] = true)}
  wavetable={wavetableAudio}
>
  <SettingsButton />

  <WavetableView />

  <Piano value={pressedKeys} on:keyDown={e => startPlayingNote(e.detail)} on:keyUp={e => stopPlayingNote(e.detail)} />
</Synth>

<section>
  <p>This app does not use oscillators for audio generation. Instead, it uses audio buffer created from scratch.</p>
  <h3>Todo</h3>

  <ul>
    <i>Import export</i>
    <li>Exported wavetable work flawlessly in vital, but are a bit broken in Serum</li>
    <li>Importing wavetables from serum works perfectly</li>
  </ul>
</section>
