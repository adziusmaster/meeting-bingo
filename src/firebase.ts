import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
import {
  getAuth,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  type User,
} from 'firebase/auth'
import type { Room, Player, Reaction, ChatMessage, GameMode, WinCondition } from './types'

const firebaseConfig = {
  apiKey: "AIzaSyCC3bCK8naG6NwYFuf5gyzPhMB2RnQePzE",
  authDomain: "meeting-bingo-a52cc.firebaseapp.com",
  projectId: "meeting-bingo-a52cc",
  storageBucket: "meeting-bingo-a52cc.firebasestorage.app",
  messagingSenderId: "908791038068",
  appId: "1:908791038068:web:755f46881b04a505615121",
  measurementId: "G-L6MTWEF0CE"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export type { User }

const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, googleProvider)
  } catch (err: unknown) {
    // Popups are blocked in TWA (Android Play Store app) — fall back to redirect
    const code = (err as { code?: string }).code
    if (code === 'auth/popup-blocked' || code === 'auth/cancelled-popup-request') {
      await signInWithRedirect(auth, googleProvider)
    } else {
      throw err
    }
  }
}

// Call once on app init to complete any pending redirect sign-in
export async function handleRedirectResult(): Promise<void> {
  await getRedirectResult(auth)
}

// ── Helpers ────────────────────────────────────────────────────

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generateCard(wordPool: string[]): string[] {
  const words = shuffle(wordPool.filter(w => w.trim() !== '')).slice(0, 24)
  words.splice(12, 0, 'FREE')
  return words
}

export function checkWin(marked: boolean[]): boolean {
  if (!marked || marked.length !== 25) return false
  const lines = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
  ]
  return lines.some(line => line.every(i => marked[i]))
}

export function getOneAwayCells(marked: boolean[]): Set<number> {
  const cells = new Set<number>()
  if (!marked || marked.length !== 25) return cells
  const lines = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
  ]
  lines.forEach(line => {
    const unmarked = line.filter(i => !marked[i])
    if (unmarked.length === 1) cells.add(unmarked[0])
  })
  return cells
}

export function getWinningCells(marked: boolean[]): Set<number> {
  const cells = new Set<number>()
  if (!marked || marked.length !== 25) return cells
  const lines = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
  ]
  lines.forEach(line => {
    if (line.every(i => marked[i])) line.forEach(i => cells.add(i))
  })
  return cells
}

// ── Win conditions ──────────────────────────────────────────────

const LINES = [
  [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
  [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
  [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
]

const CORNER_CELLS = [0, 4, 20, 24]
const X_DIAG_1 = [0, 6, 12, 18, 24]
const X_DIAG_2 = [4, 8, 12, 16, 20]

export function checkWinCondition(marked: boolean[], condition: WinCondition): boolean {
  if (!marked || marked.length !== 25) return false
  switch (condition) {
    case 'line':
      return LINES.some(line => line.every(i => marked[i]))
    case 'corners':
      return CORNER_CELLS.every(i => marked[i])
    case 'x_pattern':
      return X_DIAG_1.every(i => marked[i]) && X_DIAG_2.every(i => marked[i])
    case 'blackout':
      return marked.every(Boolean)
  }
}

export function getWinConditionCells(marked: boolean[], condition: WinCondition): Set<number> {
  const cells = new Set<number>()
  if (!marked || marked.length !== 25) return cells
  switch (condition) {
    case 'line':
      LINES.forEach(line => {
        if (line.every(i => marked[i])) line.forEach(i => cells.add(i))
      })
      break
    case 'corners':
      if (CORNER_CELLS.every(i => marked[i])) CORNER_CELLS.forEach(i => cells.add(i))
      break
    case 'x_pattern':
      if (X_DIAG_1.every(i => marked[i]) && X_DIAG_2.every(i => marked[i])) {
        X_DIAG_1.forEach(i => cells.add(i))
        X_DIAG_2.forEach(i => cells.add(i))
      }
      break
    case 'blackout':
      if (marked.every(Boolean)) marked.forEach((_, i) => cells.add(i))
      break
  }
  return cells
}

export function computeCalledMarked(card: string[], calledWords: string[]): boolean[] {
  const calledSet = new Set(calledWords.map(w => w.toLowerCase()))
  return card.map(word => word === 'FREE' || calledSet.has(word.toLowerCase()))
}

export async function callWord(roomCode: string, word: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { calledWords: arrayUnion(word) })
}

export async function uncallWord(roomCode: string, word: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { calledWords: arrayRemove(word) })
}

// ── Nick identity ───────────────────────────────────────────────

// Claim a nickname for a Google UID. Writes to two places:
//   users/{nickname}  — for nick-uniqueness checks and lastSeen
//   userNicks/{uid}   — for fast "what is my nick?" lookup by UID
export async function claimNick(nickname: string, uid: string): Promise<void> {
  await Promise.all([
    setDoc(doc(db, 'users', nickname), { nickname, uid, lastSeen: serverTimestamp() }, { merge: true }),
    setDoc(doc(db, 'userNicks', uid), { nickname }),
  ])
}

// Returns the nickname claimed by this Google UID, or null if none yet.
export async function getNickForUser(uid: string): Promise<string | null> {
  const snap = await getDoc(doc(db, 'userNicks', uid))
  return snap.exists() ? (snap.data().nickname as string) : null
}

// Returns true if another Google account already owns this nickname.
export async function checkNickTaken(nickname: string, currentUid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, 'users', nickname))
  if (!snap.exists()) return false
  const uid = snap.data().uid as string | undefined
  if (!uid) return false        // legacy entry before auth — not enforced
  return uid !== currentUid
}

