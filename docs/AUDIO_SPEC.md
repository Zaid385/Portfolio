# AUDIO_SPEC.md — Audio Events, Sound Mapping, Volume Architecture

**Status:** Source of truth for the Audio Manager system's behavior and every sound-triggering event in the product.

---

## 1. Architecture Summary

A single **Audio Manager** module owns:
- A Web Audio API `AudioContext`.
- A master `GainNode`, whose gain is driven by `SettingsState.volume` (0–100, mapped to 0–1 gain, with a perceptual curve — linear volume sliders feel wrong; recommend a logarithmic/exponential mapping, e.g., `gain = (volume / 100) ** 2` or similar, tuned during implementation).
- A **Sound Registry**: `Record<SoundId, AudioBuffer | AssetRef>` loaded/decoded lazily (not all sounds decoded at boot — only ones likely needed early, e.g., click/menu sounds; game-specific SFX load when that game's app mounts).
- A single public method surface: `audioManager.play(soundId: SoundId, options?: { volumeOverride?: number })`. **No component anywhere else in the codebase constructs its own `Audio()` element or `AudioContext`** — this is a hard architectural rule (ARCHITECTURE.md principle #3/4).

```ts
type SoundId =
  | 'startup' | 'error' | 'notification' | 'menu-open' | 'menu-close'
  | 'window-open' | 'window-close' | 'click'
  | 'recycle-empty' | 'bsod-trigger'
  | 'minesweeper-flag' | 'minesweeper-reveal' | 'minesweeper-explode'
  | 'snake-eat' | 'snake-gameover';
```

## 2. Master Mute / Effects Toggle

- `SettingsState.soundEffectsEnabled === false` → Audio Manager's `play()` becomes a no-op (short-circuited before touching the audio graph) rather than the caller needing to check the flag itself. Callers always just call `play()`; the Manager is the single point of truth for whether sound actually happens.
- Volume `0` and `soundEffectsEnabled: false` are distinct states: volume 0 still allows the taskbar volume icon to show a "muted" glyph reactively; effects-disabled is an explicit separate toggle in Control Panel (matches PRD's "Sound effects enabled/disabled" as distinct from "Volume").

## 3. Autoplay Constraint (see also SYSTEM_DESIGN.md §1.3)

`AudioContext` cannot start in a "running" state without a user gesture in most modern browsers. Architecture must:
1. Construct the `AudioContext` in a `suspended` state at module init (safe, no gesture required).
2. `resume()` it on the **first** qualifying user gesture anywhere in the app (first click/keydown/touchstart on the document — implemented as a one-time global listener that tears itself down after firing).
3. The boot startup sound (`'startup'`) is queued to play once the context resumes if boot is still in-progress or just completed at that time; if the visitor never interacts before boot completes, the sound simply plays on their first subsequent interaction with the desktop (e.g., first icon click) rather than being lost — implemented as: if `play('startup')` is called while context is suspended, queue it as the *first* sound to fire on resume rather than dropping it silently.

## 4. Event → Sound Mapping

| Event | SoundId | Trigger Point |
|---|---|---|
| Boot sequence reaches desktop transition | `startup` | Boot Controller, subject to §3 autoplay handling |
| Any dialog box (error) opens | `error` | Dialog component mount |
| Generic notification/toast shown | `notification` | Notification system, if/when implemented |
| Start Menu opens | `menu-open` | Start Menu store transition to open |
| Start Menu closes | `menu-close` | Start Menu store transition to closed |
| Any window opens (`launchApp` success) | `window-open` | Window Manager, on window creation |
| Any window closes | `window-close` | Window Manager, on window removal |
| Generic button/icon click (desktop icon, taskbar button, Control Panel toggle) | `click` | Shared click handler utility — recommend a small `useUiClickSound()` hook or shared button wrapper component so this isn't manually wired at every call site |
| Recycle Bin "empty" interaction (flavor only) | `recycle-empty` | Recycle Bin app |
| Blue Screen easter egg triggers | `bsod-trigger` | BSOD trigger handler |
| Minesweeper: flag placed | `minesweeper-flag` | Minesweeper game logic |
| Minesweeper: tile revealed | `minesweeper-reveal` | Minesweeper game logic |
| Minesweeper: mine hit (loss) | `minesweeper-explode` | Minesweeper game logic |
| Snake: food eaten | `snake-eat` | Snake game logic |
| Snake: game over | `snake-gameover` | Snake game logic |

This table is **extensible**: adding a new event requires adding a `SoundId` union member, a manifest token (ASSET_MANIFEST.md §12), and a call to `audioManager.play(...)` at the trigger point — no other system needs modification (NFR-3 compliance).

## 5. Volume Control Surfaces

Two UI surfaces write to the same `SettingsState.volume` field (single source of truth, per ARCHITECTURE.md §3):
1. Taskbar tray volume icon + popup slider.
2. Control Panel → Sounds applet slider.

Both must reflect live updates from each other (if one is open and the other changes the value, e.g., via keyboard shortcut, both should re-render from the shared store — trivial with Zustand's reactivity, called out explicitly here to prevent an implementer from accidentally giving the taskbar its own local slider state).

## 6. Performance Considerations

- Sounds are short (UI chirps, not music) — decode-on-first-use is sufficient; no need for a full preload-everything-at-boot strategy, which would slow the boot gate (see SYSTEM_DESIGN.md §1.2 — the boot gate's critical path explicitly excludes non-essential audio decode).
- Rapid repeated triggers (e.g., mashing a button) should not stack overlapping instances of the same sound indefinitely — Audio Manager should cap concurrent instances of a given `SoundId` (e.g., max 3 overlapping, or retrigger-replaces-previous for certain sounds like `click`) — [DECISION REQUIRED: exact concurrency policy, tune during Phase 16 implementation/playtesting].

## 7. Licensing (see also SECURITY.md, ASSET_MANIFEST.md §12)

No Windows XP original sound recordings may be bundled without a verified license. All audio assets referenced in §4/ASSET_MANIFEST.md §12 must be either (a) original recreations inspired by but not copied from the originals, or (b) properly licensed/royalty-free equivalents. This is a hard constraint, not a style preference — flagged again here because audio is a common area where "just grab the XP sound files" is a natural but non-compliant shortcut.

## 8. Document Authority

AUDIO_SPEC.md governs all sound-related behavior. It must not be contradicted by per-app specs (GAME_SPEC.md, COMMAND_PROMPT_SPEC.md, etc.) — those specs may add new `SoundId` mapping table rows but must route all playback through the Audio Manager contract defined here.
