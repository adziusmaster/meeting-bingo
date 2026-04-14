import { useState, useEffect, useMemo } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LoginPage from './pages/LoginPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import SettingsPage from './pages/SettingsPage'
import { db, auth, handleRedirectResult } from './firebase'
import { createAppTheme } from './theme'
import { isSoundEnabled, setSoundEnabled } from './sounds'
import { doc, getDoc } from 'firebase/firestore'
import type { Room } from './types'

type Page = 'login' | 'lobby' | 'game' | 'settings'

function getInitialTheme(): 'dark' | 'light' {
  return (localStorage.getItem('bingo_theme') as 'dark' | 'light') ?? 'dark'
}

export default function App() {
  const [page, setPage]         = useState<Page>('login')
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [resuming, setResuming] = useState(true)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(getInitialTheme)
  const [soundEnabled, setSoundState] = useState(isSoundEnabled)

  const theme = useMemo(() => createAppTheme(themeMode), [themeMode])

  useEffect(() => {
    handleRedirectResult().catch(() => {})
  }, [])

  useEffect(() => {
    const savedNick = sessionStorage.getItem('bingo_nick')
    const savedRoom = sessionStorage.getItem('bingo_room')
    if (savedNick && savedRoom) {
      getDoc(doc(db, 'rooms', savedRoom))
        .then(snap => {
          if (snap.exists() && (snap.data() as Room).status !== 'ended') {
            setNickname(savedNick)
            setRoomCode(savedRoom)
            setPage('game')
          } else {
            sessionStorage.removeItem('bingo_room')
          }
        })
        .catch(() => {})
        .finally(() => setResuming(false))
    } else {
      setResuming(false)
    }
  }, [])

  function handleLogin(nick: string) {
    setNickname(nick)
    sessionStorage.setItem('bingo_nick', nick)
    setPage('lobby')
  }

  function handleJoin(code: string) {
    setRoomCode(code)
    sessionStorage.setItem('bingo_room', code)
    setPage('game')
  }

  function handleLeave() {
    sessionStorage.removeItem('bingo_room')
    setRoomCode('')
    setPage('lobby')
  }

  function handleToggleTheme() {
    setThemeMode(prev => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('bingo_theme', next)
      return next
    })
  }

  function handleToggleSound() {
    setSoundState(prev => {
      const next = !prev
      setSoundEnabled(next)
      return next
    })
  }

  async function handleSignOut() {
    await auth.signOut()
    sessionStorage.clear()
    setNickname('')
    setRoomCode('')
    setPage('login')
  }

  if (resuming) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'lobby' && (
        <LobbyPage
          nickname={nickname}
          onJoin={handleJoin}
          onSettings={() => setPage('settings')}
        />
      )}
      {page === 'game' && (
        <GamePage roomCode={roomCode} nickname={nickname} onLeave={handleLeave} />
      )}
      {page === 'settings' && (
        <SettingsPage
          nickname={nickname}
          soundEnabled={soundEnabled}
          themeMode={themeMode}
          onBack={() => setPage('lobby')}
          onNicknameChange={setNickname}
          onToggleSound={handleToggleSound}
          onToggleTheme={handleToggleTheme}
          onSignOut={handleSignOut}
        />
      )}
    </ThemeProvider>
  )
}
