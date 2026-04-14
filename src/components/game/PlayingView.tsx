import Box from '@mui/material/Box'
import BingoBoard from './BingoBoard'
import Scoreboard from './Scoreboard'
import type { Room, Player } from '../../types'

interface PlayingViewProps {
  room: Room
  player: Player
  players: Player[]
  nickname: string
  winCells: Set<number>
  onTileClick: (index: number) => void
}

export default function PlayingView({
  room, player, players, nickname, winCells, onTileClick,
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
        <BingoBoard
          card={player.card}
          marked={player.marked}
          winCells={winCells}
          disabled={!!room.winner}
          onTileClick={onTileClick}
        />
        <Scoreboard players={players} nickname={nickname} />
      </Box>
    </>
  )
}
