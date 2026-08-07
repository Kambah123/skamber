/* ==========================================================================
   Skamber OS — runtime
   Window manager, application registry, command palette, theming,
   whiteboard, companion, and local-storage contract.
   ========================================================================== */

import { ownerProfile as O, STATUS_LABEL, publicMetrics } from "./content/owner-profile.js";

/* ---------- local storage contract (versioned keys) ---------- */
const KEY = {
  theme: "skamber-os-theme-v1",
  layout: "skamber-os-layout-v1",
  board: "skamber-os-whiteboard-v1",
  widgets: "skamber-os-widgets-v1",
  boot: "skamber-os-boot-v1",
  companion: "skamber-os-companion-v1"
};
const load = (k, fb) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fb; } catch { return fb; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const esc = (s) => String(s ?? "");

const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = () => matchMedia("(max-width: 720px)").matches;

/* ---------- icon set (one grammar: 20px grid, 1.6 stroke, round caps) ---------- */
const I = {
  projects: '<path d="M3 6.5A1.5 1.5 0 014.5 5h4l1.6 2H16a1.5 1.5 0 011.5 1.5v6A1.5 1.5 0 0116 16H4.5A1.5 1.5 0 013 14.5z"/>',
  results: '<path d="M4 16V9M8 16V5M12 16v-4M16 16V7"/>',
  systems: '<circle cx="10" cy="10" r="2.4"/><path d="M10 3v2.6M10 14.4V17M3 10h2.6M14.4 10H17M5.1 5.1l1.8 1.8M13.1 13.1l1.8 1.8M14.9 5.1l-1.8 1.8M6.9 13.1l-1.8 1.8"/>',
  proof: '<path d="M4 5.5h12v9H4z"/><path d="M8.5 8.5l3.5 1.8-3.5 1.8z"/>',
  cases: '<path d="M4 6h5l1.4 1.8H16v7.7H4z"/><path d="M7 6V4.5h6V6"/>',
  journey: '<path d="M6 4v12M6 6.5h7l-1.5 2 1.5 2H6"/>',
  founder: '<path d="M5 3.5h7l3 3v10H5z"/><path d="M12 3.5v3h3M7.5 10h5M7.5 13h5"/>',
  whiteboard: '<path d="M3.5 4.5h13v8h-13z"/><path d="M10 12.5V16M7 16h6"/>',
  browser: '<circle cx="10" cy="10" r="6.5"/><path d="M3.5 10h13M10 3.5c1.8 2 1.8 11 0 13M10 3.5c-1.8 2-1.8 11 0 13"/>',
  contact: '<path d="M3.5 6h13v8.5h-13z"/><path d="M3.5 6.5L10 11l6.5-4.5"/>',
  socials: '<circle cx="6" cy="10" r="2"/><circle cx="14" cy="5.8" r="2"/><circle cx="14" cy="14.2" r="2"/><path d="M7.8 9l4.4-2.4M7.8 11l4.4 2.4"/>',
  notes: '<path d="M4.5 3.5h11v13h-11z"/><path d="M7 7h6M7 10h6M7 13h3.5"/>',
  game: '<path d="M6 7h8a3.5 3.5 0 013.5 3.5c0 2-1.4 3.5-3 3.5-1.2 0-1.8-.8-2.5-1.5h-4c-.7.7-1.3 1.5-2.5 1.5-1.6 0-3-1.5-3-3.5A3.5 3.5 0 016 7z"/><path d="M7.5 9.5v2M6.5 10.5h2M13 10.8h.01M14.5 9.6h.01"/>',
  voice: '<rect x="8" y="3" width="4" height="9" rx="2"/><path d="M5 9.5a5 5 0 0010 0M10 14.5V17M7.5 17h5"/>',
  music: '<circle cx="6.5" cy="14.5" r="2.2"/><circle cx="14.5" cy="12.5" r="2.2"/><path d="M8.7 14.5V5.5l8-1.6v8.6"/>'
};
const svg = (d) => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

/* ---------- application registry ---------- */
/*
 * `desktop:false` apps stay fully reachable from the dock and the command
 * palette. Per Part 04, lower-priority surfaces are deferred rather than
 * shrunk when the one-screen composition runs out of room.
 */
const APPS = [
  { id: "projects",   name: "Projects",      desc: "Selected work and case files",     icon: "projects",   badge: "MAIN DRIVE", dock: true,  desktop: true },
  { id: "results",    name: "Results",       desc: "Outcomes, labelled by status",     icon: "results",    badge: "PROOF",      dock: true,  desktop: true },
  { id: "systems",    name: "Systems",       desc: "How I actually work",              icon: "systems",    dock: true,  desktop: true },
  { id: "casefiles",  name: "Case Files",    desc: "Browse the archive",               icon: "cases",      dock: true,  desktop: true },
  { id: "founder",    name: "Founder.txt",   desc: "A note, in my own words",          icon: "founder",    dock: true,  desktop: true },
  { id: "whiteboard", name: "Whiteboard",    desc: "Leave a sticky note",              icon: "whiteboard", dock: true,  desktop: true },
  { id: "browser",    name: "SkamberNet",    desc: "Open my live work",                icon: "browser",    dock: true,  desktop: true },
  { id: "contact",    name: "Contact",       desc: "Start a project brief",            icon: "contact",    badge: "OPEN",       dock: true,  desktop: true },
  { id: "proof",      name: "Proof",         desc: "Client testimony vault",           icon: "proof",      dock: true,  desktop: false },
  { id: "journey",    name: "Journey",       desc: "How I got here",                   icon: "journey",    dock: true,  desktop: false },
  { id: "socials",    name: "Socials",       desc: "Where I post and ship",            icon: "socials",    dock: true,  desktop: false },
  { id: "notes",      name: "Field Notes",   desc: "Writing on AI and fintech",        icon: "notes",      dock: true,  desktop: false },
  { id: "game",       name: "Game Room",     desc: "Ship It — a tiny arcade break",    icon: "game",       dock: true,  desktop: false },
  { id: "voice",      name: "AI Voice Agent", desc: "Talk to a live agent demo",       icon: "voice",      dock: true,  desktop: false },
  { id: "music",      name: "Music",          desc: "The Skamber OS soundtrack",       icon: "music",      dock: true,  desktop: false }
];

/* ==========================================================================
   Window manager
   ========================================================================== */
let zTop = 1000;
const openWins = new Map();

function focusWin(win) {
  zTop += 1;
  win.style.zIndex = zTop;
  document.querySelectorAll(".win").forEach((w) => w.setAttribute("aria-hidden", w === win ? "false" : "false"));
}

function closeWin(id) {
  const w = openWins.get(id);
  if (!w) return;
  const returnTo = w._returnFocus;
  w.remove();
  openWins.delete(id);
  syncDock();
  if (returnTo && document.contains(returnTo)) returnTo.focus();
}

function openApp(id) {
  const app = APPS.find((a) => a.id === id);
  if (!app) return;
  if (openWins.has(id)) { focusWin(openWins.get(id)); return; }

  const win = document.createElement("section");
  win.className = "win";
  win.setAttribute("role", "dialog");
  win.setAttribute("aria-modal", "false");
  win.setAttribute("aria-label", app.name);
  win._returnFocus = document.activeElement;

  const n = openWins.size;
  if (!isPhone()) {
    const w = Math.min(760, innerWidth - 120);
    const h = Math.min(560, innerHeight - 190);
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.style.left = Math.max(16, (innerWidth - w) / 2 + n * 26) + "px";
    win.style.top = Math.max(58, (innerHeight - h) / 2 + n * 22) + "px";
  }

  win.innerHTML = `
    <header class="win__bar">
      <span class="win__dots">
        <button class="win__dot win__dot--close" type="button" aria-label="Close ${esc(app.name)}"></button>
        <button class="win__dot win__dot--min" type="button" aria-label="Minimise ${esc(app.name)}"></button>
        <button class="win__dot win__dot--max" type="button" aria-label="Maximise ${esc(app.name)}"></button>
      </span>
      <span class="win__title">${esc(app.name)}</span>
      <span class="win__state">${esc(app.badge || "")}</span>
    </header>
    <div class="win__body" tabindex="-1"></div>`;

  const body = win.querySelector(".win__body");
  body.append(render(id));

  win.querySelector(".win__dot--close").onclick = () => closeWin(id);
  win.querySelector(".win__dot--min").onclick = () => closeWin(id);
  win.querySelector(".win__dot--max").onclick = () => win.classList.toggle("is-max");
  win.addEventListener("pointerdown", () => focusWin(win), true);
  win.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.stopPropagation(); closeWin(id); } });

  dragBy(win.querySelector(".win__bar"), win, () => !isPhone() && !win.classList.contains("is-max"));

  document.getElementById("windows").append(win);
  openWins.set(id, win);
  focusWin(win);
  body.focus();
  syncDock();
}

