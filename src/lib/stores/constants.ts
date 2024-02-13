function createConstsStore() {
  const windowSize = 2048

  let baseFrequency = 44100 / windowSize
  let audioContext: AudioContext

  function init(ctx: AudioContext) {
    audioContext = ctx
    baseFrequency = audioContext.sampleRate / windowSize
  }

  // biome-ignore format:
  return {
    get windowSize() { return windowSize },
    get baseFrequency() { return baseFrequency },
    get audioContext() { return audioContext },
    init,
  }
}

export const globalConsts = createConstsStore()
