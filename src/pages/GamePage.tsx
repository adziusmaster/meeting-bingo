import { useEffect, useState, useRef, useCallback } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  subscribeToRoom, subscribeToPlayer, subscribeToPlayers,
  startGame, updateWords, initPlayerCard,
  markTile, announceWinner, getOneAwayCells,
  resetGame, resetPlayerCards, sendReaction, subscribeToReactions,
  checkWinCondition, getWinConditionCells,
  subscribeToChatMessages, sendChatMessage,
  getUserAchievements, unlockAchievement, getPlayerWins, getHatTrickCount,
  subscribeToUserAchievements,
  getUserSelectedTheme,
  leaveRoom,
  getBlockedUsers,
  blockUser,
} from '../firebase'
import { DEFAULT_WORDS } from '../constants'
import { playClick, playBingo } from '../sounds'
import { isSoundEnabled, setSoundEnabled } from '../sounds'
import { hapticClick, hapticWin } from '../haptics'
import GameHeader from '../components/game/GameHeader'
import WaitingView from '../components/game/WaitingView'
import PlayingView from '../components/game/PlayingView'
import EndedView from '../components/game/EndedView'
import AchievementToast from '../components/game/AchievementToast'
import type { Room, Player, Reaction, ChatMessage, WinCondition } from '../types'
import { CARD_THEMES } from '../themes'
import type { CardTheme } from '../themes'

interface GamePageProps {
  roomCode: string
  nickname: string
  onLeave: () => void
}

