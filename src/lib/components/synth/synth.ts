import { audioInterfaceStore } from "src/lib/stores/audio"
import { clamp } from "src/lib/utils/math"
import { get } from "svelte/store"
import { globalConsts } from "src/lib/stores/constants"
import { tuningStore } from "src/lib/stores/tuning"

const noteKeybinds = "awsedftgyhujkolp;']"

export function getNoteFromKey(key: string, addOctave = false, octave = 0) {
  if (key.length !== 1) return null

  const keyIndex = noteKeybinds.indexOf(key.toLowerCase())
  if (keyIndex === -1) return null

  return addOctave ? keyIndex + octave * 12 : keyIndex
}

export function createSampler(
  ctx: AudioContext,
  wavetable: AudioBuffer | null,
  frame: number,
  note: number
) {
  const { baseFrequency } = globalConsts
  const { masterGain } = audioInterfaceStore
  const { tuningTable } = get(tuningStore)

  const sampler = ctx.createBufferSource()
  const playbackRate = tuningTable[note] / baseFrequency

  sampler.loop = true
  sampler.buffer = wavetable
  sampler.playbackRate.setValueAtTime(playbackRate, ctx.currentTime + 0.01)

  const frameFixed = clamp(frame, 1, 256)
  const loopStartTime = (frameFixed - 1) / baseFrequency
  const loopEndTime = frameFixed / baseFrequency

  sampler.loopStart = loopStartTime
  sampler.loopEnd = loopEndTime

  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0.6, ctx.currentTime + 0.01)

  sampler.connect(gainNode)
  masterGain.connectTo(gainNode)

  return sampler
}
