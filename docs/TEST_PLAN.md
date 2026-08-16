# TEST_PLAN.md — Testing Strategy

**Status:** Source of truth for HOW correctness is verified. Complements per-phase acceptance criteria in DEVELOPMENT_PHASES.md with the overall testing approach and tooling.

---

## 1. Testing Tooling (per TRD.md §1.1)

- **Unit tests:** Vitest — pure logic (window store transitions, filesystem traversal, command parser, game logic, gain-mapping math).
- **Component tests:** React Testing Library (with Vitest) — component rendering/interaction in isolation.
- **E2E/interaction tests:** Playwright — full-flow scenarios across the running app (boot → desktop → open app → interact → close), drag/resize gestures, keyboard navigation.
- **Accessibility tests:** axe-core integrated into Playwright or RTL test runs against key screens.
- **Visual/manual QA:** For audio correctness, XP visual authenticity fidelity, and DOOM's internal gameplay — documented manual test scripts, not automatable with reasonable effort.

## 2. Test Categories & Coverage Expectations

### 2.1 Unit Tests
Required for: Window Manager store transitions (WINDOW_MANAGER_SPEC.md §2–10 edge cases), Virtual Filesystem traversal helpers, Command Prompt parser + each `CommandDefinition`'s `execute` logic, Settings Store persistence/migration logic, Snake collision/scoring logic, Minesweeper board-generation/flood-fill/win-loss logic, Audio Manager gain-mapping and mute short-circuit logic.
Target: every pure-logic module should have tests covering its documented edge cases from the relevant spec, not just the happy path.

### 2.2 Component Tests
Required for: every app component's core rendering (given mock data/props, renders expected structure), Desktop icon rendering from config, Taskbar rendering from window list, Start Menu rendering from config, dialog/error-boundary components.

### 2.3 Interaction/E2E Tests
Required scenarios (minimum set, one Playwright spec per row is a reasonable organization):

| Scenario | Verifies |
|---|---|
| Full boot → desktop | Phase 1/2 gate correctness |
| Open app via Desktop icon, drag, minimize, restore, maximize, restore, close | Full window lifecycle (WINDOW_MANAGER_SPEC.md) |
| Open same app via Desktop and Start Menu, confirm identical resulting state | No duplicated launch logic (ARCHITECTURE.md §4) |
| Open multiple windows, verify z-index/focus correctness by clicking between them | Focus management |
| Taskbar button toggle behavior (focus/minimize/restore) | UI_UX_SPEC.md §4 |
| Navigate File Explorer through several folder levels, verify Back/Forward/Up | FILE_EXPLORER_SPEC.md §7 |
| Command Prompt: run each MVP command, verify expected output; run unknown command, verify error message | COMMAND_PROMPT_SPEC.md §4/§6 |
| Command Prompt `dir`/`cd` vs. File Explorer at equivalent path produce matching results | Cross-system consistency |
| Notepad: type, select, cut/copy/paste, attempt close with unsaved changes, confirm dialog, cancel and confirm both paths | SYSTEM_DESIGN.md §8 |
| Control Panel: adjust brightness/volume/toggles, reload page, verify persistence | SETTINGS_SPEC.md §3 |
| Browser: navigate to a known-blocked domain, verify fallback UX and working "Open in New Tab" | UI_UX_SPEC.md §10 |
| Play Snake to a game-over state, verify restart works | GAME_SPEC.md §2.3 |
| Play Minesweeper: verify first-click safety, flood-fill, win and loss paths | GAME_SPEC.md §3.3 |
| Launch DOOM, verify it loads and is interactive, minimize/restore without crash, close and verify teardown (no lingering listeners via a heap/listener check where feasible) | GAME_SPEC.md §4.5 |
| Trigger BSOD via its defined mechanism, verify full-viewport takeover and recovery to clean desktop | SYSTEM_DESIGN.md §13 |
| Attempt to trigger BSOD via unrelated common interactions (negative test) | Accidental-trigger prevention |
| Full keyboard-only navigation through: Desktop icons → open an app → operate its window controls → Start Menu → Control Panel | UI_UX_SPEC.md §9 |
| `prefers-reduced-motion` simulated on, verify all listed animations are reduced/removed | UI_UX_SPEC.md §9 |
| Small/touch viewport: verify Adapted Mode renders correctly and remains operable | UI_UX_SPEC.md §8 |

### 2.4 Performance Tests
- Bundle-size budget checks in CI (e.g., a max-size assertion on the initial JS bundle, separate from lazily-loaded chunks like DOOM) — see PERFORMANCE.md for exact budgets.
- Manual Lighthouse/equivalent audits at Phase 22 and Phase 23.

### 2.5 Accessibility Tests
- Automated axe-core scans against: Desktop, an open standard window, Start Menu open, Control Panel, Command Prompt.
- Manual screen-reader spot-check (at least one pass with a common screen reader, e.g., VoiceOver or NVDA) on the core navigation flow — documented as a manual QA script since full automation of screen-reader behavior is impractical.

### 2.6 Cross-Browser Tests
- Playwright's multi-browser projects (Chromium, Firefox, WebKit) run against the core interaction scenarios in §2.3 at minimum for the primary flows (boot, window lifecycle, one app open/close cycle) — not necessarily every single scenario on every browser, to keep CI time reasonable; full manual cross-browser QA pass before Phase 23 production release covers the remainder.

### 2.7 Regression Tests
- Every bug fixed post-MVP should be accompanied by a regression test reproducing it, per CONTRIBUTING.md conventions.

## 3. What Is Explicitly NOT Required to Be Automated

- DOOM's internal gameplay correctness (movement/shooting/level logic) — this is the responsibility of the underlying open-source engine, not this project; only the integration boundary is tested here.
- Pixel-perfect visual fidelity to real Windows XP — verified via manual visual review against reference images, not automated visual-regression testing for MVP (automated visual regression, e.g., Percy/Chromatic, is a reasonable future addition but not required — [DECISION REQUIRED] if adopted later).
- Exact audio waveform/quality verification — manual listening QA only.

## 4. CI Gating

Recommended CI pipeline stages (per CONTRIBUTING.md, referenced here for testing context): lint → typecheck → unit tests → component tests → build → (a subset of) E2E tests on PR; full E2E + cross-browser + accessibility suite run on merge to main or on a scheduled basis if full-suite runtime is too long for per-PR gating. [DECISION REQUIRED: exact CI time budget and which E2E subset runs per-PR vs. nightly.]

## 5. Document Authority

TEST_PLAN.md governs testing strategy and required coverage. It defers to each *_SPEC.md document for the specific acceptance criteria being tested — this document organizes *how* those criteria are verified, not what they are.
