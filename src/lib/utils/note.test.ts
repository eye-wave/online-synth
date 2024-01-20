import { describe, test, expect } from "bun:test"
import { generateTuningTable, isKeyBlack } from "./note"

describe("generateTuningTable", () => {
  test("generates a tuning table with default reference frequency", () => {
    const tuningTable = generateTuningTable()

    expect(tuningTable).toHaveLength(128)
    expect(tuningTable[69]).toEqual(440)
    expect(tuningTable[60]).toBeCloseTo(261.63)
  })

  test("generates a tuning table with custom reference frequency", () => {
    const customReferenceFrequency = 432
    const tuningTable = generateTuningTable(customReferenceFrequency)
    expect(tuningTable[69]).toBeCloseTo(customReferenceFrequency)
  })
})

describe("isKeyBlack", () => {
  test("identifies black keys correctly", () => {
    expect(isKeyBlack(60)).toBe(false)
    expect(isKeyBlack(61)).toBe(true)
    expect(isKeyBlack(62)).toBe(false)
  })
})
