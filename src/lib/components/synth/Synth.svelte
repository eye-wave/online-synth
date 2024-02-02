<script lang="ts">
  import { clamp } from "../../utils/math"
  import { createEventDispatcher } from "svelte"
  import { createSampler, getNoteFromKey } from "./synth"
  import { globalStore } from "src/lib/global"

  $: ctx = $globalStore.audioContext

  export let frame = 1
  export let VOICE_COUNT = 8
  export let wavetable: AudioBuffer | null = null
  export let keyboardCurrentOctave = 5

  let activeVoicesCount = 0

  type SynthEvents = {
    noteOn: number
    noteOff: number
  }

  const voiceStack: (AudioBufferSourceNode | null)[] = Array.from({ length: 128 }, () => null)
  const dispatch = createEventDispatcher<SynthEvents>()

  function startPlayingNote(note: number) {
    if (wavetable === null) return console.warn("Wavetable is null.")
    if (activeVoicesCount >= VOICE_COUNT) return console.warn("Maximum number of active voices reached.")

    if (voiceStack[note] === null && activeVoicesCount < VOICE_COUNT) stopPlayingNote(note)

    const sampler = createSampler(ctx, wavetable, frame, note)

    sampler.start(ctx.currentTime, sampler.loopStart)

    voiceStack[note] = sampler
    activeVoicesCount++

    dispatch("noteOn", note)
  }

  function stopPlayingNote(note: number) {
    const sampler = voiceStack[note]

    if (!sampler) return
    if (voiceStack[note] === null) return

    sampler.stop()

    voiceStack[note] = null
    activeVoicesCount--

    dispatch("noteOff", note)
  }

  function keyboardEventDown(e: KeyboardEvent) {
    if (e.ctrlKey) return

    const activeElement = document.activeElement?.tagName

    if (activeElement === "INPUT") return
    if (activeElement === "TEXTAREA") return

    // biome-ignore format: stop messing with my switch
    switch (e.key) {
      case "z":
        return (keyboardCurrentOctave -= 1)
      case "x":
        return (keyboardCurrentOctave += 1)

      default:
        break
    }

    keyboardCurrentOctave = clamp(keyboardCurrentOctave, 1, 10)
    const noteToPlay = getNoteFromKey(e.key, true, keyboardCurrentOctave)

    if (noteToPlay === null) return
    e.preventDefault()

    if (voiceStack[noteToPlay] !== null) return

    startPlayingNote(noteToPlay)
  }

  function keyboardEventUp(e: KeyboardEvent) {
    const noteToStop = getNoteFromKey(e.key)

    if (noteToStop === null) return

    for (let i = 0; i < 12; i++) {
      const note = noteToStop + i * 12

      if (voiceStack[note] === null) continue

      stopPlayingNote(note)
    }
  }
</script>

<svelte:window on:keydown={keyboardEventDown} on:keyup={keyboardEventUp} />
<slot {startPlayingNote} {stopPlayingNote} />
