import { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { subscribeToRecentLeaderboard, subscribeToAllTimeLeaderboard } from '../../firebase'

interface Entry { nickname: string; wins: number }

const MEDALS = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49']

function EntryList({ entries, subtitle }: { entries: Entry[]; subtitle: string }) {
  if (entries.length === 0) {
    return (
      <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', py: 2, display: 'block' }}>
        No wins yet
      </Typography>
    )
  }

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        {entries.map((e, i) => (
          <Box
            key={e.nickname}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              px: 1, py: 0.5, borderRadius: 2,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography sx={{ fontSize: '1rem', lineHeight: 1, width: 22 }}>
              {MEDALS[i] ?? `${i + 1}.`}
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 600, flex: 1 }} noWrap>
              {e.nickname}
            </Typography>
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 700 }}>
              {e.wins}{'\u00D7'}
            </Typography>
          </Box>
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, opacity: 0.5 }}>
        {subtitle}
      </Typography>
    </>
  )
}

export default function LeaderboardPanel() {
  const [tab, setTab] = useState(0)
  const [recentEntries, setRecentEntries] = useState<Entry[]>([])
  const [allTimeEntries, setAllTimeEntries] = useState<Entry[]>([])

  useEffect(() => subscribeToRecentLeaderboard(setRecentEntries), [])
  useEffect(() => subscribeToAllTimeLeaderboard(setAllTimeEntries), [])

  if (recentEntries.length === 0 && allTimeEntries.length === 0) return null

  return (
    <Paper sx={{ flex: 1, minWidth: 200, p: 2.5 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
        Leaderboard
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ minHeight: 36, mb: 1.5 }}
      >
        <Tab label="Today" sx={{ minHeight: 36, py: 0.5, px: 1.5, fontSize: '0.72rem' }} />
        <Tab label="All time" sx={{ minHeight: 36, py: 0.5, px: 1.5, fontSize: '0.72rem' }} />
      </Tabs>

      {tab === 0 && <EntryList entries={recentEntries} subtitle="Last 8 hours" />}
      {tab === 1 && <EntryList entries={allTimeEntries} subtitle="All time" />}
    </Paper>
  )
}
