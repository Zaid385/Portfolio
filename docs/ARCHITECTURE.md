# ARCHITECTURE.md — High-Level System Architecture

**Status:** Source of truth for HOW systems fit together. Individual system internals live in SYSTEM_DESIGN.md and the per-system *_SPEC.md files.

---

## 1. Architectural Principles

1. **Shell vs. Applications separation.** The "OS Shell" (boot, desktop, window manager, taskbar, Start Menu) is a closed set of core systems. "Applications" (Notepad, Command Prompt, File Explorer, Control Panel, Browser, games, project viewers) are plugins that consume shell services through defined interfaces — they never reach into shell internals directly.
2. **Data-driven content.** Nothing about a specific project, social link, desktop icon, or filesystem entry is hardcoded into a UI component. All such content flows from typed data registries (see DATA_MODEL.md, CONTENT_SCHEMA.md).
3. **Single source of truth per concern.** Window state lives only in the Window Manager store. Settings live only in the Settings store. Filesystem state lives only in the Virtual Filesystem store. No duplication/mirroring of state across stores.
4. **Composition over inheritance.** Applications are React components conforming to a common `AppComponentProps` contract, rendered inside a generic `WindowFrame` — they do not each independently implement chrome, dragging, or z-index.
5. **Fail-soft.** Any single application's runtime failure (e.g., DOOM's wasm module failing to load) is contained by an error boundary local to that window and does not affect the shell or other open windows.

## 2. System Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Root (React)                        │
│                                                                   │
│  ┌───────────────┐  Phase gate: Boot → Desktop                  │
│  │  Boot Sequence │──────────────┐                               │
│  └───────────────┘              ▼                               │
│                         ┌─────────────────┐                     │
│                         │   OS Shell       │                     │
│                         │                  │                     │
│  ┌───────────────┐      │  ┌────────────┐  │                     │
│  │ Settings Store │◄────┼─►│  Desktop   │  │                     │
│  └───────────────┘      │  └────────────┘  │                     │
│                         │  ┌────────────┐  │                     │
│  ┌───────────────┐      │  │  Window    │  │  ┌────────────────┐│
│  │ Audio Manager  │◄────┼─►│  Manager   │◄─┼─►│  Application     ││
│  └───────────────┘      │  └────────────┘  │  │  Registry        ││
│                         │  ┌────────────┐  │  └────────────────┘│
│  ┌───────────────┐      │  │  Taskbar   │  │                     │
│  │ Virtual FS     │◄────┼─►│  + Tray    │  │  ┌────────────────┐│
│  │ Store          │      │  └────────────┘  │  │  Content Data   ││
│  └───────────────┘      │  ┌────────────┐  │  │  (projects,     ││
│                         │  │ Start Menu │  │  │   socials,      ││
│                         │  └────────────┘  │  │   resume, etc.) ││
│                         └─────────────────┘  └────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │  renders into
                              ▼
                   ┌───────────────────────┐
                   │   WindowFrame(s)       │
                   │  ┌──────────────────┐  │
                   │  │  App Component    │  │  (Notepad, CmdPrompt,
                   │  │  (per-app logic)  │  │   FileExplorer, games…)
                   │  └──────────────────┘  │
                   └───────────────────────┘
