# Meeting Bingo — Claude Code Project Context

## What this is
Real-time multiplayer bingo for work meetings. Players join a room, get a unique 5×5 bingo card filled with corporate buzzwords, and mark tiles when they hear them in a meeting. First to complete a line (or other win condition) wins.

Deployed at: https://meeting-bingo-a52cc.web.app  
Play Store package: `com.adziusmaster.meetingbingo`  
GitHub: https://github.com/adziusmaster/meeting-bingo

## Stack
- **Frontend:** React 18 + TypeScript + Vite
- **UI:** Material UI v6 (dark theme by default, switchable to light)
- **Database:** Firebase Firestore (real-time subscriptions)
- **Auth:** Firebase Auth with Google Sign-In (popup + redirect fallback for TWA)
- **Hosting:** Firebase Hosting
- **PWA:** vite-plugin-pwa with service worker
- **Android:** TWA (Trusted Web Activity) via PWABuilder

## MUI v6 rules — always follow these
- All styles go in `sx={}` — never use `style=` for MUI components
- Use `slotProps={{ htmlInput: { ... } }}` — NOT `inputProps`
- Button variant overrides use `variants: [{ props: { variant, color }, style }]` — NOT `containedPrimary` in `styleOverrides`
- Theme is created with `createAppTheme(mode: 'dark' | 'light')` in `src/theme.ts`
- `ThemeProvider` and `CssBaseline` live in `App.tsx`, not `main.tsx`

## Hardcoded color rule
Never use bare `rgba(255,255,255,...)` or `rgba(0,0,0,...)` for borders/backgrounds in game components — always use `useTheme()` and branch on `palette.mode === 'dark'`. Both themes must look good.

## Project structure
```
src/
  pages/
    LoginPage.tsx       # Google Sign-In → nick claim → welcome-back
    LobbyPage.tsx       # Create/join room (with room settings: mode + win condition)
    GamePage.tsx        # Main game controller — owns all state + subscriptions
    SettingsPage.tsx    # Sound, theme, dark/light, nick change, sign out
  components/
    AdBanner.tsx        # Google AdSense — only renders in PROD (import.meta.env.PROD guard)
    game/
      BingoBoard.tsx    # 5×5 grid with tile animations, theme support, called mode
      PlayingView.tsx   # Board + scoreboard + reaction bar + chat panel
      WaitingView.tsx   # Pre-game lobby (word editor / locked word list)
      EndedView.tsx     # Win screen + confetti + near-miss boards + post-game stats
      GameHeader.tsx    # Sticky app bar — room code, avatar, sound toggle, share
      Scoreboard.tsx    # Live tile count per player
      PlayersPanel.tsx  # Player list in waiting room
      WordEditor.tsx    # Word list textarea + category quick-picks
      LeaderboardPanel.tsx  # 8-hour + all-time leaderboard tabs
      CalledWordsPanel.tsx  # Host word-calling UI (called mode only)
      ChatPanel.tsx     # In-game room chat
      PostGameStats.tsx # End-screen stats (closest player, total tiles, etc.)
      EmojiReactions.tsx   # Floating emoji overlay
      AchievementToast.tsx # Slide-in achievement unlock notification
  firebase.ts     # All Firestore + Auth operations
  types.ts        # Shared TypeScript interfaces
  constants.ts    # DEFAULT_WORDS + word category packs + WORD_CATEGORIES map
  sounds.ts       # Web Audio API — playClick, playBingo, isSoundEnabled, setSoundEnabled
  haptics.ts      # navigator.vibrate wrappers — hapticClick, hapticWin
  achievements.ts # Achievement definitions (ACHIEVEMENTS array + AchievementDef type)
  themes.ts       # Card theme definitions (CARD_THEMES array + CardTheme type)
  theme.ts        # MUI theme factory — createAppTheme(mode)
  App.tsx         # Page router + ThemeProvider + global state (theme, sound)
  main.tsx        # Entry point — just renders <App />
  vite-env.d.ts   # /// <reference types="vite/client" /> for import.meta.env
public/
  ads.txt                     # Google AdSense publisher line
  privacy.html                # Privacy policy (required for Play Store)
  .well-known/assetlinks.json # TWA digital asset link
```

