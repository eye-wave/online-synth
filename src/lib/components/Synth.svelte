<script lang="ts">
  import { clamp } from "../utils/math"
  import { createEventDispatcher } from "svelte"
  import { globalStore } from "src/global"

  $: ctx = $globalStore.audioContext
  $: tuningTable = $globalStore.TUNING_TABLE
  $: baseFrequency = $globalStore.BASE_FREQUENCY

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
    if (!tuningTable[note]) return console.warn("Tuning table entry for the given note is missing.")
    if (activeVoicesCount >= VOICE_COUNT) return console.warn("Maximum number of active voices reached.")

    if (voiceStack[note] === null && activeVoicesCount < VOICE_COUNT) stopPlayingNote(note)

    const sampler = ctx.createBufferSource()
    const playbackRate = tuningTable[note] / baseFrequency

    sampler.loop = true
    sampler.buffer = wavetable
    sampler.playbackRate.setValueAtTime(playbackRate, ctx.currentTime)

    const frameFixed = clamp(frame, 1, 256)

    sampler.loopStart = (frameFixed - 1) / baseFrequency
    sampler.loopEnd = frameFixed / baseFrequency

    const gainNode = ctx.createGain()
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime)

    sampler.connect(gainNode)
    gainNode.connect(ctx.destination)

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

  const noteKeybinds = "awsedftgyhujkolp;']"
  function getNoteFromKey(key: string, addOctave = true) {
    if (key.length > 1) return null

    let note = noteKeybinds.indexOf(key.toLowerCase())

    if (note === -1) return null
    if (addOctave) note += keyboardCurrentOctave * 12

    return note
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

    const noteToPlay = getNoteFromKey(e.key)

    if (noteToPlay === null) return
    e.preventDefault()

    if (voiceStack[noteToPlay] !== null) return

    startPlayingNote(noteToPlay)
  }

  function keyboardEventUp(e: KeyboardEvent) {
    const noteToStop = getNoteFromKey(e.key, false)

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
