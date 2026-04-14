export function isSoundEnabled(): boolean {
  return localStorage.getItem('bingo_sound') !== 'off'
}

export function setSoundEnabled(enabled: boolean): void {
  localStorage.setItem('bingo_sound', enabled ? 'on' : 'off')
}

let _ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext()
  return _ctx
}

export function playClick(): void {
  if (!isSoundEnabled()) return
  try {
    const ac = getCtx()
    const osc = ac.createOscillator()
    const gain = ac.createGain()
    osc.connect(gain)
    gain.connect(ac.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(660, ac.currentTime)
    osc.frequency.exponentialRampToValueAtTime(440, ac.currentTime + 0.07)
    gain.gain.setValueAtTime(0.12, ac.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.12)
    osc.start()
    osc.stop(ac.currentTime + 0.12)
  } catch { /* AudioContext blocked or unavailable */ }
}

export function playBingo(): void {
  if (!isSoundEnabled()) return
  try {
    const ac = getCtx()
    // C5 → E5 → G5 → C6 fanfare
    const notes = [
      { freq: 523.25, delay: 0 },
      { freq: 659.25, delay: 0.1 },
      { freq: 783.99, delay: 0.2 },
      { freq: 1046.5, delay: 0.32 },
    ]
    notes.forEach(({ freq, delay }) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.type = 'triangle'
      const t = ac.currentTime + delay
      osc.frequency.setValueAtTime(freq, t)
      gain.gain.setValueAtTime(0.22, t)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      osc.start(t)
      osc.stop(t + 0.38)
    })
  } catch { /* AudioContext blocked or unavailable */ }
}