// ── Win tracking ────────────────────────────────────────────────

const LEADERBOARD_WINDOW_MS = 8 * 60 * 60 * 1000

export async function getPlayerWins(nickname: string): Promise<number> {
  const snap = await getDocs(query(collection(db, 'wins'), where('nickname', '==', nickname)))
  return snap.size
}

export function subscribeToRecentLeaderboard(
  cb: (entries: { nickname: string; wins: number }[]) => void
): () => void {
  const since = new Date(Date.now() - LEADERBOARD_WINDOW_MS)
  return onSnapshot(
    query(collection(db, 'wins'), where('wonAt', '>=', since), orderBy('wonAt', 'desc')),
    snap => {
      const counts: Record<string, number> = {}
      snap.docs.forEach(d => {
        const nick = d.data().nickname as string
        counts[nick] = (counts[nick] ?? 0) + 1
      })
      cb(
        Object.entries(counts)
          .map(([nickname, wins]) => ({ nickname, wins }))
          .sort((a, b) => b.wins - a.wins)
      )
    }
  )
}

// ── Firestore game operations ───────────────────────────────────

export async function createRoom(
  nickname: string,
  words: string[],
  gameMode: GameMode = 'classic',
  winCondition: WinCondition = 'line',
): Promise<string> {
  const code = generateRoomCode()
  await setDoc(doc(db, 'rooms', code), {
    code, words, status: 'waiting', createdBy: nickname, winner: null, wordsLocked: false,
    gameMode, winCondition, calledWords: [],
    createdAt: serverTimestamp(),
  })
  await setDoc(doc(db, 'rooms', code, 'players', nickname), {
    nickname, card: [], marked: [], hasWon: false, joinedAt: serverTimestamp(),
  })
  return code
}

export async function joinRoom(roomCode: string, nickname: string): Promise<string> {
  const code = roomCode.toUpperCase().trim()
  const roomSnap = await getDoc(doc(db, 'rooms', code))
  if (!roomSnap.exists()) throw new Error('Room not found. Check the code and try again.')
  if ((roomSnap.data() as Room).status === 'ended') throw new Error('That game has already ended.')

  const playerSnap = await getDoc(doc(db, 'rooms', code, 'players', nickname))
  if (!playerSnap.exists()) {
    await setDoc(doc(db, 'rooms', code, 'players', nickname), {
      nickname, card: [], marked: [], hasWon: false, joinedAt: serverTimestamp(),
    })
  }
  return code
}

export async function updateWords(roomCode: string, words: string[]): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { words })
}

export async function startGame(roomCode: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'playing' })
}

export async function initPlayerCard(roomCode: string, nickname: string, wordPool: string[]): Promise<void> {
  const snap = await getDoc(doc(db, 'rooms', roomCode, 'players', nickname))
  if ((snap.data() as Player | undefined)?.card?.length === 25) return
  const card = generateCard(wordPool)
  const marked = Array<boolean>(25).fill(false)
  marked[12] = true
  await updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { card, marked })
}

export async function markTile(roomCode: string, nickname: string, marked: boolean[]): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { marked })
}

export async function announceWinner(roomCode: string, nickname: string, playerCount: number): Promise<void> {
  const ops: Promise<unknown>[] = [
    updateDoc(doc(db, 'rooms', roomCode), { status: 'ended', winner: nickname }),
    updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { hasWon: true }),
    setDoc(doc(db, 'users', nickname), { totalWins: increment(1) }, { merge: true }),
  ]
  if (playerCount > 1) {
    ops.push(addDoc(collection(db, 'wins'), { nickname, roomCode, wonAt: serverTimestamp() }))
  }
  await Promise.all(ops)
}

