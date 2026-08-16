# DEVELOPMENT_PHASES.md — Full Implementation Roadmap

**Status:** Source of truth for WHAT gets implemented and in what order. Each phase is independently reviewable. An implementing AI coding agent should treat each phase as a discrete unit of work with its own PR/review boundary, not proceed to the next phase until the current phase's Definition of Done is met.

---

## Phase 0 — Project Foundation & Architecture

**Objective:** Stand up the project skeleton so every subsequent phase has a consistent base.
**Scope:** Repo/tooling setup only — no user-facing features.
**Features:** Vite + React + TypeScript project init; Tailwind config; ESLint/Prettier config; directory structure per ARCHITECTURE.md §7; Zustand installed with one placeholder store to validate wiring; base `xp-theme.css` file created (empty/stub); CI pipeline stub (lint + typecheck + test run) per CONTRIBUTING.md.
**Dependencies:** None.
**Files/modules involved:** Root config files, `src/` skeleton directories (empty with `.gitkeep` or stub `index.ts` files as appropriate).
**Expected behavior:** `npm run dev` serves a blank page without errors; `npm run build` succeeds; `npm run lint`/`typecheck`/`test` all pass on an empty baseline.
**Acceptance criteria:** Clean install → dev server → build all succeed on a fresh checkout.
**Edge cases:** N/A (no logic yet).
**Testing requirements:** CI pipeline itself is the test — verify it fails correctly on an intentionally broken lint rule (smoke test the pipeline, then revert).
**Performance considerations:** None yet; establish baseline bundle-size tracking if convenient (optional).
**Security considerations:** Ensure no secrets/env files committed; `.gitignore` correctly configured.
**What must NOT be implemented yet:** Any actual application logic.
**Definition of done:** Repo builds, lints, and type-checks cleanly with the directory skeleton in place.
**Downstream dependents:** All subsequent phases.

---

## Phase 1 — XP Boot Experience

**Objective:** Implement the boot sequence as both an authentic visual experience and the real asset-loading gate.
**Scope:** Boot Controller + boot stage components (BIOS/POST stage, loading-bar stage, optional welcome stage, desktop transition). Does NOT include the actual Desktop (Phase 2) — boot may transition to a placeholder empty screen for now, or Phase 1 and 2 may be developed in tandem with Phase 1 landing first and Phase 2 immediately following before either is considered independently shippable. [Recommend implementing sequentially but reviewing together if practically easier — the phases remain conceptually separate for documentation/testing purposes.]
**Features:** Per SYSTEM_DESIGN.md §1 — all four stages (or the [DECISION REQUIRED]-resolved subset), promise-based readiness gate, minimum-duration handling, failure/timeout fallback.
**Dependencies:** Phase 0.
**Files/modules involved:** `src/boot/*`.
**Expected behavior:** Navigating to the site always shows the boot sequence before any shell content is visible; sequence completes and hands off cleanly.
**Acceptance criteria:** Boot sequence plays fully on fresh load; respects `prefers-reduced-motion` by shortening/simplifying transitions; simulated failure (e.g., forced rejected promise in dev) triggers the defined fallback, not an infinite hang.
**Edge cases:** Extremely fast load (assets cached) — verify minimum duration still applies without feeling broken/rushed; extremely slow load — verify no indefinite hang past defined timeout.
**Testing requirements:** Unit test the readiness-gate promise logic; E2E test (Playwright) verifying boot → transition occurs within an expected time envelope.
**Performance considerations:** Boot visuals themselves must be lightweight (no large video/image assets) per TRD.md §5.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Desktop icons, window manager, any app content.
**Definition of done:** Boot sequence is visually complete (using placeholder assets per ASSET_MANIFEST.md), functions as a real loading gate, and transitions correctly.
**Downstream dependents:** Phase 2 (transition target).

---

## Phase 2 — Desktop & Wallpaper