/* Generic pointer drag: moves `el` when `handle` is dragged. */
function dragBy(handle, el, allow = () => true) {
  handle.addEventListener("pointerdown", (e) => {
    if (!allow() || e.button !== 0) return;
    if (e.target.closest("button:not(.win__bar)") && e.target.classList.contains("win__dot")) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    handle.setPointerCapture(e.pointerId);
    el.dataset.dragging = "true";
    const move = (ev) => {
      const x = Math.min(Math.max(4, ev.clientX - dx), innerWidth - r.width - 4);
      const y = Math.min(Math.max(50, ev.clientY - dy), innerHeight - 60);
      el.style.left = x + "px";
      el.style.top = y + "px";
    };
    const up = () => {
      delete el.dataset.dragging;
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
  });
}

/* ==========================================================================
   Application content
   ========================================================================== */
function el(html) { const t = document.createElement("div"); t.innerHTML = html.trim(); return t; }

function statusChip(status) {
  const ok = status === "verified";
  return `<span class="chip ${ok ? "chip--ok" : ""}">${esc(STATUS_LABEL[status] || status)}</span>`;
}

function render(id) {
  switch (id) {
    case "projects": return renderProjects();
    case "results": return renderResults();
    case "systems": return renderSystems();
    case "casefiles": return renderCaseFiles();
    case "proof": return renderProof();
    case "journey": return renderJourney();
    case "founder": return renderFounder();
    case "whiteboard": return renderWhiteboard();
    case "browser": return renderBrowser();
    case "socials": return renderSocials();
    case "notes": return renderNotes();
    case "contact": return renderContact();
    case "game": return renderGame();
    case "voice": return renderVoice();
    case "music": return renderMusic();
    default: return el("<p>Not found.</p>");
  }
}

function projectCard(p) {
  return `
  <article class="card">
    ${p.image ? `<img class="card__art" src="${esc(p.image)}" alt="Illustration for the ${esc(p.name)} case study" loading="lazy" width="1200" height="670" />` : ""}
    <div class="card__top">
      <h3 class="card__name">${esc(p.name)}</h3>
      <span class="card__meta">${esc(p.category)} · ${esc(p.dates)}</span>
    </div>
    <p class="card__meta">${esc(p.role)}</p>
    <div class="field"><b>Problem</b><p>${esc(p.problem)}</p></div>
    <div class="field"><b>What I built</b><p>${esc(p.intervention)}</p></div>
    <div class="field"><b>Outcome</b><p>${esc(p.outcome)} ${statusChip(p.outcomeStatus)}</p></div>
    ${p.stack.length ? `<div class="stack">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>` : ""}
    ${p.url ? `<p style="margin-top:14px"><a class="linkout" href="${esc(p.url)}" target="_blank" rel="noreferrer noopener">Open ${esc(p.name)} →</a></p>` : ""}
    ${p.outcomeStatus !== "verified" ? `<p class="disclose">${esc(STATUS_LABEL[p.outcomeStatus])} — not independently audited.</p>` : ""}
  </article>`;
}

function renderProjects() {
  const feat = O.projects.filter((p) => p.featured);
  return el(`
    <h2 class="h2">Selected work</h2>
    <p class="lede">${esc(O.identity.positioning)}</p>
    ${feat.map(projectCard).join("")}
    ${O.experiments.length ? "" : `<div class="empty">Open-source projects and experiments are published here once they have a working repository or live demo.</div>`}
  `);
}

function renderResults() {
  return el(`
    <h2 class="h2">Results</h2>
    <p class="lede">Every figure below carries its verification status. Nothing is rounded up, and nothing unverified is presented as fact.</p>
    ${publicMetrics().map((m) => `
      <article class="card">
        <div class="card__top">
          <h3 class="card__name">${esc(m.value)}</h3>
          ${statusChip(m.status)}
        </div>
        <p style="margin:0">${esc(m.label)}</p>
        <p class="disclose">Source: ${esc(m.source)} · last verified ${esc(m.lastVerified)}</p>
      </article>`).join("")}
    <p class="disclose">${esc(O.legal.metricDisclaimer)}</p>
  `);
}

const LOOP = [
  ["Find the leverage", "Work out which single constraint is actually holding the product back — usually not the one in the brief.", "Artifact: a written problem statement both sides agree on."],
  ["Lock the system", "Decide the data model, the rails and the boundaries before writing feature code.", "Artifact: schema and architecture sketch."],
  ["Build the sharp edge", "Ship the one flow that proves the thing works end to end, in production conditions.", "Artifact: a working vertical slice."],
  ["Integrate the workflow", "Wire it into the real world — auth, payments, notifications, the unglamorous parts.", "Artifact: an integrated, testable system."],
  ["Prove and hand off", "Instrument it, document it, and make it maintainable by someone who isn't me.", "Artifact: docs, tests and a handover."]
];

function renderSystems() {
  return el(`
    <h2 class="h2">How I work</h2>
    <p class="lede">A five-step operating loop. It is deliberately boring — the interesting part should be the product, not the process.</p>
    ${LOOP.map(([t, b, a], i) => `
      <article class="card">
        <div class="card__top"><h3 class="card__name">${i + 1}. ${esc(t)}</h3></div>
        <p style="margin:0 0 8px">${esc(b)}</p>
        <p class="card__meta">${esc(a)}</p>
      </article>`).join("")}
  `);
}

function renderCaseFiles() {
  const tree = {
    "Start here": [{ t: "Read me first", b: O.identity.positioning }],
    Fintech: O.projects.filter((p) => p.category.includes("Fintech")).map((p) => ({ t: p.name, b: p.outcome, url: p.url })),
    Studio: O.projects.filter((p) => p.id === "onedev").map((p) => ({ t: p.name, b: p.outcome })),
    Proof: [{ t: "Client testimony", b: "No approved client material published yet." }]
  };
  const wrap = el(`
    <h2 class="h2">Case Files</h2>
    <div class="finder">
      <nav class="finder__tree" aria-label="Folders">
        ${Object.keys(tree).map((k, i) => `<button class="finder__folder" type="button" data-folder="${esc(k)}" ${i === 0 ? 'aria-current="true"' : ""}>${esc(k)}</button>`).join("")}
      </nav>
      <div class="finder__pane" id="finder-pane"></div>
    </div>`);
  const pane = wrap.querySelector("#finder-pane");
  const paint = (k) => {
    pane.innerHTML = tree[k].length
      ? tree[k].map((f) => `<article class="card"><h3 class="card__name">${esc(f.t)}</h3><p style="margin:6px 0 0">${esc(f.b)}</p>${f.url ? `<p style="margin-top:10px"><a class="linkout" href="${esc(f.url)}" target="_blank" rel="noreferrer noopener">Open →</a></p>` : ""}</article>`).join("")
      : `<div class="empty">Empty folder.</div>`;
  };
  wrap.querySelectorAll("[data-folder]").forEach((b) => {
    b.onclick = () => {
      wrap.querySelectorAll("[data-folder]").forEach((x) => x.removeAttribute("aria-current"));
      b.setAttribute("aria-current", "true");
      paint(b.dataset.folder);
    };
  });
  paint(Object.keys(tree)[0]);
  return wrap;
}

function renderProof() {
  return el(`
    <h2 class="h2">Proof</h2>
    <p class="lede">Recorded client testimony lives here.</p>
    <div class="empty">
      No client testimony is published yet.<br />
      Rather than fill this vault with invented quotes, it stays empty until real, approved material exists.
    </div>`);
}

function renderJourney() {
  if (!O.journey.length) {
    return el(`
      <h2 class="h2">Journey</h2>
      <div class="empty">The timeline is still being written. It will publish once the milestones are confirmed.</div>`);
  }
  return el(`<h2 class="h2">Journey</h2>${O.journey.map((j) => `<article class="card"><div class="card__top"><h3 class="card__name">${esc(j.title)}</h3><span class="card__meta">${esc(j.year)}</span></div><p>${esc(j.body)}</p></article>`).join("")}`);
}

function renderFounder() {
  return el(`
    <pre style="font-family:var(--font-mono);font-size:14.5px;line-height:1.75;white-space:pre-wrap;margin:0">${esc(
`WHO I AM
${O.identity.fullName} — ${O.identity.roles.join(", ").toLowerCase()}.
Based in ${O.identity.location}.

WHAT I BUILD
${O.identity.positioning}

WHY I CARE
Financial tools in this part of the world are usually built somewhere else,
for someone else, and then translated badly. Zipa started because sending
crypto to a person should not require a 44-character address and a prayer.

HOW I WORK
Solo, end to end, with AI as a pair rather than a party trick.
Design, build, ship, then make it maintainable.

WHAT I'M EXPLORING
AI-native product surfaces. Username-first payment rails.
Making on-chain infrastructure feel like ordinary software.

WHO I WANT TO WORK WITH
Founders and teams who want the thing actually built, not prototyped forever.

WHAT I WON'T COMPROMISE
Honest claims. If a number isn't verified, it doesn't ship.

CONTACT
${O.conversion.email}`
    )}</pre>`);
}

/* ---------- Whiteboard ---------- */
const SWATCH = ["#f4e07a", "#a7e3b8", "#f5b8a8", "#bcd4f5"];
function renderWhiteboard() {
  let colour = SWATCH[0];
  const wrap = el(`
    <h2 class="h2">Whiteboard</h2>
    <p class="lede">Leave a note on the board. It is stored in your browser only.</p>
    <div class="wb__tools">
      <input class="wb__input" id="wb-text" type="text" maxlength="180" placeholder="Write a note (180 characters max)…" />
      ${SWATCH.map((c, i) => `<button class="wb__swatch" type="button" data-colour="${c}" style="background:${c}" aria-label="Colour ${i + 1}" aria-pressed="${i === 0}"></button>`).join("")}
      <button class="btn btn--primary btn--sm" id="wb-add" type="button">Add sticky</button>
      <button class="btn btn--ghost btn--sm" id="wb-reset" type="button">Reset board</button>
      <button class="btn btn--ghost btn--sm" id="wb-icons" type="button">Reset desktop icons</button>
    </div>
    <div class="wb__board" id="wb-board"></div>
    <p class="note">Notes are saved to this browser with local storage. They are not sent anywhere and I will not see them — use Contact if you want to reach me.</p>`);

  const board = wrap.querySelector("#wb-board");
  const input = wrap.querySelector("#wb-text");
  let notes = load(KEY.board, []);

  function paint() {
    board.textContent = "";
    notes.forEach((n) => {
      const s = document.createElement("div");
      s.className = "sticky";
      s.style.cssText = `left:${n.x}px;top:${n.y}px;background:${n.c}`;
      const x = document.createElement("button");
      x.className = "sticky__x"; x.type = "button"; x.textContent = "×";
      x.setAttribute("aria-label", "Delete note");
      x.onclick = () => { notes = notes.filter((m) => m.id !== n.id); save(KEY.board, notes); paint(); };
      const ta = document.createElement("textarea");
      ta.value = n.t;                       // textContent path — never innerHTML
      ta.maxLength = 180;
      ta.setAttribute("aria-label", "Note text");
      ta.oninput = () => { n.t = ta.value; save(KEY.board, notes); };
      s.append(x, ta);
      board.append(s);
      // drag within board bounds
      s.addEventListener("pointerdown", (e) => {
        if (e.target !== s) return;
        const br = board.getBoundingClientRect();
        const dx = e.clientX - br.left - n.x, dy = e.clientY - br.top - n.y;
        s.setPointerCapture(e.pointerId);
        const mv = (ev) => {
          n.x = Math.min(Math.max(0, ev.clientX - br.left - dx), br.width - 158);
          n.y = Math.min(Math.max(0, ev.clientY - br.top - dy), Math.max(0, br.height - 106));
          s.style.left = n.x + "px"; s.style.top = n.y + "px";
        };
        const up = () => { save(KEY.board, notes); s.removeEventListener("pointermove", mv); s.removeEventListener("pointerup", up); };
        s.addEventListener("pointermove", mv);
        s.addEventListener("pointerup", up);
      });
    });
  }

  wrap.querySelectorAll("[data-colour]").forEach((b) => {
    b.onclick = () => {
      colour = b.dataset.colour;
      wrap.querySelectorAll("[data-colour]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    };
  });
  wrap.querySelector("#wb-add").onclick = () => {
    const t = input.value.trim();
    if (!t) { input.focus(); return; }
    notes.push({ id: Date.now(), t, c: colour, x: 12 + (notes.length % 4) * 168, y: 12 + Math.floor(notes.length / 4) * 118 });
    save(KEY.board, notes); input.value = ""; paint();
  };
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") wrap.querySelector("#wb-add").click(); });
  wrap.querySelector("#wb-reset").onclick = () => { notes = []; save(KEY.board, notes); paint(); };
  wrap.querySelector("#wb-icons").onclick = () => { localStorage.removeItem(KEY.layout); location.reload(); };
  paint();
  return wrap;
}

/* ---------- Browser ---------- */
function renderBrowser() {
  const marks = O.projects.filter((p) => p.url);
  const home = marks[0]?.url || "";
  const wrap = el(`
    <h2 class="h2">SkamberNet</h2>
    <div class="br__bar">
      <button class="br__nav" id="br-home" type="button" aria-label="Home">⌂</button>
      <button class="br__nav" id="br-reload" type="button" aria-label="Reload">↻</button>
      <input class="br__url" id="br-url" value="${esc(home)}" aria-label="Address" readonly />
      <a class="btn btn--ghost btn--sm" id="br-open" href="${esc(home)}" target="_blank" rel="noreferrer noopener">Open tab</a>
    </div>
    <div class="stack" style="margin-bottom:12px">
      ${marks.map((m) => `<button class="chip" type="button" data-go="${esc(m.url)}" style="cursor:pointer">${esc(m.name)}</button>`).join("")}
    </div>
    <iframe class="br__frame" id="br-frame" src="${esc(home)}" title="Embedded preview" loading="lazy" referrerpolicy="no-referrer"></iframe>
    <p class="note">Some sites set security headers that stop them being embedded. If a page stays blank, use “Open tab”.</p>`);

  const frame = wrap.querySelector("#br-frame");
  const url = wrap.querySelector("#br-url");
  const open = wrap.querySelector("#br-open");
  const go = (u) => { frame.src = u; url.value = u; open.href = u; };
  wrap.querySelectorAll("[data-go]").forEach((b) => (b.onclick = () => go(b.dataset.go)));
  wrap.querySelector("#br-home").onclick = () => go(home);
  wrap.querySelector("#br-reload").onclick = () => go(url.value);
  return wrap;
}

function renderSocials() {
  return el(`
    <h2 class="h2">Socials</h2>
    <p class="lede">Where the work gets posted.</p>
    ${O.socials.map((s) => `
      <article class="card">
        <div class="card__top"><h3 class="card__name">${esc(s.network)}</h3><span class="card__meta">${esc(s.handle)}</span></div>
        <p style="margin:0 0 10px">${esc(s.purpose)}</p>
        <a class="linkout" href="${esc(s.url)}" target="_blank" rel="noreferrer noopener">Open ${esc(s.network)} →</a>
      </article>`).join("")}`);
}

function renderNotes() {
  return el(`
    <h2 class="h2">Field Notes</h2>
    <p class="lede">Writing on AI-native product engineering and African fintech infrastructure.</p>
    <div class="empty">No articles published yet. Notes will appear here — and as ordinary crawlable pages — as they are written.</div>`);
}

/* ---------- Contact ---------- */
function renderContact() {
  const wa = O.conversion.whatsapp
    .map((w) => `<a class="btn btn--ghost btn--sm" href="https://wa.me/${esc(w.e164.replace("+", ""))}" target="_blank" rel="noreferrer noopener">WhatsApp ${esc(w.label)}</a>`)
    .join("");
  const wrap = el(`
    <h2 class="h2">Start a brief</h2>
    <p class="lede">${esc(O.conversion.availability)}. Based in ${esc(O.identity.location)} (${esc(O.identity.timezoneLabel)}).</p>
    <div class="routes">
      <a class="btn btn--primary btn--sm" href="mailto:${esc(O.conversion.email)}">Email ${esc(O.conversion.email)}</a>
      <button class="btn btn--ghost btn--sm" id="copy-email" type="button">Copy email</button>
      ${wa}
      ${O.socials.map((s) => `<a class="btn btn--ghost btn--sm" href="${esc(s.url)}" target="_blank" rel="noreferrer noopener">${esc(s.network)}</a>`).join("")}
    </div>
    <form class="form" id="brief" name="brief" method="POST" data-netlify="true" netlify-honeypot="company-website">
      <input type="hidden" name="form-name" value="brief" />
      <p class="hp"><label>Do not fill this in <input name="company-website" tabindex="-1" autocomplete="off" /></label></p>
      <label>Your name <input name="name" required autocomplete="name" /></label>
      <label>Email <input name="email" type="email" required autocomplete="email" /></label>
      <label>What do you want built? <textarea name="build" required></textarea></label>
      <label>Timeline <input name="timeline" placeholder="e.g. 6 weeks" /></label>
      <label>Operating range <select name="budget">
        <option value="">Prefer not to say</option>
        <option>Under $2k</option><option>$2k–$10k</option><option>$10k–$50k</option><option>$50k+</option>
      </select></label>
      <label>What does success look like? <textarea name="success"></textarea></label>
      <button class="btn btn--primary" type="submit">Send brief</button>
      <p class="note" id="brief-msg" role="status"></p>
    </form>
    <p class="note">No booking calendar is connected yet — email or WhatsApp is the fastest route.</p>`);

  wrap.querySelector("#copy-email").onclick = async (e) => {
    try { await navigator.clipboard.writeText(O.conversion.email); e.target.textContent = "Copied ✓"; }
    catch { e.target.textContent = O.conversion.email; }
  };
  wrap.querySelector("#brief").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target;
    if (f["company-website"].value) return;            // honeypot tripped
    const msg = wrap.querySelector("#brief-msg");
    msg.textContent = "Thanks — opening your mail client as a fallback while the form provider is configured.";
    companionState("excited");
    const body = encodeURIComponent(
      `Name: ${f.name.value}\nEmail: ${f.email.value}\n\nBuild: ${f.build.value}\nTimeline: ${f.timeline.value}\nRange: ${f.budget.value}\nSuccess: ${f.success.value}`
    );
    location.href = `mailto:${O.conversion.email}?subject=${encodeURIComponent("Project brief — " + f.name.value)}&body=${body}`;
  });
  return wrap;
}

/* ---------- AI Voice Agent ----------
   Config-driven. enabled:false renders an honest maintenance state with a
   working fallback route. Going live is a data change in owner-profile.js:
   set the vendor's PUBLIC agent id and enabled:true. Each agent mounts into
   its own unique container so duplicate vendor scripts never collide. */
const VOICE_VENDOR_SCRIPTS = {
  elevenlabs: "https://unpkg.com/@elevenlabs/convai-widget-embed",
  vapi: "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
};
let voiceScriptLoaded = {};

function renderVoice() {
  const cfg = O.voiceAgents || { enabled: false, agents: [] };
  const agent = cfg.agents[0] || {};

  if (!cfg.enabled) {
    const wrap = el(`
      <h2 class="h2">AI Voice Agent</h2>
      <p class="lede">A live, talk-to-it demonstration of the kind of voice agent I build and ship for clients.</p>
      <div class="empty" role="status">
        <p style="margin:0 0 6px;font-weight:600;color:var(--fg)">Agent offline — being configured</p>
        <p style="margin:0">The live demo is not connected yet. It comes online here the moment the agent is provisioned — no fake demo in the meantime.</p>
      </div>
      <div class="routes" style="margin-top:18px">
        <button class="btn btn--primary btn--sm" data-open-contact type="button">Reach me directly instead</button>
        <a class="btn btn--ghost btn--sm" href="mailto:${esc(O.conversion.email)}">Email ${esc(O.conversion.email)}</a>
      </div>
      <p class="note">When live: conversations are handled by a third-party voice vendor and are not private — don't share sensitive information with the demo agent. ${esc(agent.disclosure || "")}</p>`);
    wrap.querySelector("[data-open-contact]").onclick = () => openApp("contact");
    return wrap;
  }

  // Live path — unique mount per agent, script loaded once per vendor.
  const wrap = el(`
    <h2 class="h2">AI Voice Agent</h2>
    <p class="lede">${esc(agent.purpose || "")}</p>
    <div id="voice-mount-${esc(agent.id)}" class="voice-mount"></div>
    <p class="note" id="voice-status">Loading the agent…</p>
    <p class="note">${esc(agent.disclosure || "You are talking to an AI agent.")} Conversations are processed by a third-party voice vendor — avoid sharing sensitive information.</p>`);

  const mount = wrap.querySelector(`#voice-mount-${CSS.escape(agent.id)}`);
  const status = wrap.querySelector("#voice-status");
  const src = VOICE_VENDOR_SCRIPTS[cfg.vendor];

  const attach = () => {
    status.textContent = "";
    if (cfg.vendor === "elevenlabs") {
      const node = document.createElement("elevenlabs-convai");
      node.setAttribute("agent-id", agent.id);
      mount.append(node);
    } else {
      status.textContent = "Vendor connected — follow the vendor widget instructions.";
    }
  };
  if (voiceScriptLoaded[cfg.vendor]) attach();
  else {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    s.onload = () => { voiceScriptLoaded[cfg.vendor] = true; attach(); };
    s.onerror = () => { status.textContent = "The agent could not load. Use Contact instead — the button above works."; };
    document.head.append(s);
    setTimeout(() => { if (!voiceScriptLoaded[cfg.vendor]) status.textContent = "Still loading… if this persists, reach me via Contact."; }, 8000);
  }
  return wrap;
}

/* ---------- Music ----------
   Streams through Spotify's embedded player: licensed playback, Spotify's own
   play/pause/seek controls, nothing hosted here, no autoplay. Iframes load
   only when this window opens (deferred third-party embed). */
function renderMusic() {
  if (!O.music.length) {
    return el(`<h2 class="h2">Music</h2><div class="empty">No tracks yet.</div>`);
  }
  const wrap = el(`
    <h2 class="h2">Music</h2>
    <p class="lede">The Skamber OS soundtrack — streamed through Spotify's player.</p>
    ${O.music.map((t) => `
      <div class="music__track">
        <iframe src="https://open.spotify.com/embed/track/${esc(t.spotifyTrackId)}"
                title="Spotify player: ${esc(t.title)}"
                width="100%" height="152" frameborder="0" loading="lazy"
                allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style="border-radius:12px;border:0;display:block"></iframe>
      </div>`).join("")}
    <p class="note">Playback, licensing and controls are Spotify's. Nothing autoplays — press play if you want the soundtrack. <a href="https://open.spotify.com/track/${esc(O.music[0].spotifyTrackId)}" target="_blank" rel="noreferrer noopener">Open in Spotify →</a></p>`);
  return wrap;
}

/* ---------- Game Room: "Ship It" — original mini-game ----------
   Catch falling feature-blocks with the deploy tray. Miss three and the
   sprint ends. Keyboard arrows, mouse, or touch. Pauses when hidden. */
function renderGame() {
  const wrap = el(`
    <h2 class="h2">Ship It</h2>
    <p class="lede">Catch the shipping features. Don't let three hit the floor. Arrow keys, mouse, or touch.</p>
    <div class="game__hud"><span id="g-score">Score 0</span><span id="g-miss">Misses 0/3</span>
      <button class="btn btn--ghost btn--sm" id="g-start" type="button">Start</button></div>
    <canvas id="g-canvas" width="640" height="380" style="width:100%;max-width:640px;border:1px solid var(--border);border-radius:var(--radius);background:var(--panel);touch-action:none;display:block"></canvas>
    <p class="note">Original mini-game, no sound, keyboard-friendly. Progress is not stored.</p>`);

  const cv = wrap.querySelector("#g-canvas"), ctx = cv.getContext("2d");
  const scoreEl = wrap.querySelector("#g-score"), missEl = wrap.querySelector("#g-miss");
  let raf = null, running = false, score = 0, miss = 0;
  let tray = { x: 280, w: 90 }, drops = [], speed = 1.6, spawn = 0;
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function reset() { score = 0; miss = 0; drops = []; speed = 1.6; hud(); }
  function hud() { scoreEl.textContent = "Score " + score; missEl.textContent = `Misses ${miss}/3`; }
  function loop() {
    if (!running) return;
    ctx.clearRect(0, 0, cv.width, cv.height);
    // tray
    ctx.fillStyle = css("--accent") || "#d8f24a";
    ctx.fillRect(tray.x - tray.w / 2, cv.height - 26, tray.w, 12);
    // drops
    spawn -= 1;
    if (spawn <= 0) { drops.push({ x: 30 + Math.random() * (cv.width - 60), y: -14, r: 11 }); spawn = Math.max(34, 90 - score * 2); }
    ctx.fillStyle = css("--fg") || "#f4f1e8";
    drops.forEach((d) => {
      d.y += speed + score * 0.045;
      ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 7); ctx.fill();
    });
    drops = drops.filter((d) => {
      if (d.y > cv.height - 30 && Math.abs(d.x - tray.x) < tray.w / 2 + d.r) { score += 1; hud(); return false; }
      if (d.y > cv.height + d.r) { miss += 1; hud(); if (miss >= 3) end(); return false; }
      return true;
    });
    raf = requestAnimationFrame(loop);
  }
  function end() {
    running = false; cancelAnimationFrame(raf);
    ctx.fillStyle = css("--fg"); ctx.font = "600 22px Space Grotesk, sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`Sprint over — shipped ${score}`, cv.width / 2, cv.height / 2);
    wrap.querySelector("#g-start").textContent = "Play again";
  }
  wrap.querySelector("#g-start").onclick = (e) => {
    if (e.target.textContent === "Resume" && miss < 3) { running = true; loop(); }
    else { reset(); running = true; cancelAnimationFrame(raf); loop(); }
    e.target.textContent = "Restart";
  };
  const moveTo = (clientX) => {
    const r = cv.getBoundingClientRect();
    tray.x = Math.min(Math.max(((clientX - r.left) / r.width) * cv.width, tray.w / 2), cv.width - tray.w / 2);
  };
  cv.addEventListener("pointermove", (e) => moveTo(e.clientX));
  cv.addEventListener("pointerdown", (e) => moveTo(e.clientX));
  cv.tabIndex = 0;
  cv.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { tray.x = Math.max(tray.w / 2, tray.x - 34); e.preventDefault(); }
    if (e.key === "ArrowRight") { tray.x = Math.min(cv.width - tray.w / 2, tray.x + 34); e.preventDefault(); }
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden && running) { running = false; cancelAnimationFrame(raf); wrap.querySelector("#g-start").textContent = "Resume"; } });
  return wrap;
}

