import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { createRoom, joinRoom } from '../firebase'
import { DEFAULT_WORDS } from '../constants'

interface LobbyPageProps {
  nickname: string
  onJoin: (code: string) => void
}

export default function LobbyPage({ nickname, onJoin }: LobbyPageProps) {
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [joining, setJoining] = useState(false)

  async function handleCreate() {
    setCreating(true)
    setError('')
    try {
      const code = await createRoom(nickname, DEFAULT_WORDS)
      onJoin(code)
    } catch (e) {
      setError((e as Error).message)
      setCreating(false)
    }
  }

  async function handleJoin(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoining(true)
    setError('')
    try {
      const code = await joinRoom(joinCode, nickname)
      onJoin(code)
    } catch (e) {
      setError((e as Error).message)
      setJoining(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 420, p: 3 }}>
        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
          Hey, <strong>{nickname}</strong>!
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 3 }}>
          What do you want to do?
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleCreate}
          disabled={creating}
        >
          {creating ? 'Creating room…' : 'Create a new room'}
        </Button>

        <Divider sx={{ my: 2.5, color: 'text.secondary', fontSize: '0.75rem' }}>or join an existing one</Divider>

        <Box component="form" onSubmit={handleJoin} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            placeholder="Room code"
            value={joinCode}
            autoFocus
            onChange={e => setJoinCode(e.target.value.toUpperCase())}
            slotProps={{
              htmlInput: {
                maxLength: 6,
                style: {
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  fontSize: '1.2rem',
                  fontFamily: 'monospace',
                },
              },
            }}
          />
          <Button
            variant="outlined"
            type="submit"
            size="large"
            fullWidth
            disabled={joining || joinCode.trim().length < 1}
          >
            {joining ? 'Joining…' : 'Join room'}
          </Button>
        </Box>

        {error && (
          <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1.5, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  )
}
