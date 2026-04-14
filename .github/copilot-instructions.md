# Meeting Bingo — Copilot Instructions

Real-time multiplayer bingo for work meetings. Players join a room, get a unique 5×5 card of corporate buzzwords, and mark tiles as they hear them. First to complete the win condition wins.

- **Live app:** https://meeting-bingo-a52cc.web.app
- **Play Store:** `com.adziusmaster.meetingbingo`
- **Firebase project:** `meeting-bingo-a52cc`

---

## Stack

| Layer    | Technology                                        |
|----------|---------------------------------------------------|
| Frontend | React 18 + TypeScript + Vite                      |
| UI       | Material UI v6 (dark default, switchable to light)|
| Backend  | Firebase Firestore (real-time) + Firebase Auth    |
| Hosting  | Firebase Hosting                                  |
| Android  | TWA (Trusted Web Activity) via PWABuilder         |
| Ads      | Google AdSense                                    |

---

## MUI v6 — always follow these rules

- All styles go in `sx={}` — **never** use `style=` on MUI components
- Use `slotProps={{ htmlInput: { ... } }}` — **not** `inputProps`
- Button variant overrides use `variants: [{ props: { variant, color }, style }]` — **not** `containedPrimary` in `styleOverrides`
- Theme factory: `createAppTheme(mode: 'dark' | 'light')` lives in `src/theme.ts`
- `ThemeProvider` and `CssBaseline` live in `App.tsx`, not `main.tsx`

---

## Color / theming rule

Never hardcode `rgba(255,255,255,...)` or `rgba(0,0,0,...)` for borders or backgrounds in game components. Always use `useTheme()` and branch on `palette.mode === 'dark'`. Both themes must look good.

---

## Project structure

```
src/
  pages/
    LoginPage.tsx        # Google Sign-In → nick claim → welcome-back
    LobbyPage.tsx        # Create/join room (mode + win condition settings)
    GamePage.tsx         # Main controller — all state + Firestore subscriptions
    SettingsPage.tsx     # Sound, theme, dark/light, nick change, sign out
  components/
    AdBanner.tsx         # AdSense — only renders in PROD (import.meta.env.PROD)
    game/
      BingoBoard.tsx     # 5×5 grid, tile animations, card themes, called mode
      PlayingView.tsx    # Board + scoreboard + reactions + chat
      WaitingView.tsx    # Pre-game lobby (word editor / locked list)
      EndedView.tsx      # Win screen + confetti + post-game stats
      GameHeader.tsx     # Sticky app bar — room code, avatar, sound, share
      Scoreboard.tsx     # Live tile count per player
      PlayersPanel.tsx   # Player list in waiting room
      WordEditor.tsx     # Word list textarea + category quick-picks
      LeaderboardPanel.tsx  # 8-hour + all-time leaderboard tabs
      CalledWordsPanel.tsx  # Host word-calling UI (called mode only)
      ChatPanel.tsx      # In-game room chat
      PostGameStats.tsx  # End-screen stats
      EmojiReactions.tsx # Floating emoji overlay
      AchievementToast.tsx  # Slide-in achievement notification
  firebase.ts      # All Firestore + Auth operations
  types.ts         # Shared TypeScript interfaces
  constants.ts     # DEFAULT_WORDS + category packs + WORD_CATEGORIES map
  sounds.ts        # Web Audio — playClick, playBingo, isSoundEnabled, setSoundEnabled
  haptics.ts       # navigator.vibrate — hapticClick, hapticWin
  achievements.ts  # ACHIEVEMENTS array + AchievementDef type
  themes.ts        # CARD_THEMES array + CardTheme type
  theme.ts         # MUI theme factory — createAppTheme(mode)
  App.tsx          # Router + ThemeProvider + global state (theme, sound)
  main.tsx         # Entry point — renders <App /> only
public/
  ads.txt                      # AdSense publisher line
  privacy.html                 # Privacy policy (Play Store requirement)
  .well-known/assetlinks.json  # TWA digital asset link — do NOT remove
```

---

## Firestore data model

```
rooms/{code}
  code, createdBy, status ('waiting'|'playing'|'ended'), words[], winner,
  wordsLocked, gameMode ('classic'|'called'),
  winCondition ('line'|'corners'|'x_pattern'|'blackout'),
  calledWords[], createdAt

  players/{nickname}
    nickname, card[], marked[], hasWon, joinedAt

  messages/{id}    nickname, text, sentAt
  reactions/{id}   nickname, emoji, sentAt

users/{nickname}
  nickname, uid, lastSeen, totalWins, achievements[], selectedTheme

userNicks/{uid}   nickname
wins/{id}         nickname, roomCode, wonAt
```

---

## Game modes

- **Classic** — players self-mark tiles. `player.marked[]` updated on tile click.
- **Called** — host calls words via `CalledWordsPanel`. `room.calledWords[]` drives highlighting. `computeCalledMarked(card, calledWords)` derives which tiles are marked. Players cannot manually mark tiles.

---

## Win conditions

- **Line** — any row, column, or diagonal (12 possible)
- **Corners** — tiles `[0, 4, 20, 24]`
- **X Pattern** — both diagonals: `[0,6,12,18,24]` + `[4,8,12,16,20]`
- **Blackout** — all 25 tiles

Use `checkWinCondition(marked, condition)` and `getWinConditionCells(marked, condition)`. The legacy `checkWin()` / `getWinningCells()` are kept only for backwards compat — do not use them in new code.

---

## Card themes

| Theme          | Unlock    |
|----------------|-----------|
| 🌙 Navy Night  | Free      |
| 🌲 Forest      | Free      |
| 🌅 Sunset      | 5 wins    |
| 🌊 Ocean       | 10 wins   |
| 🌹 Midnight Rose | 25 wins |
| ❄️ Arctic      | 50 wins   |

Selected theme stored in `users/{nickname}.selectedTheme`. Light mode always overrides tile text color for readability.

---

## Achievements

| ID              | Name          | Condition                                     |
|-----------------|---------------|-----------------------------------------------|
| `first_win`     | First Blood   | Win your first game                           |
| `quick_draw`    | Quick Draw    | Win with ≤ 8 tiles marked                     |
| `veteran`       | Veteran       | Win 10 games                                  |
| `legend`        | Legend        | Win 50 games                                  |
| `underdog`      | Underdog      | Win when someone else had more tiles marked   |
| `called_winner` | By the Book   | Win in called mode                            |
| `hat_trick`     | Hat Trick     | Win 3 times in one day                        |
| `blackout`      | Blackout      | Win with blackout win condition               |

Stored in `users/{nickname}.achievements[]`. Shown as toasts on unlock via `AchievementToast`.

---

## AdSense

- Publisher: `ca-pub-6700431049727613` | Slot: `2274482181`
- Render guard: `import.meta.env.PROD` — never renders in dev

---

## Deploy

```bash
npm run build && firebase deploy
```

---

## TWA notes

- `public/.well-known/assetlinks.json` must never be deleted — required for TWA verification
- Google Sign-In uses popup with `signInWithRedirect` fallback (popups blocked in TWA)
- `handleRedirectResult()` called on App mount to complete pending redirects

---

## Monetization (planned, not yet implemented)

All gameplay is free. Paid cosmetics: premium card themes. Future: Google Play Billing (Android) + Stripe (web). "Host unlocks = everyone sees it" model for win animations.

---

## Firebase rules note

Currently permissive (dev). Before hardening: players should only write their own player documents.
