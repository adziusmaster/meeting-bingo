import { useState, useEffect } from 'react'
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
import Tooltip from '@mui/material/Tooltip'
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
import LockIcon from '@mui/icons-material/Lock'
import { useTheme } from '@mui/material/styles'
import { auth, claimNick, checkNickTaken, getUserTotalWins, getUserAchievements, getUserSelectedTheme, saveUserTheme, getPurchasedThemes, savePurchasedTheme } from '../firebase'
import type { User } from '../firebase'
import { CARD_THEMES } from '../themes'
import { ACHIEVEMENTS } from '../achievements'
import { isBillingSupported, purchaseTheme, getOwnedSkus } from '../purchases'
import type { ThemeSku } from '../purchases'

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
  const { palette } = useTheme()
  const isDark = palette.mode === 'dark'

  const [editingNick, setEditingNick]   = useState(false)
  const [nickValue, setNickValue]       = useState(nickname)
  const [nickError, setNickError]       = useState('')
  const [checking, setChecking]         = useState(false)
  const [saved, setSaved]               = useState(false)

  const [totalWins, setTotalWins]           = useState(0)
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([])
  const [selectedThemeId, setSelectedThemeId] = useState<string>('navy_night')
  const [purchasedThemes, setPurchasedThemes] = useState<string[]>([])
  const [billingSupported, setBillingSupported] = useState(false)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      getUserTotalWins(nickname),
      getUserAchievements(nickname),
      getUserSelectedTheme(nickname),
      getPurchasedThemes(nickname),
      isBillingSupported(),
    ]).then(([wins, achievements, themeId, purchased, billing]) => {
      setTotalWins(wins)
      setUnlockedAchievements(achievements)
      setSelectedThemeId(themeId)
      setPurchasedThemes(purchased)
      setBillingSupported(billing)
    }).catch(() => {})
  }, [nickname])

  async function handleRestorePurchases() {
    const ownedSkus = await getOwnedSkus()
    for (const sku of ownedSkus) {
      const theme = CARD_THEMES.find(t => t.skuId === sku)
      if (theme && !purchasedThemes.includes(theme.id)) {
        await savePurchasedTheme(nickname, theme.id)
        setPurchasedThemes(prev => [...prev, theme.id])
      }
    }
  }

  async function handleBuyTheme(skuId: ThemeSku, themeId: string) {
    if (purchasing) return
    setPurchasing(themeId)
    try {
      await purchaseTheme(skuId)
      await savePurchasedTheme(nickname, themeId)
      setPurchasedThemes(prev => [...prev, themeId])
      // Auto-select newly purchased theme
      await handleSelectTheme(themeId)
    } catch (e) {
      // User cancelled or error — silently ignore
    } finally {
      setPurchasing(null)
    }
  }

  async function handleSelectTheme(themeId: string) {
    setSelectedThemeId(themeId)
    await saveUserTheme(nickname, themeId)
  }

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

        {/* Card Themes */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              Card Themes
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
              {totalWins} win{totalWins !== 1 ? 's' : ''} total
            </Typography>
            {billingSupported && (
              <Button size="small" variant="text" onClick={handleRestorePurchases} sx={{ fontSize: '0.65rem', color: 'text.secondary', py: 0 }}>
                Restore purchases
              </Button>
            )}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
            {CARD_THEMES.map(t => {
              const grandfathered = totalWins >= t.requiredWins  // legacy win-unlock still works
              const purchased = purchasedThemes.includes(t.id)
              const unlocked = !t.isPremium || grandfathered || purchased
              const selected = selectedThemeId === t.id
              const isPurchasing = purchasing === t.id

              return (
                <Tooltip
                  key={t.id}
                  title={
                    unlocked ? t.name
                    : billingSupported ? `Buy to unlock`
                    : `Available on Android`
                  }
                  placement="top"
                >
                  <Box
                    onClick={() => unlocked && !isPurchasing && handleSelectTheme(t.id)}
                    sx={{
                      borderRadius: 2,
                      border: '2px solid',
                      borderColor: selected ? t.accentColor : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      p: 1.25,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                      cursor: unlocked ? 'pointer' : 'default',
                      opacity: unlocked ? 1 : 0.5,
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                      boxShadow: selected ? `0 0 0 1px ${t.accentColor}` : 'none',
                      background: selected
                        ? isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                        : 'transparent',
                      '&:hover': unlocked && !selected ? {
                        borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
                      } : {},
                    }}
                  >
                    <Typography sx={{ fontSize: '1.5rem', lineHeight: 1 }}>
                      {t.emoji}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.68rem', textAlign: 'center', lineHeight: 1.2 }}>
                      {t.name}
                    </Typography>
                    {!t.isPremium && (
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>free</Typography>
                    )}
                    {t.isPremium && unlocked && (
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', color: t.accentColor }}>✓ owned</Typography>
                    )}
                    {t.isPremium && !unlocked && billingSupported && (
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={isPurchasing}
                        onClick={e => { e.stopPropagation(); handleBuyTheme(t.skuId as ThemeSku, t.id) }}
                        sx={{ fontSize: '0.6rem', py: 0.25, px: 0.75, mt: 0.25, minWidth: 'auto' }}
                      >
                        {isPurchasing ? '...' : 'Buy'}
                      </Button>
                    )}
                    {t.isPremium && !unlocked && !billingSupported && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                        <LockIcon sx={{ fontSize: '0.65rem', color: 'text.disabled' }} />
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>Android</Typography>
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              )
            })}
          </Box>
        </Paper>

        {/* Achievements */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
              Achievements
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {ACHIEVEMENTS.map(ach => {
              const unlocked = unlockedAchievements.includes(ach.id)
              return (
                <Box
                  key={ach.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    p: 1,
                    borderRadius: 1.5,
                    opacity: unlocked ? 1 : 0.4,
                    background: unlocked
                      ? isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'
                      : 'transparent',
                  }}
                >
                  <Typography sx={{ fontSize: '1.4rem', lineHeight: 1, width: 28, textAlign: 'center' }}>
                    {unlocked ? ach.icon : <LockIcon sx={{ fontSize: '1.1rem', color: 'text.disabled' }} />}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem' }}>
                      {ach.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {ach.description}
                    </Typography>
                  </Box>
                  {unlocked && <CheckIcon sx={{ fontSize: '1rem', color: 'success.main' }} />}
                </Box>
              )
            })}
          </Box>
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
