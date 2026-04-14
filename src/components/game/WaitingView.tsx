import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import LockIcon from '@mui/icons-material/Lock'
import PlayersPanel from './PlayersPanel'
import WordEditor from './WordEditor'
import LeaderboardPanel from './LeaderboardPanel'
import AdBanner from '../AdBanner'
import type { Room, Player } from '../../types'

const WIN_CONDITION_LABELS: Record<string, string> = {
  line: 'Line',
  corners: 'Corners',
  x_pattern: 'X Pattern',
  blackout: 'Blackout',
}

interface WaitingViewProps {
  room: Room
  players: Player[]
  nickname: string
  isCreator: boolean
  wordInput: string
  wordError: string
  onWordChange: (v: string) => void
  onStart: () => void
}

export default function WaitingView({
  room, players, nickname, isCreator,
  wordInput, wordError, onWordChange, onStart,
}: WaitingViewProps) {
  const wordsLocked = room.wordsLocked ?? false
  const gameMode = room.gameMode ?? 'classic'
  const winCondition = room.winCondition ?? 'line'
  const modeLabel = gameMode === 'called' ? 'Called mode' : 'Classic mode'
  const condLabel = WIN_CONDITION_LABELS[winCondition] ?? 'Line'

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, p: 1.5, flex: 1 }}>
      <PlayersPanel
        players={players}
        nickname={nickname}
        createdBy={room.createdBy}
        roomCode={room.code}
      />

      <LeaderboardPanel />

      {isCreator && !wordsLocked && (
        <WordEditor
          wordInput={wordInput}
          wordError={wordError}
          onChange={onWordChange}
          onStart={onStart}
        />
      )}

      {isCreator && wordsLocked && (
        <Paper sx={{ flex: 2, minWidth: 300, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Word list locked
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            The word list is fixed for this room. {room.words.length} words loaded.
          </Typography>
          <Box
            sx={{
              flex: 1, overflowY: 'auto', maxHeight: 280,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1, p: 1.5,
              fontSize: '0.87rem', lineHeight: 1.7, color: 'text.secondary',
              whiteSpace: 'pre-wrap',
            }}
          >
            {room.words.join('\n')}
          </Box>
          <Button variant="contained" onClick={onStart}>
            Start game {'\u2192'}
          </Button>
        </Paper>
      )}

      {!isCreator && (
        <Paper
          sx={{
            flex: 2, minWidth: 280, p: 3,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 2, textAlign: 'center',
          }}
        >
          <CircularProgress />
          <Typography color="text.secondary">
            Waiting for <strong>{room.createdBy}</strong> to start the game...
          </Typography>
          <AdBanner format="rectangle" />
        </Paper>
      )}

      {/* Game mode info pill */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 0.5 }}>
        <Chip
          label={`${modeLabel} \u00B7 ${condLabel} win`}
          size="small"
          variant="outlined"
          sx={{ fontSize: '0.72rem', fontWeight: 600 }}
        />
      </Box>
    </Box>
  )
}
