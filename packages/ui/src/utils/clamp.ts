export function clamp(min: number, value: number, max: number): number {
  return Math.min(Math.max(min, value), max);
}