**Objective:** Render the XP desktop shell surface.
**Scope:** Wallpaper rendering, desktop icon grid rendering from `DesktopConfig` (data-driven, but icons are inert placeholders — clicking does nothing yet, since Window Manager doesn't exist until Phase 3).
**Features:** Icon grid layout (SYSTEM_DESIGN.md §2), selection state (single-click highlight), configurable icon list consumption.
**Dependencies:** Phase 0, Phase 1 (boot transitions into this).
**Files/modules involved:** `src/shell/desktop/*`, `src/registries/` (initial `DesktopConfig` stub with placeholder icons).
**Expected behavior:** After boot, desktop renders with wallpaper and correctly positioned icons; icons are selectable (highlighted) but not yet launchable.
**Acceptance criteria:** Icon list renders entirely from config data (verified by adding/removing a config entry and confirming the render updates with zero component code changes); selection/deselection behavior works via click and keyboard per UI_UX_SPEC.md §2.
**Edge cases:** Very small viewport — verify icon grid doesn't overflow unmanageably (full Adapted Mode is Phase 21, but basic non-broken rendering should hold now).
**Testing requirements:** Component tests for icon rendering from mock config; visual check against XP reference for spacing/layout conventions.
**Performance considerations:** Wallpaper asset should be reasonably sized/optimized.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Actual app launching (double-click is wired to a no-op or console log placeholder), Window Manager, Taskbar, Start Menu.
**Definition of done:** Desktop renders correctly and icons are interactive at the selection level.
**Downstream dependents:** Phase 3 (icons will call into it), Phase 4, Phase 5.

---

## Phase 3 — Core Window Manager

**Objective:** Implement the single most critical system: window lifecycle, per WINDOW_MANAGER_SPEC.md in full.
**Scope:** `WindowManagerAPI`, `WindowInstance` store, `WindowFrame` rendering component (title bar, minimize/maximize/close buttons, drag, resize, focus/z-index), Application Registry (empty/stub apps acceptable for now — even a single "Hello World" test app is sufficient to validate the system).
**Features:** All of WINDOW_MANAGER_SPEC.md §2–§10.
**Dependencies:** Phase 0, Phase 2 (icons will eventually call `launchApp`, though Phase 3 can be built/tested with a temporary trigger, e.g., a dev-only button, before Phase 2's icons are wired to it in this same phase's completion step).
**Files/modules involved:** `src/shell/window-manager/*`, `src/stores/window-store.ts`, `src/registries/application-registry.ts` (initial stub).
**Expected behavior:** Multiple windows can be opened (via a temporary test trigger or by wiring at least one real Desktop icon, e.g., a placeholder "Test App"), dragged, resized, minimized, maximized, restored, closed, and correctly focus/z-index-order relative to each other.
**Acceptance criteria:** All acceptance criteria and edge cases listed in WINDOW_MANAGER_SPEC.md §10 pass; Desktop icon double-click now successfully calls `launchApp` (closing the loop from Phase 2's placeholder).
**Edge cases:** Per WINDOW_MANAGER_SPEC.md §10 table, in full.
**Testing requirements:** Unit tests for store logic (position/z-index/state transitions); interaction tests (Playwright or RTL + user-event) for drag/resize/minimize/maximize/close flows; reduced-motion variant tested explicitly.
**Performance considerations:** Drag/resize performance per WINDOW_MANAGER_SPEC.md §11 — verify no jank with multiple windows open simultaneously.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Taskbar (Phase 4) and Start Menu (Phase 5) — window manager must be independently testable via Desktop-only triggers first.
**Definition of done:** Full window lifecycle works correctly and generically for at least one test/placeholder application.
**Downstream dependents:** Every subsequent application phase (6 onward) depends entirely on this.

---

## Phase 4 — Taskbar & System Tray

**Objective:** Implement taskbar rendering and interaction per SYSTEM_DESIGN.md §4 / UI_UX_SPEC.md §4.
**Scope:** Start button (opens nothing yet — Start Menu is Phase 5, button can be inert/stubbed), task buttons subscribing to `listWindows()`, system tray indicators (Wi-Fi/Bluetooth/battery simulated states), volume popup (wired to Settings Store — may need a minimal Settings Store stub introduced here if not already present), brightness control, clock.
**Dependencies:** Phase 3 (subscribes to Window Manager).
**Files/modules involved:** `src/shell/taskbar/*`, `src/stores/settings-store.ts` (initial version, expanded fully in Phase 11).
**Expected behavior:** Taskbar accurately reflects open windows in real time; clicking task buttons focuses/minimizes/restores correctly per the toggle logic; tray indicators render (static/simulated states acceptable for now — full Control Panel binding completes in Phase 11); clock shows real time.
**Acceptance criteria:** Taskbar button state (active/inactive/minimized visual) always matches actual window state; no independent window list drift.
**Edge cases:** Many simultaneous windows — taskbar buttons should degrade gracefully (e.g., shrink/truncate titles) rather than overflow broken.
**Testing requirements:** Component tests verifying taskbar reflects store changes reactively; interaction tests for the click-toggle behavior.
**Performance considerations:** Clock re-render should be isolated (e.g., its own small component) so it doesn't cause the entire taskbar to re-render every second.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Full Control Panel-driven brightness/volume persistence (Phase 11); Start Menu content (Phase 5).
**Definition of done:** Taskbar is fully functional against the Window Manager; brightness/volume controls visibly work even if not yet persisted.
**Downstream dependents:** Phase 5 (Start button), Phase 11 (full settings binding).

---

## Phase 5 — Start Menu

**Objective:** Implement the Start Menu per SYSTEM_DESIGN.md §5.
**Scope:** Start Menu open/close state, two-column layout, `StartMenuConfig`-driven rendering, submenu flyouts (Games, Socials — content stubs acceptable until those apps exist), entries calling the same `launchApp`.
**Dependencies:** Phase 3, Phase 4 (Start button trigger).
**Files/modules involved:** `src/shell/start-menu/*`, `src/registries/` (`StartMenuConfig`).
**Expected behavior:** Start button toggles menu; entries launch apps identically to Desktop icons; closes correctly on outside-click/Escape/selection.
**Acceptance criteria:** Launching the same `appId` from Desktop vs. Start Menu produces identical `WindowInstance` behavior (explicit regression test for "no duplicated launch logic").
**Edge cases:** Submenu hover-intent timing (UI_UX_SPEC.md §5) — verify no flicker.
**Testing requirements:** Interaction tests for open/close triggers and submenu behavior; keyboard navigation test.
**Performance considerations:** None significant.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Real app content for most entries (still stubs until Phases 7+).
**Definition of done:** Start Menu is fully navigable and launches correctly via the shared system.
**Downstream dependents:** All content phases (7 onward) populate real entries here.

---

## Phase 6 — Application Registry & System Finalization

**Objective:** Formalize the Application Registry contract (ARCHITECTURE.md §4) as a robust, typed, documented system before rapidly adding many real apps in subsequent phases.
**Scope:** Finalize `AppDefinition` typing, `AppComponentProps` contract (including the `onBeforeClose` guard hook from WINDOW_MANAGER_SPEC.md §6), lazy-loading wiring pattern (`React.lazy`) established as the standard pattern for heavier apps (to be used starting with DOOM later, but the *pattern* should exist now so it's not retrofitted).
**Dependencies:** Phase 3.
**Files/modules involved:** `src/registries/application-registry.ts` (finalized), shared `src/apps/_shared/` utilities (e.g., a base error boundary wrapper per app).
**Expected behavior:** Registering a new app is a documented, mechanical process (add `AppDefinition`, implement component conforming to contract).
**Acceptance criteria:** A trivial "Hello World" test app can be added and fully function (open/close/minimize/focus, appears in taskbar/Start Menu if configured) by touching only the registry + one new component file.
**Edge cases:** An app component that throws during render — verify the per-window error boundary (ARCHITECTURE.md §6) contains the failure.
**Testing requirements:** Test the error boundary explicitly with an intentionally-throwing stub component.
**Performance considerations:** Confirm lazy-loaded stub app doesn't appear in the main bundle (verify via build output analysis).
**Security considerations:** None specific.
**What must NOT be implemented yet:** Real portfolio apps (next phases).
**Definition of done:** The plugin contract is stable, documented in code, and validated by at least one real (even if trivial) registered app plus one error-boundary test app.
**Downstream dependents:** Every remaining phase.

---

## Phase 7 — My Computer / Virtual Filesystem

**Objective:** Implement Virtual Filesystem Store + File Explorer app per FILE_EXPLORER_SPEC.md.
**Scope:** Filesystem data model + store (DATA_MODEL.md §5), seeded with structural folders (Projects/Social/Games folders may be structurally present but empty until Phases 13–15 populate real content), File Explorer navigation UI (address bar, back/forward/up, icon-grid content pane).
**Dependencies:** Phase 6.
**Files/modules involved:** `src/stores/filesystem-store.ts`, `src/apps/file-explorer/*`, `src/registries/filesystem-seed.ts`.
**Expected behavior:** My Computer opens showing Local Disk (C:); navigation into subfolders works; empty folders render an appropriate "this folder is empty" state rather than breaking.
**Acceptance criteria:** Per FILE_EXPLORER_SPEC.md §7 (adjusted — some criteria depend on later phases' content and are re-verified then).
**Edge cases:** Navigating into a folder with zero children; navigating via Back past the root (no-op, doesn't error).
**Testing requirements:** Unit tests for filesystem tree traversal helpers (get children, get path, resolve node by path); interaction tests for navigation UI.
**Performance considerations:** None significant at this scale of data.
**Security considerations:** Read-only guarantee (FILE_EXPLORER_SPEC.md §5) must be verified — no UI affordance exists yet that could mutate the tree.
**What must NOT be implemented yet:** Real project/social content inside the tree (Phases 13–15); Command Prompt filesystem interaction (Phase 10).
**Definition of done:** File Explorer is fully navigable against the (partially empty) seeded filesystem.
**Downstream dependents:** Phase 8, Phase 10, Phase 13, Phase 14, Phase 15.

---

## Phase 8 — Navigation guide.txt

**Objective:** Implement the read-only Notepad-style document viewer and the `Navigation guide.txt` content.
**Scope:** `navigation-guide-viewer` app (generic read-only text viewer, reusable for any future static document, not hardcoded solely to this one file), desktop icon wired, filesystem node wired (FILE_EXPLORER_SPEC.md structure).
**Dependencies:** Phase 6, Phase 7 (for the filesystem node/icon consistency rule).
**Files/modules involved:** `src/apps/navigation-guide/*` (or a more generically named `src/apps/document-viewer/*` if built as a reusable read-only viewer), `src/content/navigation-guide.ts`.
**Expected behavior:** Double-clicking the desktop icon or the filesystem entry opens identical read-only content in a Notepad-styled window.
**Acceptance criteria:** Content covers all topics required by CONTENT_SCHEMA.md §3.5; icon visually resembles a text-document icon (ASSET_MANIFEST.md `XP_TEXT_DOCUMENT_ICON` placeholder wired correctly).
**Edge cases:** Long content requiring scroll — verify scroll works correctly within the window bounds.
**Testing requirements:** Component test confirming content renders; consistency test confirming Desktop and File Explorer entry points produce identical output.
**Performance considerations:** None significant.
**Security considerations:** Content is static/trusted (authored, not visitor-supplied) — no sanitization concerns beyond standard practice.
**What must NOT be implemented yet:** The separate editable Notepad app (Phase 9) — must not be conflated with this read-only viewer.
**Definition of done:** Navigation guide is fully readable and consistently accessible from both entry points.
**Downstream dependents:** None blocking, but supports overall usability testing from here forward.

---

## Phase 9 — Notepad

**Objective:** Implement the editable Notepad app per SYSTEM_DESIGN.md §8 MVP boundary.
**Scope:** Blank editable document, typing/editing/selection/cut/copy/paste, New document with unsaved-changes guard (using the `onBeforeClose` hook from Phase 6), title bar reflecting Untitled/unsaved indicator.
**Dependencies:** Phase 6.
**Files/modules involved:** `src/apps/notepad/*`.
**Expected behavior:** Fully functional lightweight text editor within a window; matches SYSTEM_DESIGN.md §8's explicit MVP/deferred boundary exactly (no save-to-filesystem, no find/replace).
**Acceptance criteria:** Typing/deleting/selecting/cut/copy/paste all function via both mouse and standard OS keyboard shortcuts; closing with unsaved content triggers the confirmation dialog; closing with no changes (or after confirming discard) closes cleanly.
**Edge cases:** Very large pasted text — verify no crash/extreme slowdown (a native `<textarea>` handles this natively; if a custom `contenteditable` is used instead, this must be explicitly verified).
**Testing requirements:** Interaction tests for typing, selection, clipboard operations (may require mocking clipboard API in test environment), and the unsaved-changes close-guard flow.
**Performance considerations:** None significant for MVP scope.
**Security considerations:** Pasted content must be treated as plain text only — no risk of script injection if implemented via `<textarea>`/plain-text `contenteditable` without HTML interpretation.
**What must NOT be implemented yet:** Save-to-filesystem, Find/Replace, Word Wrap toggle, Font selection, opening existing files for editing (all explicitly deferred per SYSTEM_DESIGN.md §8).
**Definition of done:** Notepad meets the full MVP scope list and none of the deferred items are partially/inconsistently implemented (either fully deferred or not started, not half-built).
**Downstream dependents:** None blocking.

---

## Phase 10 — Command Prompt

**Objective:** Implement the virtual shell per COMMAND_PROMPT_SPEC.md in full.
**Scope:** ASCII banner, parser, command registry with full MVP command set (§4 of that spec), history navigation, tab completion (command-name-only per the MVP decision), scrollback, error handling, per-instance `cwd` reading/writing against the Virtual Filesystem Store from Phase 7.
**Dependencies:** Phase 6, Phase 7 (filesystem interaction), Phase 8/9 not required but `open` command benefits from other apps existing (may be partially stubbed and completed incrementally as later phases add more content — recommend revisiting Command Prompt's `open`/`projects`/`socials` commands' completeness once Phases 13–15 land, as a small follow-up task, rather than blocking this phase entirely on unrelated content phases).
**Files/modules involved:** `src/apps/command-prompt/*`, `src/registries/command-registry.ts`, `src/content/ascii-banner.ts`.
**Expected behavior:** Fully interactive terminal matching COMMAND_PROMPT_SPEC.md behavior exactly.
**Acceptance criteria:** All MVP commands function correctly against seeded/available data; error handling matches §6 of that spec exactly; cross-system consistency with File Explorer (dir output matches filesystem state) verified.
**Edge cases:** Per COMMAND_PROMPT_SPEC.md throughout (unknown command, invalid path, missing argument, empty input).
**Testing requirements:** Unit tests per command (pure logic, easy to test in isolation given `CommandContext` is a clean interface); interaction tests for history/tab-completion/scrollback UX.
**Performance considerations:** Scrollback should not degrade with very long sessions — consider a reasonable cap with truncation if needed (non-blocking polish).
**Security considerations:** Explicit test that no command path allows `eval`/arbitrary execution (this should be trivially true by construction, but worth an explicit regression test given how central this constraint is).
**What must NOT be implemented yet:** Full path-based tab completion (deferred), any shell chaining/piping syntax (explicitly out of scope).
**Definition of done:** Command Prompt is fully functional per spec and passes the security regression test.
**Downstream dependents:** None blocking, benefits from later content phases.

---

## Phase 11 — Control Panel & Global Settings

**Objective:** Finalize the Settings Store and Control Panel per SETTINGS_SPEC.md in full, replacing any Phase 4 stub.
**Scope:** Full `SettingsState` schema, persistence (localStorage, versioned), Control Panel applets (Display/Sounds/Appearance), full binding from Taskbar tray controls (Phase 4) to this finalized store, `prefers-reduced-motion` initial-default interaction (§4 of that spec), brightness visual implementation finalized (SYSTEM_DESIGN.md §6 decision resolved here).
**Dependencies:** Phase 4 (taskbar controls being upgraded from stub), Phase 6.
**Files/modules involved:** `src/stores/settings-store.ts` (finalized), `src/apps/control-panel/*`.
**Expected behavior:** All settings changes apply live and persist across reload; brightness/volume controls in both Taskbar and Control Panel stay in sync.
**Acceptance criteria:** Reload the page after changing settings → settings are restored correctly; brightness smoothly interpolates across its full range; volume affects Audio Manager gain once Phase 16 exists (Control Panel/Settings Store must be built now in a way that Phase 16 can cleanly plug into it without rework).
**Edge cases:** Corrupted/malformed localStorage value — falls back to defaults without crashing (per SETTINGS_SPEC.md §3).
**Testing requirements:** Unit tests for persistence/migration logic; interaction tests for each applet; explicit test of the reduced-motion initial-default behavior.
**Performance considerations:** None significant.
**Security considerations:** `localStorage` content is not sensitive; no special handling needed beyond standard JSON parse safety (try/catch).
**What must NOT be implemented yet:** Actual audio playback integration (Phase 16) — volume setting exists and is wired structurally, but Audio Manager itself doesn't exist until Phase 16; this is fine since Settings Store is the single source of truth Phase 16 will read from, not the other way around.
**Definition of done:** Settings are fully functional, persistent, and correctly bound across both UI surfaces.
**Downstream dependents:** Phase 16 (audio), all future settings-consuming features.

---

## Phase 12 — Browser

**Objective:** Implement the Browser app per SYSTEM_DESIGN.md §9 / UI_UX_SPEC.md §10.
**Scope:** Address bar, navigation controls (back/forward/reload — mocked/simplified since there's no real multi-page history within the simulated browser unless intentionally built), content area, embeddable/non-embeddable/portfolio-controlled-content handling per the three-category strategy, fallback UX for blocked sites, curated in-app "search" easter egg layer (per the [DECISION REQUIRED] resolution recommended in SYSTEM_DESIGN.md §9 — implement option (b)+(a) hybrid).
**Dependencies:** Phase 6.
**Files/modules involved:** `src/apps/browser/*`, a small `src/content/embeddable-sites.ts` or similar allow-list config.
**Expected behavior:** Navigating to a known-embeddable/portfolio-controlled URL renders inline; navigating to a known-blocked site renders the styled fallback with "Open in New Tab"; searching a portfolio-relevant term shows curated results, other terms fall back to opening real Google search in a new tab.
**Acceptance criteria:** No actual broken/blank iframe is ever shown to the visitor — every non-embeddable case is explicitly caught and handled per the allow/block-list, not left to fail silently at runtime.
**Edge cases:** A site not present in either allow-list or block-list (unknown status) — must have a defined default behavior (recommend: default to the fallback/new-tab treatment, i.e., "assume non-embeddable unless proven otherwise," which is the safe default given most modern sites block framing).
**Testing requirements:** Component tests for each of the three content-category rendering paths; test the unknown-site default behavior explicitly.
**Performance considerations:** None significant.
**Security considerations:** Any iframe usage must include appropriate `sandbox` attributes for embedded portfolio-controlled content at minimum; external `window.open` calls must use `noopener,noreferrer` (COMMAND_PROMPT_SPEC.md §9 pattern applies here too — shared utility recommended).
**What must NOT be implemented yet:** Any server-side proxy/embedding-bypass mechanism (explicitly prohibited per TRD.md §2 point 3 unless a future explicit decision changes this).
**Definition of done:** Browser handles all three content categories correctly and never presents a broken embedding experience.
**Downstream dependents:** Phase 14 (Socials may route through Browser).

---

## Phase 13 — Portfolio Content Integration (Resume/About)

**Objective:** Wire real (or clearly placeholder-marked) Resume/About content into the OS via a dedicated viewer app, per CONTENT_SCHEMA.md §3.1.
**Scope:** `resume-viewer` app rendering `ResumeData` generically; desktop icon and filesystem node wired consistently (DATA_MODEL.md §5 consistency rule); Command Prompt's `whoami`/`about`/`skills` (from Phase 10) now have real data to read (verify integration).
**Dependencies:** Phase 6, Phase 7, Phase 10 (for the cross-verification step).
**Files/modules involved:** `src/apps/resume-viewer/*`, `src/content/resume.ts` (populated with placeholders per PRD's explicit instruction not to invent content).
**Expected behavior:** Resume icon opens a well-formatted viewer window showing all `ResumeData` fields; identical whether opened from Desktop, Start Menu, or File Explorer's Documents folder.
**Acceptance criteria:** All three entry points produce consistent results; Command Prompt commands reflect the same underlying data (no drift).
**Edge cases:** Empty `experience`/`education` arrays (if content isn't ready yet) — viewer renders gracefully (e.g., an appropriate placeholder note) rather than a broken empty layout.
**Testing requirements:** Component test with both a fully-populated and a minimal/placeholder `ResumeData` fixture.
**Performance considerations:** None significant.
**Security considerations:** None specific (trusted authored content).
**What must NOT be implemented yet:** Downloadable PDF resume asset wiring is optional/stretch — may be included now if trivial, or deferred; not blocking.
**Definition of done:** Resume content is fully integrated and consistent across all access points.
**Downstream dependents:** None blocking.

---

## Phase 14 — Social Applications / Integration

**Objective:** Wire Social links per CONTENT_SCHEMA.md §3.3 and FILE_EXPLORER_SPEC.md's Social folder.
**Scope:** Desktop icons for LinkedIn/GitHub (and any additional socials), filesystem nodes, routing through the Browser app (Phase 12) with correct `embeddable: false` fallback behavior verified end-to-end for real target domains.
**Dependencies:** Phase 6, Phase 7, Phase 12.
**Files/modules involved:** `src/content/socials.ts`, wiring in `src/registries/`.
**Expected behavior:** Double-clicking LinkedIn/GitHub icons opens the Browser app, attempts navigation, and correctly shows the fallback UX with a working "Open in New Tab" link to the real placeholder URL.
**Acceptance criteria:** End-to-end flow verified for at least LinkedIn and GitHub (both are real, known-blocking domains, making them good realistic test cases even with placeholder URLs).
**Edge cases:** Placeholder URL (`"[YOUR LINKEDIN URL]"`) is not a valid URL yet — "Open in New Tab" should handle this gracefully in a dev/placeholder state (e.g., disabled state or a dev-only warning) rather than attempting to navigate to a literal bracketed string; must not break in production once real URLs are supplied. [DECISION REQUIRED: exact placeholder-detection mechanism, e.g., checking for a leading `[` — a pragmatic dev-time safeguard, not a permanent feature.]
**Testing requirements:** Integration test confirming Social icon → Browser → fallback UX → new-tab-open flow.
**Performance considerations:** None significant.
**Security considerations:** `noopener,noreferrer` enforced (Phase 12 pattern reused).
**What must NOT be implemented yet:** N/A — this phase is fully scoped as described.
**Definition of done:** All configured social links function correctly through the Browser's fallback path.
**Downstream dependents:** None blocking.

---

## Phase 15 — Project Application Integration

**Objective:** Wire the Project Registry and `ProjectViewer` app per DATA_MODEL.md §7 and FILE_EXPLORER_SPEC.md's Projects folder.
**Scope:** `project-viewer` generic app component, `projects.ts` content file (placeholder entries per CONTENT_SCHEMA.md §3.2 minimum seed set), Desktop/Start Menu/File Explorer/Command Prompt (`projects` command) all correctly surfacing the same registry.
**Dependencies:** Phase 6, Phase 7, Phase 10.
**Files/modules involved:** `src/apps/project-viewer/*`, `src/content/projects.ts`.
**Expected behavior:** Each project appears consistently across every access point; opening a project shows name/description/stack/links/screenshots (screenshots may show a placeholder-image state until real assets are supplied) with working repo/deployment links (`noopener,noreferrer`, new tab).
**Acceptance criteria:** The explicit extensibility acceptance test from FILE_EXPLORER_SPEC.md §7 (add a test project record, confirm it appears everywhere with zero component changes) passes.
**Edge cases:** A project missing optional fields (no `deploymentUrl`, no `screenshots`) — viewer renders gracefully, omitting absent sections rather than showing broken placeholders.
**Testing requirements:** Component test with a fully-populated and a minimal `ProjectRecord` fixture; extensibility regression test as described above.
**Performance considerations:** Screenshot images should be lazy-loaded/optimized once real assets exist (structural readiness now, optimization detail tracked in PERFORMANCE.md).
**Security considerations:** External links use `noopener,noreferrer`.
**What must NOT be implemented yet:** Real project screenshots/final content (placeholders remain until supplied by [YOUR NAME]).
**Definition of done:** Project system is fully data-driven, consistent across all four access surfaces, and passes the extensibility test.
**Downstream dependents:** None blocking.

---

## Phase 16 — Audio / XP System Sounds

**Objective:** Implement the Audio Manager per AUDIO_SPEC.md in full and retrofit all prior phases' interaction points with the defined sound triggers.
**Scope:** `AudioManager` module, Sound Registry, autoplay-safe initialization (§3 of that spec), full event→sound wiring table (§4), volume/mute integration finalized against Settings Store (completing the Phase 11 structural readiness note).
**Dependencies:** Phase 11 (Settings Store), and touches nearly every prior phase's components to add trigger calls (Window Manager for open/close, Start Menu for open/close, a shared click-sound hook for icons/buttons).
**Files/modules involved:** `src/audio/audio-manager.ts`, `src/audio/sound-registry.ts`, small edits across `src/shell/*` and `src/apps/*` call sites.
**Expected behavior:** All defined events in AUDIO_SPEC.md §4 produce sound (when enabled/volume>0); muting/volume changes apply globally and immediately.
**Acceptance criteria:** Manual/automated verification of the autoplay-safe queuing behavior (§3) — startup sound is not silently lost if no gesture occurred before boot completed.
**Edge cases:** Rapid repeated triggers (§6 concurrency policy) verified not to cause audio glitching/stacking issues.
**Testing requirements:** Unit tests for gain-mapping math and mute/enable short-circuit logic; a manual QA pass (audio is hard to fully automate-test) documented in TEST_PLAN.md.
**Performance considerations:** Lazy-decode strategy (§6 of that spec) verified — game-specific sounds not decoded until their app mounts.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Game-specific sound events wire in naturally during Phases 17–19 (Snake/Minesweeper/DOOM), which are downstream of this phase.
**Definition of done:** Centralized audio system fully replaces any ad-hoc placeholder sound calls (there should be none, since no phase before this one was permitted to add its own audio playback — if any were added as temporary stubs, they must be migrated now).
**Downstream dependents:** Phase 17, 18, 19 (game sound events), Phase 20 (BSOD sound).

---

## Phase 17 — Snake

**Objective:** Implement Snake per GAME_SPEC.md §2.
**Scope:** Full playable game, canvas-based (per recommendation), fixed window size, pause-on-minimize, sound events wired to Phase 16's Audio Manager, desktop/Start Menu registration.
**Dependencies:** Phase 6, Phase 16.
**Files/modules involved:** `src/apps/games/snake/*`.
**Expected behavior/Acceptance criteria/Edge cases:** Per GAME_SPEC.md §2.3 exactly.
**Testing requirements:** Unit tests for collision/growth/scoring logic (pure functions separated from rendering); interaction test for input handling and pause-on-minimize.
**Performance considerations:** Fixed-timestep loop verified not to leak `requestAnimationFrame` callbacks after window close (matches the general app-teardown discipline established for DOOM in GAME_SPEC.md §4.3, applied here too even though Snake is much lighter-weight).
**Security considerations:** None specific.
**What must NOT be implemented yet:** N/A.
**Definition of done:** Snake is genuinely, fully playable and passes all acceptance criteria.
**Downstream dependents:** None blocking.

---

## Phase 18 — Minesweeper

**Objective:** Implement Minesweeper per GAME_SPEC.md §3.
**Scope:** Full playable game, DOM-grid based, post-first-click mine placement, flood-fill reveal, flag/reveal interactions, HUD (mine counter, timer), desktop/Start Menu registration, sound events.
**Dependencies:** Phase 6, Phase 16.
**Files/modules involved:** `src/apps/games/minesweeper/*`.
**Expected behavior/Acceptance criteria/Edge cases:** Per GAME_SPEC.md §3.3 exactly.
**Testing requirements:** Unit tests for board-generation (post-first-click safety), flood-fill algorithm correctness, and win/loss detection (pure logic, highly testable in isolation).
**Performance considerations:** Flood-fill on large boards should not block the main thread noticeably (unlikely an issue at classic Minesweeper board sizes, but worth a note).
**Security considerations:** None specific.
**What must NOT be implemented yet:** Difficulty selector (deferred per §3.1 decision, unless resolved otherwise before this phase begins).
**Definition of done:** Minesweeper is genuinely, fully playable with correct classic rules and passes all acceptance criteria.
**Downstream dependents:** None blocking.

---

## Phase 19 — DOOM Integration

**Objective:** Integrate a genuinely playable DOOM per GAME_SPEC.md §4 (Option A: existing open-source WASM port + shareware WAD).
**Scope:** Lazy-loaded `DoomApp` component, isolated canvas rendering scoped to its window, full mount/pause/resume/teardown lifecycle discipline (§4.3), error boundary isolation, licensing attribution, touch/mobile handling decision resolved (§4.4).
**Dependencies:** Phase 6, Phase 16, and is the most technically risky phase in the entire roadmap — recommend a technical spike/prototype sub-step before full integration, even though this document doesn't subdivide it into a separate numbered phase (a spike is investigative, not a shippable increment).
**Files/modules involved:** `src/apps/games/doom/*`.
**Expected behavior/Acceptance criteria/Edge cases:** Per GAME_SPEC.md §4.5 exactly.
**Testing requirements:** Manual QA heavy for this phase given engine-internal behavior is largely opaque to the shell; automated tests focus on the integration boundary (mount/unmount lifecycle, error boundary triggering on a simulated load failure, window minimize/restore not crashing the engine) rather than DOOM's internal gameplay logic itself.
**Performance considerations:** Profile bundle size impact (must be fully code-split, zero impact on initial load per TRD.md §5) and runtime performance once running.
**Security considerations:** WASM execution is sandboxed by the browser by default; no additional concerns beyond standard practice; licensing compliance (§4.2) is the primary non-technical risk here, not security in the traditional sense.
**What must NOT be implemented yet:** Any commercial WAD bundling; any attempt at Option B (in-house Emscripten compilation) unless Option A is proven infeasible during the spike.
**Definition of done:** DOOM shareware episode is genuinely playable, correctly isolated/lazy-loaded, and survives minimize/restore/close without corrupting shell state.
**Downstream dependents:** None blocking, but this phase's risk should be flagged early (see README.md risk list) and potentially attempted earlier in the overall timeline if the team wants to de-risk it sooner than its dependency order strictly requires — see README.md's recommended implementation order notes.

---

## Phase 20 — Easter Eggs / Blue Screen

**Objective:** Implement the Recycle Bin app and Blue Screen easter egg per SYSTEM_DESIGN.md §12–13.
**Scope:** `recycle-bin` app rendering curated `RecycleBinContent`; BSOD trigger mechanism (final [DECISION REQUIRED] from SYSTEM_DESIGN.md §13 resolved here), full-viewport takeover component, simulated-crash window-closure behavior, simulated-reboot animation returning to desktop.
**Dependencies:** Phase 6, Phase 7 (Recycle Bin may reference filesystem-adjacent concepts loosely), Phase 16 (BSOD sound).
**Files/modules involved:** `src/apps/recycle-bin/*`, `src/shell/bsod/*` (a shell-level overlay, not a windowed "app" itself, since it takes over the full viewport outside the normal window system).
**Expected behavior:** Recycle Bin opens showing curated flavor content; BSOD trigger (per resolved decision) reliably and only fires via its intended discoverable mechanism, never accidentally during normal use; BSOD sequence auto-recovers back to a clean desktop.
**Acceptance criteria:** BSOD trigger is verified NOT to fire from any common/expected interaction path (explicit negative test); recovery correctly returns to a usable desktop with no lingering broken state (all windows closed, taskbar clean, settings intact).
**Edge cases:** Triggering BSOD while other windows are open (verify clean simulated-crash closure of all of them); triggering it a second time shortly after recovery (should work again, not be a one-time-only easter egg unless intentionally designed that way — [DECISION REQUIRED, minor]).
**Testing requirements:** E2E test simulating the exact trigger sequence and verifying full recovery; explicit negative tests for accidental-trigger prevention.
**Performance considerations:** None significant.
**Security considerations:** None specific.
**What must NOT be implemented yet:** Additional easter eggs beyond Recycle Bin + BSOD are optional/additive and may be layered in during Phase 21 polish or later, per the extensibility principle — not required to exhaustively implement every possible easter egg idea in this phase.
**Definition of done:** Recycle Bin and BSOD both function correctly and BSOD passes both positive (triggers correctly) and negative (doesn't trigger accidentally) test cases.
**Downstream dependents:** None blocking.

---

## Phase 21 — Polish / Accessibility / Responsiveness

**Objective:** Address the Adapted/touch mode (UI_UX_SPEC.md §8) comprehensively, close out any deferred [DECISION REQUIRED] accessibility items, and do a full pass against UI_UX_SPEC.md §9's accessibility requirements across every app built so far.
**Scope:** Adapted Mode implementation (maximized-by-default windows, full-screen/bottom-sheet Start Menu, simplified taskbar interaction on small viewports), full keyboard-navigation audit, focus-trap verification on all dialogs, color-contrast audit, reduced-motion audit across every animated surface introduced since Phase 1.
**Dependencies:** All prior phases (this is explicitly a cross-cutting pass, not a new subsystem).
**Files/modules involved:** Touches shell and app components broadly; primarily CSS/responsive-breakpoint work plus targeted accessibility fixes.
**Expected behavior:** Site is fully usable (not merely "not broken") on a representative small/touch viewport; keyboard-only navigation can reach and operate every interactive element in the product.
**Acceptance criteria:** A full manual accessibility walkthrough (documented in TEST_PLAN.md) passes; automated accessibility linting (e.g., axe-core integration in tests) reports no critical violations.
**Edge cases:** DOOM's touch-control decision (GAME_SPEC.md §4.4) finalized here if not already resolved earlier.
**Testing requirements:** Cross-device manual QA pass; automated a11y test suite run against key screens (desktop, an open window, Start Menu, Command Prompt).
**Performance considerations:** None beyond what's covered in Phase 22.
**Security considerations:** None specific.
**What must NOT be implemented yet:** N/A — this is a completion/hardening phase.
**Definition of done:** Product is usable and accessible across the full defined browser/device support matrix (TRD.md §4).
**Downstream dependents:** Phase 23.

---

## Phase 22 — Performance Optimization

**Objective:** Execute the full strategy in PERFORMANCE.md against the now-complete feature set.
**Scope:** Bundle analysis and code-splitting audit (verify DOOM/game assets are correctly isolated per TRD.md §5), image/asset optimization pass (once real assets exist — may be partially deferred if real assets aren't supplied yet, in which case this phase optimizes the pipeline/placeholders and is revisited when real assets land), render-performance profiling with multiple windows open, memory-leak audit (especially DOOM's mount/unmount per GAME_SPEC.md §4.5's leak-check requirement).
**Dependencies:** All prior phases.
**Files/modules involved:** Broad, build-config-focused (Vite config, lazy-loading boundaries) plus targeted component-level fixes where profiling identifies issues.
**Expected behavior:** Meets or exceeds the performance budgets defined in PERFORMANCE.md.
**Acceptance criteria:** Lighthouse/equivalent performance audit meets defined thresholds (see PERFORMANCE.md); no memory growth over repeated open/close cycles of any app, verified via browser dev tools heap snapshots for at least Window Manager cycling and DOOM specifically.
**Edge cases:** Stress test — opening/closing many windows rapidly in sequence; verify no store/listener leaks accumulate.
**Testing requirements:** Performance regression tests where feasible (bundle size budgets enforced in CI); manual profiling documented.
**Performance considerations:** This entire phase IS the performance consideration.
**Security considerations:** None specific.
**What must NOT be implemented yet:** N/A.
**Definition of done:** All PERFORMANCE.md budgets are met; no known memory leaks remain open.
**Downstream dependents:** Phase 23.

---

## Phase 23 — Production Testing & Deployment

**Objective:** Final hardening, full regression pass, and production deployment to Vercel.
**Scope:** Full TEST_PLAN.md execution across all categories (unit/integration/UI/interaction/performance/accessibility/cross-browser/regression), production environment configuration, deployment pipeline verification, final asset-manifest audit (confirm every `[ASSET: ...]` token is either resolved to a real asset or intentionally deferred with a tracked follow-up, not silently missing), final security review against SECURITY.md.
**Dependencies:** All prior phases.
**Files/modules involved:** CI/CD config, Vercel project configuration, final QA pass across the entire application.
**Expected behavior:** Production deployment is stable, performant, and matches all documented specs.
**Acceptance criteria:** Full TEST_PLAN.md suite passes; production smoke test (a scripted walk through every major user journey from PRD.md §5) passes on the live deployed URL.
**Edge cases:** Production-specific concerns (correct base URL/routing config, correct caching headers for static assets, environment-specific config if any).
**Testing requirements:** Full regression suite, plus a manual production smoke test.
**Performance considerations:** Final production Lighthouse audit.
**Security considerations:** Final SECURITY.md checklist review (e.g., confirm no accidental exposure of any dev-only debug affordances in production build).
**What must NOT be implemented yet:** N/A — this is the final phase.
**Definition of done:** Production deployment is live, passes full test suite, and meets every acceptance criterion enumerated across all preceding phases.
**Downstream dependents:** None — this is the terminal phase for v1.

---

## Phase Numbering Note

This phase list intentionally follows the PRD's suggested structure closely, since the dependency order it implies (foundation → boot → desktop → windowing → shell chrome → content apps → games → polish) is sound and was validated against ARCHITECTURE.md's system ownership model during this document's authoring. No reordering was necessary beyond the minor clarifications noted inline above (e.g., Phase 1/2 tight coupling, DOOM's recommended early risk-spike).
