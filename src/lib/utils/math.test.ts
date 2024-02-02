import { describe, test, expect } from "bun:test"
import { clamp, round } from "./math"

describe("clamp", () => {
  test("should clamp values", () => {
    expect(clamp(0, 0, 10)).toEqual(0)
    expect(clamp(4, 0, 10)).toEqual(4)
    expect(clamp(-4, 0, 10)).toEqual(0)
    expect(clamp(20, 0, 10)).toEqual(10)
  })
})

describe("round", () => {
  test("should round values", () => {
    expect(round(1.21361544, 0)).toEqual(1)
    expect(round(8.79380892, 2)).toEqual(8.79)
    expect(round(6.12036598, 3)).toEqual(6.12)
    expect(round(9.84512032, 4)).toEqual(9.8451)
    expect(round(5.98412036, 5)).toEqual(5.98412)
  })
})