/* ==========================================================================
   Desktop composition
   ========================================================================== */
function buildDesktop() {
  const grid = document.getElementById("apps");
  const layout = load(KEY.layout, {});
  APPS.filter((a) => a.desktop).forEach((a) => {
    const b = document.createElement("button");
    b.className = "appicon";
    b.type = "button";
    b.dataset.app = a.id;
    b.innerHTML = `
      <span class="appicon__glyph">${svg(I[a.icon])}</span>
      <span class="appicon__name">${esc(a.name)}</span>
      <span class="appicon__desc">${esc(a.desc)}</span>
      ${a.badge ? `<span class="appicon__badge">${esc(a.badge)}</span>` : ""}`;
    b.setAttribute("aria-label", `${a.name} — ${a.desc}`);
    b.onclick = () => openApp(a.id);
    const pos = layout[a.id];
    if (pos && !isPhone()) {
      b.style.position = "absolute";
      b.style.left = pos.x + "px";
      b.style.top = pos.y + "px";
      b.style.width = "158px";
    }
    grid.append(b);
    enableIconDrag(b, a.id);
  });

  const dock = document.getElementById("dock");
  APPS.filter((a) => a.dock).forEach((a) => {
    const b = document.createElement("button");
    b.className = "dock__btn";
    b.type = "button";
    b.dataset.dock = a.id;
    b.setAttribute("aria-label", a.name);
    b.innerHTML = `${svg(I[a.icon])}<span class="tip">${esc(a.name)}</span>`;
    b.onclick = () => openApp(a.id);
    dock.append(b);
  });
}

