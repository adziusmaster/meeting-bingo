import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import LoginPage from './pages/LoginPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import { db, handleRedirectResult } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import type { Room } from './types'

type Page = 'login' | 'lobby' | 'game'

export default function App() {
  const [page, setPage] = useState<Page>('login')
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [resuming, setResuming] = useState(true)

  useEffect(() => {
    // Complete any pending Google redirect sign-in (needed for TWA / Android)
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

  if (resuming) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <>
      {page === 'login' && <LoginPage onLogin={handleLogin} />}
      {page === 'lobby' && <LobbyPage nickname={nickname} onJoin={handleJoin} />}
      {page === 'game' && (
        <GamePage roomCode={roomCode} nickname={nickname} onLeave={handleLeave} />
      )}
    </>
  )
}