```

## 3. Core Systems (owners of state, defined fully in SYSTEM_DESIGN.md)

| System | Owns | Does NOT own |
|---|---|---|
| **Boot Controller** | Boot stage/progress, transition to Shell | Asset loading internals of individual apps |
| **Window Manager** | Window instances, position, size, z-index, focus, min/max/restore state | Application-internal state (e.g., Notepad's text buffer) |
| **Application Registry** | Mapping of `appId → { component, metadata, icon, launch config }` | Window chrome/position |
| **Desktop** | Icon layout/config consumption, double-click → launch dispatch | Window rendering itself |
| **Taskbar / System Tray** | Rendering open-window summaries, simulated Wi-Fi/Bluetooth/battery UI state, clock | Real device battery/network data |
| **Start Menu** | Menu open/closed state, structured entries (reuses Application Registry) | Its own copy of app launch logic |
| **Virtual Filesystem Store** | Tree of folders/files, metadata, content refs | Rendering (File Explorer renders it; Command Prompt reads it) |
| **Settings Store** | Brightness, volume, animations toggle, sound toggle, visual effects | Actual audio playback (delegates to Audio Manager) or visual rendering (delegates to CSS variables) |
| **Audio Manager** | Web Audio graph, master gain, sound registry/playback | Which UI event triggers which sound (apps/shell call into it explicitly) |
| **Content Data Layer** | Typed project/social/resume data | UI presentation of that data |

## 4. Application Plugin Contract

Every application (Notepad, Command Prompt, File Explorer, Control Panel, Browser, Snake, Minesweeper, DOOM, project viewers, static document viewers like Navigation Guide) is registered once in the **Application Registry** with:

- `id`: unique string
- `title`: display title for title bar / taskbar / Start Menu
- `icon`: asset reference
- `component`: the React component implementing the app body (receives `AppComponentProps`: `windowId`, `instanceState`, helper callbacks for `setTitle`, `requestClose`, etc.)
- `defaultWindowConfig`: initial width/height/position/resizable/maximizable flags
- `singleInstance`: boolean — whether launching twice should focus the existing window instead of opening a new one (e.g., Control Panel is single-instance; File Explorer windows may be multi-instance for different folders)
- `launchArgs` (optional): typed payload for parameterized launches (e.g., File Explorer opened to a specific path, or a Project Viewer opened for a specific project id)

The Desktop, Start Menu, File Explorer (double-clicking a `.txt`/project entry), and Command Prompt (`open <app>`-style commands, if included) **all call the same `launchApp(id, args)` function** against the Window Manager + Application Registry. This satisfies PRD FR-13 (no duplicated launch logic).

## 5. Data Flow Example — Opening a Project

1. Visitor double-clicks `Audioflow` inside File Explorer's `C:\Projects\` view (File Explorer is itself an app reading from the Virtual Filesystem Store, which was seeded from the Content Data Layer's project registry).
2. File Explorer calls `launchApp('project-viewer', { projectId: 'audioflow' })`.
3. Window Manager creates a new window instance, registers it in taskbar, assigns z-index/focus.
4. WindowFrame mounts the `ProjectViewer` component (registered in Application Registry) with `launchArgs.projectId`.
5. `ProjectViewer` reads the specific project record from the Content Data Layer (typed per DATA_MODEL.md) and renders name/description/stack/links/screenshots.
6. No project-specific markup exists anywhere in `ProjectViewer` — it is fully generic over the project schema.

## 6. Cross-Cutting Concerns

- **Persistence layer:** A thin wrapper around `localStorage` (see SETTINGS_SPEC.md) used only by Settings Store (and optionally Notepad's "save" feature in its expanded scope). Not used by Window Manager (window layout does not persist across reloads for v1 — [DECISION REQUIRED] if this changes).
- **Error boundaries:** One error boundary per `WindowFrame`, so a crashing app shows an in-window error state rather than taking down the shell.
- **Theming:** CSS custom properties driven by Settings Store (brightness → a global filter/overlay; reduced motion → a data-attribute toggling animation CSS).
- **Asset loading:** Route/app-level code-splitting (`React.lazy`) for heavy apps (DOOM foremost, also Minesweeper/Snake if their sprite assets are large).

## 7. Directory Structure (recommended, non-binding until Phase 0)

```
src/
  boot/                  # Boot Controller + boot stage components
  shell/
    desktop/
    window-manager/
    taskbar/
    start-menu/
  apps/
    notepad/
    navigation-guide/
    command-prompt/
    file-explorer/
    control-panel/
    browser/
    project-viewer/
    social-viewer/
    resume-viewer/
    games/
      snake/
      minesweeper/
      doom/
  registries/
    application-registry.ts
    filesystem-seed.ts
  content/
    projects.ts
    socials.ts
    resume.ts
  stores/                # Zustand stores
    window-store.ts
    settings-store.ts
    filesystem-store.ts
    audio-store.ts
  audio/
    audio-manager.ts
    sound-registry.ts
  styles/
    xp-theme.css
  assets/                # placeholders per ASSET_MANIFEST.md
```

## 8. Document Authority

ARCHITECTURE.md governs system boundaries and ownership. SYSTEM_DESIGN.md and the per-system spec files must conform to the ownership table in §3 — if a spec assigns state ownership differently, ARCHITECTURE.md wins and the spec must be corrected.