function syncDock() {
  document.querySelectorAll("[data-dock]").forEach((b) => {
    b.dataset.openWin = String(openWins.has(b.dataset.dock));
  });
}

/* Desktop icon dragging — pointer events, desktop only, never the only route. */
function enableIconDrag(node, id) {
  node.addEventListener("pointerdown", (e) => {
    if (isPhone() || e.pointerType === "touch" || e.button !== 0) return;
    const start = { x: e.clientX, y: e.clientY };
    const r = node.getBoundingClientRect();
    const host = document.getElementById("apps").getBoundingClientRect();
    let moved = false;
    node.setPointerCapture(e.pointerId);
    const mv = (ev) => {
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 5) return;
      moved = true;
      node.dataset.dragging = "true";
      node.style.position = "absolute";
      node.style.width = "158px";
      node.style.left = Math.max(0, Math.min(ev.clientX - host.left - r.width / 2, host.width - 158)) + "px";
      node.style.top = Math.max(0, ev.clientY - host.top - 18) + "px";
    };
    const up = () => {
      node.removeEventListener("pointermove", mv);
      node.removeEventListener("pointerup", up);
      if (moved) {
        delete node.dataset.dragging;
        const layout = load(KEY.layout, {});
        layout[id] = { x: parseInt(node.style.left, 10), y: parseInt(node.style.top, 10) };
        save(KEY.layout, layout);
        node.addEventListener("click", (c) => c.stopImmediatePropagation(), { once: true, capture: true });
      }
    };
    node.addEventListener("pointermove", mv);
    node.addEventListener("pointerup", up);
  });
}

