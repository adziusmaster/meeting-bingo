import { useEffect, useState, useRef } from 'react'
import {
  subscribeToRoom,
  subscribeToPlayer,
  subscribeToPlayers,
  startGame,
  updateWords,
  initPlayerCard,
  markTile,
  announceWinner,
  checkWin,
  getWinningCells,
  resetGame,
} from '../firebase'

const DEFAULT_WORDS_TEXT = [
  'Synergy', 'Bandwidth', 'Circle back', 'Touch base', 'Deep dive',
  'Low-hanging fruit', 'Move the needle', 'Think outside the box', 'Leverage', 'Pivot',
  'Disruptive', 'Agile', 'Scalable', 'ROI', 'KPI',
  'Stakeholder', 'Action item', 'Deliverable', 'Roadmap', 'Ecosystem',
  'Value-add', 'Best practice', 'Alignment', 'Takeaway', 'Going forward',
  'Buy-in', 'Ping', 'Quick win', 'Proactive', 'Iterate',
  'Holistic', 'Streamline', 'Visibility', 'Paradigm shift', 'Ideate',
  'Drill down', 'Game changer', 'Empower', 'Innovation', 'Onboarding',
].join('\n')

export default function GamePage({ roomCode, nickname, onLeave }) {
  const [room, setRoom] = useState(null)
  const [player, setPlayer] = useState(null)
  const [players, setPlayers] = useState([])
  const [wordInput, setWordInput] = useState(DEFAULT_WORDS_TEXT)
  const [wordError, setWordError] = useState('')
  const [copied, setCopied] = useState(false)
  const didInitCard = useRef(false)
  const didAnnounce = useRef(false)

  useEffect(() => subscribeToRoom(roomCode, setRoom), [roomCode])
  useEffect(() => subscribeToPlayer(roomCode, nickname, setPlayer), [roomCode, nickname])
  useEffect(() => subscribeToPlayers(roomCode, setPlayers), [roomCode])

  // Sync word input with room words (only when status changes to avoid overwriting edits)
  useEffect(() => {
    if (room?.words?.length) setWordInput(room.words.join('\n'))
  }, [room?.status]) // eslint-disable-line react-hooks/exhaustive-deps

  // When game starts, initialise this player's card
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

  async function handleTile(index) {
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
    await resetGame(roomCode)
    // Clear each player's card so new ones are generated
    // (simplified: just reset room status; players will get new cards on next start)
  }

  function copyCode() {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!room || !player) {
    return <div className="center-page"><div className="spinner-large" /></div>
  }

  const isCreator = room.createdBy === nickname
  const winCells = player.marked ? getWinningCells(player.marked) : new Set()
  const markedCount = (player.marked || []).filter(Boolean).length

  // ── ENDED ────────────────────────────────────────────────────
  if (room.status === 'ended') {
    const iWon = room.winner === nickname
    return (
      <div className="center-page">
        <div className="card winner-card">
          <div className="winner-emoji">{iWon ? '🏆' : '😔'}</div>
          <h1 className="bingo-shout">BINGO!</h1>
          <h2>{room.winner} wins!</h2>
          {iWon && <p className="winner-sub">That's you — nice ears!</p>}
          {!iWon && <p className="winner-sub">Better luck next meeting.</p>}
          <div className="winner-actions">
            {isCreator && (
              <button className="btn-primary" onClick={handleReset}>Play again</button>
            )}
            <button className="btn-ghost" onClick={onLeave}>Leave game</button>
          </div>
        </div>
      </div>
    )
  }

  // ── WAITING ───────────────────────────────────────────────────
  if (room.status === 'waiting') {
    return (
      <div className="game-page">
        <header className="game-header">
          <span className="logo-small">🎱 Meeting Bingo</span>
          <div className="room-code-badge" onClick={copyCode} title="Click to copy">
            {roomCode} {copied ? '✓' : '📋'}
          </div>
        </header>

        <div className="waiting-layout">
          <div className="card players-panel">
            <h3>Players in room</h3>
            <ul className="player-list">
              {players.map(p => (
                <li key={p.nickname}>
                  {p.nickname === room.createdBy ? '👑 ' : '• '}
                  {p.nickname}
                  {p.nickname === nickname ? ' (you)' : ''}
                </li>
              ))}
            </ul>
            <p className="share-hint">Share the code <strong>{roomCode}</strong> to invite others</p>
          </div>

          {isCreator ? (
            <div className="card word-panel">
              <h3>Word list <span className="word-count-badge">
                {wordInput.split('\n').filter(Boolean).length} words
              </span></h3>
              <p className="hint">One word or phrase per line. Minimum 25 needed.</p>
              <textarea
                value={wordInput}
                onChange={e => setWordInput(e.target.value)}
                rows={14}
                placeholder="Enter buzzwords, one per line…"
              />
              {wordError && <p className="error-msg">{wordError}</p>}
              <button className="btn-primary" onClick={handleStart}>
                Start game →
              </button>
            </div>
          ) : (
            <div className="card waiting-panel">
              <div className="spinner-large" />
              <p>Waiting for <strong>{room.createdBy}</strong> to start the game…</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── PLAYING ───────────────────────────────────────────────────
  if (!player.card || player.card.length !== 25) {
    return <div className="center-page"><div className="spinner-large" /><p>Shuffling your card…</p></div>
  }

  return (
    <div className="game-page">
      <header className="game-header">
        <span className="logo-small">🎱 Meeting Bingo</span>
        <span className="playing-as">Playing as <strong>{nickname}</strong></span>
        <div className="room-code-badge" onClick={copyCode} title="Click to copy">
          {roomCode} {copied ? '✓' : '📋'}
        </div>
      </header>

      {room.winner && (
        <div className="winner-banner">
          🎉 {room.winner === nickname ? 'You got' : `${room.winner} got`} BINGO!
        </div>
      )}

      <div className="board-layout">
        <div className="bingo-card">
          <div className="bingo-letters">
            {['B', 'I', 'N', 'G', 'O'].map(l => (
              <div key={l} className="bingo-letter">{l}</div>
            ))}
          </div>
          <div className="bingo-grid">
            {player.card.map((word, i) => {
              const isFree = word === 'FREE'
              const isMarked = player.marked[i]
              const isWinning = winCells.has(i)
              return (
                <button
                  key={i}
                  className={[
                    'tile',
                    isFree ? 'tile-free' : '',
                    isMarked ? 'tile-marked' : '',
                    isWinning ? 'tile-winning' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => handleTile(i)}
                  disabled={isFree || !!room.winner}
                >
                  {word}
                </button>
              )
            })}
          </div>
        </div>

        <aside className="scoreboard">
          <h3>Scoreboard</h3>
          {players
            .sort((a, b) => {
              if (a.hasWon !== b.hasWon) return a.hasWon ? -1 : 1
              return (b.marked?.filter(Boolean).length || 0) - (a.marked?.filter(Boolean).length || 0)
            })
            .map(p => {
              const count = (p.marked || []).filter(Boolean).length
              const pct = Math.round((count / 25) * 100)
              return (
                <div key={p.nickname} className={`score-row ${p.hasWon ? 'score-won' : ''} ${p.nickname === nickname ? 'score-me' : ''}`}>
                  <div className="score-name">
                    {p.hasWon ? '🏆 ' : ''}{p.nickname}{p.nickname === nickname ? ' ★' : ''}
                  </div>
                  <div className="score-bar-wrap">
                    <div className="score-bar" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="score-num">{count}/25</div>
                </div>
              )
            })}
          <div className="my-count">{markedCount} / 25 marked</div>
        </aside>
      </div>
    </div>
  )
}
