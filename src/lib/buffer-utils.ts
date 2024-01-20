export function float32ToAudioBuffer(input: Float32Array, context: AudioContext) {
  const buffer = context.createBuffer(1, input.length, context.sampleRate)
  buffer.getChannelData(0).set(input)
  return buffer
}

export const generateWaveformData = (
  sampleRate: number,
  frequency = 100,
  amplitudes = [1],
  phaseOffsets = [0]
): Float32Array => {
  const numSamples = Math.floor(sampleRate / frequency)
  const waveData = new Float32Array(numSamples)

  const twoPi = 2 * Math.PI

  for (let i = 0; i < numSamples; i++) {
    const t = (i / sampleRate) * twoPi

    let y = 0

    for (let j = 0; j < amplitudes.length; j++) {
      const harmonicFrequency = frequency * (j + 1)
      const amplitude = amplitudes[j] ?? 0
      const phase = phaseOffsets[j] ?? 0

      y += amplitude * Math.sin(harmonicFrequency * t + phase)
    }

    waveData[i] = y
  }

  return waveData
}
