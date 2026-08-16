# GAME_SPEC.md — Snake, Minesweeper, DOOM

**Status:** Source of truth for game requirements and integration architecture. Does not contain implementation code. Each game is registered as a standard app in the Application Registry (DATA_MODEL.md §1) and rendered inside a normal `WindowFrame`.

---

## 1. Common Requirements (all games)

- Each game MUST be a fully self-contained app component conforming to the standard `AppComponentProps` contract (ARCHITECTURE.md §4) — no bespoke window-manager integration.
- Each game MUST appear on the Desktop and in the Start Menu (`category: 'game'` in `AppDefinition`, and a "Games" submenu entry in `StartMenuConfig`).
- Each game MUST be minimizable/restorable/closable via the standard Window Manager; on minimize, gameplay MUST pause (no background CPU/animation-frame burn while hidden) — implemented via a visibility/focus-aware pause hook shared across games where feasible.
- On restore, the game resumes from paused state (not reset), except where explicitly noted (DOOM's own internal pause behavior is engine-dependent, see §4).
- Each game's sound events route through the central Audio Manager (AUDIO_SPEC.md) — no independent audio handling.
- Each game's own internal state (score, board state, in-progress run) persists only for the lifetime of that window instance in v1; closing the window resets it. Cross-session high-score persistence is a **[DECISION REQUIRED — recommended stretch goal]**, implementable later via the same `localStorage` pattern as Settings without architectural change.

## 2. Snake

### 2.1 Requirements
- Classic grid-based snake movement: arrow keys / WASD control direction; snake grows on eating food; game ends on wall or self-collision (walls = window/board edges, not full-viewport — this is a windowed app, not fullscreen).
- Must be **genuinely playable**: real-time tick-based movement loop, collision detection, score tracking, restart-on-game-over affordance.
- Difficulty/speed may increase with score [DECISION REQUIRED: exact curve — non-blocking polish detail].

### 2.2 Technical Approach
- Recommended: HTML5 `<canvas>` rendering with a fixed-timestep game loop (`requestAnimationFrame` + accumulator pattern, decoupled from render rate for consistent speed across displays). A DOM-grid (absolutely positioned divs) alternative is acceptable for simplicity but canvas is preferred for smoother rendering and easier snake-body rendering. [DECISION REQUIRED: canvas vs. DOM grid — recommend canvas.]
- Board size should scale to the window's resizable/fixed bounds; recommend a **fixed default window size, resizable disabled** for Snake in `AppDefinition.defaultWindow` (classic simple-game convention; avoids re-deriving grid dimensions on resize).
- No external dependencies required; a from-scratch implementation is appropriate and consistent with the user's stated preference for minimal dependencies (per memory of prior project patterns) and PRD's "avoid unnecessary dependencies."

### 2.3 Acceptance Criteria
- Arrow/WASD input reliably changes direction without allowing instant 180° reversal into self.
- Score increments correctly per food eaten; food respawns at a valid unoccupied cell.
- Game-over state is clearly presented with a restart affordance, without requiring the window to be closed/reopened.
- Pausing on minimize verified (no movement/score change while minimized).

## 3. Minesweeper

### 3.1 Requirements
- Classic grid of hidden cells; left-click reveals, right-click (or long-press equivalent for touch) flags; numbers indicate adjacent mine counts; flood-fill reveal for zero-adjacency cells; win when all non-mine cells are revealed; lose on revealing a mine.
- Must be **genuinely playable** with correct classic rules, not a simplified/fake approximation.
- Difficulty presets (e.g., Beginner/Intermediate/Expert classic XP dimensions) recommended: [DECISION REQUIRED: include difficulty selector in MVP or ship one fixed board size — recommend one fixed size for MVP, difficulty selector as polish].
- A visible mine/flag counter and a timer, matching classic Minesweeper HUD conventions, is expected for authenticity.

### 3.2 Technical Approach
- DOM-grid rendering (a grid of styled buttons/cells) is entirely appropriate here — no canvas required; Minesweeper's interaction model (discrete cell clicks) doesn't benefit from canvas the way Snake's continuous movement does.
- Core logic (board generation with mine placement *after* first click to guarantee a safe/reasonable first reveal — matching classic Minesweeper convention, avoids an unfair instant loss) implemented as pure functions independent of rendering, to keep it testable (see TEST_PLAN.md).

### 3.3 Acceptance Criteria
- First click is never a mine (mines placed post-first-click).
- Flood-fill reveal correctly cascades through contiguous zero-adjacency regions.
- Flagging toggles correctly and prevents accidental reveal of flagged cells.
- Win/loss states are unambiguous and offer a restart affordance.

## 4. DOOM

### 4.1 Constraint Restated
Per TRD.md/PRD.md: DOOM must NOT be assumed buildable from scratch as an ordinary React feature. This section documents the real technical/legal landscape and the recommended integration strategy. **No implementation occurs at the documentation stage.**

### 4.2 Licensing Landscape
- id Software released the DOOM **source code** (the engine) under GPL, which is why numerous open-source WebAssembly/JS ports exist. The **engine/code** being open-source does **not** mean the **game data** (WAD files containing levels, textures, sounds) is free to redistribute.
- The original commercial WAD (`DOOM.WAD`) is still copyrighted by id Software/Bethesda/ZeniMax and may not be legally bundled without a license.
- id Software also released the **shareware** episode as `DOOM1.WAD`, which has historically been freely distributable for non-commercial use as shareware — this is the standard legally-safe path used by essentially every "DOOM in the browser" demo project. **Recommended approach: use only the shareware WAD**, sourced from a legitimate distribution, and clearly attribute id Software. [DECISION REQUIRED: final confirmation of shareware WAD's redistribution terms at implementation time, since licensing understanding here reflects long-standing community practice but should be re-verified before shipping, not assumed permanently unchanged.]
- Do not bundle any WAD file whose provenance/license cannot be clearly established.

### 4.3 Technical Integration Options

| Option | Description | Trade-offs |
|---|---|---|
| **A. Existing WASM port (e.g., a maintained "DOOM in browser" WASM/Emscripten build)** | Compile/embed a pre-existing open-source WASM DOOM port (several exist in the open-source ecosystem, built with Emscripten from the GPL'd source) | **Recommended.** Fastest path to genuinely playable DOOM; well-trodden; must isolate it in its own bundle chunk (TRD.md §2 point 5) and its own iframe or tightly-scoped container to avoid CSS/JS global collisions with the shell. |
| **B. Build/compile the engine in-house from GPL source via Emscripten** | Do the Emscripten compilation work as part of this project | Significant engineering effort disproportionate to a portfolio feature; only justified if it becomes itself a portfolio talking point. Not recommended for MVP timeline. |
| **C. Link out to an existing hosted DOOM-in-browser demo** | Desktop icon opens the Browser app pointed at a third-party hosted DOOM instance | Fails PRD's "genuinely playable...installed application, integrated with window manager" requirement in spirit (it would just be an iframe of someone else's site, likely also blocked by X-Frame-Options like other external sites) — **not recommended** as the primary solution, but acceptable as an interim placeholder during early phases if Option A proves time-consuming. |

**Recommendation:** Option A. Encapsulate the chosen WASM build inside a dedicated `DoomApp` component that:
- Lazy-loads the WASM/JS bundle only on first launch (`React.lazy` + dynamic `import()`), never part of the initial page bundle.
- Renders the engine into a `<canvas>` scoped strictly within its `WindowFrame` bounds.
- Wraps the mount/unmount lifecycle carefully: the engine must be fully torn down (audio context, event listeners, animation loop) when its window is **closed** (not merely minimized) to avoid leaking global listeners/CPU usage into the rest of the shell. Minimize should pause, not destroy, per §1.
- Is isolated behind its own error boundary (ARCHITECTURE.md §6) so a WASM load failure shows a contained "This application could not start" message rather than crashing the shell.

### 4.4 Browser Compatibility Considerations
- WebAssembly is broadly supported in evergreen browsers (Chrome/Firefox/Safari/Edge) — no major compatibility gap expected for the target browser matrix (TRD.md §4).
- Mobile/touch: DOOM's control scheme (WASD + mouse-look, or arrow keys + strafe) does not translate cleanly to touch. Recommended: DOOM is either **not offered** in Adapted/touch mode (UI_UX_SPEC.md §8), or offered with a clearly-labeled "best experienced on desktop" notice plus a basic on-screen touch control overlay if the chosen WASM port supports remapping. [DECISION REQUIRED at Phase 19.]
- Performance: WASM DOOM is lightweight by modern standards (it's a 1993 engine) and should run acceptably even on modest hardware; still must be profiled once integrated (PERFORMANCE.md).

### 4.5 Acceptance Criteria (for the eventual implementation phase, documented now for completeness)
- DOOM launches from Desktop/Start Menu into a standard window.
- Shareware episode is genuinely playable: movement, shooting, level progression function correctly.
- Window can be minimized (pausing the engine) and restored (resuming) without a crash or state corruption.
- Closing the window fully tears down engine resources (verified via a memory/listener leak check in TEST_PLAN.md).
- No copyrighted commercial WAD is bundled; attribution to id Software is present (e.g., in an "About" area of the app or the project's licensing notes).

## 5. Document Authority

GAME_SPEC.md governs game-specific requirements and DOOM's integration strategy specifically. It defers to WINDOW_MANAGER_SPEC.md for generic windowing behavior and to AUDIO_SPEC.md for sound integration; it does not redefine either.
