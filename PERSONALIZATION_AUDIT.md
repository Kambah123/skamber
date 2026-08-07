# PERSONALIZATION_AUDIT.md

**Build:** Skamber OS — personal operating system for Musa Sulaiman
**Mode:** clean-room. No reference implementation was cloned; there is no inherited codebase.
**Date:** 2026-08-06

## Why this file exists

The master specification supplied by the owner embeds a reference implementation
belonging to a different person. Even though nothing was cloned, that spec text
contains identity-bearing tokens which must never appear in this build. This file
inventories them and asserts their absence.

## Reference-identity purge list

Every token below originates in the supplied specification, **not** in this owner's
material. None may ship in source, built output, metadata, alt text, filenames,
notification copy, or hidden accessibility text.

| Reference token | Origin in spec | Replacement in this build |
|---|---|---|
| `RajNet` | reference browser app name | `SkamberNet` (from `ownerProfile.identity.osName`) |
| `UK Realty` | reference case study | REMOVE — not this owner's client |
| `Investors Propmart` | reference case study | REMOVE |
| `Imperium Marketing` | reference case study | REMOVE |
| `₹80Cr+ pipeline influenced` | reference metric | REMOVE — no equivalent claim exists |
| `Rs` / `₹` currency framing | reference market | REMOVE — owner operates in NGN/USD |
| Reference owner name / surname | Part 08, Part 36 | `Musa Sulaiman` |
| Reference owner domain | Part 08 | `ownerProfile.identity.domain` (currently `PENDING_DOMAIN`) |
| Automatic domain-greeting copy | Part 08 prohibition | REMOVE — never rendered anywhere |
| Reference avatar likeness | Part 36 | Original avatar derived only from owner's approved photos |
| Reference booking-ping copy | Part 36 | REMOVE — feature disabled, see below |
| `Talk to [reference owner]` | Part 23 | REMOVE — no voice agent in v1 |

## Scan

Run from the repository root:

```bash
grep -rniE "rajnet|uk realty|investors propmart|imperium|₹|80cr" \
  --include="*.html" --include="*.css" --include="*.js" --include="*.json" \
  . | grep -v PERSONALIZATION_AUDIT.md
```

**Result (2026-08-06):** no matches outside this documentation file. Build passes.

The scan must be re-run against built output before every production deploy, not
only against source.

## Domain-greeting assertion

Part 08 forbids automatic domain-greeting copy anywhere in the interface,
especially near the identity block. Confirmed absent. `ownerProfile.identity.domain`
is consumed only by metadata, canonical URL, Open Graph, and structured data —
never rendered as visible identity copy.

## Intentionally retained neutral assets

- Google Fonts (Space Grotesk, JetBrains Mono) — open licence, no identity attached.
- Icon family — drawn for this build as inline SVG, one shared grammar. No third-party icon set.

## Honesty exceptions recorded

Two spec-required features are **deliberately not shipped**, because shipping them
would require fabricating content:

1. **Booking ping** (Part 36). The spec permits it only when the trigger is a real
   booking event or an explicitly labelled demonstration. No booking provider is
   connected, so there is no truthful trigger. The component is built but disabled
   behind `ownerProfile.conversion.bookingEnabled = false`.
2. **Proof app** (Part 17). No approved client testimony exists. The app ships with
   an honest empty state rather than invented quotes, names, or results.

Neither omission is a defect. Both are the specification's own integrity rules
taking precedence over its feature list.
