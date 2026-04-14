import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { subscribeToRecentLeaderboard } from '../../firebase'

interface Entry { nickname: string; wins: number }

const MEDALS = ['🥇', '🥈', '🥉']

export default function LeaderboardPanel() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => subscribeToRecentLeaderboard(setEntries), [])

  if (entries.length === 0) return null

  return (
    <Paper sx={{ flex: 1, minWidth: 200, p: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
        Today's winners
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {entries.map((e, i) => (
          <Box
            key={e.nickname}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1, py: 0.5, borderRadius: 2,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <Typography sx={{ fontSize: '1rem', lineHeight: 1, width: 22 }}>
              {MEDALS[i] ?? `${i + 1}.`}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, flex: 1 }} noWrap>
              {e.nickname}
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700 }}>
              {e.wins}×
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, opacity: 0.5 }}>
        Last 8 hours
      </Typography>
    </Paper>
  )
}
