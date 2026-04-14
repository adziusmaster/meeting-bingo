import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import type { Player } from '../../types'

interface PlayersPanelProps {
  players: Player[]
  nickname: string
  createdBy: string
  roomCode: string
}

export default function PlayersPanel({ players, nickname, createdBy, roomCode }: PlayersPanelProps) {
  return (
    <Paper sx={{ flex: 1, minWidth: 220, p: 2.5 }}>
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}
      >
        Players in room
      </Typography>
      <List dense disablePadding sx={{ mb: 1.5 }}>
        {players.map(p => (
          <ListItem
            key={p.nickname}
            disableGutters
            sx={{
              px: 1, py: 0.5,
              borderRadius: 2,
              mb: 0.5,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <ListItemText
              primary={`${p.nickname === createdBy ? '👑 ' : '• '}${p.nickname}${p.nickname === nickname ? ' (you)' : ''}`}
            />
          </ListItem>
        ))}
      </List>
      <Typography variant="caption" color="text.secondary">
        Share the code <strong>{roomCode}</strong> to invite others
      </Typography>
    </Paper>
  )
}