## Firestore data model
```
rooms/{code}
  code, createdBy, status ('waiting'|'playing'|'ended'), words[], winner,
  wordsLocked, gameMode ('classic'|'called'), winCondition ('line'|'corners'|'x_pattern'|'blackout'),
  calledWords[], createdAt

  players/{nickname}
    nickname, card[], marked[], hasWon, joinedAt

  messages/{id}
    nickname, text, sentAt

  reactions/{id}
    nickname, emoji, sentAt

users/{nickname}
  nickname, uid, lastSeen, totalWins, achievements[], selectedTheme

userNicks/{uid}
  nickname

wins/{id}
  nickname, roomCode, wonAt

achievements/{nickname}/unlocked/{achievementId}  (optional subcollection approach)
```

## Game modes
- **Classic:** Players self-mark tiles when they hear a word. `player.marked[]` is updated on tile click.
- **Called:** Host clicks words in CalledWordsPanel to call them. `room.calledWords[]` drives everything. Tiles are auto-highlighted via `computeCalledMarked(card, calledWords)`. Players cannot manually mark tiles.

## Win conditions
- **Line:** Any row, column, or diagonal (12 possible lines)
- **Corners:** All 4 corner tiles [0, 4, 20, 24]
- **X Pattern:** Both diagonals complete [0,6,12,18,24] + [4,8,12,16,20]
- **Blackout:** All 25 tiles marked

Use `checkWinCondition(marked, condition)` and `getWinConditionCells(marked, condition)` — NOT the legacy `checkWin()` / `getWinningCells()` (kept for backwards compat only).

## Card themes
6 themes: Navy Night (free), Forest (free), Sunset (5 wins), Ocean (10 wins), Midnight Rose (25 wins), Arctic (50 wins). Unlocked by total win count. Selected theme stored in `users/{nickname}.selectedTheme` and applied in `BingoBoard`. Light mode always overrides tile text color for readability.

## Achievements (8 total)
`first_win`, `quick_draw` (≤8 tiles), `veteran` (10 wins), `legend` (50 wins), `underdog` (win with fewer tiles than someone else), `called_winner` (win in called mode), `hat_trick` (3 wins in one day), `blackout` (win with blackout condition). Stored in `users/{nickname}.achievements[]`. Shown as toasts on unlock.

## AdSense
- Publisher: `ca-pub-6700431049727613`
- Slot: `2274482181`
- `AdBanner` component has `format='auto'` (full-width) and `format='rectangle'` (300×250) variants
- Only renders in production (`import.meta.env.PROD`)

## Deploy workflow
```bash
npm run build && firebase deploy
```
Firebase project: `meeting-bingo-a52cc`

## TWA / Play Store notes
- `public/.well-known/assetlinks.json` must stay — it's required for TWA verification
- Google Sign-In uses popup with redirect fallback (`signInWithRedirect`) for TWA because popups are blocked
- `handleRedirectResult()` is called on App mount to complete pending redirects
- Privacy policy required by Play Store: `https://meeting-bingo-a52cc.web.app/privacy.html`

## Monetization plan (not yet implemented)
- All gameplay features are free (modes, win conditions, chat, achievements)
- Cosmetics are paid: premium card themes (Sunset, Ocean, Midnight Rose, Arctic)
- Current unlock path: win milestones (soft launch)
- Future: Google Play Billing for instant unlock in Android app + Stripe for web
- "Host unlocks = everyone in room sees it" model for win animations (future)

## Known Firebase rules
The app uses permissive Firestore rules during development. Before production hardening, rules should be tightened so players can only write to their own player documents.