/* ---------- identity, clock, transmission ---------- */
const QUOTES = [
  "Ship the boring part first. The interesting part depends on it.",
  "A demo proves it can work. Production proves it does.",
  "Constraints are the brief. Everything else is decoration.",
  "If the number isn't verified, it isn't a number worth publishing.",
  "Build the thing people can actually use today.",
  "Solo does not mean slow. It means no handoff losses.",
  "The best abstraction is the one you did not need to write."
];

function fillIdentity() {
  document.getElementById("nav-os").textContent = O.identity.osName;
  document.getElementById("boot-os").textContent = O.identity.osName;
  document.getElementById("tx-os").textContent = O.identity.osName;
  document.getElementById("id-roles").textContent = O.identity.roles.join(" · ");
  document.getElementById("id-name").textContent = O.identity.fullName;
  document.getElementById("id-intro").textContent = O.identity.intro;
  document.getElementById("avail-text").textContent = "Available for work";
  document.title = `${O.identity.fullName} — ${O.identity.osName}`;

  const p = document.getElementById("cta-primary");
  p.textContent = O.conversion.primaryLabel;
  p.onclick = () => openApp(O.conversion.primaryAction.split(":")[1]);
  const s = document.getElementById("cta-secondary");
  s.textContent = O.conversion.secondaryLabel;
  s.onclick = () => openApp(O.conversion.secondaryAction.split(":")[1]);

  document.getElementById("id-metrics").innerHTML = publicMetrics().slice(0, 3).map((m) => `
    <li><b>${esc(m.value)}</b><span>${esc(m.label)}</span>
    ${m.status !== "verified" ? `<em>${esc(STATUS_LABEL[m.status])}</em>` : ""}</li>`).join("");

  document.getElementById("portrait-img").alt = `Illustrated portrait of ${O.identity.fullName}`;

  const d = new Date();
  document.getElementById("tx-date").textContent = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  document.getElementById("tx-quote").textContent = QUOTES[d.getDate() % QUOTES.length];
}

