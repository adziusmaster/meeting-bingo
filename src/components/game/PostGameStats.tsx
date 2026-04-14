import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { Player, WinCondition } from '../../types'

interface PostGameStatsProps {
  players: Player[]
  winner: string
  winCondition: WinCondition
}

const LINES = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
]

function minTilesNeededForLine(marked: boolean[]): number {
  let minRemaining = 25
  LINES.forEach(line => {
    const remaining = line.filter(i => !marked[i]).length
    if (remaining < minRemaining) minRemaining = remaining
  })
  return minRemaining
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ textAlign: 'center', px: 1.5, py: 1 }}>
      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
        {label}
      </Typography>
    </Box>
  )
}

export default function PostGameStats({ players, winner, winCondition }: PostGameStatsProps) {
  if (players.length <= 1) return null

  const activePlayers = players.filter(p => p.card?.length === 25)
  const winnerPlayer = activePlayers.find(p => p.nickname === winner)
  const nonWinners = activePlayers.filter(p => p.nickname !== winner)

  const winnerTileCount = winnerPlayer?.marked?.filter(Boolean).length ?? 0
  const totalTilesMarked = activePlayers.reduce((sum, p) => sum + (p.marked?.filter(Boolean).length ?? 0), 0)
  const mostTilesNonWinner = nonWinners.reduce((max, p) => Math.max(max, p.marked?.filter(Boolean).length ?? 0), 0)

  // Find closest non-winner
  let closestPlayer = ''
  let closestRemaining = 25
  if (winCondition === 'line') {
    nonWinners.forEach(p => {
      const remaining = minTilesNeededForLine(p.marked ?? [])
      if (remaining < closestRemaining) {
        closestRemaining = remaining
        closestPlayer = p.nickname
      }
    })
  }

  return (
    <Paper sx={{ maxWidth: 520, width: '100%', p: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
        Game Stats
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1 }}>
        <StatBox label="Winner's tiles" value={winnerTileCount} />
        <StatBox label="Total marked" value={totalTilesMarked} />
        {nonWinners.length > 0 && (
          <StatBox label="Most tiles (non-winner)" value={mostTilesNonWinner} />
        )}
      </Box>

      {closestPlayer && closestRemaining <= 2 && (
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1.5 }}>
          {closestPlayer} was {closestRemaining === 1 ? 'just 1 tile' : `${closestRemaining} tiles`} away!
        </Typography>
      )}
    </Paper>
  )
}
