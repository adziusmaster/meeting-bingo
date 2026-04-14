import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'
import { keyframes } from '@emotion/react'

const pulseWin = keyframes`
  0%, 100% { box-shadow: 0 0 14px rgba(16,185,129,0.5); }
  50%       { box-shadow: 0 0 30px rgba(16,185,129,0.85); }
`

interface BingoBoardProps {
  card: string[]
  marked: boolean[]
  winCells: Set<number>
  disabled: boolean
  onTileClick: (index: number) => void
}

function tileStyle(isFree: boolean, isMarked: boolean, isWinning: boolean) {
  if (isFree) {
    return {
      background: 'rgba(59,130,246,0.18)',
      borderColor: 'rgba(59,130,246,0.45)',
      color: '#06b6d4',
    }
  }
  if (isWinning) {
    return {
      background: 'linear-gradient(135deg, rgba(16,185,129,0.4), rgba(6,182,212,0.3))',
      borderColor: '#10b981',
      color: '#fff',
      animation: `${pulseWin} 1.2s ease-in-out infinite`,
      boxShadow: '0 0 18px rgba(16,185,129,0.55)',
    }
  }
  if (isMarked) {
    return {
      background: 'linear-gradient(135deg, rgba(251,191,36,0.3), rgba(249,115,22,0.2))',
      borderColor: 'rgba(251,191,36,0.6)',
      color: '#fbbf24',
    }
  }
  return {
    background: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.09)',
    color: '#f1f5f9',
  }
}

export default function BingoBoard({ card, marked, winCells, disabled, onTileClick }: BingoBoardProps) {
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
                color: 'primary.main',
                textShadow: '0 0 16px rgba(59,130,246,0.7)',
                letterSpacing: '0.05em',
              }}
            >
              {l}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 5×5 grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '5px' }}>
        {card.map((word, i) => {
          const isFree = word === 'FREE'
          const isMarked = marked[i]
          const isWinning = winCells.has(i)

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
                ...tileStyle(isFree, isMarked, isWinning),
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
