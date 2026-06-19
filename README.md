# ChessTrainer

A personal chess‑training dashboard that turns your own Lichess games into a focused daily practice routine — and a launch pad to the training tools you already use. It runs entirely in the browser as a single‑file progressive web app: installable, offline‑capable, and free of streaks, badges, and nagging.

**Live:** https://karsten711.github.io/chess_dashboard

## Runs anywhere

This is a plain web app, so it works in any modern browser — Windows, macOS, Linux, iPad, or Android. It was built and tuned on an iPad, but nothing ties it there: open the live link on a Windows laptop in Chrome, Edge, or Firefox and it behaves the same. Installing it (see below) just gives it its own window and an offline cache.

## The idea

ChessTrainer doesn't try to replace the tools you train with. It sits on top of Lichess, reads your rated games and puzzle history, works out where you're actually losing points, and turns that into a clear "what to do next" — then hands you off to whichever site does that job best. Think of it as the dashboard and router for your existing chess‑study ecosystem.

Everything lives on one screen as collapsible sections.

## The sections

| Section | What it does | Token |
|---|---|:---:|
| **Today's Training** | Daily plan with two modes, **STUDY** and **PLAY**. Each block has a *suggested time* (no countdown) and a button to the right tool. See *The training split*. | no |
| **Profile & Ratings** | Classical and Puzzle ratings, plus a per‑game chart. Five tiles toggle the chart lines (Classical, Puzzle, Accuracy, Blunder score, CP loss); the Blunder tile also shows stacked **error‑distribution bars**. Only Accuracy is on by default. | yes |
| **Rated Games** | Sortable table of recent rated games with accuracy and per‑game error counts. | yes |
| **Puzzle Themes** | Your puzzle win‑rate by theme over the last 90 days. | yes¹ |
| **Training Priorities** | The areas that most need work, derived from your real game errors. Each tile links straight to themed Lichess puzzles. | yes |
| **Review** | Interactive blunder‑review trainer: board, the move you played, the engine's best move, the eval swing. Grade yourself **Got it / Missed / Next**. | yes |
| **Build queue** | Background analysis that fills the Review queue (the heavy step). | yes |
| **GMT trainer** | Guess‑the‑move drill from strong‑player positions; board oriented to the side to move. | no |
| **Opening Repertoire** | Your own openings, with live Lichess opening‑explorer data. | yes |
| **Setup** | Where you paste your Lichess access token. | — |
| **Offline & install** | Service‑worker status (the bit that caches the app) and the install prompt. | no |

¹ Puzzle Themes needs the `puzzle:read` scope on your token — see *Getting started*.

The Review trainer analyses your moves locally with Stockfish (depth 16) and schedules positions with spaced repetition (SM‑2, measured in **games played**), so mistakes resurface at the right time instead of all at once:

```
Your rated games → Build queue → Stockfish (depth 16, in browser) → Review queue
  → Review trainer (Got it / Missed / Next) → SM-2 reschedules by games played → back to the queue
```

## The training split

The minute splits are a deliberate blend, not equal slices. Three well‑proven ideas shape them:

- **Daily contact** — touch every part of your game a little each day, rather than grinding one area while the rest goes cold. The STUDY / PLAY split — and most of the time allocations — mirror **Sam Belnap's** shared study routine ([podcast](https://www.youtube.com/watch?v=KqKl-9W_mnM) · [study guide](https://docs.google.com/document/d/1E1r69Q46gZX02mE5hYPjdVw4VXdz0KfjrTjvLdf3z3s/edit)), which he runs as a daily practice: a study pass across openings, tactics, middlegame thinking, and endgame, plus a separate routine for competitive play.
- **Step by step** — the long Study block builds on the **Steps Method**, a long‑proven course system of graded lesson and exercise books that moves topic by topic, easy to hard.
- **Spaced repetition** — **Chessable's** spaced drilling keeps what you've learned from fading.

Treat the numbers as a starting point, not a rule. Shorten what's strong, lengthen what's leaking points, and edit the destinations to match your own tools (see *Customizing*).

The minute totals below cover the **core categories** only. The **Study** block on top — book work or a Chessable course — is open‑ended: spend as long as your material needs.

### STUDY — about 1 h of core blocks, plus open‑ended study

| Block | Suggested | Opens |
|---|:---:|---|
| Openings | 10 min | Chessbook |
| Tactics | 15 min | in‑app **Training Priorities** → themed Lichess puzzles · also: ChessTempo |
| Visualize | 10 min | Listudy (blind tactics) |
| GM Focus | 15 min | GMT trainer *(in‑app)* |
| Endgame | 10 min | Chess.com endgames · also: Listudy, ChessTempo |
| Study | your pace | Chessable / books |

The Tactics block doesn't dump you on a generic puzzle page — it routes through your own weak spots first:

```
STUDY · Tactics (15 min) → Training Priorities section (in-app) → Lichess puzzles (filtered by your weak theme)
extra: ChessTempo
```

