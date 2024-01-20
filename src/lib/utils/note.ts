export function generateTuningTable(referenceFrequency = 440) {
  const tuningTable = new Float32Array(128)
  const semitoneRatio = 2 ** (1 / 12)

  for (let midiNote = 0; midiNote <= 127; midiNote++) {
    const frequency = referenceFrequency * semitoneRatio ** (midiNote - 69)
    tuningTable[midiNote] = frequency
  }

  return tuningTable
}

export function isKeyBlack(key: number) {
  const truncToOctave = key % 12
  switch (truncToOctave) {
    case 0:
    case 2:
    case 4:
    case 5:
    case 7:
    case 9:
    case 11:
      return false
    default:
      return true
  }
}
