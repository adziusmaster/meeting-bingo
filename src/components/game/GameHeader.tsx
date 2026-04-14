import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'

interface GameHeaderProps {
  roomCode: string
  nickname: string
  copied: boolean
  onCopyCode: () => void
}

export default function GameHeader({ roomCode, nickname, copied, onCopyCode }: GameHeaderProps) {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.09)',
      }}
    >
      <Toolbar sx={{ gap: 1.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
          🎱 Meeting Bingo
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Playing as <strong>{nickname}</strong>
        </Typography>
        <Chip
          label={`${roomCode}${copied ? ' ✓' : ''}`}
          onClick={onCopyCode}
          icon={copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
          size="small"
          sx={{
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '0.15em',
            background: 'rgba(59,130,246,0.15)',
            border: '1px solid rgba(59,130,246,0.35)',
            cursor: 'pointer',
            '&:hover': { background: 'rgba(59,130,246,0.28)' },
          }}
        />
      </Toolbar>
    </AppBar>
  )
}
