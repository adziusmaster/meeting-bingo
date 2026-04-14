import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { keyframes } from '@emotion/react'
import confetti from 'canvas-confetti'
import { getWinningCells } from '../../firebase'
import type { Room, Player } from '../../types'
import AdBanner from '../AdBanner'

const bounce = keyframes`
  from { transform: translateY(0); }
  to   { transform: translateY(-12px); }
`

interface EndedViewProps {
  room: Room
  nickname: string
  players: Player[]
  isCreator: boolean
  onReset: () => void
  onLeave: () => void
}

function MiniBoard({ player }: { player: Player }) {
  const winCells = getWinningCells(player.marked ?? [])
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ fontWeight: 700, mb: 0.5, fontSize: '0.65rem' }} noWrap>
        {player.hasWon ? '🏆 ' : ''}{player.nickname}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 18px)', gap: '2px' }}>
        {(player.card ?? []).map((word, i) => {
          const isWin    = winCells.has(i)
          const isMarked = player.marked?.[i]
          const isFree   = word === 'FREE'
          return (
            <Box
              key={i}
              sx={{
                width: 18,
                height: 18,
                borderRadius: '3px',
                border: '1px solid',
                borderColor: isWin
                  ? '#10b981'
                  : isMarked || isFree
                    ? 'rgba(251,191,36,0.5)'
                    : 'rgba(255,255,255,0.1)',
                background: isWin
                  ? 'rgba(16,185,129,0.35)'
                  : isMarked || isFree
                    ? 'rgba(251,191,36,0.2)'
                    : 'rgba(255,255,255,0.04)',
              }}
            />
          )
        })}
      </Box>
    </Box>
  )
}

export default function EndedView({ room, nickname, players, isCreator, onReset, onLeave }: EndedViewProps) {
  const iWon = room.winner === nickname

  useEffect(() => {
    if (!iWon) return
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.65 } })
    const t = setTimeout(() => confetti({ particleCount: 80, spread: 60, origin: { y: 0.55, x: 0.3 } }), 400)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const activePlayers = players.filter(p => p.card?.length === 25)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2, gap: 2 }}>
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

      {/* Near-miss boards */}
      {activePlayers.length > 1 && (
        <Paper sx={{ maxWidth: 520, width: '100%', p: 2.5 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 2 }}>
            How everyone did
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5, justifyContent: 'center' }}>
            {activePlayers.map(p => (
              <MiniBoard key={p.nickname} player={p} />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  )
}
