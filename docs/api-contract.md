# API Contract Draft

REST first. The browser handles visuals; the backend owns the real economy.

## Game State

- `GET /api/game/state`
  - Loads the authoritative player state.

## Actions

- `POST /api/game/click`
  - Records a click/mining action.
- `POST /api/game/buy-extractor`
  - Requests an extractor purchase.
- `POST /api/game/sell-particles`
  - Requests selling particles.
- `POST /api/game/research`
  - Requests a research upgrade.
- `POST /api/game/trade`
  - Requests a trade.
- `POST /api/game/ascend`
  - Requests prestige/ascension.

## Rule

The frontend sends intent. The backend calculates and validates rewards, costs, offline gains, and ownership.

