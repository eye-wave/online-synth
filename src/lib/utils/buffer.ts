export async function decodeBuffer(ctx: AudioContext, data: ArrayBuffer) {
  const audioBuffer = await ctx.decodeAudioData(data)
  return audioBuffer.getChannelData(0)
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
