# WINDOW_MANAGER_SPEC.md — Window Lifecycle & Behavior

**Status:** Source of truth for the Window Manager system — the single most structurally important subsystem in the project. All applications depend on this; this document takes precedence over any app-specific spec regarding generic windowing behavior.

---

## 1. Responsibilities

The Window Manager (a Zustand store + a rendering layer, e.g., `<WindowManagerRoot>` mounted once at the Shell level) owns exclusively:
- The collection of open `WindowInstance` records (DATA_MODEL.md §2).
- z-index ordering / focus.
- Position, size, and min/max/restore state per window.
- The public API surface consumed by every other system (Desktop, Start Menu, File Explorer, Command Prompt, taskbar).

It does **not** own: any individual application's internal state (a Notepad buffer, a Minesweeper board) — those live inside the app component itself (local component state or an app-specific store), addressable only via `windowId` if cross-referencing is ever needed (e.g., for a future "are there unsaved changes" close-guard hook, see §6).

## 2. Public API

```ts
interface WindowManagerAPI {
  launchApp(appId: string, args?: LaunchArgs): string;         // returns new windowId (or existing, if singleInstance and already open)
  focusWindow(windowId: string): void;
  minimizeWindow(windowId: string): void;
  toggleMaximize(windowId: string): void;                      // maximize if normal, restore if maximized
  closeWindow(windowId: string): void;                          // may be intercepted by an app's close-guard, see §6
  moveWindow(windowId: string, position: {x:number;y:number}): void;
  resizeWindow(windowId: string, size: {width:number;height:number}): void;
  setWindowTitle(windowId: string, title: string): void;        // apps may override their own title at runtime (e.g., Notepad filename)
  getWindow(windowId: string): WindowInstance | undefined;
  listWindows(): WindowInstance[];                              // consumed by Taskbar
}
```

Every consumer (Desktop double-click handler, Start Menu entry click, File Explorer file-open, Command Prompt `open` command) calls `launchApp` — this is the single choke point that guarantees no duplicated launch logic (PRD FR-13/25 compliance, ARCHITECTURE.md §4).

## 3. Window Creation (`launchApp`)

