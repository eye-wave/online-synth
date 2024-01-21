import { genrate_basic_shapes_table } from "pkg/wavetable_synth"
import { get } from "svelte/store"
import { globalStore } from "src/lib/global"

export function generateBasicShapes(sampleRate = 48000, quality = 500) {
  return genrate_basic_shapes_table(sampleRate, get(globalStore).BASE_FREQUENCY, quality)
}
