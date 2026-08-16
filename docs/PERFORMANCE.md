# PERFORMANCE.md — Performance Strategy

**Status:** Source of truth for performance budgets and optimization strategy across the project's lifecycle (referenced primarily by Phase 22, but applicable throughout).

---

## 1. Guiding Principle

The product's richness (multiple simultaneous windows, animations, audio, games, DOOM) must never come at the cost of a visitor's first impression. The boot sequence conveniently doubles as a loading gate (SYSTEM_DESIGN.md §1.2), but everything beyond the initial shell must be aggressively lazy-loaded so that "the OS boots fast" and "DOOM is heavy" are not in tension.

## 2. Performance Budgets (initial targets — to be measured/refined during Phase 22, not treated as immutable)

| Metric | Target |
|---|---|
| Initial JS bundle (shell: boot, desktop, window manager, taskbar, Start Menu, core apps registry — excluding lazily-loaded apps) | [DECISION REQUIRED: e.g., ≤ 250KB gzipped as a starting target] |
| Time to boot sequence visible | < 1s on a throttled "Fast 3G"-equivalent profile |
| Time to interactive desktop (after boot completes) | < 1s beyond boot completion on the same profile |
| DOOM bundle (lazy chunk) | Loaded only on first DOOM launch; not counted against initial budget, but should itself load within a reasonable window (a few seconds) on a typical broadband connection, with a loading indicator shown inside its window while it does |
| Per-window open/close/drag interaction | Should feel immediate (no perceptible input lag) — target 60fps during drag/resize gestures on typical modern hardware |

## 3. Code-Splitting Strategy

- Every app registered in the Application Registry that is not part of the "core shell experience" is a candidate for `React.lazy` + dynamic `import()`. At minimum, this MUST apply to: DOOM (largest, most critical), and SHOULD apply to Minesweeper/Snake if their bundled assets prove non-trivial in size (measured, not assumed).
- Notepad, Command Prompt, File Explorer, Control Panel, Browser, and the content viewers (Resume, Project, Navigation Guide) are lightweight enough to likely remain in the main bundle without issue — but this should be verified via bundle analysis (Phase 22), not assumed permanently; if the shell bundle grows too large as more apps are added, promote more of them to lazy-loaded status without changing their external behavior (an internal-only refactor, since the Application Registry's `component` field already supports lazy references transparently per ARCHITECTURE.md §4).

## 4. Rendering Performance

- Window drag/resize must avoid triggering full-tree re-renders on every pointer-move frame — see WINDOW_MANAGER_SPEC.md §11 for the specific technique decision (direct style transform during gesture, commit to store on release, or throttled store writes).
- The Taskbar clock must be isolated so its per-second re-render doesn't cascade to the rest of the shell (DEVELOPMENT_PHASES.md Phase 4 note).
- Long-running game loops (Snake, DOOM) must correctly cancel their `requestAnimationFrame` loops on window close (and ideally pause, not just visually hide, on minimize) to avoid wasted CPU/battery when not visible — this is both a performance and a good-citizenship (visitor's battery life) concern.

## 5. Asset Optimization

- Images (project screenshots, icons) should be served in modern, appropriately-sized/compressed formats once real assets are supplied (ASSET_MANIFEST.md); this is deferred in effect until real assets exist, but the loading *pipeline* (lazy `<img loading="lazy">` or equivalent, appropriately-sized responsive images) should be built correctly from the start so no rework is needed later.
- Audio assets (AUDIO_SPEC.md) are short UI sounds — compressed formats (e.g., appropriately encoded short audio files) keep these negligible in size; full sound-pack preloading is explicitly avoided (AUDIO_SPEC.md §6) in favor of lazy decode-on-first-use.

## 6. Memory Management

- Every app with persistent listeners, timers, or animation loops (games especially, DOOM most critically) MUST clean these up on window close via a standard React `useEffect` cleanup pattern — enforced by code review and the explicit leak-check testing requirement in GAME_SPEC.md §4.5 / TEST_PLAN.md §2.3.
- Repeated open/close cycling of any app should not cause measurable memory growth over time (verified via heap snapshot comparison at Phase 22).

## 7. Monitoring / Measurement Tooling

- Recommended: Vite's built-in bundle analysis output (or `rollup-plugin-visualizer`) reviewed at Phase 22 and periodically thereafter.
- Recommended: Lighthouse CI or manual Lighthouse audits at Phase 22/23 checkpoints, tracked over time to catch regressions as content/features grow.

## 8. Non-Goals

- Server-side rendering / static pre-rendering is explicitly not pursued (TRD.md §3 rationale) — this is a fully client-rendered simulated OS where SSR provides little benefit and meaningful complexity cost given the window-manager's inherently client-only state model.
- Perfect parity with native OS performance is not the bar; the bar is "feels responsive and doesn't embarrass itself on a recruiter's laptop or phone."

## 9. Document Authority

PERFORMANCE.md governs performance budgets and optimization approach. TRD.md §5 sets the original high-level constraint this document elaborates; where a specific *_SPEC.md document makes a performance-relevant recommendation (e.g., GAME_SPEC.md's DOOM lazy-loading requirement), that recommendation must be consistent with this document's strategy, and this document is the aggregation point for measuring compliance.
