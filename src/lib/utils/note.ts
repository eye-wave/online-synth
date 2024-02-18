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
    case 1:
    case 3:
    case 6:
    case 8:
    case 10:
      return true
    default:
      return false
  }
}
