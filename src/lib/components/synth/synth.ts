import { clamp } from "src/lib/utils/math"
import { get } from "svelte/store"
import { globalStore } from "src/lib/global"

const noteKeybinds = "awsedftgyhujkolp;']"
export function getNoteFromKey(key: string, addOctave = false, octave = 0) {
  if (key.length > 1) return null

  let note = noteKeybinds.indexOf(key.toLowerCase())

  if (note === -1) return null
  if (addOctave) note += octave * 12

  return note
}

export function createSampler(
  ctx: AudioContext,
  wavetable: AudioBuffer | null,
  frame: number,
  note: number
) {
  const { TUNING_TABLE, BASE_FREQUENCY, analyzerNode } = get(globalStore)

  const sampler = ctx.createBufferSource()
  const playbackRate = TUNING_TABLE[note] / BASE_FREQUENCY

  sampler.loop = true
  sampler.buffer = wavetable
  sampler.playbackRate.setValueAtTime(playbackRate, ctx.currentTime)

  const frameFixed = clamp(frame, 1, 256)

  sampler.loopStart = (frameFixed - 1) / BASE_FREQUENCY
  sampler.loopEnd = frameFixed / BASE_FREQUENCY

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0.4, ctx.currentTime)

  sampler.connect(gainNode)
  gainNode.connect(analyzerNode)

  return sampler
}
