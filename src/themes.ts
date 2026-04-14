export interface CardTheme {
  id: string
  name: string
  emoji: string
  requiredWins: number  // 0 = always unlocked
  // Colors used in BingoBoard
  accentColor: string        // FREE tile text, BINGO letters
  markedColorRgb: string     // "R,G,B" for marked tile gradient
  winColorRgb: string        // "R,G,B" for win glow
  oneAwayColorRgb: string    // "R,G,B" for one-away pulse
  defaultTileBg: string      // default tile background (dark mode)
  defaultTileBorder: string  // default tile border (dark mode)
  defaultTileText: string    // default tile text (dark mode)
}

export const CARD_THEMES: CardTheme[] = [
  { id: 'navy_night',     name: 'Navy Night',     emoji: '\u{1F319}', requiredWins: 0,  accentColor: '#06b6d4', markedColorRgb: '251,191,36',  winColorRgb: '16,185,129',  oneAwayColorRgb: '251,191,36',  defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(255,255,255,0.09)', defaultTileText: '#f1f5f9' },
  { id: 'forest',         name: 'Forest',         emoji: '\u{1F332}', requiredWins: 0,  accentColor: '#34d399', markedColorRgb: '52,211,153',   winColorRgb: '16,185,129',  oneAwayColorRgb: '52,211,153',  defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(52,211,153,0.18)',  defaultTileText: '#ecfdf5' },
  { id: 'sunset',         name: 'Sunset',         emoji: '\u{1F305}', requiredWins: 5,  accentColor: '#fb923c', markedColorRgb: '251,146,60',   winColorRgb: '239,68,68',   oneAwayColorRgb: '251,146,60',  defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(251,146,60,0.18)',  defaultTileText: '#fff7ed' },
  { id: 'ocean',          name: 'Ocean',          emoji: '\u{1F30A}', requiredWins: 10, accentColor: '#38bdf8', markedColorRgb: '56,189,248',   winColorRgb: '14,165,233',  oneAwayColorRgb: '56,189,248',  defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(56,189,248,0.18)',  defaultTileText: '#f0f9ff' },
  { id: 'midnight_rose',  name: 'Midnight Rose',  emoji: '\u{1F339}', requiredWins: 25, accentColor: '#f472b6', markedColorRgb: '244,114,182',  winColorRgb: '236,72,153',  oneAwayColorRgb: '244,114,182', defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(244,114,182,0.18)', defaultTileText: '#fdf2f8' },
  { id: 'arctic',         name: 'Arctic',         emoji: '\u2744\uFE0F', requiredWins: 50, accentColor: '#818cf8', markedColorRgb: '129,140,248',  winColorRgb: '99,102,241',  oneAwayColorRgb: '129,140,248', defaultTileBg: 'rgba(255,255,255,0.05)', defaultTileBorder: 'rgba(129,140,248,0.18)', defaultTileText: '#eef2ff' },
]
