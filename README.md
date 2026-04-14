# 🎱 Meeting Bingo

Real-time multiplayer bingo for your next meeting. Mark off buzzwords as you hear them — first to bingo wins.

**Live app:** https://meeting-bingo-a52cc.web.app  
**Play Store:** [Meeting Bingo on Google Play](https://play.google.com/store/apps/details?id=com.adziusmaster.meetingbingo)

---

## Features

- **Real-time multiplayer** — join a room with a 6-character code, everyone gets a unique shuffled card
- **Two game modes** — Classic (self-mark) or Called (host calls words for everyone)
- **Win conditions** — Line, Corners, X Pattern, or Full Blackout
- **Room chat** — send messages to everyone in your room during the game
- **Emoji reactions** — 🔥😂😱👏💀🎉 float across everyone's screen in real time
- **Leaderboard** — 8-hour and all-time win rankings
- **Achievements** — 8 badges to unlock based on how you play
- **Card themes** — 6 visual themes unlocked by winning games
- **Sound effects** — tile click + bingo fanfare (toggleable)
- **Google Sign-In** — permanent nickname tied to your Google account, works across devices
- **PWA** — installable on any device, works as a native Android app via Google Play

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Material UI v6 |
| Backend | Firebase Firestore (real-time) + Firebase Auth |
| Hosting | Firebase Hosting |
| Android | TWA (Trusted Web Activity) via PWABuilder |
| Ads | Google AdSense |

---

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

> Google Sign-In works on localhost. Firestore connects to the live production database — use a test room code to avoid interfering with real games.

---

## Build & deploy

```bash
npm run build        # builds to dist/
firebase deploy      # deploys to Firebase Hosting
```

Firebase project: `meeting-bingo-a52cc`

---

## Project structure

```
src/
  pages/          # LoginPage, LobbyPage, GamePage, SettingsPage
  components/
    game/         # BingoBoard, PlayingView, WaitingView, EndedView,
                  # GameHeader, Scoreboard, ChatPanel, CalledWordsPanel,
                  # LeaderboardPanel, PostGameStats, AchievementToast, ...
    AdBanner.tsx  # Google AdSense (PROD only)
  firebase.ts     # All Firestore + Auth operations
  types.ts        # TypeScript interfaces
  constants.ts    # Word packs (Corporate, Tech, Sales, Management, HR, Product, Design)
  sounds.ts       # Web Audio sound effects
  haptics.ts      # Vibration feedback
  achievements.ts # Achievement definitions
  themes.ts       # Card theme definitions
  theme.ts        # MUI theme (dark + light modes)
  App.tsx         # Root — routing + ThemeProvider
public/
  privacy.html              # Privacy policy (Play Store requirement)
  ads.txt                   # AdSense publisher verification
  .well-known/
    assetlinks.json         # TWA digital asset link (do not remove)
```

---

## Word packs

7 built-in categories selectable by the room host:

- **Corporate Buzzwords** — synergy, pivot, deep dive, leverage, ...
- **Tech Standup** — PR review, merge conflict, flaky test, tech debt, ...
- **Sales Call** — decision maker, ROI, close plan, champion, ...
- **Management** — OKRs, headcount, change management, org restructure, ...
- **HR & People** — performance review, culture fit, attrition, succession planning, ...
- **Product Meeting** — jobs to be done, PRD, RICE score, product-market fit, ...
- **Design Review** — wireframe, design system, cognitive load, empty state, ...

---

## Achievements

| Badge | Name | How to unlock |
|---|---|---|
| 🩸 | First Blood | Win your first game |
| ⚡ | Quick Draw | Win with ≤ 8 tiles marked |
| 🎖️ | Veteran | Win 10 games |
| 🏅 | Legend | Win 50 games |
| 🐕 | Underdog | Win when someone else had more tiles marked |
| 📖 | By the Book | Win a game in called mode |
| 🎩 | Hat Trick | Win 3 times in one day |
| 🌑 | Blackout | Win with the Blackout win condition |

---

## Card themes

Unlocked by total win count:

| Theme | Unlock |
|---|---|
| 🌙 Navy Night | Free |
| 🌲 Forest | Free |
| 🌅 Sunset | 5 wins |
| 🌊 Ocean | 10 wins |
| 🌹 Midnight Rose | 25 wins |
| ❄️ Arctic | 50 wins |

---

## Privacy

Privacy policy: https://meeting-bingo-a52cc.web.app/privacy.html

Data collected: Google account ID, display name, email (settings only), profile picture. Nickname, game history, and win records stored in Firebase. See privacy policy for full details.
