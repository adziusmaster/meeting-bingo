import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import { auth, signInWithGoogle, claimNick, checkNickTaken, getNickForUser, getPlayerWins, getUserAchievements, getUserTotalWins } from '../firebase'
import type { User } from '../firebase'
import { NICK_SUGGESTIONS } from '../constants'
import { ACHIEVEMENTS } from '../achievements'
import { CARD_THEMES } from '../themes'

interface LoginPageProps {
  onLogin: (nickname: string) => void
}

type Step = 'loading' | 'sign-in' | 'pick-nick' | 'welcome-back'

function makeSuggestions(base: string): string[] {
  const seen = new Set<number>()
  while (seen.size < 4) seen.add(Math.floor(Math.random() * 9900) + 10)
  return [...seen].map(n => `${base}${n}`)
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [step, setStep] = useState<Step>('loading')
  const [user, setUser] = useState<User | null>(null)
  const [existingNick, setExistingNick] = useState('')
  const [wins, setWins] = useState(0)
  const [nick, setNick] = useState('')
  const [nickTaken, setNickTaken] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [checking, setChecking] = useState(false)
  const [signInError, setSignInError] = useState('')
  const [achievements, setAchievements] = useState<string[]>([])
  const [totalWins, setTotalWins] = useState(0)
  const [unlockedThemes, setUnlockedThemes] = useState(0)

  useEffect(() => {
    return auth.onAuthStateChanged(async u => {
      setUser(u)
      if (!u) { setStep('sign-in'); return }

      const claimed = await getNickForUser(u.uid)
      if (claimed) {
        setExistingNick(claimed)
        const [w, ach, tw] = await Promise.all([
          getPlayerWins(claimed),
          getUserAchievements(claimed),
          getUserTotalWins(claimed),
        ])
        setWins(w)
        setAchievements(ach)
        setTotalWins(tw)
        setUnlockedThemes(CARD_THEMES.filter(t => t.requiredWins <= tw).length)
        setStep('welcome-back')
      } else {
        // Pre-fill from Google display name (first name only)
        setNick(u.displayName?.split(' ')[0] ?? '')
        setStep('pick-nick')
      }
    })
  }, [])

  async function handleGoogleSignIn() {
    setSignInError('')
    try {
      await signInWithGoogle()
      // onAuthStateChanged will fire and advance the step
    } catch {
      setSignInError('Sign-in failed. Please try again.')
    }
  }

  function suggest() {
    pickNick(NICK_SUGGESTIONS[Math.floor(Math.random() * NICK_SUGGESTIONS.length)])
  }

  function pickNick(value: string) {
    setNick(value)
    setNickTaken(false)
    setSuggestions([])
  }

  function handleChange(value: string) {
    setNick(value)
    setNickTaken(false)
    setSuggestions([])
  }

  async function handleBlur() {
    if (!user) return
    const trimmed = nick.trim()
    if (trimmed.length < 2) return
    setChecking(true)
    try {
      const taken = await checkNickTaken(trimmed, user.uid)
      if (taken) {
        setNickTaken(true)
        setSuggestions(makeSuggestions(trimmed))
      } else {
        setNickTaken(false)
        setSuggestions([])
      }
    } finally {
      setChecking(false)
    }
  }

  async function handleClaimNick(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!user) return
    const trimmed = nick.trim()
    if (trimmed.length < 2 || nickTaken || checking) return
    await claimNick(trimmed, user.uid)
    onLogin(trimmed)
  }

  async function handlePlay() {
    if (!user) return
    await claimNick(existingNick, user.uid) // refresh lastSeen
    onLogin(existingNick)
  }

  // Shared card wrapper
  function Card({ children }: { children: React.ReactNode }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
        <Paper sx={{ width: '100%', maxWidth: 380, p: 3.5, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', lineHeight: 1, mb: 1.5 }}>{'\uD83C\uDFB1'}</Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900, letterSpacing: '-0.03em', mb: 0.5,
              background: 'linear-gradient(135deg, #fff 30%, #06b6d4)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            Meeting Bingo
          </Typography>
          {children}
        </Paper>
      </Box>
    )
  }

  // Loading
  if (step === 'loading') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Sign in
  if (step === 'sign-in') {
    return (
      <Card>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Survive the buzzwords. Win the game.
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleGoogleSignIn}
          startIcon={
            <Box component="img"
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              sx={{ width: 18, height: 18 }}
            />
          }
        >
          Sign in with Google
        </Button>
        {signInError && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5 }}>
            {signInError}
          </Typography>
        )}
      </Card>
    )
  }

  // Welcome back
  if (step === 'welcome-back') {
    const achDefs = ACHIEVEMENTS.filter(a => achievements.includes(a.id))
    return (
      <Card>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Welcome back, {existingNick}!
        </Typography>
        {wins > 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
            You've won{' '}
            <Typography component="span" variant="body2" sx={{ color: 'secondary.main', fontWeight: 700 }}>
              {wins} {wins === 1 ? 'game' : 'games'}
            </Typography>
            {' '}{'\uD83C\uDFC6'}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1 }}>
            No wins yet — time to change that.
          </Typography>
        )}

        {/* Achievement badges */}
        {achDefs.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.75, justifyContent: 'center', flexWrap: 'wrap', mb: 1 }}>
            {achDefs.map(a => (
              <Tooltip key={a.id} title={`${a.name}: ${a.description}`}>
                <Box sx={{ fontSize: '1.3rem', cursor: 'default' }}>{a.icon}</Box>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* Unlocked themes count */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
          You've unlocked {unlockedThemes}/{CARD_THEMES.length} themes
        </Typography>

        <Button variant="contained" size="large" fullWidth onClick={handlePlay}>
          Let's play
        </Button>
      </Card>
    )
  }

  // Pick nickname
  return (
    <Card>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Hi, <strong>{user?.displayName?.split(' ')[0]}</strong>! Choose your nickname:
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        This is permanent — it will be yours across all games.
      </Typography>

      <Box component="form" onSubmit={handleClaimNick} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Box sx={{ display: 'flex', gap: 0.75 }}>
          <TextField
            placeholder="Your nickname"
            value={nick}
            autoFocus
            onChange={e => handleChange(e.target.value)}
            onBlur={handleBlur}
            slotProps={{ htmlInput: { maxLength: 20 } }}
            sx={{ flex: 1 }}
            error={nickTaken}
          />
          <Tooltip title="Suggest a nickname">
            <IconButton onClick={suggest} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <ShuffleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        {nickTaken && (
          <Box sx={{ textAlign: 'left' }}>
            <Typography variant="caption" color="error.light">
              <strong>{nick.trim()}</strong> is already taken. Try:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mt: 0.75 }}>
              {suggestions.map(s => (
                <Chip key={s} label={s} size="small" clickable onClick={() => pickNick(s)}
                  sx={{ fontSize: '0.75rem' }} />
              ))}
            </Box>
          </Box>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={nick.trim().length < 2 || nickTaken || checking}
          size="large"
        >
          {checking ? 'Checking...' : 'Claim nickname'}
        </Button>
      </Box>
    </Card>
  )
}
