import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import type { Player } from '../../types'

interface ScoreboardProps {
  players: Player[]
  nickname: string
}

export default function Scoreboard({ players, nickname }: ScoreboardProps) {
  const sorted = [...players].sort((a, b) => {
    if (a.hasWon !== b.hasWon) return a.hasWon ? -1 : 1
    return (b.marked?.filter(Boolean).length ?? 0) - (a.marked?.filter(Boolean).length ?? 0)
  })

  const myCount = players.find(p => p.nickname === nickname)?.marked?.filter(Boolean).length ?? 0

  return (
    <Box sx={{ minWidth: 210, maxWidth: 280, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
        Scoreboard
      </Typography>

      {sorted.map(p => {
        const count = p.marked?.filter(Boolean).length ?? 0
        const pct = Math.round((count / 25) * 100)

        return (
          <Paper
            key={p.nickname}
            sx={{
              px: 1.25, py: 0.75,
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              alignItems: 'center',
              gap: 1,
              borderColor: p.hasWon
                ? 'success.main'
                : p.nickname === nickname
                  ? 'rgba(59,130,246,0.45)'
                  : 'rgba(255,255,255,0.09)',
              background: p.hasWon ? 'rgba(16,185,129,0.07)' : undefined,
            }}
          >
            <Typography variant="caption" noWrap sx={{ fontWeight: 600 }}>
              {p.hasWon ? '🏆 ' : ''}{p.nickname}{p.nickname === nickname ? ' ★' : ''}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={pct}
              sx={{
                width: 44, height: 5, borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.08)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
                  borderRadius: 3,
                },
              }}
            />
            <Typography variant="caption" color="text.secondary" noWrap>
              {count}/25
            </Typography>
          </Paper>
        )
      })}

      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 0.5 }}>
        {myCount} / 25 marked
      </Typography>
    </Box>
  )
}
