import { useState, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { ChatMessage } from '../../types'

interface ChatPanelProps {
  roomCode: string
  nickname: string
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
}

export default function ChatPanel({ nickname, messages, onSendMessage }: ChatPanelProps) {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isMobile)
  const [text, setText] = useState('')
  const [lastSeenCount, setLastSeenCount] = useState(messages.length)
  const listRef = useRef<HTMLDivElement>(null)

  const unreadCount = open ? 0 : Math.max(0, messages.length - lastSeenCount)

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setLastSeenCount(messages.length)
    }
  }, [messages.length, open, scrollToBottom])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSendMessage(trimmed)
    setText('')
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleToggle() {
    setOpen(prev => {
      if (!prev) setLastSeenCount(messages.length)
      return !prev
    })
  }

  if (!open) {
    return (
      <IconButton
        onClick={handleToggle}
        sx={{
          position: isMobile ? 'fixed' : 'relative',
          bottom: isMobile ? 16 : undefined,
          right: isMobile ? 16 : undefined,
          zIndex: isMobile ? 1200 : undefined,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          width: 44,
          height: 44,
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={9}>
          <ChatIcon fontSize="small" />
        </Badge>
      </IconButton>
    )
  }

  const isDark = muiTheme.palette.mode === 'dark'

  return (
    <Paper
      sx={{
        width: isMobile ? '100%' : 280,
        maxHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 1.5,
          py: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Chat</Typography>
        {isMobile && (
          <IconButton size="small" onClick={handleToggle}>
            <ChatIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Messages */}
      <Box
        ref={listRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 1.5,
          py: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.75,
          minHeight: 180,
        }}
      >
        {messages.length === 0 ? (
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No messages yet. Say hi! {'\uD83D\uDC4B'}
          </Typography>
        ) : (
          messages.map(msg => {
            const isOwn = msg.nickname === nickname
            const time = msg.sentAt?.toDate?.()
            const timeStr = time ? `${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}` : ''
            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start',
                }}
              >
                <Box
                  sx={{
                    maxWidth: '85%',
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 2,
                    background: isOwn
                      ? 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(6,182,212,0.2))'
                      : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  {!isOwn && (
                    <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.65rem', display: 'block' }}>
                      {msg.nickname}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ fontSize: '0.78rem', wordBreak: 'break-word' }}>
                    {msg.text}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', mt: 0.25, px: 0.5 }}>
                  {timeStr}
                </Typography>
              </Box>
            )
          })
        )}
      </Box>

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 0.5, px: 1, py: 0.75, borderTop: '1px solid', borderColor: 'divider' }}>
        <TextField
          value={text}
          onChange={e => setText(e.target.value.slice(0, 200))}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          size="small"
          slotProps={{ htmlInput: { maxLength: 200 } }}
          sx={{ flex: 1, '& .MuiOutlinedInput-root': { fontSize: '0.8rem' } }}
        />
        <IconButton size="small" color="primary" onClick={handleSend} disabled={!text.trim()}>
          <SendIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  )
}
