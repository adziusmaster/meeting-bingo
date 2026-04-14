import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { keyframes } from '@emotion/react'
import type { CardTheme } from '../../themes'
import { CARD_THEMES } from '../../themes'

const markPop = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(0.82); }
  65%  { transform: scale(1.09); }
  100% { transform: scale(1); }
`

interface BingoBoardProps {
  card: string[]
  marked: boolean[]
  winCells: Set<number>
  oneAwayCells: Set<number>
  disabled: boolean
  onTileClick: (index: number) => void
  theme?: CardTheme
}

function makePulseWin(rgb: string) {
  return keyframes`
    0%, 100% { box-shadow: 0 0 14px rgba(${rgb},0.5); }
    50%       { box-shadow: 0 0 30px rgba(${rgb},0.85); }
  `
}

function makeOneAwayPulse(rgb: string) {
  return keyframes`
    0%, 100% { box-shadow: 0 0 8px rgba(${rgb},0.35); }
    50%       { box-shadow: 0 0 22px rgba(${rgb},0.9); }
  `
}

function tileStyle(
  isFree: boolean,
  isMarked: boolean,
  isWinning: boolean,
  isOneAway: boolean,
  t: CardTheme,
  isDark: boolean,
) {
  if (isFree) {
    return {
      background: `rgba(59,130,246,0.18)`,
      borderColor: 'rgba(59,130,246,0.45)',
      color: t.accentColor,
    }
  }
  if (isWinning) {
    const pw = makePulseWin(t.winColorRgb)
    return {
      background: `linear-gradient(135deg, rgba(${t.winColorRgb},0.4), rgba(6,182,212,0.3))`,
      borderColor: `rgb(${t.winColorRgb})`,
      color: '#fff',
      animation: `${pw} 1.2s ease-in-out infinite`,
      boxShadow: `0 0 18px rgba(${t.winColorRgb},0.55)`,
    }
  }
  if (isMarked) {
    return {
      background: `linear-gradient(135deg, rgba(${t.markedColorRgb},0.3), rgba(${t.markedColorRgb},0.15))`,
      borderColor: `rgba(${t.markedColorRgb},0.6)`,
      color: `rgb(${t.markedColorRgb})`,
      animation: `${markPop} 0.32s ease`,
    }
  }
  if (isOneAway) {
    const oap = makeOneAwayPulse(t.oneAwayColorRgb)
    return {
      background: `rgba(${t.oneAwayColorRgb},0.06)`,
      borderColor: `rgba(${t.oneAwayColorRgb},0.45)`,
      color: isDark ? t.defaultTileText : '#334155',
      animation: `${oap} 1.5s ease-in-out infinite`,
    }
  }
  return {
    background: isDark ? t.defaultTileBg : 'rgba(0,0,0,0.03)',
    borderColor: isDark ? t.defaultTileBorder : 'rgba(0,0,0,0.1)',
    color: isDark ? t.defaultTileText : '#334155',
  }
}

export default function BingoBoard({
  card, marked, winCells, oneAwayCells, disabled, onTileClick, theme: cardTheme,
}: BingoBoardProps) {
  const muiTheme = useTheme()
  const isDark = muiTheme.palette.mode === 'dark'
  const t = cardTheme ?? CARD_THEMES[0]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {/* Column headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', mb: '2px' }}>
        {['B', 'I', 'N', 'G', 'O'].map(l => (
          <Box key={l} sx={{ textAlign: 'center', py: 0.5 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: t.accentColor,
                textShadow: `0 0 16px ${t.accentColor}70`,
                letterSpacing: '0.05em',
              }}
            >
              {l}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 5x5 grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
        {card.map((word, i) => {
          const isFree     = word === 'FREE'
          const isMarked   = marked[i]
          const isWinning  = winCells.has(i)
          const isOneAway  = !isMarked && !isWinning && oneAwayCells.has(i)

          return (
            <ButtonBase
              key={i}
              onClick={() => onTileClick(i)}
              disabled={isFree || disabled}
              sx={{
                width: 'clamp(62px, 14vw, 96px)',
                height: 'clamp(62px, 14vw, 96px)',
                borderRadius: '10px',
                border: '1px solid',
                fontSize: 'clamp(0.46rem, 1.1vw, 0.68rem)',
                fontFamily: 'inherit',
                fontWeight: isFree ? 900 : 600,
                lineHeight: 1.2,
                padding: '5px',
                wordBreak: 'break-word',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.12s, transform 0.1s, border-color 0.12s, box-shadow 0.12s',
                letterSpacing: isFree ? '0.05em' : 'normal',
                '&:not(.Mui-disabled):hover': {
                  background: 'rgba(59,130,246,0.18)',
                  borderColor: 'rgba(59,130,246,0.5)',
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 16px rgba(59,130,246,0.2)',
                },
                '&:active:not(.Mui-disabled)': { transform: 'scale(0.96)' },
                ...tileStyle(isFree, isMarked, isWinning, isOneAway, t, isDark),
              }}
            >
              {word}
            </ButtonBase>
          )
        })}
      </Box>
    </Box>
  )
}
