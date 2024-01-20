export function clamp(input: number, min: number, max: number) {
  return Math.min(Math.max(min, input), max)
}
