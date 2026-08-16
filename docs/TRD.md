# TRD.md — Technical Requirements Document

**Status:** Source of truth for TECHNOLOGY and technical constraints. Defines *what stack and technical rules* implementation must follow. Does not define product behavior (PRD.md) or system-internal design (ARCHITECTURE.md, SYSTEM_DESIGN.md).

---

## 1. Stack Evaluation

The user-proposed stack is evaluated below. Verdict per item: **Accept**, **Accept with conditions**, or **Reject/Replace**.

| Layer | Proposed | Verdict | Rationale |
|---|---|---|---|
| Framework | React 18+ | **Accept** | Component model fits app/window composition well; large ecosystem for canvas/game wrappers. |
| Language | TypeScript | **Accept** | Non-negotiable for a project this structurally complex — application registry, filesystem model, and command system all benefit from static typing to keep an AI coding agent's output consistent across phases. |
| Build tool | Vite | **Accept** | Fast dev iteration, native TS/JSX support, easy code-splitting for lazy-loaded apps (esp. DOOM). |
| Styling | Tailwind CSS + custom CSS | **Accept with conditions** | Tailwind is fine for layout/utility (taskbar flex layouts, spacing). XP-specific chrome (title bars, 3D borders, button bevels, classic scrollbars) is highly detail-specific and is better hand-authored as a dedicated `xp-ui.css` / CSS-variable-driven theme layer rather than fought into Tailwind utilities. Both coexist; Tailwind must not be used to approximate bespoke pixel-level XP chrome. |
| State | Zustand | **Accept** | Lightweight, no boilerplate, good fit for multiple independent stores (window manager, settings, filesystem, audio) without a single monolithic Redux tree. Avoids overengineering per NFR-3/implementation principles. |
| Windowing | Custom window manager; react-rnd evaluated | **Accept with conditions** | A **custom** window manager is required regardless, because XP-specific behaviors (snap, taskbar z-index coordination, minimize-to-taskbar animation anchor, maximize semantics) are bespoke. `react-rnd` MAY be used internally *only* for the low-level drag/resize pointer-math primitive, wrapped by the custom window manager — it must never be exposed directly to application authors. [DECISION REQUIRED: evaluate react-rnd vs. hand-rolled pointer-event dragging during Phase 3; hand-rolled is acceptable and may reduce dependency surface — see WINDOW_MANAGER_SPEC.md.] |
| Graphics | HTML/CSS/SVG/Canvas | **Accept** | Desktop chrome/icons: HTML+CSS+SVG. Snake/Minesweeper: Canvas or DOM-grid (decided per-game in GAME_SPEC.md). DOOM: isolated iframe/wasm module, not a canvas the shell manages directly. |
| Games | React/Canvas; DOOM separate | **Accept** | See GAME_SPEC.md for DOOM's isolation strategy. |
| Audio | Web Audio API | **Accept** | Needed for precise volume/gain control centrally, rather than N independent `<audio>` tags. |
| Deployment | Vercel | **Accept** | Static/SPA hosting fits a fully client-side app; no backend is required for v1 per PRD §10 Out of Scope. |

### 1.1 Additional Technical Decisions

- **Routing:** A minimal client-side router (e.g., for deep-linking to a specific app/window state via URL, such as `?app=projects&project=audioflow`) is recommended for shareability, but is **not required for MVP**. [DECISION REQUIRED — Phase 6 or later.]
- **Persistence:** `localStorage` for settings and lightweight state (see SETTINGS_SPEC.md). No IndexedDB required for v1 unless Notepad "save to virtual filesystem" scope requires larger storage (see SYSTEM_DESIGN.md §Notepad MVP boundary).
- **Testing tooling:** Vitest (unit) + React Testing Library (component) + Playwright (E2E/interaction). See TEST_PLAN.md.
- **Linting/formatting:** ESLint + Prettier, enforced in CI before merge (see CONTRIBUTING.md).

## 2. Technical Constraints (Hard Rules)

1. **No arbitrary code execution.** The Command Prompt is a closed virtual interpreter operating only over an in-memory command registry and virtual filesystem. It must never `eval()` visitor input as JavaScript, must never issue real network/file-system calls beyond what's explicitly whitelisted (e.g., opening a real URL in a new tab is allowed and is not "arbitrary execution").
2. **No copyrighted asset bundling without a license path.** All Windows XP visual/audio assets are referenced as placeholders (see ASSET_MANIFEST.md) until legally sourced or recreated originals are supplied.
3. **No iframe-embedding workarounds that defeat browser security.** If a target site sends `X-Frame-Options`/CSP disallowing framing, the Browser app must detect and gracefully degrade (see UI_UX_SPEC.md), not attempt server-side proxying/rewriting to bypass it, unless a future [DECISION REQUIRED] explicitly approves a same-origin proxy for portfolio-controlled content only.
4. **Client-only architecture for v1.** No backend service is assumed. If a backend is later introduced (e.g., contact form relay, analytics), it must be additive and not required for core OS functionality to work.
5. **Bundle-splitting is mandatory** for any heavy, optional subsystem: DOOM engine/wasm, Minesweeper/Snake assets if large, and any large sound packs. These must not block Time-To-Interactive for the desktop shell.
6. **Reduced motion compliance.** Any animation (window open/close, minimize genie-effect, boot sequence) must have a reduced/instant alternative respecting `prefers-reduced-motion`.

## 3. Environments

- **Local dev:** Vite dev server, hot-module reload.
- **Preview:** Vercel preview deployments per PR.
- **Production:** Vercel production deployment from main branch, static export (no SSR required — this is a fully client-rendered simulated OS; SSR provides no meaningful benefit here and would complicate window-manager state that only makes sense client-side).

## 4. Browser Support Matrix

| Browser | Support Level |
|---|---|
| Chrome/Edge (evergreen) | Full |
| Firefox (evergreen) | Full |
| Safari (evergreen, desktop) | Full, with Web Audio API quirks tested explicitly |
| Mobile Safari/Chrome | Adapted mode (see UI_UX_SPEC.md §Responsive/Touch Strategy) — not full free-form windowing |
| IE / legacy Edge | Not supported (explicitly out of scope; ironic given subject matter, but not a technical requirement) |

## 5. Performance Budgets (initial targets — refine in PERFORMANCE.md)

- Boot sequence must be visually present within ~1s of navigation even on throttled 3G-equivalent (it *is* the loading screen, so this is largely automatic, but the boot visuals themselves must be lightweight — no large video files).
- Desktop interactive (icons clickable) within a target budget defined in PERFORMANCE.md, excluding lazy-loaded heavy apps.
- DOOM and other heavy assets must not be part of the initial JS bundle; loaded on first launch only.

## 6. Technical Risk Flags (elaborated in SECURITY.md, GAME_SPEC.md, README.md risk list)

- DOOM integration (licensing + browser compatibility + performance).
- Third-party site embedding restrictions (Browser app).
- Audio autoplay restrictions in modern browsers (boot startup sound may require a user gesture — must be designed around, not ignored).
- Mobile/touch adaptation of a fundamentally desktop-window-based interaction model.

## 7. Document Authority

TRD.md governs technology/tooling decisions. It must not contradict PRD.md's functional requirements; where a technology constraint makes a PRD requirement infeasible as stated, that conflict is flagged [DECISION REQUIRED] and resolved before the relevant phase begins.
