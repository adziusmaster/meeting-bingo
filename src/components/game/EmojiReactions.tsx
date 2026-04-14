import { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import type { Reaction } from '../../types'

interface FloatingEmoji {
  id: string
  emoji: string
  nickname: string
  x: number
}

export default function EmojiReactions({ reactions }: { reactions: Reaction[] }) {
  const [floating, setFloating] = useState<FloatingEmoji[]>([])
  const knownIds = useRef(new Set<string>())
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      // Seed known IDs from initial snapshot without showing them
      reactions.forEach(r => knownIds.current.add(r.id))
      isFirst.current = false
      return
    }

    const newOnes = reactions.filter(r => !knownIds.current.has(r.id))
    if (newOnes.length === 0) return
    newOnes.forEach(r => knownIds.current.add(r.id))

    const toAdd: FloatingEmoji[] = newOnes.map(r => ({
      id: r.id,
      emoji: r.emoji,
      nickname: r.nickname,
      x: 8 + Math.random() * 84,
    }))
    setFloating(prev => [...prev, ...toAdd])

    const ids = toAdd.map(f => f.id)
    const timer = setTimeout(() => {
      setFloating(prev => prev.filter(f => !ids.includes(f.id)))
    }, 3200)
    return () => clearTimeout(timer)
  }, [reactions]) // eslint-disable-line react-hooks/exhaustive-deps

  if (floating.length === 0) return null

  return (
    <Box sx={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1300 }}>
      {floating.map(f => (
        <Box
          key={f.id}
          sx={{
            position: 'absolute',
            bottom: '12%',
            left: `${f.x}%`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.25,
            animation: 'floatUp 3s ease-out forwards',
            '@keyframes floatUp': {
              '0%':   { transform: 'translateY(0) scale(1)',    opacity: 1 },
              '70%':  { opacity: 1 },
              '100%': { transform: 'translateY(-55vh) scale(1.3)', opacity: 0 },
            },
          }}
        >
          <Box sx={{ fontSize: '2rem', lineHeight: 1 }}>{f.emoji}</Box>
          <Box sx={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {f.nickname}
          </Box>
        </Box>
      ))}
    </Box>
  )
}
