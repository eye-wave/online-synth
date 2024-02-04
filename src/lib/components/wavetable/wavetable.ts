import { generate_saw_tooth } from "pkg/wavetable_synth"
import { writable } from "svelte/store"

export type WavetableStore = {
  buffer: Float32Array
  name: string
  frame: number
}

function createWavetableStore() {
  const bufferStore = writable<Float32Array>(generate_saw_tooth(2048))
  const nameStore = writable<string>("Init")
  const frameStore = writable<number>(1)

  return {
    bufferStore,
    nameStore,
    frameStore,
  }
}

export const wavetableStore = createWavetableStore()
