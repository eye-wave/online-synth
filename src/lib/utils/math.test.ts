import { describe, test, expect } from "bun:test"
import { clamp } from "./math"

describe("clamp", () => {
  test("should clamp values", () => {
    expect(clamp(0, 0, 10)).toEqual(0)
    expect(clamp(4, 0, 10)).toEqual(4)
    expect(clamp(-4, 0, 10)).toEqual(0)
    expect(clamp(20, 0, 10)).toEqual(10)
  })
})
