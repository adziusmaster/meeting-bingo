import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { DEFAULT_WORDS, WORD_CATEGORIES } from '../../constants'
import type { WordCategory } from '../../constants'

interface WordEditorProps {
  wordInput: string
  wordError: string
  onChange: (v: string) => void
  onStart: () => void
}

const CATEGORY_ICONS: Record<WordCategory, string> = {
  'Corporate Buzzwords': '💼',
  'Tech Standup':        '💻',
  'Sales Call':          '📞',
  'Management':          '📊',
}

export default function WordEditor({ wordInput, wordError, onChange, onStart }: WordEditorProps) {
  const wordCount = wordInput.split('\n').filter(Boolean).length

  return (
    <Paper
      sx={{ flex: 2, minWidth: 300, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          Word list
        </Typography>
        <Chip
          label={`${wordCount} words`}
          size="small"
          sx={{
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'rgba(6,182,212,0.15)',
            color: 'secondary.main',
          }}
        />
        <Button
          size="small"
          onClick={() => onChange(DEFAULT_WORDS.join('\n'))}
          sx={{ ml: 'auto', fontSize: '0.72rem', color: 'text.secondary' }}
        >
          Reset
        </Button>
      </Box>

      {/* Category quick-picks */}
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
          Quick-load a category:
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
          {(Object.keys(WORD_CATEGORIES) as WordCategory[]).map(cat => (
            <Chip
              key={cat}
              label={`${CATEGORY_ICONS[cat]} ${cat}`}
              size="small"
              clickable
              onClick={() => onChange(WORD_CATEGORIES[cat].join('\n'))}
              sx={{ fontSize: '0.72rem' }}
            />
          ))}
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary">
        One word or phrase per line. Minimum 25 needed.
      </Typography>

      <TextField
        multiline
        rows={10}
        value={wordInput}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter buzzwords, one per line…"
        slotProps={{ htmlInput: { style: { fontSize: '0.87rem', lineHeight: 1.7 } } }}
      />

      {wordError && (
        <Typography variant="caption" color="error">
          {wordError}
        </Typography>
      )}

      <Button variant="contained" onClick={onStart}>
        Start game →
      </Button>
    </Paper>
  )
}
