import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [nick, setNick] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = nick.trim()
    if (trimmed.length < 2) return
    onLogin(trimmed)
  }

  return (
    <div className="center-page">
      <div className="card login-card">
        <div className="logo">🎱</div>
        <h1>Meeting Bingo</h1>
        <p className="subtitle">Survive the buzzwords. Win the game.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nick}
            onChange={e => setNick(e.target.value)}
            maxLength={20}
            autoFocus
          />
          <button type="submit" disabled={nick.trim().length < 2}>
            Let's play
          </button>
        </form>
      </div>
    </div>
  )
}
