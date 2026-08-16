# SYSTEM_DESIGN.md — Detailed System Design

**Status:** Source of truth for HOW individual systems behave internally. Assumes ARCHITECTURE.md's ownership boundaries. Where a system has its own dedicated spec (Window Manager, Command Prompt, File Explorer, Settings, Games, Audio), this document gives the cross-system view; the dedicated spec is authoritative for that system's fine detail.

---

## 1. Boot System

### 1.1 Stages
1. **Power-on / BIOS-style stage** — brief, text-based, simulated POST messages (memory check, device detection — all fake/flavor text). Duration target: short, non-blocking.
2. **XP loading stage** — the classic XP loading bar visual (recreated, not copied). This stage is the *real* asset-loading window: application registry, content data, and shell chrome CSS/fonts load here. Progress indication should be honest-ish (tied to actual promise resolution of critical assets) rather than a fake timer, but must have a sensible minimum duration so it doesn't flash instantly on fast connections [DECISION REQUIRED: minimum duration value].
3. **(Optional) Welcome/login stage** — simulated user selection screen with a single profile representing the visitor or [YOUR NAME]'s persona. [DECISION REQUIRED: include or skip for MVP — recommend skip for MVP, add in polish phase.]
4. **Desktop transition** — wallpaper fade-in, optional startup sound (see §Audio Autoplay Constraint below), desktop icons populate.

### 1.2 Boot as Loading Gate
The Boot Controller exposes a promise-based readiness gate. Critical-path resources (application registry metadata, desktop icon config, fonts, base CSS) must resolve before the boot sequence is allowed to complete, even if minimum visual duration has elapsed. Non-critical resources (DOOM engine, large game sprite sheets) are explicitly excluded from this gate — they load lazily on first app launch, not during boot.

### 1.3 Audio Autoplay Constraint
Browsers block unsolicited audio before a user gesture. The startup sound cannot reliably autoplay on load. Design: the boot sequence proceeds visually regardless; the startup sound plays only if a user gesture has already occurred (e.g., page load via click-through from an external link counts in some browsers, but cannot be relied upon) — practically, treat the startup sound as **best-effort**, and/or trigger it on the first user interaction with the desktop (e.g., first click) as a graceful compromise. This must not block or gate the boot sequence itself.

### 1.4 Failure Handling
If critical asset loading fails or times out (define timeout in PERFORMANCE.md), the Boot Controller must transition to a defined fallback: either proceed to desktop with reduced content and a non-blocking notification, or show a simulated "Setup could not complete — Continue" screen. It must never hang indefinitely on a blank/black screen.

## 2. Desktop System

- Renders icons from an ordered, configurable list (`DesktopIconConfig[]` — see DATA_MODEL.md), each referencing an `appId` (and optional `launchArgs`) present in the Application Registry.
- Supports single-click to select (visual highlight) and double-click (or Enter key when focused, or a defined touch equivalent — see UI_UX_SPEC.md) to launch.
- Icon layout: a simple grid, top-to-bottom then left-to-right (matching classic XP default arrangement), positions computed from list order — not free-drag placement for MVP. [DECISION REQUIRED: whether free-drag icon repositioning is a v1 feature or deferred; recommend defer — adds persistence complexity for low payoff.]
- Desktop itself is a "drop target" only in the sense of receiving focus-loss clicks (clicking empty desktop deselects icons and can serve as a global "blur" affordance); no drag-and-drop file operations required for MVP.

## 3. Window Manager (see WINDOW_MANAGER_SPEC.md for full detail)

Summarized responsibilities relevant to cross-system integration:
- Exposes `launchApp(appId, launchArgs?)`, `focusWindow(windowId)`, `minimizeWindow(windowId)`, `toggleMaximize(windowId)`, `closeWindow(windowId)`, `moveWindow`, `resizeWindow`.
- Desktop, Start Menu, File Explorer, and Command Prompt are all *consumers* of `launchApp` — none reimplement window creation.
- Emits window lifecycle events (`onOpen`, `onClose`, `onFocus`, `onMinimize`) that the Taskbar subscribes to for its own rendering; the Taskbar does not read Window Manager internal state structures directly beyond the public store selector.

## 4. Taskbar & System Tray

