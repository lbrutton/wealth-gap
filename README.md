# The Wealth Gap

Plague Inc in reverse: the plague is the 100 richest people on earth. You play the people of the world, acting through countries, religions and a secret cabal to shrink inequality, while the top 10 buy up the world, lobby your policies away and fund the far right.

**Play it:** https://lbrutton.github.io/wealth-gap/

Early prototype. Turn-based, runs in the browser, no install.

## Repo layout
| Path | What it is |
|---|---|
| `src/game.html` | The game. Edit this. Engine logic sits between `// ENGINE START` and `// ENGINE END`; the UI is below it. |
| `docs/index.html` | Built page served by GitHub Pages. Generated, don't edit by hand. |
| `tools/build.sh` | Builds `docs/index.html` from `src/game.html`. |
| `tools/sim.js` | Balance simulator: plays scripted strategies hundreds of times and reports win/loss rates. |
| `design/` | Design notes: original brainstorm, shareable recap, economics model. |

## Working on it
```sh
tools/build.sh                     # rebuild the playable page
open docs/index.html               # play locally
node tools/sim.js                  # check balance with default settings
node tools/sim.js '{"BASE_AP":5}'  # try a tweak to any CFG value
```
Run the simulator before and after any balance change. A healthy result: doing nothing loses in about 14 years, single-action strategies lose, and mixed strategies sometimes win.

## Contributing
Open an issue with ideas or bugs, or send a pull request. Commit `src/game.html` and the rebuilt `docs/index.html` together.

All billionaires in the game are fictional parody characters.
