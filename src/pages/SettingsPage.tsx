import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { auth, claimNick, checkNickTaken } from '../firebase'
import type { User } from '../firebase'

const PRIVACY_POLICY_URL = 'https://meeting-bingo-a52cc.web.app/privacy.html'
const FEEDBACK_URL = 'https://github.com/adziusmaster/meeting-bingo/issues'
const APP_VERSION = '1.0.0'

interface SettingsPageProps {
  nickname: string
  soundEnabled: boolean
  themeMode: 'dark' | 'light'
  onBack: () => void
  onNicknameChange: (nick: string) => void
  onToggleSound: () => void
  onToggleTheme: () => void
  onSignOut: () => void
}

function SettingRow({
  icon, label, children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, px: 0.5 }}>
      <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', width: 22 }}>
        {icon}
      </Box>
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      {children}
    </Box>
  )
}

export default function SettingsPage({
  nickname, soundEnabled, themeMode,
  onBack, onNicknameChange, onToggleSound, onToggleTheme, onSignOut,
}: SettingsPageProps) {
  const user = auth.currentUser as User | null

  const [editingNick, setEditingNick]   = useState(false)
  const [nickValue, setNickValue]       = useState(nickname)
  const [nickError, setNickError]       = useState('')
  const [checking, setChecking]         = useState(false)
  const [saved, setSaved]               = useState(false)

  async function handleNickBlur() {
    if (!user) return
    const trimmed = nickValue.trim()
    if (trimmed === nickname || trimmed.length < 2) return
    setChecking(true)
    setNickError('')
    try {
      const taken = await checkNickTaken(trimmed, user.uid)
      if (taken) setNickError(`"${trimmed}" is already taken`)
    } finally {
      setChecking(false)
    }
  }

  async function handleSaveNick() {
    if (!user) return
    const trimmed = nickValue.trim()
    if (trimmed.length < 2 || nickError || checking) return
    setChecking(true)
    try {
      await claimNick(trimmed, user.uid)
      sessionStorage.setItem('bingo_nick', trimmed)
      onNicknameChange(trimmed)
      setEditingNick(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setChecking(false)
    }
  }

  function cancelNickEdit() {
    setNickValue(nickname)
    setNickError('')
    setEditingNick(false)
  }

  return (
    <Box sx={{ minHeight: '100vh', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <IconButton onClick={onBack} size="small">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>Settings</Typography>
      </Box>

      <Box sx={{ maxWidth: 480, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Profile */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1.5 }}>
            Profile
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            {user?.photoURL
              ? <Avatar src={user.photoURL} sx={{ width: 44, height: 44 }} />
              : <Avatar sx={{ width: 44, height: 44, background: 'linear-gradient(135deg,#3b82f6,#06b6d4)', fontWeight: 800 }}>
                  {nickname[0]?.toUpperCase()}
                </Avatar>
            }
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{nickname}</Typography>
              {user?.email && (
                <Typography variant="caption" color="text.secondary">{user.email}</Typography>
              )}
            </Box>
            {saved && <Chip label="Saved ✓" size="small" color="success" sx={{ ml: 'auto' }} />}
          </Box>

          {editingNick ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  value={nickValue}
                  autoFocus
                  onChange={e => { setNickValue(e.target.value); setNickError('') }}
                  onBlur={handleNickBlur}
                  error={!!nickError}
                  slotProps={{ htmlInput: { maxLength: 20 } }}
                  size="small"
                />
                <IconButton
                  color="primary"
                  onClick={handleSaveNick}
                  disabled={!!nickError || checking || nickValue.trim().length < 2 || nickValue.trim() === nickname}
                >
                  <CheckIcon />
                </IconButton>
                <IconButton onClick={cancelNickEdit}>
                  <CloseIcon />
                </IconButton>
              </Box>
              {nickError && (
                <Typography variant="caption" color="error">{nickError}</Typography>
              )}
            </Box>
          ) : (
            <Button
              size="small"
              startIcon={<EditIcon fontSize="small" />}
              onClick={() => setEditingNick(true)}
              sx={{ color: 'text.secondary' }}
            >
              Change nickname
            </Button>
          )}
        </Paper>

        {/* Preferences */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
            Preferences
          </Typography>

          <SettingRow
            icon={soundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
            label="Sound effects"
          >
            <Switch checked={soundEnabled} onChange={onToggleSound} size="small" />
          </SettingRow>

          <Divider sx={{ opacity: 0.4 }} />

          <SettingRow
            icon={themeMode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
            label={themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
          >
            <Switch checked={themeMode === 'dark'} onChange={onToggleTheme} size="small" />
          </SettingRow>
        </Paper>

        {/* Account */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
            Account
          </Typography>

          <SettingRow icon={<LogoutIcon fontSize="small" />} label="Sign out">
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={onSignOut}
              sx={{ fontSize: '0.75rem', py: 0.5 }}
            >
              Sign out
            </Button>
          </SettingRow>
        </Paper>

        {/* About */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
            About
          </Typography>

          <SettingRow icon={<Box sx={{ fontSize: '0.9rem' }}>v</Box>} label="Version">
            <Typography variant="caption" color="text.secondary">{APP_VERSION}</Typography>
          </SettingRow>

          <Divider sx={{ opacity: 0.4 }} />

          <SettingRow icon={<OpenInNewIcon fontSize="small" />} label="Privacy policy">
            <IconButton size="small" component="a" href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </SettingRow>

          <Divider sx={{ opacity: 0.4 }} />

          <SettingRow icon={<OpenInNewIcon fontSize="small" />} label="Report a bug">
            <IconButton size="small" component="a" href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </SettingRow>
        </Paper>

      </Box>
    </Box>
  )
}
