import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  collection,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'

// ─────────────────────────────────────────────────────────────
// 🔧  SETUP REQUIRED
//
// 1. Go to https://console.firebase.google.com and create a project.
// 2. Add a Web App to the project (click the </> icon).
// 3. Enable Firestore Database (Build → Firestore Database → Create database).
//    Choose "Start in test mode" for a quick internal setup.
// 4. Copy your config values below.
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyCC3bCK8naG6NwYFuf5gyzPhMB2RnQePzE",
  authDomain: "meeting-bingo-a52cc.firebaseapp.com",
  projectId: "meeting-bingo-a52cc",
  storageBucket: "meeting-bingo-a52cc.firebasestorage.app",
  messagingSenderId: "908791038068",
  appId: "1:908791038068:web:755f46881b04a505615121",
  measurementId: "G-L6MTWEF0CE"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

// ── Helpers ────────────────────────────────────────────────────

export function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function generateCard(wordPool) {
  const words = shuffle(wordPool.filter(w => w.trim() !== '')).slice(0, 24)
  // inject FREE at center (index 12)
  words.splice(12, 0, 'FREE')
  return words
}

export function checkWin(marked) {
  if (!marked || marked.length !== 25) return false
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ]
  return lines.some(line => line.every(i => marked[i]))
}

export function getWinningCells(marked) {
  const cells = new Set()
  if (!marked || marked.length !== 25) return cells
  const lines = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20],
  ]
  lines.forEach(line => {
    if (line.every(i => marked[i])) line.forEach(i => cells.add(i))
  })
  return cells
}

// ── Firestore operations ────────────────────────────────────────

export async function createRoom(nickname, words) {
  const code = generateRoomCode()
  await setDoc(doc(db, 'rooms', code), {
    code,
    words,
    status: 'waiting',
    createdBy: nickname,
    winner: null,
    createdAt: serverTimestamp(),
  })
  await setDoc(doc(db, 'rooms', code, 'players', nickname), {
    nickname,
    card: [],
    marked: [],
    hasWon: false,
    joinedAt: serverTimestamp(),
  })
  return code
}

export async function joinRoom(roomCode, nickname) {
  const code = roomCode.toUpperCase().trim()
  const roomSnap = await getDoc(doc(db, 'rooms', code))
  if (!roomSnap.exists()) throw new Error('Room not found. Check the code and try again.')
  if (roomSnap.data().status === 'ended') throw new Error('That game has already ended.')

  const playerSnap = await getDoc(doc(db, 'rooms', code, 'players', nickname))
  if (!playerSnap.exists()) {
    await setDoc(doc(db, 'rooms', code, 'players', nickname), {
      nickname,
      card: [],
      marked: [],
      hasWon: false,
      joinedAt: serverTimestamp(),
    })
  }
  return code
}

export async function updateWords(roomCode, words) {
  await updateDoc(doc(db, 'rooms', roomCode), { words })
}

export async function startGame(roomCode) {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'playing' })
}

export async function initPlayerCard(roomCode, nickname, wordPool) {
  const snap = await getDoc(doc(db, 'rooms', roomCode, 'players', nickname))
  if (snap.data()?.card?.length === 25) return
  const card = generateCard(wordPool)
  const marked = Array(25).fill(false)
  marked[12] = true
  await updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { card, marked })
}

export async function markTile(roomCode, nickname, marked) {
  await updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { marked })
}

export async function announceWinner(roomCode, nickname) {
  await Promise.all([
    updateDoc(doc(db, 'rooms', roomCode), { status: 'ended', winner: nickname }),
    updateDoc(doc(db, 'rooms', roomCode, 'players', nickname), { hasWon: true }),
  ])
}

export async function resetGame(roomCode) {
  await updateDoc(doc(db, 'rooms', roomCode), { status: 'waiting', winner: null })
}

export function subscribeToRoom(roomCode, cb) {
  return onSnapshot(doc(db, 'rooms', roomCode), snap => {
    if (snap.exists()) cb(snap.data())
  })
}

export function subscribeToPlayer(roomCode, nickname, cb) {
  return onSnapshot(doc(db, 'rooms', roomCode, 'players', nickname), snap => {
    if (snap.exists()) cb(snap.data())
  })
}

export function subscribeToPlayers(roomCode, cb) {
  return onSnapshot(collection(db, 'rooms', roomCode, 'players'), snap => {
    cb(snap.docs.map(d => d.data()))
  })
}
