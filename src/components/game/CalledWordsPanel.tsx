import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import { callWord, uncallWord } from '../../firebase'

interface CalledWordsPanelProps {
  roomCode: string
  words: string[]
  calledWords: string[]
}

export default function CalledWordsPanel({ roomCode, words, calledWords }: CalledWordsPanelProps) {
  const calledSet = new Set(calledWords.map(w => w.toLowerCase()))

  function handleToggle(word: string) {
    if (calledSet.has(word.toLowerCase())) {
      uncallWord(roomCode, word)
    } else {
      callWord(roomCode, word)
    }
  }

  function handleReset() {
    // Uncall all words one by one (arrayRemove each)
    calledWords.forEach(w => uncallWord(roomCode, w))
  }

  return (
    <Paper sx={{ p: 2, minWidth: 220, maxWidth: 320 }}>
      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
        Called Words
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        {calledWords.length} / {words.length} words called
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, maxHeight: 320, overflowY: 'auto', mb: 1.5 }}>
        {words.map(word => {
          const isCalled = calledSet.has(word.toLowerCase())
          return (
            <Chip
              key={word}
              label={word}
              size="small"
              onClick={() => handleToggle(word)}
              color={isCalled ? 'primary' : 'default'}
              variant={isCalled ? 'filled' : 'outlined'}
              sx={{ fontSize: '0.7rem', cursor: 'pointer' }}
            />
          )
        })}
      </Box>

      {calledWords.length > 0 && (
        <Button size="small" color="warning" onClick={handleReset} sx={{ fontSize: '0.7rem' }}>
          Reset called words
        </Button>
      )}
    </Paper>
  )
}