function clock() {
  const now = new Date();
  document.getElementById("clock-date").textContent = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
  document.getElementById("clock-time").textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: O.identity.timezone });
  document.getElementById("clock-tz").textContent = O.identity.timezoneLabel;
}

function descriptorLoop() {
  const node = document.getElementById("id-descriptor");
  let i = 0;
  const set = () => { node.textContent = O.identity.descriptors[i % O.identity.descriptors.length]; i += 1; };
  set();
  if (!reduceMotion) setInterval(set, 2800);
}

/* ---------- theme ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  save(KEY.theme, t);
  document.querySelectorAll("[data-theme-set]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.themeSet === t))
  );
}

/* ---------- companion ---------- */
let companionTimer;
const COMPANION_ART = {
  idle: "assets/companion/companion-idle.png",
  happy: "assets/companion/companion-happy.png",
  sad: "assets/companion/companion-sad.png",
  excited: "assets/companion/companion-excited.png"
};
function companionState(state) {
  const c = document.getElementById("companion");
  const img = document.getElementById("companion-img");
  c.dataset.state = state;
  if (COMPANION_ART[state]) img.src = COMPANION_ART[state];
  clearTimeout(companionTimer);
  if (state !== "idle") companionTimer = setTimeout(() => companionState("idle"), 4000);
}

