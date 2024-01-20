import { describe, it, expect } from "bun:test"
import { generateWaveformData } from "./buffer-utils"

describe("generateWaveformData", () => {
  it("generates wave data with default parameters", () => {
    const sampleRate = 44100
    const waveData = generateWaveformData(sampleRate)
    expect(waveData).toBeInstanceOf(Float32Array)
    expect(waveData.length).toBe(Math.floor(sampleRate / 100))
  })

  it("generates wave data with custom frequency and amplitude", () => {
    const sampleRate = 44100
    const frequency = 200
    const amplitudes = [1, 0.5, 0.2]
    const waveData = generateWaveformData(sampleRate, frequency, amplitudes)

    expect(waveData).toBeInstanceOf(Float32Array)
    expect(waveData.length).toBe(Math.floor(sampleRate / frequency))
  })

  it("generates wave data with custom phase offsets", () => {
    const sampleRate = 44100
    const phaseOffsets = [0.2, 0.4, 0.6]
    const waveData = generateWaveformData(sampleRate, 100, [1, 0.5, 0.2], phaseOffsets)

    expect(waveData).toBeInstanceOf(Float32Array)
    expect(waveData.length).toBe(Math.floor(sampleRate / 100))
  })

  it("generates wave data with all parameters customized", () => {
    const sampleRate = 44100
    const frequency = 200
    const amplitudes = [1, 0.5, 0.2]
    const phaseOffsets = [0.2, 0.4, 0.6]
    const waveData = generateWaveformData(sampleRate, frequency, amplitudes, phaseOffsets)

    expect(waveData).toBeInstanceOf(Float32Array)
    expect(waveData.length).toBe(Math.floor(sampleRate / frequency))
  })
})
