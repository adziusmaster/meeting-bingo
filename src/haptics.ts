export function hapticClick(): void {
  try { navigator.vibrate?.(12) } catch { /* unsupported */ }
}

export function hapticWin(): void {
  try { navigator.vibrate?.([60, 40, 100, 40, 180]) } catch { /* unsupported */ }
}
