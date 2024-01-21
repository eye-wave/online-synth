import { generateTuningTable } from "./utils/note"
import { writable } from "svelte/store"

export type GlobalStore = {
  audioContext: AudioContext
  BASE_FREQUENCY: number
  readonly TUNING_FREQUENCY: number
  readonly TUNING_TABLE: Float32Array
}

function createGlobalStore() {
  const { set, update, subscribe } = writable<GlobalStore>()

  set({
    BASE_FREQUENCY: 23.4375,
    TUNING_FREQUENCY: 440,
    TUNING_TABLE: generateTuningTable(440),
  } as GlobalStore)

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
