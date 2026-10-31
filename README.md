# Black Candle Lab Zero

A browser-based Budgie RPG built from scratch for desktop and mobile browsers.

## Project structure

- `index.html` owns the game-area markup and the intentional classic-script load order.
- `js/game.js` owns movement, camera, flight, pathfinding, collision evaluation, and transitions.
- `js/areas/` contains the dimensions, placements, collision data, and transition definitions for interior and exterior areas.
- `js/inventory.js` is the single source of truth for item definitions and quantities.
- `js/progress.js` is the single source of truth for level, current HP, maximum HP, and completed quests.
- `js/pickups.js` connects world pickups to inventory quantities and removable pickup collisions.
- `js/dialogue.js` owns the dialogue runner and NPC interaction zones.
- `js/dialogues/` contains character- and boss-specific conversation content and quest decisions, including the vacuum's basement lines.
- `js/menu-state.js` owns New Game, Continue, saved position, and the cinematic opening.
- `js/audio.js` owns the shared Web Audio context, decoded sounds, ambience, and voice limits.
- `js/vacuum-combat.js` owns the Lab Zero basement boss intro, vacuum attack cycle, capture, blackout, and cage reset.
- `css/areas/` contains exterior-area presentation; the other CSS files cover shared UI and interiors.
- `assets/sprites/environment/map-layers/` contains visible map layers and hidden planning layers.

The JavaScript currently uses classic scripts rather than ES modules. Later files intentionally call APIs declared by earlier files, so preserve the order at the bottom of `index.html` when adding a new system.

## Persistent game data

Game data is stored in `sessionStorage` under `lab-zero-*` keys. New Game clears the keys listed in `START_MENU_NEW_GAME_KEYS` in `js/menu-state.js`. Any new persistent combat or boss key must be added there.

## Combat integration boundary

The player-health API is ready for combat code:

- `getPlayerProgress()` returns current level, current HP, and completed quests.
- `getPlayerMaxHp()` returns level-scaled maximum HP.
- `setPlayerHp(hp)` clamps and saves current HP.
- `damagePlayer(amount)` applies persistent damage.
- `healPlayer(amount)` restores persistent HP without exceeding maximum HP.
- `isPlayerDefeated()` reports whether HP has reached zero.

Boss-specific controllers such as `js/vacuum-combat.js` own their encounter phases and combat-only animation timing. A future shared `js/combat.js` can own reusable damage, hit cooldown, victory, and defeat rules. Movement and camera remain in `js/game.js`.

Run the regression checks with Node before deploying:

```text
node tests/state-smoke.js
node tests/interiors-smoke.js
node tests/outside-smoke.js
node tests/vacuum-combat-smoke.js
```

## Map artwork workflow

Keep collectible plants out of visible static terrain layers. Area-specific `planning/` folders may retain placement and terrain guides, such as Cricket Thicket's plant and terrain PNGs, but those guides are not loaded by the game. The live pickup elements in `js/pickups.js` are what appear and disappear during play.

This is the developer's first game built without Unreal or Unity and the first deployed directly to smartphones. Frequent deployment and device testing are intentional parts of development.
