import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { keyframes } from '@emotion/react'
import type { Room } from '../../types'
import AdBanner from '../AdBanner'

const bounce = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-12px); }
`

interface EndedViewProps {
  room: Room
  nickname: string
  isCreator: boolean
  onReset: () => void
  onLeave: () => void
}

export default function EndedView({ room, nickname, isCreator, onReset, onLeave }: EndedViewProps) {
  const iWon = room.winner === nickname

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Paper
        sx={{
          maxWidth: 380, width: '100%', p: 3.5,
          textAlign: 'center',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.25,
        }}
      >
        <Box sx={{ fontSize: '4rem', lineHeight: 1, animation: `${bounce} 0.6s ease infinite alternate` }}>
          {iWon ? '🏆' : '😔'}
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          BINGO!
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          {room.winner} wins!
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {iWon ? "That's you — nice ears!" : 'Better luck next meeting.'}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%', mt: 1 }}>
          {isCreator ? (
            <Button variant="contained" onClick={onReset}>Play again</Button>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, py: 1 }}>
              <CircularProgress size={16} thickness={5} />
              <Typography variant="caption" color="text.secondary">
                Waiting for <strong>{room.createdBy}</strong> to start the next round…
              </Typography>
            </Box>
          )}
          <Button variant="outlined" onClick={onLeave}>Leave game</Button>
        </Box>

        <AdBanner />
      </Paper>
    </Box>
  )
}
