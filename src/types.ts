export interface Room {
  code: string
  createdBy: string
  status: 'waiting' | 'playing' | 'ended'
  words: string[]
  winner: string | null
  wordsLocked?: boolean
}

export interface Player {
  nickname: string
  card: string[]
  marked: boolean[]
  hasWon: boolean
}
