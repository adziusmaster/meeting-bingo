import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { DEFAULT_WORDS, WORD_GROUPS } from '../../constants'
import type { WordGroup } from '../../constants'

interface WordEditorProps {
  wordInput: string
  wordError: string
  onChange: (v: string) => void
  onStart: () => void
  playerCount: number
}

export default function WordEditor({ wordInput, wordError, onChange, onStart, playerCount }: WordEditorProps) {
  const [selectedGroup, setSelectedGroup] = useState<WordGroup | null>(null)
  const wordCount = wordInput.split('\n').filter(Boolean).length
  const needMorePlayers = playerCount < 2

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

      {/* Two-level category picker */}
      <Box>
        {selectedGroup === null ? (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>
              Quick-load a category:
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {WORD_GROUPS.map(group => (
                <Chip
                  key={group.name}
                  label={`${group.emoji} ${group.name}`}
                  size="small"
                  clickable
                  onClick={() => setSelectedGroup(group)}
                  sx={{ fontSize: '0.72rem' }}
                />
              ))}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
              <Chip
                label={`← ${selectedGroup.emoji} ${selectedGroup.name}`}
                size="small"
                clickable
                onClick={() => setSelectedGroup(null)}
                sx={{ fontSize: '0.72rem' }}
              />
              <Typography variant="caption" color="text.secondary">
                Pick a list:
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
              {selectedGroup.lists.map(list => (
                <Chip
                  key={list.name}
                  label={`${list.emoji} ${list.name}`}
                  size="small"
                  clickable
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    onChange(list.words.join('\n'))
                    setSelectedGroup(null)
                  }}
                  sx={{ fontSize: '0.72rem' }}
                />
              ))}
            </Box>
          </>
        )}
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

      <Button variant="contained" onClick={onStart} disabled={needMorePlayers}>
        {needMorePlayers ? 'Waiting for players…' : 'Start game →'}
      </Button>
    </Paper>
  )
}