### PLAY — about 2 h 30 m of core blocks, plus open‑ended study

| Block | Suggested | Opens |
|---|:---:|---|
| Focus | 20 min | Opening Repertoire *(in‑app)* |
| Tactics | 10 min | Easy Lichess Puzzles |
| Play | 60 min | Lichess |
| Analyse | 30 min | Rated Games *(in‑app)* |
| Unwind | 30 min | — (no link) |
| Study | your pace | Chessable / books |

## How it's built

| Piece | Detail |
|---|---|
| **Structure** | Single `index.html`, no build step. Open it, host it, or fork it — nothing to compile. |
| **Engine** | Stockfish 18 Lite (single‑threaded WebAssembly) runs in your browser; analysis happens on your device. |
| **Libraries** | [chess.js](https://github.com/jhlywa/chess.js) for move legality, [Chart.js](https://www.chartjs.org) for graphs — both bundled locally. |
| **Offline** | A network‑first service worker (`sw.js`) caches the app for offline use; a web manifest makes it installable. |
| **Backend** | None. The only network calls go straight to the Lichess API (profile, games, rating history, puzzle dashboard). |

## Customizing

It's meant to be tinkered with. A few things a handy user can change directly in `index.html`:

| What | Where | Notes |
|---|---|---|
| **Training destinations** | `TTP_STUDY` / `TTP_PLAY` arrays | Each block is `{ label, min, url, urlLabel }`. Swap any `url`; change `min` to retune the time split. Extra per‑block links live in `TTP_EXTRA_LINKS`. |
| **Opening repertoire** | `REPERTOIRE` array | Each entry has a name, color, ECO code, and starting position. The defaults are just one player's London / Catalan / KIA / Caro‑Kann / Slav / KID — replace them with your own. |
| **Piece set** | local storage `ct_piece_set` | Default `cburnett`; several sets are included. |
| **Board theme & durations** | inline | Editable in the same file. |

## Getting started

```
Create token (puzzle:read) → Paste in Setup section → Run Build queue once → Train (Review + Today's Training)
```

1. Open the live link, or fork the repo and serve the folder over **HTTPS** (required for the service worker and the engine).
2. Create a **Lichess personal access token** (a private key that lets the app read your data from Lichess):
   1. Log in at [lichess.org](https://lichess.org).
   2. Go to **lichess.org → API access tokens**, or open it directly: https://lichess.org/account/oauth/token
   3. Click **New personal access token** (the **+** button).
   4. Name it something you'll recognize, e.g. *ChessTrainer*.
   5. Tick the **`puzzle:read`** scope — the only permission the app needs. (In plain terms: it lets the app fetch your puzzle statistics, which are private; your profile, games, and rating history are public and need no scope.)
   6. Click **Create** / **Submit**, then **copy the token** — Lichess shows it only once.
3. Paste it into the **Setup** section. It's kept only in your browser's local storage and is sent only to Lichess — see *Privacy*.
4. Run **Build queue** once to populate the Review trainer.

### Add to Home Screen / install

Optional — the app runs fine in a normal browser tab. Installing just gives it its own window and a faster offline launch.

| Platform | Steps |
|---|---|
| **iPad / iPhone (iOS)** | Open the live link in **Safari** (must be Safari) → tap **Share** (square with an upward arrow) → **Add to Home Screen** → **Add**. |
| **Windows / macOS desktop** | Open in **Chrome** or **Edge** → click the **install icon** in the address bar (a small monitor icon), or **⋮** menu → **Install ChessTrainer** → confirm. |
| **Android** | Open in **Chrome** → **⋮** menu → **Install app** / **Add to Home screen**. |

> **Stuck on an old version?** A progressive web app caches itself, so a stale copy can linger. In a browser tab, a hard reload (`Cmd/Ctrl + Shift + R`) usually refreshes it; if not, clear the site's data once (your browser's site settings → cookies & site data for `github.io`). An installed Home‑Screen icon updates only by removing and re‑adding it.

## Privacy

There is no backend and no analytics. Your token and data stay in your browser, and requests go directly to Lichess — nothing is sent anywhere else.

## Status

A personal project, built iteratively around one player's routine and shared in case it's useful to others. Expect opinionated defaults and the occasional rough edge.

## Credits

- [Lichess](https://lichess.org) for the open API and data.
- [Stockfish](https://stockfishchess.org), [chess.js](https://github.com/jhlywa/chess.js), and [Chart.js](https://www.chartjs.org).
- Headings set in [Fredoka](https://fonts.google.com/specimen/Fredoka) (SIL Open Font License).
- The training split draws on [Sam Belnap's study routine](https://www.youtube.com/watch?v=KqKl-9W_mnM), the [Steps Method](https://www.stappenmethode.nl/en/), and Chessable.
- Links out to Chessbook, Listudy, Chess.com, Chessable, and ChessTempo — independent tools, each excellent at its own thing.
