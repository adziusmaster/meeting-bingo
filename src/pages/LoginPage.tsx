import { useState } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

interface LoginPageProps {
  onLogin: (nickname: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [nick, setNick] = useState('')

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    const trimmed = nick.trim()
    if (trimmed.length < 2) return
    onLogin(trimmed)
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 2 }}>
      <Paper sx={{ width: '100%', maxWidth: 380, p: 3.5, textAlign: 'center' }}>
        <Typography sx={{ fontSize: '3rem', lineHeight: 1, mb: 1.5 }}>
          🎱
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: '-0.03em',
            mb: 0.5,
            background: 'linear-gradient(135deg, #fff 30%, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Meeting Bingo
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Survive the buzzwords. Win the game.
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}
        >
          <TextField
            placeholder="Enter your nickname"
            value={nick}
            autoFocus
            onChange={e => setNick(e.target.value)}
            slotProps={{ htmlInput: { maxLength: 20 } }}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={nick.trim().length < 2}
            size="large"
          >
            Let's play
          </Button>
        </Box>
      </Paper>
    </Box>
  )
}
