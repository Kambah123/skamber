# ASSET_MANIFEST.md

All generated imagery, its provenance, and its approval state.
Generator: in-environment native image generation (`gemini-3.1-flash-image`). No API key involved.

| Asset | Source / derivation | Files | Alt text | Status |
|---|---|---|---|---|
| Owner avatar hero | Generated from owner's approved portrait (white-kaftan frame); likeness confirmed by owner 2026-08-06 | `assets/portraits/avatar-hero.webp` (1024), `avatar-512.webp`, master PNG | "Illustrated portrait of Musa Sulaiman" | inspected at render size, in use |
| Nav / boot mark | 96px derivative of avatar hero | `assets/portraits/avatar-mark.png/.webp` | decorative (`alt=""`), OS name adjacent | inspected at 26px and 72px, in use |
| Companion — idle | Original character, prompt-designed for this build; no likeness source | `assets/companion/companion-idle.png` (128) `@2x` (256) | "Skamber OS companion" | inspected, in use |
| Companion — happy | Image-to-image from idle master (consistency) | `companion-happy.png` `@2x` | state conveyed via `data-state` | inspected, on-model, in use |
| Companion — sad | Image-to-image from idle master | `companion-sad.png` `@2x` | same | inspected, on-model (dimmed antenna, drooped eyes), in use |
| Companion — excited | Image-to-image from idle master | `companion-excited.png` `@2x` | same | inspected, on-model (mid-hop, sparkle eyes), in use |
| Zipa case art | Original composition, brand palette, no text, no real crypto logos | `assets/cases/zipa.webp` 1200×670 | "Illustration for the Zipa case study" | inspected at card size, in use |
| OneDev case art | Original composition, brand palette, no text | `assets/cases/onedev.webp` 1200×670 | "Illustration for the OneDev Studio case study" | inspected at card size, in use |

## Generation rules honoured

- Likeness derived **only** from the owner's approved photos; companion has no likeness source.
- No text, numbers, or logos baked into any asset.
- One coherent art direction: deep forest green `#0d2f26`, lime `#d8f24a`, warm off-white, consistent outline weight and lighting.
- Backgrounds flood-fill-removed from border only (interior tones preserved); transparent PNG for the companion, WebP for photographic/illustrative panels.
- Every asset inspected at its actual desktop and phone render size before integration.

## Owner approval

Final approval authority: Musa Sulaiman. The companion silhouette was flagged to the
owner (passing resemblance to a generic capsule mascot) with an offer to regenerate.
Pending explicit rejection, current art ships.
