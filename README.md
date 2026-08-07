# Skamber OS

A personal portfolio that behaves like an operating system, built for
**Musa Sulaiman** — AI product engineer and founder, Kebbi, Nigeria.

Static site. No build step, no framework, no dependencies.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

ES modules require a server — opening `index.html` from the filesystem will not work.

## Structure

```
index.html                 desktop shell markup
styles.css                 design system + responsive reflow
app.js                     window manager, apps, palette, companion
content/owner-profile.js   ← ALL content lives here
assets/portraits/          owner avatar (generated from approved photos)
assets/companion/          companion states
PERSONALIZATION_AUDIT.md   reference-identity purge assertion + scan
CLAIM_LEDGER.md            every public claim, with source and status
build.py                   bundles a single-file preview for sharing
```

## Editing content

**Everything visible comes from `content/owner-profile.js`.** Do not hard-code
copy into markup or event handlers — the contamination scan and the claim ledger
both depend on that single source of truth.

### Adding a project

Append to `ownerProfile.projects`. Required fields: `id`, `name`, `category`,
`dates`, `role`, `problem`, `intervention`, `outcome`, `outcomeStatus`.
Set `featured: true` to surface it on the Projects drive.

### Adding a metric

Append to `ownerProfile.metrics`. Every metric **must** carry a `status`:

`verified` · `client-reported` · `founder-reported` · `estimated` · `illustrative` · `private`

`private` metrics never render. Anything except `verified` renders with a visible
disclosure. A metric without an approved status should be omitted, not guessed.

## Before you deploy

1. **Set the domain.** Replace `PENDING_DOMAIN` in `content/owner-profile.js`,
   `robots.txt`, and `sitemap.xml`. It appears in exactly those three places.
2. **Run the contamination scan** in `PERSONALIZATION_AUDIT.md` against both source
   and built output.
3. **Update `CLAIM_LEDGER.md`** if any claim changed.
4. **Configure the form.** The Contact brief currently falls back to a `mailto:`
   handoff. Netlify Forms blueprint is already in the markup (`data-netlify`,
   honeypot `company-website`) — it activates on a Netlify deploy.

## Not shipped in v1, deliberately

| Feature | Why | How to enable |
|---|---|---|
| Booking calendar | no provider connected | set `conversion.bookingUrl` and `bookingEnabled: true` |
| Booking ping notification | no truthful trigger exists | needs a real booking webhook — never fake the event |
| Proof / testimonials | no approved client material | populate `ownerProfile.testimonials` |
| Journey timeline | milestones not yet supplied | populate `ownerProfile.journey` |
| Field Notes articles | none written | add to `ownerProfile.articles` + create static routes in `blog/` |
| AI Voice Agent | no vendor selected | add an approved embed |
| Music player | no licensed tracks | populate `ownerProfile.music` |

## Local storage

Versioned keys, all resettable from the Whiteboard app:

```
skamber-os-theme-v1        skamber-os-layout-v1
skamber-os-whiteboard-v1   skamber-os-widgets-v1
skamber-os-boot-v1         skamber-os-companion-v1
```

Visitor notes never leave the browser. Note text is written with `textContent`,
never `innerHTML`.

## Licence and assets

© Musa Sulaiman. Owner portraits supplied by the owner, rights confirmed 2026-08-06.
Avatar and companion artwork generated for this build from those approved photos.
Typefaces: Space Grotesk, JetBrains Mono (Google Fonts, open licence).
