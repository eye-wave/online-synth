function createGlobalStore() {
  const windowSize = 2048

  let baseFrequency = 44100 / windowSize
  let audioContext: AudioContext
  let analyzerNode: AnalyserNode

  const addAudioContext = (ctx: AudioContext) => {
    audioContext = ctx
    analyzerNode = audioContext.createAnalyser()
    baseFrequency = audioContext.sampleRate / windowSize

    analyzerNode.connect(audioContext.destination)
  }

  // biome-ignore format:
  return {
    get windowSize() { return 2048 },
    get baseFrequency() { return baseFrequency },
    get analyzerNode() { return analyzerNode },
    get audioContext() { return audioContext },
    addAudioContext,
  }
}

export const globalStore = createGlobalStore()