export async function resetPlayerCards(roomCode: string): Promise<void> {
  const snap = await getDocs(collection(db, 'rooms', roomCode, 'players'))
  await Promise.all(
    snap.docs.map(d => updateDoc(d.ref, { card: [], marked: [], hasWon: false }))
  )
}

export async function resetGame(roomCode: string): Promise<void> {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'waiting', winner: null, wordsLocked: true, calledWords: [] })
}

export function subscribeToRoom(roomCode: string, cb: (room: Room) => void): () => void {
  return onSnapshot(doc(db, 'rooms', roomCode), snap => {
    if (snap.exists()) cb(snap.data() as Room)
  })
}

export function subscribeToPlayer(roomCode: string, nickname: string, cb: (player: Player) => void): () => void {
  return onSnapshot(doc(db, 'rooms', roomCode, 'players', nickname), snap => {
    if (snap.exists()) cb(snap.data() as Player)
  })
}

export function subscribeToPlayers(roomCode: string, cb: (players: Player[]) => void): () => void {
  return onSnapshot(collection(db, 'rooms', roomCode, 'players'), snap => {
    cb(snap.docs.map(d => d.data() as Player))
  })
}

export async function sendReaction(roomCode: string, nickname: string, emoji: string): Promise<void> {
  await addDoc(collection(db, 'rooms', roomCode, 'reactions'), {
    nickname, emoji, sentAt: serverTimestamp(),
  })
}

export function subscribeToReactions(
  roomCode: string,
  cb: (reactions: Reaction[]) => void
): () => void {
  return onSnapshot(
    query(
      collection(db, 'rooms', roomCode, 'reactions'),
      orderBy('sentAt', 'desc'),
      limit(30)
    ),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as Reaction)))
  )
}

// ── Chat ───────────────────────────────────────────────────────

export async function sendChatMessage(roomCode: string, nickname: string, text: string): Promise<void> {
  await addDoc(collection(db, 'rooms', roomCode, 'messages'), {
    nickname,
    text,
    sentAt: serverTimestamp(),
  })
}

export function subscribeToChatMessages(
  roomCode: string,
  cb: (messages: ChatMessage[]) => void
): () => void {
  return onSnapshot(
    query(
      collection(db, 'rooms', roomCode, 'messages'),
      orderBy('sentAt', 'asc'),
      limit(60)
    ),
    snap => cb(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatMessage)))
  )
}

// ── Achievements ───────────────────────────────────────────────

export async function getUserAchievements(nickname: string): Promise<string[]> {
  const snap = await getDoc(doc(db, 'users', nickname))
  if (!snap.exists()) return []
  return (snap.data().achievements as string[]) ?? []
}

export async function unlockAchievement(nickname: string, achievementId: string): Promise<void> {
  await setDoc(doc(db, 'users', nickname), { achievements: arrayUnion(achievementId) }, { merge: true })
}

export function subscribeToUserAchievements(
  nickname: string,
  cb: (achievements: string[]) => void
): () => void {
  return onSnapshot(doc(db, 'users', nickname), snap => {
    if (snap.exists()) {
      cb((snap.data().achievements as string[]) ?? [])
    } else {
      cb([])
    }
  })
}

export async function getHatTrickCount(nickname: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const snap = await getDocs(
    query(collection(db, 'wins'), where('nickname', '==', nickname), where('wonAt', '>=', today))
  )
  return snap.size
}

// ── All-time leaderboard ───────────────────────────────────────

export function subscribeToAllTimeLeaderboard(
  cb: (entries: { nickname: string; wins: number }[]) => void
): () => void {
  return onSnapshot(
    query(collection(db, 'users'), orderBy('totalWins', 'desc'), limit(15)),
    snap => {
      cb(
        snap.docs
          .map(d => ({ nickname: d.data().nickname as string ?? d.id, wins: (d.data().totalWins as number) ?? 0 }))
          .filter(e => e.wins > 0)
      )
    }
  )
}

// ── Card themes ────────────────────────────────────────────────

export async function getUserSelectedTheme(nickname: string): Promise<string> {
  const snap = await getDoc(doc(db, 'users', nickname))
  if (!snap.exists()) return 'navy_night'
  return (snap.data().selectedTheme as string) ?? 'navy_night'
}

export async function saveUserTheme(nickname: string, themeId: string): Promise<void> {
  await setDoc(doc(db, 'users', nickname), { selectedTheme: themeId }, { merge: true })
}

export async function getUserTotalWins(nickname: string): Promise<number> {
  const snap = await getDoc(doc(db, 'users', nickname))
  if (!snap.exists()) return 0
  return (snap.data().totalWins as number) ?? 0
}
