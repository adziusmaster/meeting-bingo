import { useEffect } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { keyframes } from '@emotion/react'
import { ACHIEVEMENTS } from '../../achievements'

const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
`

interface AchievementToastProps {
  achievements: string[]
  onDismiss: () => void
}

export default function AchievementToast({ achievements, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  if (achievements.length === 0) return null

  const first = ACHIEVEMENTS.find(a => a.id === achievements[0])
  if (!first) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1400,
        animation: `${slideIn} 0.4s ease-out`,
      }}
    >
      <Paper
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          minWidth: 240,
          background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.15))',
          borderColor: 'rgba(251,191,36,0.5)',
        }}
      >
        <Box sx={{ fontSize: '2rem', lineHeight: 1 }}>
          {first.icon}
        </Box>
        <Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color: 'warning.main', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Achievement Unlocked!
          </Typography>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.3 }}>
            {first.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            {first.description}
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
