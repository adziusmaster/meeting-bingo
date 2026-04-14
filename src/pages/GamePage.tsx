import { useEffect, useState, useRef } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  subscribeToRoom, subscribeToPlayer, subscribeToPlayers,
  startGame, updateWords, initPlayerCard,
  markTile, announceWinner, checkWin, getWinningCells, resetGame, resetPlayerCards,
} from '../firebase'
import { DEFAULT_WORDS } from '../constants'
import GameHeader from '../components/game/GameHeader'
import WaitingView from '../components/game/WaitingView'
import PlayingView from '../components/game/PlayingView'
import EndedView from '../components/game/EndedView'
import type { Room, Player } from '../types'

interface GamePageProps {
  roomCode: string
  nickname: string
  onLeave: () => void
}

export default function GamePage({ roomCode, nickname, onLeave }: GamePageProps) {
  const [room, setRoom] = useState<Room | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [wordInput, setWordInput] = useState(() => DEFAULT_WORDS.join('\n'))
  const [wordError, setWordError] = useState('')
  const [copied, setCopied] = useState(false)
  const didInitCard = useRef(false)
  const didAnnounce = useRef(false)
  const didFirstRoomLoad = useRef(false)

  useEffect((): (() => void) => subscribeToRoom(roomCode, setRoom), [roomCode])
  useEffect((): (() => void) => subscribeToPlayer(roomCode, nickname, setPlayer), [roomCode, nickname])
  useEffect((): (() => void) => subscribeToPlayers(roomCode, setPlayers), [roomCode])

  // Sync word input on status changes — but skip initial load so Firebase's
  // stale words don't overwrite the current DEFAULT_WORDS from constants.
  useEffect(() => {
    if (!room?.words?.length) return
    if (!didFirstRoomLoad.current) {
      didFirstRoomLoad.current = true
      return
    }
    setWordInput(room.words.join('\n'))
  }, [room?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Initialise this player's card when the game starts
  useEffect(() => {
    if (room?.status !== 'playing') return
    if (didInitCard.current) return
    if (player?.card?.length === 25) { didInitCard.current = true; return }
    didInitCard.current = true
    initPlayerCard(roomCode, nickname, room.words)
  }, [room?.status, player?.card?.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Check for win after every tile toggle
  useEffect(() => {
    if (room?.status !== 'playing') return
    if (!player?.marked || player.marked.length !== 25) return
    if (room.winner || didAnnounce.current) return
    if (checkWin(player.marked)) {
      didAnnounce.current = true
      announceWinner(roomCode, nickname)
    }
  }, [player?.marked]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStart() {
    const words = wordInput.split('\n').map(w => w.trim()).filter(Boolean)
    if (words.length < 25) {
      setWordError(`Need at least 25 words (you have ${words.length})`)
      return
    }
    setWordError('')
    await updateWords(roomCode, words)
    await startGame(roomCode)
  }

  async function handleTile(index: number) {
    if (!player?.marked || player.marked.length !== 25) return
    if (player.card[index] === 'FREE') return
    if (room?.status !== 'playing' || room?.winner) return
    const newMarked = [...player.marked]
    newMarked[index] = !newMarked[index]
    await markTile(roomCode, nickname, newMarked)
  }

  async function handleReset() {
    didInitCard.current = false
    didAnnounce.current = false
    setWordInput(DEFAULT_WORDS.join('\n'))   // instant local update
    await updateWords(roomCode, DEFAULT_WORDS) // words first so sync effect gets correct data
    await resetPlayerCards(roomCode)          // clear all cards so no instant-win on rejoin
    await resetGame(roomCode)
  }

  function copyCode() {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!room || !player) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isCreator = room.createdBy === nickname
  const winCells = player.marked ? getWinningCells(player.marked) : new Set<number>()

  if (room.status === 'ended') {
    return (
      <EndedView
        room={room}
        nickname={nickname}
        isCreator={isCreator}
        onReset={handleReset}
        onLeave={onLeave}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GameHeader roomCode={roomCode} nickname={nickname} copied={copied} onCopyCode={copyCode} />

      {room.status === 'waiting' && (
        <WaitingView
          room={room}
          players={players}
          nickname={nickname}
          isCreator={isCreator}
          wordInput={wordInput}
          wordError={wordError}
          onWordChange={setWordInput}
          onStart={handleStart}
        />
      )}

      {room.status === 'playing' && (
        player.card.length !== 25
          ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: 2 }}>
              <CircularProgress />
              <Typography color="text.secondary">Shuffling your card…</Typography>
            </Box>
          )
          : (
            <PlayingView
              room={room}
              player={player}
              players={players}
              nickname={nickname}
              winCells={winCells}
              onTileClick={handleTile}
            />
          )
      )}
    </Box>
  )
}