export default function GamePage({ roomCode, nickname, onLeave }: GamePageProps) {
  const [room, setRoom]       = useState<Room | null>(null)
  const [player, setPlayer]   = useState<Player | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [reactions, setReactions] = useState<Reaction[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [blockedUsers, setBlockedUsers] = useState<string[]>([])
  const [wordInput, setWordInput] = useState(() => DEFAULT_WORDS.join('\n'))
  const [wordError, setWordError] = useState('')
  const [copied, setCopied]   = useState(false)
  const [cardTheme, setCardTheme] = useState<CardTheme>(CARD_THEMES[0])
  const [newAchievements, setNewAchievements] = useState<string[]>([])
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled())
  const didInitCard   = useRef(false)
  const didAnnounce   = useRef(false)
  const didFirstRoomLoad = useRef(false)
  const knownAchievements = useRef<string[]>([])

  useEffect((): (() => void) => subscribeToRoom(roomCode, setRoom),       [roomCode])
  useEffect((): (() => void) => subscribeToPlayer(roomCode, nickname, setPlayer), [roomCode, nickname])
  useEffect((): (() => void) => subscribeToPlayers(roomCode, setPlayers), [roomCode])
  useEffect((): (() => void) => subscribeToReactions(roomCode, setReactions), [roomCode])
  useEffect((): (() => void) => subscribeToChatMessages(roomCode, setMessages), [roomCode])

  // Load card theme and initial achievements
  useEffect(() => {
    getUserSelectedTheme(nickname).then(themeId => {
      const t = CARD_THEMES.find(ct => ct.id === themeId)
      if (t) setCardTheme(t)
    })
    getBlockedUsers(nickname).then(setBlockedUsers)
    getUserAchievements(nickname).then(ach => {
      knownAchievements.current = ach
    })
  }, [nickname])

  // Subscribe to achievements for toast
  useEffect(() => {
    return subscribeToUserAchievements(nickname, (achievements) => {
      const prev = knownAchievements.current
      const newOnes = achievements.filter(a => !prev.includes(a))
      if (newOnes.length > 0 && prev.length > 0) {
        setNewAchievements(newOnes)
      }
      knownAchievements.current = achievements
    })
  }, [nickname])

  // Sync word input on status changes
  useEffect(() => {
    if (!room?.words?.length) return
    if (!didFirstRoomLoad.current) {
      didFirstRoomLoad.current = true
      return
    }
    setWordInput(room.words.join('\n'))
  }, [room?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset per-round refs when the host sends everyone back to waiting
  useEffect(() => {
    if (room?.status === 'waiting') {
      didInitCard.current  = false
      didAnnounce.current  = false
    }
  }, [room?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // Initialise this player's card when the game starts
  useEffect(() => {
    if (room?.status !== 'playing') return
    if (didInitCard.current) return
    if (player?.card?.length === 25) { didInitCard.current = true; return }
    didInitCard.current = true
    initPlayerCard(roomCode, nickname, room.words)
  }, [room?.status, player?.card?.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Determine win condition
  const winCondition: WinCondition = room?.winCondition ?? 'line'
  const computedMarked = player?.marked ?? []

  // Check for win after every tile toggle
  useEffect(() => {
    if (room?.status !== 'playing') return
    if (!computedMarked || computedMarked.length !== 25) return
    if (room.winner || didAnnounce.current) return
    if (checkWinCondition(computedMarked, winCondition)) {
      didAnnounce.current = true
      playBingo()
      hapticWin()
      announceWinner(roomCode, nickname, players.length)

      // Check achievements
      const markedCount = computedMarked.filter(Boolean).length
      checkAchievementsAsync(markedCount, winCondition)
    }
  }, [computedMarked, room?.status, room?.winner]) // eslint-disable-line react-hooks/exhaustive-deps

  async function checkAchievementsAsync(markedCount: number, wc: WinCondition) {
    try {
      const existing = await getUserAchievements(nickname)
      const unlock = (id: string) => { if (!existing.includes(id)) unlockAchievement(nickname, id) }

      const totalWins = await getPlayerWins(nickname)
      // totalWins here counts wins collection docs, announceWinner just added one
      if (totalWins >= 1) unlock('first_win')
      if (markedCount <= 8) unlock('quick_draw')
      if (totalWins >= 10) unlock('veteran')
      if (totalWins >= 50) unlock('legend')
      if (wc === 'blackout') unlock('blackout')

      // underdog: win when another player had more tiles marked
      const othersMax = players.filter(p => p.nickname !== nickname)
        .reduce((max, p) => Math.max(max, p.marked?.filter(Boolean).length ?? 0), 0)
      if (othersMax > markedCount) unlock('underdog')

      // hat trick: 3 wins today
      const todayCount = await getHatTrickCount(nickname)
      if (todayCount >= 3) unlock('hat_trick')
    } catch {
      // Achievement check failure should not break the game
    }
  }

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
    playClick()
    hapticClick()
    const newMarked = [...player.marked]
    newMarked[index] = !newMarked[index]
    await markTile(roomCode, nickname, newMarked)
  }

  async function handleLeave() {
    await leaveRoom(roomCode, nickname)
    onLeave()
  }

  async function handleReset() {
    didInitCard.current  = false
    didAnnounce.current  = false
    // Preserve the room's current words (which may be custom) instead of resetting to defaults
    const currentWords = room?.words?.length ? room.words : DEFAULT_WORDS
    setWordInput(currentWords.join('\n'))
    await updateWords(roomCode, currentWords)
    await resetPlayerCards(roomCode)
    await resetGame(roomCode)
  }

  function copyCode() {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleToggleSound() {
    const next = !soundOn
    setSoundEnabled(next)
    setSoundOn(next)
  }

  const handleSendMessage = useCallback((text: string) => {
    sendChatMessage(roomCode, nickname, text)
  }, [roomCode, nickname])

  if (!room || !player) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  const isCreator  = room.createdBy === nickname
  const winCells   = computedMarked.length === 25
    ? getWinConditionCells(computedMarked, winCondition)
    : new Set<number>()
  const oneAwayCells = (room.status === 'playing' && !room.winner && computedMarked.length === 25)
    ? getOneAwayCells(computedMarked, winCondition)
    : new Set<number>()

  if (room.status === 'ended') {
    return (
      <>
        <EndedView
          room={room}
          nickname={nickname}
          players={players}
          isCreator={isCreator}
          cardTheme={cardTheme}
          onReset={handleReset}
          onLeave={onLeave}
        />
        {newAchievements.length > 0 && (
          <AchievementToast
            achievements={newAchievements}
            onDismiss={() => setNewAchievements([])}
          />
        )}
      </>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <GameHeader roomCode={roomCode} nickname={nickname} copied={copied} onCopyCode={copyCode} onLeave={handleLeave} />

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
              <Typography color="text.secondary">Shuffling your card...</Typography>
            </Box>
          )
          : (
            <PlayingView
              room={room}
              player={player}
              players={players}
              nickname={nickname}
              winCells={winCells}
              oneAwayCells={oneAwayCells}
              reactions={reactions}
              onTileClick={handleTile}
              onReact={(emoji) => sendReaction(roomCode, nickname, emoji)}
              messages={messages}
              onSendMessage={handleSendMessage}
              blockedUsers={blockedUsers}
              onUserBlocked={async (target) => {
                await blockUser(nickname, target)
                setBlockedUsers(prev => prev.includes(target) ? prev : [...prev, target])
              }}
              computedMarked={computedMarked}
              cardTheme={cardTheme}
              soundEnabled={soundOn}
              onToggleSound={handleToggleSound}
            />
          )
      )}

      {newAchievements.length > 0 && (
        <AchievementToast
          achievements={newAchievements}
          onDismiss={() => setNewAchievements([])}
        />
      )}
    </Box>
  )
}