- Start button (toggles Start Menu open/closed).
- Task buttons: one per open window (not per app — two File Explorer windows = two buttons), reflecting title + icon + active/minimized visual state.
- System tray (right-aligned): Wi-Fi indicator, Bluetooth indicator, battery indicator — all **simulated UI state** with no real device API binding for v1. [DECISION REQUIRED: whether battery indicator optionally binds to the real Battery Status API where available as a delightful easter-egg-adjacent detail — recommend defer, non-essential, API has spotty browser support.]
- Volume icon (opens a small slider popup, mirrors Control Panel's volume setting — both write to the same Settings Store field).
- Brightness control (see §6).
- Clock: real system time of the visitor's browser, formatted in a classic XP tray-clock style; clicking may show a simple calendar popup [DECISION REQUIRED: MVP or deferred polish — recommend deferred].

## 5. Start Menu

- Two-column classic-XP-style layout is the aesthetic target: left column = "pinned/frequently used" style entries (About Me, Resume, Projects, Browser), right column = system-style entries (My Computer, Control Panel, Command Prompt) plus a "Games" flyout and "Socials" flyout submenu.
- All entries reference `appId`s from the Application Registry; the Start Menu's data structure is itself configurable (`StartMenuConfig` — see DATA_MODEL.md) independent from the Desktop icon list, though both ultimately point at the same registry.
- Opening any entry calls `launchApp` and closes the Start Menu.
- Closes on: selecting an entry, clicking outside its bounds, pressing Escape.

## 6. Settings & Brightness Architecture

- Settings Store holds: `brightness (0–100)`, `volume (0–100)`, `soundEffectsEnabled (bool)`, `animationsEnabled (bool)`, `crtEffectEnabled (bool)` [optional/stretch], plus any future portfolio-specific toggles.
- **Brightness implementation:** a full-viewport, pointer-events-none overlay `<div>` with `background: black` and `opacity` mapped from `(100 - brightness) / 100 * maxOpacity`, OR a CSS `filter: brightness(x%)` applied to a root wrapper element. [DECISION REQUIRED: overlay-div approach vs. CSS filter approach — the CSS filter approach is simpler and GPU-accelerated but affects rendering performance differently across browsers on complex scenes (e.g., DOOM canvas); recommend CSS filter on a root wrapper for simplicity, verified against DOOM's canvas in Phase 19/21 testing.] Must be smoothly interpolated (CSS transition), not stepped, satisfying PRD's "support smoothly changing brightness."
- Settings persist to `localStorage` under a single versioned key (see SETTINGS_SPEC.md) and are rehydrated on load, applied before or during the boot sequence so the desktop never "flashes" at default settings before jumping to saved ones.

## 7. Virtual Filesystem (see FILE_EXPLORER_SPEC.md for full detail)

- A single in-memory tree structure, typed per DATA_MODEL.md, seeded at startup from the Content Data Layer (projects, resume doc, social shortcuts) plus static structural folders (Users, Documents, Downloads, Games).
- Read-only for v1 except: (a) Notepad "save" writing new file nodes if that MVP scope is included (see §8), (b) Recycle Bin's "deleted" file list, which is pre-seeded/curated, not derived from a real delete flow for MVP. [DECISION REQUIRED: whether desktop icons that represent "files" (e.g., Resume) are the *same underlying nodes* as their filesystem counterpart, or independent registry entries that happen to look similar. Recommend: single source of truth — desktop icon config references the *same* virtual filesystem node/app id so Resume-on-Desktop and Resume-in-Documents are guaranteed consistent.]
- Command Prompt reads/writes this same store for `dir`, `cd`, `ls`, `cat`-equivalent commands — no separate filesystem representation for the terminal.

## 8. Notepad — MVP Scope Boundary

**MVP (Phase 9) includes:**
- Blank editable document on launch.
- Typing, deleting, text selection (native browser `contenteditable`/`textarea` behavior).
- Cut/Copy/Paste via native browser clipboard interaction and standard keyboard shortcuts (Ctrl/Cmd+X/C/V, Ctrl/Cmd+A, Ctrl/Cmd+Z where trivially available via native textarea undo).
- "New" document (clears buffer, with an unsaved-changes confirmation if content exists).
- Window title reflects an "Untitled" vs. a given filename, with a `*` unsaved-changes indicator, matching classic Notepad UX.

**Explicitly deferred (future expansion, not MVP):**
- Persisting saved documents into the Virtual Filesystem Store (`File > Save As` writing a real node visitors can find later in File Explorer).
- Multiple simultaneous Notepad documents beyond what multi-instance windowing already provides "for free."
- Find/Replace, Word Wrap toggle, Font selection (classic Notepad menu items) — nice-to-have polish items, not required for the portfolio's substantive purpose.
- Opening existing virtual `.txt` files for editing (Navigation Guide and other read-only doc viewers remain intentionally separate/read-only components, not a mode of this Notepad).

Rationale for boundary: Notepad's product purpose here is demonstrating OS-authenticity and giving visitors a tactile "this is a real interactive computer" moment, not being a persistence-backed writing tool. Full save/load is a differentiator worth adding post-MVP if time allows, tracked as a distinct backlog item.

## 9. Browser App — Embedding Strategy

Three content categories, each with defined behavior (detailed further in UI_UX_SPEC.md):

1. **Portfolio-controlled pages** (e.g., an in-app "search results" page, an "about:home" start page) — always renderable, full control, no embedding restrictions since they're same-origin/owned content.
2. **Embeddable external content** — sites the operator has verified do not send blocking `X-Frame-Options`/`frame-ancestors` CSP directives. Rendered directly in an iframe within the Browser window.
3. **Non-embeddable external sites** (most real-world sites: LinkedIn, GitHub, Google Search results pages, etc.) — the Browser app must detect this is expected (via a maintained allow-list/block-list config, since detecting frame-refusal reliably at runtime is not always possible pre-emptively due to cross-origin restrictions) and render an in-app fallback view: a styled "This site can't be displayed in [Browser App Name]" page with a prominent "Open in a new tab" button, preserving the illusion's tone (flavored like an XP-era browser error page) while remaining technically honest.

Google search specifically: Google blocks framing. The Browser's "search" affordance should be implemented as: visitor types a query → app either (a) opens Google search in a new real browser tab (simplest, most honest), or (b) simulates a lightweight in-app "search results" experience using curated/portfolio-relevant links only (e.g., searching "projects" surfaces portfolio project links) — [DECISION REQUIRED: pick (a), (b), or both, e.g., real queries fall back to (a) while a small set of "easter egg" queries produce curated in-app results per (b)]. Recommendation: (b) for portfolio-relevant terms as a delightful easter egg layer, falling back to (a) for everything else.

## 10. Command Prompt (see COMMAND_PROMPT_SPEC.md for full detail)

Cross-system note: the Command Prompt's `cd`/`dir`/`ls` family of commands read the same Virtual Filesystem Store used by File Explorer (§7), guaranteeing a visitor sees consistent results whether they browse graphically or via terminal.

## 11. Control Panel

- Renders a set of "applet" tiles (classic Control Panel icon-grid look), each opening a settings sub-panel (could be inline expansion or a secondary modal-in-window) bound directly to Settings Store fields — no separate Control-Panel-local state copy.
- Applets (MVP): Display (brightness), Sounds (volume + effects toggle), Appearance (animations toggle, CRT effect toggle if included). Additional applets are additive per NFR-3.

## 12. Recycle Bin

- A specialized read-mostly view over a curated list of "deleted" file entries (see DATA_MODEL.md `RecycleBinEntry`), independent of the main Virtual Filesystem tree (these are *not* real deleted nodes from a delete operation in v1 — no delete flow is required for MVP, only the curated flavor content).
- Icon may visually reflect "empty" vs. "has items" state per classic XP behavior, purely cosmetic for v1.

## 13. Blue Screen Easter Egg

- **Trigger candidates** (choose at least one for MVP, more are additive): a hidden keyboard combination (e.g., a specific key sequence), a rare-chance trigger on a specific benign action (e.g., 1-in-N chance when closing a specific app), or a dedicated hidden interactive object (e.g., an innocuous-looking desktop icon like "Do Not Click" or a fake corrupted file). [DECISION REQUIRED: final trigger(s) — must be discoverable but not accidental; avoid binding to common actions like generic window-close to prevent frustrating accidental triggers, satisfying PRD FR-31/32's "prevent accidental triggering" requirement.]
- **Behavior:** Full-viewport takeover mimicking the classic BSOD text style (recreated, not copied verbatim from Microsoft's actual copy — paraphrased/parody framing appropriate for a portfolio easter egg), auto-progressing after a fixed duration into a simulated "restart" (mini reboot animation, shorter than the full boot sequence) that returns to the desktop.
- **State handling:** All previously open windows are closed as part of the "crash" (this is the honest simulated-crash behavior); Settings persist (they're in localStorage, unaffected); no real data loss is possible because there is no unsaved-critical-data concept beyond an open Notepad buffer, which the BSOD trigger design should avoid interrupting carelessly — [DECISION REQUIRED: whether an unsaved Notepad buffer should block/warn before an intentional BSOD trigger, or whether the "crash realism" of losing it is acceptable/desired]. Recommend: acceptable, it's flavor, and the Navigation Guide can mention it.

## 14. Error / Dialog System

A shared, generic "XP-style dialog box" component (icon + message + buttons, e.g., OK / Cancel / Yes / No) is used by: Notepad's unsaved-changes prompt, Command Prompt's invalid-command hints (if surfaced as a dialog rather than inline text — likely inline text is more appropriate, see COMMAND_PROMPT_SPEC.md), any fake error easter eggs, and Browser's non-embeddable fallback framing (styled consistently). This avoids each app inventing its own modal styling.

## 15. Document Authority

SYSTEM_DESIGN.md elaborates ARCHITECTURE.md's system boundaries; it must not reassign ownership defined there. Dedicated specs (WINDOW_MANAGER_SPEC.md, COMMAND_PROMPT_SPEC.md, FILE_EXPLORER_SPEC.md, SETTINGS_SPEC.md, GAME_SPEC.md, AUDIO_SPEC.md) take precedence over this document for their respective domains' fine detail; this document takes precedence for cross-system interaction behavior.
