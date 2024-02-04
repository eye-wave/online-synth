import { generateTuningTable } from "./utils/note"
import { writable } from "svelte/store"

export type GlobalStore = {
  audioContext: AudioContext
  analyzerNode: AnalyserNode
  BASE_FREQUENCY: number
  readonly windowSize: 2048
  readonly TUNING_FREQUENCY: number
  readonly TUNING_TABLE: Float32Array
}

function createGlobalStore() {
  const { set, update, subscribe } = writable<GlobalStore>()

  set({
    windowSize: 2048,
    TUNING_FREQUENCY: 440,
    TUNING_TABLE: generateTuningTable(440),
  } as GlobalStore)

  const addAudioContext = (audioContext: AudioContext) => {
    const analyzerNode = audioContext.createAnalyser()
    const BASE_FREQUENCY = audioContext.sampleRate / 2048

    analyzerNode.connect(audioContext.destination)
    update(s => ({ ...s, audioContext, analyzerNode, BASE_FREQUENCY }))
  }
  const setTuningFrequency = (freq: number) =>
    update(state => ({ ...state, TUNING_FREQUENCY: freq, TUNING_TABLE: generateTuningTable(freq) }))

  return {
    subscribe,
    setTuningFrequency,
    addAudioContext,
  }
}

export const globalStore = createGlobalStore()
