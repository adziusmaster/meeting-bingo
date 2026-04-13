import { useState } from 'react'
import { createRoom, joinRoom } from '../firebase'

const DEFAULT_WORDS = [
  'Synergy', 'Bandwidth', 'Circle back', 'Touch base', 'Deep dive',
  'Low-hanging fruit', 'Move the needle', 'Think outside the box', 'Leverage', 'Pivot',
  'Disruptive', 'Agile', 'Scalable', 'ROI', 'KPI',
  'Stakeholder', 'Action item', 'Deliverable', 'Roadmap', 'Ecosystem',
  'Value-add', 'Best practice', 'Alignment', 'Takeaway', 'Going forward',
  'Buy-in', 'Ping', 'Quick win', 'Proactive', 'Iterate',
  'Holistic', 'Streamline', 'Visibility', 'Paradigm shift', 'Ideate',
  'Drill down', 'Game changer', 'Empower', 'Innovation', 'Onboarding',
]

export default function LobbyPage({ nickname, onJoin }) {
  const [tab, setTab] = useState('create')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setError('')
    try {
      const code = await createRoom(nickname, DEFAULT_WORDS)
      onJoin(code)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setLoading(true)
    setError('')
    try {
      const code = await joinRoom(joinCode, nickname)
      onJoin(code)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="center-page">
      <div className="card lobby-card">
        <div className="player-greeting">Hey, <strong>{nickname}</strong>!</div>
        <h2>What do you want to do?</h2>

        <div className="tabs">
          <button
            className={tab === 'create' ? 'tab active' : 'tab'}
            onClick={() => { setTab('create'); setError('') }}
          >
            Create room
          </button>
          <button
            className={tab === 'join' ? 'tab active' : 'tab'}
            onClick={() => { setTab('join'); setError('') }}
          >
            Join room
          </button>
        </div>

        {tab === 'create' && (
          <div className="tab-content">
            <p>Start a new bingo room and invite your teammates with a code.</p>
            <button className="btn-primary" onClick={handleCreate} disabled={loading}>
              {loading ? 'Creating…' : 'Create room'}
            </button>
          </div>
        )}

        {tab === 'join' && (
          <form className="tab-content" onSubmit={handleJoin}>
            <p>Enter the 6-letter room code your teammate shared.</p>
            <input
              type="text"
              placeholder="ROOM CODE"
              value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
              style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '1.2rem' }}
              autoFocus
            />
            <button className="btn-primary" type="submit" disabled={loading || joinCode.trim().length < 1}>
              {loading ? 'Joining…' : 'Join room'}
            </button>
          </form>
        )}

        {error && <p className="error-msg">{error}</p>}
      </div>
    </div>
  )
}
