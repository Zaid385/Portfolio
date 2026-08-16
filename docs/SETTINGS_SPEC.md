# SETTINGS_SPEC.md — Settings & Persistence Specification

**Status:** Source of truth for the Settings Store, Control Panel data binding, and persistence rules.

---

## 1. Settings Schema

```ts
interface SettingsState {
  brightness: number;            // 0–100, default 100
  volume: number;                // 0–100, default a moderate default (e.g., 60) rather than 100, to avoid startling first-time visitors — [DECISION REQUIRED: exact default]
  soundEffectsEnabled: boolean;  // default true
  animationsEnabled: boolean;    // default true (independent from, but should be initialized respecting, prefers-reduced-motion — see §4)
  crtEffectEnabled: boolean;     // default false; optional/stretch visual effect
  schemaVersion: number;         // increment whenever this shape changes, for migration safety
}
```

## 2. Ownership & API

- Single Zustand store, `useSettingsStore`, exposing the state plus setters: `setBrightness`, `setVolume`, `setSoundEffectsEnabled`, `setAnimationsEnabled`, `setCrtEffectEnabled`.
- All consumers (Taskbar tray controls, Control Panel applets) call these setters directly — no consumer maintains a local shadow copy of any setting (ARCHITECTURE.md principle #3).
- Setters apply changes **immediately** to the store; any debouncing needed for expensive downstream effects (unlikely here — brightness/volume changes are cheap CSS/gain updates) is an internal implementation detail of the consuming system, not the store itself.

## 3. Persistence

- Persisted to `localStorage` under a single namespaced key, e.g., `xp-portfolio:settings`, as a JSON blob matching `SettingsState` (Zustand's `persist` middleware is an appropriate, low-risk implementation choice given TRD.md's stack).
- On load: attempt to read and parse the stored value; validate `schemaVersion` matches the current expected version.
  - If it matches: hydrate directly.
  - If it's an older version: apply a defined migration path (even if trivial, e.g., "add new field with its default") — must not simply discard all prior settings silently unless the migration is genuinely undefined for that field. [DECISION REQUIRED per future schema change; document each migration in CONTRIBUTING.md's changelog conventions when it happens.]
  - If parsing fails or no stored value exists: fall back to defaults, no error surfaced to the visitor.
- Hydration must complete **before** the Boot Controller finalizes its transition to desktop (SYSTEM_DESIGN.md §1.2), so brightness/animation preferences are correctly applied from the very first rendered frame of the desktop, avoiding a jarring flash of default-then-corrected state.

## 4. Interaction with System Preferences

- On first visit (no stored settings), `animationsEnabled` should default based on the visitor's OS-level `prefers-reduced-motion` media query if it indicates "reduce" — i.e., respect the system signal as the *initial* default, while still letting the visitor override it explicitly via Control Panel thereafter (their explicit choice, once made, persists and takes precedence over the media query on subsequent visits).
- This satisfies both NFR-2 (accessibility-first) and a sensible, non-surprising default.

## 5. Brightness — Behavioral Detail

(Cross-ref SYSTEM_DESIGN.md §6 for implementation approach decision.)
- Range 0–100, applied via smooth CSS transition (recommended `transition: filter 150ms ease` or equivalent if using the overlay-div approach) — no stepped/discrete jumps.
- Extremes: 100 = fully normal rendering; 0 = "extremely dark" per PRD, meaning still just barely perceivable (never literally 100% opaque black, which would make the UI fully unusable and undiscoverable-recoverable) — recommend clamping the darkest achievable visual state to something like 90–95% darkening rather than 100%, so a visitor who drags brightness to 0 can still see enough to find the brightness control again without reloading. [DECISION REQUIRED: exact minimum-visibility floor.]

## 6. Volume — Behavioral Detail

- Range 0–100, mapped to Audio Manager master gain per AUDIO_SPEC.md §1 (non-linear curve for perceptual accuracy).
- 0 is a valid, meaningful "muted" state — Taskbar tray volume icon reflects a distinct muted glyph at 0 (ASSET_MANIFEST.md §6).

## 7. Sound Effects Toggle vs. Volume

Explicitly two independent controls, as required by PRD:
- `volume = 0` ≈ effectively silent but is a *continuous* control the visitor actively set.
- `soundEffectsEnabled = false` is a discrete on/off preference (e.g., for a visitor who wants a professional, silent browsing session by default without hunting for a volume slider) — Control Panel exposes this as a separate, clearly labeled checkbox/toggle (UI_UX_SPEC.md §7), distinct from the volume slider.

## 8. Animations Toggle

- When `false`, this is functionally equivalent to forcing the `prefers-reduced-motion` behavior described throughout UI_UX_SPEC.md §9 and WINDOW_MANAGER_SPEC.md §10, regardless of the visitor's actual OS-level setting — implemented as a single shared boolean check (`shouldReduceMotion = !animationsEnabled || systemPrefersReducedMotion`) consumed wherever animation branching occurs, so there is exactly one decision point, not scattered conditionals.

## 9. Control Panel Data Binding

Each Control Panel applet (SYSTEM_DESIGN.md §11) binds directly to `useSettingsStore` fields:

| Applet | Bound Field(s) |
|---|---|
| Display | `brightness`, `crtEffectEnabled` (optional) |
| Sounds | `volume`, `soundEffectsEnabled` |
| Appearance | `animationsEnabled` |

No applet holds intermediate/staged state requiring an "Apply" or "OK" button — all changes are live (PRD FR-22), matching modern UX conventions over legacy Windows' apply-then-confirm pattern, which would add friction without benefit here.

## 10. Document Authority

SETTINGS_SPEC.md governs the Settings Store's schema, persistence, and every setting's precise behavioral semantics. AUDIO_SPEC.md and SYSTEM_DESIGN.md reference these fields but do not redefine them.
