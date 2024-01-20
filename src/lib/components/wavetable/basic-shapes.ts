import { generateWaveformData } from "src/lib/utils/buffer"
import { globalStore } from "src/global"
import { get } from "svelte/store"

export function generateBasicShapes(sampleRate = 48000) {
  const BASE_FREQUENCY = get(globalStore).BASE_FREQUENCY

  const sine = generateWaveformData(sampleRate, BASE_FREQUENCY, [1])
  const saw = generateWaveformData(
    sampleRate,
    BASE_FREQUENCY,
    Array.from({ length: 200 }, (_, i) => (i % 1 === 0 ? 0.4 : 0) / (i + 1))
  )
  const square = generateWaveformData(
    sampleRate,
    BASE_FREQUENCY,
    Array.from({ length: 200 }, (_, i) => (i % 2 === 0 ? 0.4 : 0) / (i + 1))
  )
  const triangle = generateWaveformData(
    sampleRate,
    BASE_FREQUENCY,
    Array.from({ length: 200 }, (_, i) =>
      i % 2 === 0 ? ((8 / Math.PI ** 2) * (-1) ** (i / 2)) / (i + 1) ** 2 : 0
    )
  )

  return new Float32Array([...sine, ...saw, ...square, ...triangle])
}
