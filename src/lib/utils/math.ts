export function clamp(input: number, min: number, max: number) {
  return Math.min(Math.max(min, input), max)
}

export function round(input: number, decimals = 1) {
  const multiplier = 10 ** decimals
  return Math.floor(input * multiplier) / multiplier
}
