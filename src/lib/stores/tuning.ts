import { writable } from "svelte/store"
import { generateTuningTable } from "../utils/note"

export type TuningStore = {
  frequency: number
  tuningTable: Float32Array
}

function createTuningStore() {
  const { set, subscribe } = writable<TuningStore>({ ...retune(440) })

  function retune(frequency: number) {
    return {
      frequency,
      tuningTable: generateTuningTable(frequency),
    }
  }

  retune(440)

  return {
    retune(freq: number) {
      set({ ...retune(freq) })
    },
    subscribe,
  }
}

export const tuningStore = createTuningStore()
