import { useState, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Snackbar from '@mui/material/Snackbar'
import ChatIcon from '@mui/icons-material/Chat'
import SendIcon from '@mui/icons-material/Send'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import FlagIcon from '@mui/icons-material/Flag'
import BlockIcon from '@mui/icons-material/Block'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import type { ChatMessage } from '../../types'
import { reportMessage, blockUser } from '../../firebase'

interface ChatPanelProps {
  roomCode: string
  nickname: string
  messages: ChatMessage[]
  blockedUsers: string[]
  onSendMessage: (text: string) => void
  onUserBlocked: (targetNickname: string) => void
}

export default function ChatPanel({ roomCode, nickname, messages, blockedUsers, onSendMessage, onUserBlocked }: ChatPanelProps) {
  const muiTheme = useTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'))
  const [open, setOpen] = useState(!isMobile)
  const [text, setText] = useState('')
  const [lastSeenCount, setLastSeenCount] = useState(messages.length)
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [menuMsg, setMenuMsg] = useState<ChatMessage | null>(null)
  const [snackbar, setSnackbar] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const visibleMessages = messages.filter(m => !blockedUsers.includes(m.nickname))
  const unreadCount = open ? 0 : Math.max(0, visibleMessages.length - lastSeenCount)

  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    if (open) {
      scrollToBottom()
      setLastSeenCount(visibleMessages.length)
    }
  }, [visibleMessages.length, open, scrollToBottom])

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
      if (!prev) setLastSeenCount(visibleMessages.length)
      return !prev
    })
  }

  function openMenu(e: React.MouseEvent<HTMLElement>, msg: ChatMessage) {
    e.stopPropagation()
    setMenuAnchor(e.currentTarget)
    setMenuMsg(msg)
  }

  function closeMenu() {
    setMenuAnchor(null)
    setMenuMsg(null)
  }

  async function handleReport() {
    if (!menuMsg) return
    closeMenu()
    await reportMessage(nickname, roomCode, menuMsg)
    setSnackbar('Message reported. Thanks for keeping the room safe.')
  }

  async function handleBlock() {
    if (!menuMsg) return
    const target = menuMsg.nickname
    closeMenu()
    await blockUser(nickname, target)
    onUserBlocked(target)
    setSnackbar(`${target} has been blocked. You won't see their messages.`)
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
    <>
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
          {visibleMessages.length === 0 ? (
            <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
              No messages yet. Say hi! {'\uD83D\uDC4B'}
            </Typography>
          ) : (
            visibleMessages.map(msg => {
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
                    '&:hover .msg-actions': { opacity: 1 },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flexDirection: isOwn ? 'row-reverse' : 'row' }}>
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
                    {!isOwn && (
                      <Tooltip title="Report or block">
                        <IconButton
                          className="msg-actions"
                          size="small"
                          onClick={e => openMenu(e, msg)}
                          sx={{ opacity: 0, transition: 'opacity 0.15s', p: 0.25 }}
                        >
                          <MoreVertIcon sx={{ fontSize: '0.9rem' }} />
                        </IconButton>
                      </Tooltip>
                    )}
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

      {/* Per-message context menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} disablePortal={false}>
        <MenuItem onClick={handleReport}>
          <ListItemIcon><FlagIcon fontSize="small" color="warning" /></ListItemIcon>
          <ListItemText primary="Report message" secondary="We'll review it" />
        </MenuItem>
        <MenuItem onClick={handleBlock}>
          <ListItemIcon><BlockIcon fontSize="small" color="error" /></ListItemIcon>
          <ListItemText primary={`Block ${menuMsg?.nickname ?? 'user'}`} secondary="Hide all their messages" />
        </MenuItem>
      </Menu>

      <Snackbar
        open={Boolean(snackbar)}
        autoHideDuration={4000}
        onClose={() => setSnackbar('')}
        message={snackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  )
}
