import { generate_waveform_data } from "pkg/synth"

export function float32ToAudioBuffer(input: Float32Array, context: AudioContext) {
  const buffer = context.createBuffer(1, input.length, context.sampleRate)
  buffer.getChannelData(0).set(input)
  return buffer
}

export function generateWaveformData(
  sampleRate: number,
  frequency = 100,
  amplitudes = [1],
  phaseOffsets = [0]
) {
  return generate_waveform_data(
    sampleRate,
    frequency,
    new Float32Array(amplitudes),
    new Float32Array(phaseOffsets)
  )
}
