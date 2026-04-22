import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import BingoBoard from './BingoBoard'
import Scoreboard from './Scoreboard'
import EmojiReactions from './EmojiReactions'
import ChatPanel from './ChatPanel'
import type { Room, Player, Reaction, ChatMessage } from '../../types'
import type { CardTheme } from '../../themes'

const REACTION_EMOJIS = ['\uD83D\uDD25', '\uD83D\uDE02', '\uD83D\uDE31', '\uD83D\uDC4F', '\uD83D\uDC80', '\uD83C\uDF89']

interface PlayingViewProps {
  room: Room
  player: Player
  players: Player[]
  nickname: string
  winCells: Set<number>
  oneAwayCells: Set<number>
  reactions: Reaction[]
  onTileClick: (index: number) => void
  onReact: (emoji: string) => void
  messages: ChatMessage[]
  onSendMessage: (text: string) => void
  blockedUsers: string[]
  onUserBlocked: (targetNickname: string) => void
  computedMarked?: boolean[]
  cardTheme?: CardTheme
  soundEnabled: boolean
  onToggleSound: () => void
}

export default function PlayingView({
  room, player, players, nickname, winCells, oneAwayCells, reactions, onTileClick, onReact,
  messages, onSendMessage, blockedUsers, onUserBlocked, computedMarked, cardTheme,
  soundEnabled, onToggleSound,
}: PlayingViewProps) {
  const isHost = room.createdBy === nickname
  const displayMarked = computedMarked ?? player.marked

  return (
    <>
      {room.winner && (
        <Box
          sx={{
            textAlign: 'center',
            py: 0.75,
            background: 'linear-gradient(90deg, #fbbf24, #f97316)',
            color: '#000',
            fontWeight: 800,
            fontSize: '0.95rem',
          }}
        >
          {'\uD83C\uDF89'} {room.winner === nickname ? 'You got' : `${room.winner} got`} BINGO!
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          p: 1.5,
          justifyContent: 'center',
          alignItems: 'flex-start',
          flex: 1,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <BingoBoard
            card={player.card}
            marked={displayMarked}
            winCells={winCells}
            oneAwayCells={oneAwayCells}
            disabled={!!room.winner}
            onTileClick={onTileClick}
            theme={cardTheme}
          />

          {/* Reaction bar */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, alignItems: 'center' }}>
            {REACTION_EMOJIS.map(emoji => (
              <Tooltip key={emoji} title="React">
                <IconButton
                  size="small"
                  onClick={() => onReact(emoji)}
                  sx={{
                    fontSize: '1.25rem',
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'transform 0.12s, background 0.12s',
                    '&:hover': { transform: 'scale(1.25)', background: 'rgba(255,255,255,0.08)' },
                    '&:active': { transform: 'scale(0.9)' },
                  }}
                >
                  {emoji}
                </IconButton>
              </Tooltip>
            ))}

            <Tooltip title={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}>
              <IconButton
                size="small"
                onClick={onToggleSound}
                sx={{
                  ml: 'auto',
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  color: soundEnabled ? 'primary.main' : 'text.disabled',
                  transition: 'transform 0.12s, background 0.12s, color 0.12s',
                  '&:hover': { transform: 'scale(1.15)', background: 'rgba(255,255,255,0.08)' },
                }}
              >
                {soundEnabled ? <VolumeUpIcon fontSize="small" /> : <VolumeOffIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Scoreboard players={players} nickname={nickname} />

          <ChatPanel
            roomCode={room.code}
            nickname={nickname}
            messages={messages}
            blockedUsers={blockedUsers}
            onSendMessage={onSendMessage}
            onUserBlocked={onUserBlocked}
          />
        </Box>
      </Box>

      <EmojiReactions reactions={reactions} />
    </>
  )
}
