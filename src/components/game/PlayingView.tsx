import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import BingoBoard from './BingoBoard'
import Scoreboard from './Scoreboard'
import EmojiReactions from './EmojiReactions'
import type { Room, Player, Reaction } from '../../types'

const REACTION_EMOJIS = ['🔥', '😂', '😱', '👏', '💀', '🎉']

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
}

export default function PlayingView({
  room, player, players, nickname, winCells, oneAwayCells, reactions, onTileClick, onReact,
}: PlayingViewProps) {
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
          🎉 {room.winner === nickname ? 'You got' : `${room.winner} got`} BINGO!
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
            marked={player.marked}
            winCells={winCells}
            oneAwayCells={oneAwayCells}
            disabled={!!room.winner}
            onTileClick={onTileClick}
          />

          {/* Reaction bar */}
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
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
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'transform 0.12s, background 0.12s',
                    '&:hover': { transform: 'scale(1.25)', background: 'rgba(255,255,255,0.08)' },
                    '&:active': { transform: 'scale(0.9)' },
                  }}
                >
                  {emoji}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Scoreboard players={players} nickname={nickname} />
      </Box>

      <EmojiReactions reactions={reactions} />
    </>
  )
}
