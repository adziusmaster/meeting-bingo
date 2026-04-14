import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ShareIcon from '@mui/icons-material/Share'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { auth } from '../../firebase'
import { isSoundEnabled, setSoundEnabled } from '../../sounds'

const APP_URL = 'https://meeting-bingo-a52cc.web.app'

interface GameHeaderProps {
  roomCode: string
  nickname: string
  copied: boolean
  onCopyCode: () => void
  onLeave: () => void
}

export default function GameHeader({ roomCode, nickname, copied, onCopyCode, onLeave }: GameHeaderProps) {
  const { palette } = useTheme()
  const isDark = palette.mode === 'dark'
  const photoURL = auth.currentUser?.photoURL
  const [sound, setSound] = useState(isSoundEnabled)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function toggleSound() {
    setSound(prev => {
      setSoundEnabled(!prev)
      return !prev
    })
  }

  async function handleShare() {
    const joinUrl = `${APP_URL}?room=${roomCode}`
    const shareData = {
      title: 'Meeting Bingo',
      text: `Join my Meeting Bingo room! Use code ${roomCode} or tap the link:`,
      url: joinUrl,
    }
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${joinUrl}`)
    }
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid',
          borderColor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.1)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
            🎱 Meeting Bingo
          </Typography>

          {photoURL ? (
            <Tooltip title={nickname}>
              <Avatar src={photoURL} sx={{ width: 28, height: 28 }} />
            </Tooltip>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Playing as <strong>{nickname}</strong>
            </Typography>
          )}

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
          <Tooltip title={sound ? 'Mute sounds' : 'Unmute sounds'}>
            <IconButton size="small" onClick={toggleSound} sx={{ color: 'text.secondary' }}>
              {sound ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Invite people">
            <IconButton size="small" onClick={handleShare} sx={{ color: 'text.secondary' }}>
              <ShareIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Leave room">
            <IconButton size="small" onClick={() => setConfirmOpen(true)} sx={{ color: 'text.secondary' }}>
              <ExitToAppIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Leave room?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You'll be removed from this room. Your progress won't be saved.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Stay</Button>
          <Button color="error" onClick={() => { setConfirmOpen(false); onLeave() }}>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
