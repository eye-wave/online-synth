export type GainInterface = ReturnType<typeof createGainInterface>
function createGainInterface(ctx: AudioContext) {
  const gainNode = ctx.createGain()
  gainNode.gain.setValueAtTime(0.4, 0)

  const connect = (node: AudioNode) => gainNode.connect(node)
  const connectTo = (node: AudioNode) => node.connect(gainNode)
  const disconnect = () => gainNode.disconnect()
  const setGain = (value: number) => gainNode.gain.setValueAtTime(value, 0)

  return {
    connect,
    connectTo,
    disconnect,
    setGain,
    get gain() {
      return gainNode.gain.value
    },
  }
}

function createAudioInterfaceStore() {
  let analyzerNode: AnalyserNode
  let masterGain: GainInterface

  function init(ctx: AudioContext) {
    analyzerNode = ctx.createAnalyser()
    analyzerNode.connect(ctx.destination)

    masterGain = createGainInterface(ctx)
    masterGain.connect(analyzerNode)
  }

  // biome-ignore format:
  return {
    get analyzerNode() { return analyzerNode },
    get masterGain() { return masterGain },
    init,
  }
}

export const audioInterfaceStore = createAudioInterfaceStore()
