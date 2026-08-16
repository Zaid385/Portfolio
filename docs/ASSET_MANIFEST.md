# ASSET_MANIFEST.md — Complete Asset Placeholder Manifest

**Status:** Source of truth for every asset the project will eventually require. No real asset paths exist yet — every entry below is a placeholder token to be wired into `AssetRef` fields (see DATA_MODEL.md §12) and replaced with real, licensed, or recreated assets prior to production launch. Implementing agents must import/reference these tokens symbolically (e.g., a constant, a config lookup) rather than fabricating file paths.

---

## 1. Manifest Principles

- Every visual/audio asset used anywhere in the product MUST have a corresponding entry here before it is referenced in code.
- No component may hardcode a raw asset path string inline; all references flow through a central asset registry keyed by these tokens (recommended: `src/assets/asset-manifest.ts` exporting a typed map, populated with real paths once assets are sourced).
- Where an asset is a **recreation** of an XP-era visual (not a copy of Microsoft's actual copyrighted file), that is noted explicitly — this is the required approach for anything visually iconic (Bliss wallpaper, XP button chrome, system sounds) to avoid IP issues; see SECURITY.md §Licensing.

## 2. Wallpaper & Environment

| Token | Description | Notes |
|---|---|---|
| `[ASSET: XP_BLISS_WALLPAPER]` | Default desktop wallpaper, XP "Bliss"-style rolling green hill + blue sky | Must be an **original recreation/inspired-by** image, not the copyrighted Microsoft photograph, unless a properly licensed or public-domain equivalent is sourced. |
| `[ASSET: XP_WALLPAPER_ALT_1..N]` | Optional alternate wallpapers (future Control Panel "Desktop" applet feature) | Deferred/stretch. |

## 3. Cursors

| Token | Description |
|---|---|
| `[ASSET: XP_CURSOR_NORMAL]` | Default arrow cursor, XP style |
| `[ASSET: XP_CURSOR_POINTER]` | Hand/link pointer cursor |
| `[ASSET: XP_CURSOR_TEXT]` | I-beam text cursor (may rely on native browser cursor styling instead — [DECISION REQUIRED]) |
| `[ASSET: XP_CURSOR_WAIT]` | Busy/loading cursor (hourglass), used during boot or heavy app load |
| `[ASSET: XP_CURSOR_RESIZE_*]` | Directional resize cursors for window edges (may rely on native CSS `cursor: nwse-resize` etc. instead — recommend native, deprioritize custom art) |

## 4. System Chrome Icons

| Token | Description |
|---|---|
| `[ASSET: XP_MY_COMPUTER_ICON]` | My Computer desktop/Start Menu icon |
| `[ASSET: XP_RECYCLE_BIN_ICON_EMPTY]` | Recycle Bin, empty state |
| `[ASSET: XP_RECYCLE_BIN_ICON_FULL]` | Recycle Bin, has-items state |
| `[ASSET: XP_NOTEPAD_ICON]` | Notepad app icon |
| `[ASSET: XP_TEXT_DOCUMENT_ICON]` | Generic `.txt` document icon (used for Navigation guide.txt) |
| `[ASSET: XP_COMMAND_PROMPT_ICON]` | Command Prompt app icon |
| `[ASSET: XP_CONTROL_PANEL_ICON]` | Control Panel app icon |
| `[ASSET: XP_BROWSER_ICON]` | Browser app icon |
| `[ASSET: XP_FOLDER_ICON_CLOSED]` | Generic closed folder icon |
| `[ASSET: XP_FOLDER_ICON_OPEN]` | Generic open folder icon |
| `[ASSET: XP_DRIVE_ICON]` | Local Disk (C:) drive icon |
| `[ASSET: XP_EXE_ICON_GENERIC]` | Generic executable icon (for easter-egg fake files) |
| `[ASSET: XP_ERROR_DIALOG_ICON]` | Red-X error icon for dialog boxes |
| `[ASSET: XP_WARNING_DIALOG_ICON]` | Yellow-triangle warning icon |
| `[ASSET: XP_INFO_DIALOG_ICON]` | Blue-i info icon |

## 5. Window Chrome

| Token | Description |
|---|---|
| `[ASSET: XP_WINDOW_REFERENCE]` | Reference sheet/spec for title bar gradient, borders, corner radius (used to hand-author CSS, not a literal image asset in production) |
| `[ASSET: XP_TITLEBAR_BUTTON_MINIMIZE]` | Minimize button glyph/icon |
| `[ASSET: XP_TITLEBAR_BUTTON_MAXIMIZE]` | Maximize button glyph/icon |
| `[ASSET: XP_TITLEBAR_BUTTON_RESTORE]` | Restore-down button glyph/icon |
| `[ASSET: XP_TITLEBAR_BUTTON_CLOSE]` | Close button glyph/icon |

## 6. Taskbar & Start Menu

| Token | Description |
|---|---|
| `[ASSET: XP_TASKBAR_REFERENCE]` | Reference sheet for taskbar gradient/height/style |
| `[ASSET: XP_START_BUTTON_ASSET]` | Start button graphic (green, pill-shaped, classic XP look) |
| `[ASSET: XP_START_MENU_REFERENCE]` | Reference sheet for Start Menu layout/colors |
| `[ASSET: XP_SYSTEM_TRAY_ICONS]` | Icon set: Wi-Fi, Bluetooth, battery, volume glyphs |
| `[ASSET: XP_SYSTEM_TRAY_WIFI_ON]` / `[ASSET: XP_SYSTEM_TRAY_WIFI_OFF]` | Wi-Fi state icons |
| `[ASSET: XP_SYSTEM_TRAY_BLUETOOTH_ON]` / `[ASSET: XP_SYSTEM_TRAY_BLUETOOTH_OFF]` | Bluetooth state icons |
| `[ASSET: XP_SYSTEM_TRAY_BATTERY_*]` | Battery level icon states (e.g., full/mid/low/charging) |
| `[ASSET: XP_SYSTEM_TRAY_VOLUME_*]` | Volume level icon states (muted/low/mid/high) |

## 7. Boot Sequence

| Token | Description |
|---|---|
| `[ASSET: XP_BOOT_BIOS_FONT]` | Monospace font reference for POST/BIOS-style text stage |
| `[ASSET: XP_BOOT_LOADING_BAR]` | Recreated XP-style segmented loading bar graphic/animation |
| `[ASSET: XP_BOOT_LOGO]` | Recreated startup logo mark (an original mark for this portfolio, not Microsoft's) |
| `[ASSET: XP_WELCOME_SCREEN_REFERENCE]` | Reference for optional welcome/login screen, if included |

## 8. Games — Icons

| Token | Description |
|---|---|
| `[ASSET: GAME_SNAKE_ICON]` | Snake app/desktop icon |
| `[ASSET: GAME_MINESWEEPER_ICON]` | Minesweeper app/desktop icon |
| `[ASSET: GAME_DOOM_ICON]` | DOOM app/desktop icon |

## 9. Games — In-App Assets

| Token | Description |
|---|---|
| `[ASSET: GAME_SNAKE_SPRITE_SHEET]` | Optional sprite art if not pure CSS/canvas-drawn primitives |
| `[ASSET: GAME_MINESWEEPER_TILE_SPRITES]` | Classic Minesweeper tile/flag/mine sprite set (recreated) |
| `[ASSET: GAME_DOOM_ENGINE_BUNDLE]` | The DOOM web build/engine bundle itself (see GAME_SPEC.md for sourcing strategy) — not a visual asset, but tracked here as a required external dependency artifact |
| `[ASSET: GAME_DOOM_SHAREWARE_WAD]` | The shareware WAD data file required to run DOOM legally without a full commercial license (see GAME_SPEC.md §Licensing) |

## 10. Project Assets

| Token | Description |
|---|---|
| `[ASSET: PROJECT_ICON_<NAME>]` | Per-project icon, one per `ProjectRecord.icon` |
| `[ASSET: PROJECT_SCREENSHOT_<NAME>_<N>]` | Per-project screenshot(s), one or more per `ProjectRecord.screenshots` |

`<NAME>` is the project's `id` (e.g., `AUDIOFLOW`, `TETHER`). These tokens are generated per entry in the Project Registry (see DATA_MODEL.md §7) — the manifest itself does not enumerate final project names (per PRD: "Do not invent project information").

## 11. Resume / Documents

| Token | Description |
|---|---|
| `[ASSET: RESUME_PDF]` | Downloadable resume PDF, if offered as a real file in addition to the in-app Resume viewer |
| `[ASSET: PROFILE_PHOTO]` | Optional profile photo, if used anywhere (e.g., a simulated "user account" picture on a welcome screen) |

## 12. Audio

| Token | Description |
|---|---|
| `[ASSET: XP_STARTUP_SOUND]` | Boot/startup chime (recreated/licensed, not Microsoft's original copyrighted composition) |
| `[ASSET: XP_SHUTDOWN_SOUND]` | Used only if a shutdown-style flow is ever added (e.g., leaving the site, or BSOD-adjacent flavor) — currently not required by PRD, tracked for completeness |
| `[ASSET: XP_ERROR_SOUND]` | Error dialog chime |
| `[ASSET: XP_NOTIFICATION_SOUND]` | Generic notification chime |
| `[ASSET: XP_MENU_SOUND]` | Start Menu open/close, menu navigation click |
| `[ASSET: XP_WINDOW_OPEN_SOUND]` | Window open chime |
| `[ASSET: XP_WINDOW_CLOSE_SOUND]` | Window close chime |
| `[ASSET: XP_CLICK_SOUND]` | Generic UI click |
| `[ASSET: XP_RECYCLE_EMPTY_SOUND]` | Optional flavor sound for Recycle Bin interaction |
| `[ASSET: BSOD_TRIGGER_SOUND]` | Optional dramatic sting for Blue Screen easter egg trigger |
| `[ASSET: GAME_MINESWEEPER_FLAG_SOUND]` / `[ASSET: GAME_MINESWEEPER_REVEAL_SOUND]` / `[ASSET: GAME_MINESWEEPER_EXPLODE_SOUND]` | Minesweeper SFX set |
| `[ASSET: GAME_SNAKE_EAT_SOUND]` / `[ASSET: GAME_SNAKE_GAMEOVER_SOUND]` | Snake SFX set |

## 13. Fonts

| Token | Description |
|---|---|
| `[ASSET: FONT_XP_TAHOMA_EQUIVALENT]` | Primary UI font — Tahoma is not freely licensed for web embedding in all contexts; a metrically-similar open alternative (e.g., a suitable open-source sans) should be sourced. [DECISION REQUIRED: exact font choice.] |
| `[ASSET: FONT_MONOSPACE_TERMINAL]` | Monospace font for Command Prompt / BIOS boot text |

## 14. Manifest Maintenance Rule

Any new phase that introduces a new visual/audio element MUST add its token(s) here in the same PR/commit that introduces the reference, even if the real asset is still pending. This keeps the manifest exhaustive and prevents undocumented inline asset paths from entering the codebase (enforced via code review per CONTRIBUTING.md).
