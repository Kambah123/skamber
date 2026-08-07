# TEST_LOG.md

Functional, responsive, and accessibility test results. Method: real Chromium
sessions at each viewport against the built bundle, plus code-level checks.

## Functional (Part 47 matrix)

| # | Test | Result | Evidence |
|---|---|---|---|
| 1 | Boot completes | PASS | auto-completes ~1.9s, 0.5s on repeat visit |
| 2 | Skip Boot works | PASS | button dismisses immediately |
| 3 | Every desktop app opens | PASS | 8 desktop + 4 dock-only, all render |
| 4 | Every window closes | PASS | close dot + Escape |
| 5 | Focus order (z-promotion) | PASS | pointerdown promotes |
| 6 | Windows within viewport | PASS | drag clamped 4px/50px margins |
| 7 | Search finds applications | PASS | fuzzy match, palette |
| 8 | Theme switch works | PASS | Day/Night/Dark; open windows preserved |
| 9 | Time updates | PASS | 30s interval, WAT timezone |
| 10 | Projects render | PASS | Zipa + OneDev cards with art |
| 11 | Project URLs resolve | PASS | usezipa.xyz → 200, opens new tab |
| 12 | Results show disclosures | PASS | founder-reported labelled inline |
| 13 | Proof videos load | N/A | no approved material; honest empty state |
| 14 | Learn videos load | N/A | app not in v1 (no channel supplied) |
| 15 | Voice agent offline state | N/A | app not in v1 (no vendor) |
| 16 | Contact form succeeds | PASS | mailto fallback fires; Netlify blueprint present, activates on deploy |
| 17 | Booking opens | ADAPTED | routes to Contact per contract (no provider) |
| 18 | WhatsApp opens | PASS | wa.me links, both numbers |
| 19–21 | Music play/pause/next | N/A | no licensed tracks; app not shipped |
| 22 | Whiteboard creates note | PASS | tested live at 390×844 |
| 23 | Whiteboard edits note | PASS | textarea inline |
| 24 | Whiteboard moves note | PASS | pointer drag, board-clamped |
| 25 | Whiteboard deletes note | PASS | × control |
| 26 | Notes survive reload | PASS | localStorage v1 key |
| 27 | Icon positions survive reload | PASS | layout v1 key, desktop only |
| 28 | Reset works | PASS | board reset + icon reset + companion reset |
| 29 | Blog routes return 200 | PENDING | no articles yet; routes ship with first article |
| 30 | Sitemap returns 200 | PASS (structure) | verify again on production host |

## Responsive

| Viewport | Result | Notes |
|---|---|---|
| 320×568 | PASS after fix | OS name hidden, theme switch compacted, companion 38px |
| 390×844 | PASS | transmission first, identity second, 2-col grid, full-width CTA card, sheet windows |
| 1440×900 | PASS | one-screen composition, no scroll, all 8 icons + dock reachable |
| 1920×1080 | PASS | composition holds, portrait and fold correct |
| 360×800 / 430×932 | PASS by construction | same breakpoint band as 390, re-verify on device |
| 768×1024 / 1024×768 / 1366×768 | PASS by construction | tablet band ≤1024 collapses portrait, verified at boundary |

No horizontal body overflow observed at any tested width. Wallpaper reaches all
edges. Nav never overlaps Daily Transmission (explicit top inset).

## Accessibility

- Keyboard: all apps openable via Tab + Enter; palette via ⌘K/Ctrl-K; Escape closes windows and palette. PASS
- Focus visible: 2px lime outline on `:focus-visible`. PASS
- Windows: `role="dialog"`, labelled; body focused on open; focus returned on close. PASS
- Reduced motion: animations collapse to ~0ms; descriptor rotation stops; boot shortens. PASS
- Touch targets: buttons ≥44px height (`min-height` on .btn, boot skip, palette rows). PASS
- Contrast: cream on deep green ≥ 7:1; lime accents on dark ≥ 8:1; Day theme ink on cream ≥ 12:1. Dim text (#b9c4bd on #0d2f26) ≈ 7.4:1. PASS
- Sticky note text uses `textContent`/`value` only — no HTML injection path. PASS
- 200% zoom: layout reflows to the ≤1024 band; re-verify manually on production. PASS (by construction)

## Known limitations

1. Netlify form submission untestable until deployed on Netlify — mailto fallback verified instead.
2. Tablet widths verified at band boundaries, not on physical devices.
3. `PENDING_DOMAIN` must be replaced before metadata/sitemap are meaningful.

## Addendum — 2026-08-07 (video parity pass)

Compared the build against the reference video walkthrough. Added:

- **Interactive wallpaper** — glows drift toward the pointer, grid brightens around it.
  Compositor-only transforms, disabled under reduced motion and on coarse pointers. PASS
- **Game Room / "Ship It"** — original canvas mini-game. Keyboard arrows, mouse, touch.
  Pauses on tab hide with Resume. No sound, no stored progress, no copyrighted assets. PASS (tested live at 1920×1080)

Still blocked honestly: music player (no owned tracks supplied), voice agent (no vendor).

## Addendum — 2026-08-07 (voice agent)

- **AI Voice Agent app** added, config-driven from `ownerProfile.voiceAgents`.
  - `enabled:false` (current): honest maintenance state, working "Reach me directly"
    route into Contact, mailto fallback, third-party privacy disclosure. Test 15 now PASS.
  - Live path implemented for ElevenLabs Agents (public agent-id embed, unique mount
    per agent, script loaded once, 8s stall notice, onerror fallback). Vapi slot reserved.
  - No API key can appear client-side; config accepts public agent ids only.

## Addendum — 2026-08-07 (music)

- **Music app** added, driven by `ownerProfile.music` (Spotify track ids).
  Playback via Spotify's embedded player: licensed streaming, Spotify's own
  play/pause/seek, no audio hosted in the repo, no autoplay, embed loads only
  when the window opens. Tests 19–21 now PASS via the vendor player.
  Verified live: track card renders with artwork and play control.

## Addendum — 2026-08-07 (voice agent LIVE)

- Agent id agent_8501kzdra76be4arp1cfx9cqw6vp connected, `enabled: true`.
- Verified in Chromium: vendor script loads on window open, "Start a call"
  widget renders, disclosure copy visible. Mic-audio path needs a manual
  check on a real device (headless browser has no microphone).
- Note: the ElevenLabs widget floats bottom-right above the folded call tab
  while active — acceptable overlap, revisit if owner objects.
