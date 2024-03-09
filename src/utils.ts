export function lerp(x: number, y: number, t: number): number {
  return x + (y - x) * t;
}

export function damp(x: number, y: number, lambda: number, dt: number): number {
  return lerp(x, y, 1 - Math.exp(-lambda * dt));
}
