import { writable } from "svelte/store"
import { generateTuningTable } from "./lib/note-utils"

export type GlobalStore = {
  audioContext: AudioContext
  BASE_FREQUENCY: number
  readonly TUNING_FREQUENCY: number
  readonly TUNING_TABLE: Float32Array
}

function createGlobalStore() {
  const { set, update, subscribe } = writable<GlobalStore>()

  set({
    audioContext: new AudioContext(),
    BASE_FREQUENCY: 10,
    TUNING_FREQUENCY: 440,
    TUNING_TABLE: generateTuningTable(440),
  })

  const addAudioContext = (audioContext: AudioContext) => update(s => ({ ...s, audioContext }))
  const setTuningFrequency = (freq: number) =>
    update(state => ({ ...state, TUNING_FREQUENCY: freq, TUNING_TABLE: generateTuningTable(freq) }))

  return {
    subscribe,
    setTuningFrequency,
    addAudioContext,
  }
}

export const globalStore = createGlobalStore()
