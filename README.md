# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/kijanginova88/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/kijanginova88/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Legends is an offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI — 1 platinum, 2 gold, 6 silver, 46 bronze. Every trophy has its exact official name and description, a guide written in our own words with cited sources, a grade, a kind, a Gamerscore value and a missable flag. The app has a checklist saved in the browser (localStorage) with export/import JSON, filters by grade and kind, a search box, a spoiler setting that hides the 28 hidden story trophies until earned, and a five-step roadmap to the platinum (PowerPyx rates it 4/10, about 200 hours, one playthrough, no online trophies). The only trophy reported as possibly missable is Positive Mental Attitude — its Chapter 1 meditation spot can be lost, and there is no mission replay.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080.

The app is fully static and offline: `app/index.html` plus `app/app.js`, `app/style.css` and `app/data/trophies.json`. `main.ts` (Node 22 standard library only) copies `app/` and `screenshots/` into the output directory and writes `dossier.json` for the make.fun judge.

---

<sub>Entered on [make.fun](https://make.fun/?ref=thr15azb&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
