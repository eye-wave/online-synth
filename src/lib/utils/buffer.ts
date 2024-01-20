export function float32ToAudioBuffer(input: Float32Array, context: AudioContext) {
  const buffer = context.createBuffer(1, input.length, context.sampleRate)
  buffer.getChannelData(0).set(input)
  return buffer
}

export function normalizeBuffer(input: Float32Array) {
  let max = 0
  for (let i = 0; i < input.length; i++) {
    if (input[i] > max) {
      max = input[i]
    }
  }

  const multiplier = 1 / max

  for (let i = 0; i < input.length; i++) {
    input[i] *= multiplier
  }

  return input
}

export function generateWaveformData(
  sampleRate: number,
  frequency = 100,
  amplitudes = [1],
  phaseOffsets = [0]
) {
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
