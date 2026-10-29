# Little Wing V2.5 Asset Pack

This pack is staged for review and is not connected to the live game yet.

## Animation sets

- `Idle/`: five provisional idle poses. Behavior labels and variable timing will be assigned later.
- `Walk/`: four walking frames.
- `Flight/`: five flying frames.
- `Takeoff/`: four ground-to-flight transition frames.
- `Landing/`: four flight-to-ground transition frames.
- `Combat/Haiatii/`: four casting poses with the traveling energy arc removed from the character artwork.
- `Effects/HaiatiiProjectile/`: two independent blue energy-arc projectile frames.

Every numbered frame is a transparent 64 x 64 PNG. Each folder also contains a horizontal preview strip using the folder's unnumbered filename. Preview strips are reference assets; runtime animation should use the numbered frames unless the animation loader is updated to support sprite sheets.

Ground animations share a bottom alignment. Flight frames are centered. The idle filenames are intentionally provisional until the poses are classified as base idle, breathing, looking, turning, or another behavior.

The source scaffold remains in `C:/Users/vorpa/Documents/Codex/dropzonezero/AssetpackScaffold` and was not modified.
