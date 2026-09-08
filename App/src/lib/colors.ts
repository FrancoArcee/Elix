export function intToHex(n: number): string {
  return `#${n.toString(16).padStart(6, '0')}`
}

export function hexToInt(hex: string): number {
  return parseInt(hex.replace('#', ''), 16)
}