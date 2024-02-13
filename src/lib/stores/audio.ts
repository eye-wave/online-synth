function createAudioInterfaceStore() {
  let analyzerNode: AnalyserNode
  let masterGainNode: GainNode

  function init(audioContext: AudioContext) {
    analyzerNode = audioContext.createAnalyser()
    analyzerNode.connect(audioContext.destination)

    masterGainNode = audioContext.createGain()
    masterGainNode.connect(analyzerNode)
  }

  // biome-ignore format:
  return {
    get analyzerNode() { return analyzerNode },
    get masterGainNode() { return masterGainNode },
    init,
  }
}

export const audioInterfaceStore = createAudioInterfaceStore()
