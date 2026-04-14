export type GameMode = 'classic' | 'called'
export type WinCondition = 'line' | 'corners' | 'x_pattern' | 'blackout'

export interface Room {
  code: string
  createdBy: string
  status: 'waiting' | 'playing' | 'ended'
  words: string[]
  winner: string | null
  wordsLocked?: boolean
  gameMode: GameMode
  winCondition: WinCondition
  calledWords: string[]
}

export interface Player {
  nickname: string
  card: string[]
  marked: boolean[]
  hasWon: boolean
}

export interface UserProfile {
  nickname: string
  lastSeen: { toDate(): Date }
}

export interface Reaction {
  id: string
  nickname: string
  emoji: string
  sentAt: { toDate(): Date } | null
}

export interface ChatMessage {
  id: string
  nickname: string
  text: string
  sentAt: { toDate(): Date } | null
}
