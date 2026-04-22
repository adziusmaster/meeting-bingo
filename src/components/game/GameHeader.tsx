import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import ShareIcon from '@mui/icons-material/Share'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { auth } from '../../firebase'
import { isSoundEnabled, setSoundEnabled } from '../../sounds'

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
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  function toggleSound() {
    setSound(prev => {
      setSoundEnabled(!prev)
      return !prev
    })
  }

  async function handleShare() {
    const joinUrl = `${window.location.origin}?room=${roomCode}`
    const shareData = {
      title: 'Meeting Bingo',
      text: `Join my Meeting Bingo room! Use code ${roomCode} or tap the link:`,
      url: joinUrl,
    }
    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(`${shareData.text}\n${joinUrl}`)
      onCopyCode()
    }
  }

  function handleCopy() {
    setMenuAnchor(null)
    onCopyCode()
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
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', flex: 1 }}>
            🎱 Meeting Bingo
          </Typography>

          {/* Avatar + nickname */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            {photoURL
              ? <Avatar src={photoURL} sx={{ width: 26, height: 26 }} />
              : <Avatar sx={{ width: 26, height: 26, fontSize: '0.7rem', background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', fontWeight: 800 }}>
                  {nickname[0]?.toUpperCase()}
                </Avatar>
            }
            <Typography variant="caption" sx={{ fontWeight: 600, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nickname}
            </Typography>
          </Box>

          {/* ⋮ menu */}
          <IconButton
            size="small"
            onClick={e => setMenuAnchor(e.currentTarget)}
            sx={{ color: 'text.secondary' }}
          >
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Dropdown menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 210 } } }}
      >
        {/* Room code row — fixed width, no layout shift */}
        <MenuItem onClick={handleCopy} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Box sx={{ width: 20, display: 'flex', justifyContent: 'center' }}>
              {copied ? <CheckIcon fontSize="small" color="success" /> : <ContentCopyIcon fontSize="small" />}
            </Box>
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">Copy room code</Typography>
                <Typography
                  variant="caption"
                  sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.12em',
                    background: isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
                    px: 0.75, borderRadius: 1 }}
                >
                  {roomCode}
                </Typography>
              </Box>
            }
          />
        </MenuItem>

        <MenuItem onClick={() => { setMenuAnchor(null); toggleSound() }} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            {sound ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText primary={sound ? 'Sound on' : 'Sound off'} />
        </MenuItem>

        <MenuItem onClick={() => { setMenuAnchor(null); handleShare() }} dense>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ShareIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Invite players" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => { setMenuAnchor(null); setConfirmOpen(true) }} dense sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <ExitToAppIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Leave room" />
        </MenuItem>
      </Menu>

      {/* Leave confirmation */}
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
