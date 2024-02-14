import { globalConsts } from "../stores/constants"

export async function decodeBuffer(ctx: AudioContext, data: ArrayBuffer) {
  const maxLength = globalConsts.windowSize * 256
  const audioBuffer = await ctx.decodeAudioData(data)
  const buffer = audioBuffer.getChannelData(0)

  buffer.length > maxLength &&
    console.warn(`Maximumg length exceeded, ${buffer.length / ctx.sampleRate}s of audio wasted`)

  return buffer.slice(0, maxLength)
}

export function float32ToAudioBuffer(input: Float32Array, context: AudioContext) {
  const buffer = context.createBuffer(1, input.length, context.sampleRate)
  buffer.getChannelData(0).set(input)
  return buffer
}

export function joinFloat32Arrays(list: Float32Array[]) {
  const length = list.reduce((sum, v) => sum + v.length, 0)
  const buffer = new Float32Array(length)

  let offset = 0
  for (const item of list) {
    buffer.set(item, offset)
    offset += item.length
  }

  return buffer
}
