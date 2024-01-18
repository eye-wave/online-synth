export function generateTuningTable(referenceFrequency = 440) {
  const tuningTable: number[] = [];
  const semitoneRatio = Math.pow(2, 1 / 12);

  for (let midiNote = 21; midiNote <= 108; midiNote++) {
    const frequency = referenceFrequency * Math.pow(semitoneRatio, midiNote - 69);
    tuningTable.push(frequency);
  }

  return tuningTable;
}
