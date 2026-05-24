# Resources

Initial resource progression:

- Sand
- Dirt
- Stone
- Silver
- Gold
- Platinum
- Emerald
- Diamond
- Obsidian

## Currency

Money should be tracked separately from physical resources.

Suggested use:

- earned by selling resources
- spent on upgrades, extractors, research, and trading
- displayed in the top HUD near resource counters
- calculated and validated by the backend once the Java API exists

## Visual Style

Resources should use simple pixel-art or low-detail sprites.

Recommended baseline:

- 16x16 or 32x32 PNG sprites
- square or slightly irregular block shape
- clear base color
- one darker shadow color
- one lighter highlight color
- 2-4 visual variants per resource later, so piles do not look too repetitive

## Suggested Colors

| Resource | Base Look |
| --- | --- |
| Sand | beige square |
| Dirt | brown square |
| Stone | gray square |
| Silver | pale metallic gray |
| Gold | gold/yellow |
| Platinum | cool white-gray |
| Emerald | saturated green |
| Diamond | pale blue/cyan |
| Obsidian | near-black purple/gray |

## Asset Tooling

Use Aseprite for the first hand-made game assets.

Why Aseprite:

- good for pixel art
- easy 16x16 and 32x32 work
- fast resource variants
- exports PNG and spritesheets
- well suited for small game resources

## Frontend Asset Location

Put exported PNG files here:

```text
frontend/src/assets/resources/
```

Suggested file names:

```text
sand.png
dirt.png
stone.png
silver.png
gold.png
platinum.png
emerald.png
diamond.png
obsidian.png
```

Later, if we add variants:

```text
sand-01.png
sand-02.png
sand-03.png
```

## Current Implementation Note

The frontend can keep generating simple placeholder sand in Phaser until real PNG assets exist. Once the PNG files are ready, Phaser should preload them in `BootScene` and use those textures in `GameScene`.