function initCompanion() {
  const c = document.getElementById("companion");
  const stored = load(KEY.companion, null);
  const clamp = () => {
    const r = c.getBoundingClientRect();
    const maxX = innerWidth - r.width - 8;
    const maxY = innerHeight - r.height - 8;
    if (c.style.left) c.style.left = Math.min(Math.max(8, parseInt(c.style.left, 10)), maxX) + "px";
    if (c.style.top) c.style.top = Math.min(Math.max(56, parseInt(c.style.top, 10)), maxY) + "px";
  };
  if (stored && !isPhone()) {
    c.style.left = stored.x + "px";
    c.style.top = stored.y + "px";
    c.style.bottom = "auto";
    clamp();
  }
  c.querySelector("#companion-reset").onclick = (e) => {
    e.stopPropagation();
    localStorage.removeItem(KEY.companion);
    c.style.left = ""; c.style.top = ""; c.style.bottom = "";
    companionState("happy");
  };
  c.addEventListener("click", (e) => {
    if (e.target.id === "companion-reset") return;
    companionState(c.dataset.state === "happy" ? "excited" : "happy");
  });
  // Desktop drag only — never competes with touch scrolling.
  c.addEventListener("pointerdown", (e) => {
    if (isPhone() || e.pointerType === "touch") return;
    const r = c.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    c.setPointerCapture(e.pointerId);
    c.dataset.dragging = "true";
    const mv = (ev) => {
      c.style.bottom = "auto";
      c.style.left = Math.min(Math.max(8, ev.clientX - dx), innerWidth - r.width - 8) + "px";
      c.style.top = Math.min(Math.max(56, ev.clientY - dy), innerHeight - r.height - 8) + "px";
    };
    const up = () => {
      delete c.dataset.dragging;
      save(KEY.companion, { x: parseInt(c.style.left, 10), y: parseInt(c.style.top, 10) });
      c.removeEventListener("pointermove", mv);
      c.removeEventListener("pointerup", up);
    };
    c.addEventListener("pointermove", mv);
    c.addEventListener("pointerup", up);
  });
  addEventListener("resize", clamp);
}