1. Resolve `AppDefinition` from Application Registry by `appId`; if not found, throw a development-time error (this is a programming error, not a visitor-facing scenario — should be caught by type-safety and testing, not runtime user-facing handling).
2. If `AppDefinition.singleInstance` is true and a `WindowInstance` with that `appId` already exists: call `focusWindow` on the existing instance (and if minimized, restore it) instead of creating a new one; return its `windowId`.
3. Otherwise, construct a new `WindowInstance`:
   - `windowId`: generated unique id.
   - Position: if `defaultWindow.x/y` are specified, use them; otherwise compute a **cascade offset** from the most-recently-created window (e.g., +24px x, +24px y from the last window's position, wrapping back toward a base offset once nearing viewport edges) so new windows never render exactly on top of a prior one.
   - Size: from `defaultWindow.width/height`, clamped to not exceed the current viewport.
   - `zIndex`: `currentMaxZIndex + 1`.
   - `state: 'normal'`, `isFocused: true` (new windows always take focus).
4. All other currently-open windows have `isFocused` set to `false`.
5. Fire `window-open` audio event (AUDIO_SPEC.md §4) and any window-open animation (UI_UX_SPEC.md §3, respecting reduced-motion).

## 4. Focus & Z-Index

- `focusWindow(windowId)`: sets target's `zIndex = currentMaxZIndex + 1`, sets its `isFocused = true`, sets all others' `isFocused = false`.
- Clicking anywhere within a window's bounds (title bar or body, mousedown/pointerdown, captured via a wrapper on `WindowFrame`) calls `focusWindow` if it is not already the focused window — this must not interfere with normal in-app interactions (e.g., clicking a button inside Notepad both focuses the window AND performs the button's own action; these are not mutually exclusive, standard event bubbling handles this naturally as long as the focus handler doesn't call `stopPropagation`).
- Minimized windows are excluded from "focusable by click" (they're not visibly rendered) but remain in the z-index stack conceptually (irrelevant while hidden).

## 5. Minimize / Maximize / Restore

- **Minimize:** `state = 'minimized'`, `isFocused = false`. Window is removed from visible rendering (e.g., `display:none` or unmounted-but-state-preserved — [DECISION REQUIRED: keep mounted with CSS hide vs. conditionally unmount; recommend **CSS hide, stay mounted**, so app-internal state and any in-progress animation/timers are naturally preserved without needing special persistence logic — this directly satisfies PRD's "preserve state where appropriate" (FR-8) most simply]. Focus automatically shifts to the next-highest z-index non-minimized window, if any.
- **Maximize:** Before maximizing, current `position`/`size` are saved to `restoreBounds`. `state = 'maximized'`; window renders filling the desktop area (viewport minus taskbar height). Only applies if `AppDefinition.defaultWindow.maximizable` (or per-instance override) is true.
- **Restore (from maximized):** `state = 'normal'`; `position`/`size` reset from `restoreBounds`.
- **Restore (from minimized, via taskbar click):** `state = 'normal'` (or `'maximized'` if it was maximized before minimizing — state prior to minimizing must be remembered, not lost); `isFocused = true`, `zIndex` bumped to top.

## 6. Close

- `closeWindow(windowId)` removes the `WindowInstance` from the store and unmounts its app component tree.
- **Close-guard mechanism:** an app component may register a close-intercept via a callback passed through `AppComponentProps` (e.g., `onBeforeClose: () => boolean | Promise<boolean>` — returning `false`/resolving `false` cancels the close). Used by Notepad's unsaved-changes confirmation (SYSTEM_DESIGN.md §14). This is implemented generically in the Window Manager (it always checks for a registered guard before finalizing close) — not as a Notepad-specific special case, so any future app can opt into the same mechanism (NFR-3).
- Fires `window-close` audio event.

## 7. Drag & Resize

- Drag: implemented via pointer events on the title bar (`pointerdown` → track `pointermove` deltas → `moveWindow` → `pointerup` ends drag). Must use pointer capture (`setPointerCapture`) so drag continues correctly even if the cursor briefly leaves the title bar element during fast movement.
- Constraint: window must remain **at least partially draggable back into view** — enforce that some minimum portion of the title bar (e.g., 40px) always remains within viewport bounds after any move, preventing a window from becoming permanently inaccessible.
- Resize: pointer events on edge/corner handles, respecting `minWidth`/`minHeight` from `AppDefinition.defaultWindow`; only enabled if `isResizable`.
- Both operations are **not** delegated to `react-rnd` blindly per TRD.md §1 — if used, it is wrapped entirely inside the Window Manager's internal `WindowFrame` implementation, never exposed to or configured by individual app authors.

## 8. Taskbar Integration Contract

- Window Manager exposes `listWindows()` (reactive Zustand selector) — Taskbar subscribes to this and renders one button per entry, driven by `title`, `icon`, `state`, `isFocused`. Taskbar does not maintain any parallel window list of its own.
- Taskbar button click behavior implements the toggle logic described in UI_UX_SPEC.md §4, calling `focusWindow`/`minimizeWindow` as appropriate — this logic can live in the Taskbar component since it's pure UI-interaction routing, not window-state ownership.

## 9. Keyboard Interaction

- `Alt+Tab`-style window cycling: [DECISION REQUIRED — nice-to-have for authenticity, not MVP-blocking; if implemented, cycles focus through non-minimized windows in z-order].
- `Escape` inside a focused window does **not** globally close it (would be surprising/destructive) — `Escape` is reserved for closing transient overlays (Start Menu, dialogs, dropdowns) per UI_UX_SPEC.md, not windows themselves.
- Window control buttons (minimize/maximize/close) must be independently focusable and activatable via keyboard (Enter/Space) per UI_UX_SPEC.md §9.

## 10. Edge Cases

| Case | Required Behavior |
|---|---|
| `launchApp` called for a `singleInstance` app already minimized | Restore + focus, do not create duplicate |
| Window resized/moved such that it would exceed viewport due to a browser window resize (not user drag) | On viewport resize, clamp all window positions/sizes back within new bounds (reactive effect, not just on next manual interaction) |
| Closing the currently-focused window | Focus automatically shifts to the next-highest remaining z-index window, if any; if none remain, no window is focused (Taskbar shows no active state) |
| Rapid double-`launchApp` calls (e.g., fast double-click firing twice) for a non-singleInstance app | Acceptable to open two windows if the app genuinely isn't single-instance (matches real OS behavior); if this proves visually janky in testing, consider a debounce — [DECISION REQUIRED, low priority] |
| `prefers-reduced-motion` active | All open/close/minimize/maximize transitions become instant or near-instant (short opacity crossfade at most), no scale/slide flourish |

## 11. Performance Notes

- Drag/resize position updates should be applied via direct style transforms during the gesture (avoiding a full Zustand state write on every `pointermove` frame, which could cause excessive re-renders) — commit the final position to the store only on `pointerup`, OR throttle store writes to animation-frame cadence if live-store-driven rendering is preferred for architectural simplicity. [DECISION REQUIRED: exact technique, finalized during Phase 3 implementation; both are valid, this is a performance-tuning detail, not a behavioral one — see PERFORMANCE.md.]

## 12. Document Authority

WINDOW_MANAGER_SPEC.md is authoritative for all generic windowing behavior across the entire product. No app-specific spec may override minimize/maximize/close/focus/drag/resize semantics defined here; apps may only opt into the close-guard extension point described in §6.
