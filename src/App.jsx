import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import LobbyPage from './pages/LobbyPage'
import GamePage from './pages/GamePage'
import { db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export default function App() {
  const [page, setPage] = useState('login')
  const [nickname, setNickname] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [resuming, setResuming] = useState(true)

  // Resume session from sessionStorage on first load
  useEffect(() => {
    const savedNick = sessionStorage.getItem('bingo_nick')
    const savedRoom = sessionStorage.getItem('bingo_room')
    if (savedNick && savedRoom) {
      // Verify the room still exists
      getDoc(doc(db, 'rooms', savedRoom))
        .then(snap => {
          if (snap.exists() && snap.data().status !== 'ended') {
            setNickname(savedNick)
            setRoomCode(savedRoom)
            setPage('game')
          } else {
            sessionStorage.removeItem('bingo_room')
          }
        })
        .catch(() => {}) // Firebase not configured yet — ignore
        .finally(() => setResuming(false))
    } else {
      setResuming(false)
    }
  }, [])

  function handleLogin(nick) {
    setNickname(nick)
    sessionStorage.setItem('bingo_nick', nick)
    setPage('lobby')
  }

  function handleJoin(code) {
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
    return <div className="center-page"><div className="spinner-large" /></div>
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