/* ---------- command palette ---------- */
function initPalette() {
  const pal = document.getElementById("palette");
  const input = document.getElementById("palette-input");
  const list = document.getElementById("palette-results");
  let items = [], sel = 0;

  const source = () => [
    ...APPS.map((a) => ({ label: a.name, type: "App", run: () => openApp(a.id) })),
    ...O.projects.map((p) => ({ label: p.name, type: "Project", run: () => openApp("projects") })),
    ...O.socials.map((s) => ({ label: s.network + " " + s.handle, type: "Social", run: () => window.open(s.url, "_blank", "noreferrer noopener") })),
    { label: "Email " + O.conversion.email, type: "Contact", run: () => (location.href = "mailto:" + O.conversion.email) },
    ...["day", "night", "dark"].map((t) => ({ label: "Theme: " + t, type: "System", run: () => applyTheme(t) }))
  ];

  const paint = () => {
    list.innerHTML = items.map((it, i) =>
      `<li role="option" aria-selected="${i === sel}"><span>${esc(it.label)}</span><span class="palette__type">${esc(it.type)}</span></li>`
    ).join("") || `<li role="option" aria-selected="false"><span>No matches</span></li>`;
    list.querySelectorAll("li").forEach((li, i) => (li.onclick = () => choose(i)));
  };
  const search = (q) => {
    const s = q.trim().toLowerCase();
    items = !s ? source().slice(0, 8)
      : source().filter((it) => {
          const l = it.label.toLowerCase();
          let j = 0;
          for (const ch of s) { j = l.indexOf(ch, j); if (j === -1) return false; j += 1; }
          return true;
        }).slice(0, 10);
    sel = 0; paint();
  };
  const choose = (i) => { const it = items[i]; if (!it) return; close(); it.run(); };
  const open = () => { pal.hidden = false; input.value = ""; search(""); input.focus(); };
  const close = () => { pal.hidden = true; };

  document.getElementById("nav-search").onclick = open;
  pal.querySelector("[data-palette-close]").onclick = close;
  input.addEventListener("input", () => search(input.value));
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { sel = Math.min(sel + 1, items.length - 1); paint(); e.preventDefault(); }
    else if (e.key === "ArrowUp") { sel = Math.max(sel - 1, 0); paint(); e.preventDefault(); }
    else if (e.key === "Enter") { choose(sel); e.preventDefault(); }
    else if (e.key === "Escape") close();
  });
  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? open() : close(); }
    if (e.key === "Escape" && !pal.hidden) close();
  });
}

/* ---------- boot ---------- */
function initBoot() {
  const boot = document.getElementById("boot");
  const fill = document.getElementById("boot-fill");
  const seen = load(KEY.boot, false);
  const total = seen || reduceMotion ? 500 : 1900;
  let t0 = performance.now();
  const done = () => { boot.classList.add("is-done"); save(KEY.boot, true); setTimeout(() => (boot.hidden = true), 500); };
  const tick = (now) => {
    const p = Math.min(1, (now - t0) / total);
    fill.style.width = p * 100 + "%";
    if (p < 1) requestAnimationFrame(tick); else done();
  };
  requestAnimationFrame(tick);
  document.getElementById("boot-skip").onclick = done;
}

/* ---------- widget drag ---------- */
function initWidget() {
  const tx = document.getElementById("transmission");
  const pos = load(KEY.widgets, null);
  if (pos && !isPhone()) { tx.style.left = pos.x + "px"; tx.style.top = pos.y + "px"; tx.style.right = "auto"; }
  tx.addEventListener("pointerdown", (e) => {
    if (isPhone() || e.target.closest("button")) return;
    const r = tx.getBoundingClientRect();
    const dx = e.clientX - r.left, dy = e.clientY - r.top;
    tx.setPointerCapture(e.pointerId);
    const mv = (ev) => {
      tx.style.right = "auto";
      tx.style.left = Math.min(Math.max(8, ev.clientX - dx), innerWidth - r.width - 8) + "px";
      tx.style.top = Math.min(Math.max(52, ev.clientY - dy), innerHeight - 120) + "px";
    };
    const up = () => {
      save(KEY.widgets, { x: parseInt(tx.style.left, 10), y: parseInt(tx.style.top, 10) });
      tx.removeEventListener("pointermove", mv);
      tx.removeEventListener("pointerup", up);
    };
    tx.addEventListener("pointermove", mv);
    tx.addEventListener("pointerup", up);
  });
}

/* ---------- interactive wallpaper ----------
   The glows drift toward the pointer and the grid brightens around it.
   Pure transform/opacity (compositor-only), disabled under reduced motion
   and on touch devices. */
function initWallpaper() {
  if (reduceMotion || matchMedia("(pointer: coarse)").matches) return;
  const a = document.querySelector(".wp-glow--a");
  const b = document.querySelector(".wp-glow--b");
  const grid = document.querySelector(".wp-grid");
  let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
  const step = () => {
    cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
    a.style.transform = `translate(${cx * 46}px, ${cy * 34}px)`;
    b.style.transform = `translate(${cx * -34}px, ${cy * -26}px)`;
    grid.style.maskImage = grid.style.webkitMaskImage =
      `radial-gradient(ellipse at ${50 + cx * 24}% ${42 + cy * 22}%, #000 30%, transparent 78%)`;
    if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002) raf = requestAnimationFrame(step);
    else raf = null;
  };
  addEventListener("pointermove", (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
    if (!raf) raf = requestAnimationFrame(step);
  }, { passive: true });
}

/* ---------- start ---------- */
function start() {
  applyTheme(load(KEY.theme, O.themes.default));
  document.querySelectorAll("[data-theme-set]").forEach((b) => (b.onclick = () => applyTheme(b.dataset.themeSet)));
  document.querySelectorAll("[data-open]").forEach((b) => (b.onclick = () => openApp(b.dataset.open)));
  document.getElementById("foldtab").onclick = () => openApp("contact");

  fillIdentity();
  descriptorLoop();
  clock();
  setInterval(clock, 30000);
  buildDesktop();
  initWallpaper();
  initWidget();
  initCompanion();
  initPalette();
  initBoot();
}

start();
