# FILE_EXPLORER_SPEC.md — Virtual Filesystem & My Computer Behavior

**Status:** Source of truth for the File Explorer application and the Virtual Filesystem it renders. Complements DATA_MODEL.md §5 (data shape) with behavioral specification.

---

## 1. Application Overview

- Registered as `file-explorer`, `singleInstance: false` (each folder navigation may reasonably open in its own window, or reuse one window depending on navigation mode — see §3).
- Launch args: `{ initialPath?: string }` — defaults to filesystem root ("My Computer") if omitted; `My Computer` desktop icon launches with no arg, while other entry points (e.g., a Start Menu "Projects" shortcut) may launch directly into `C:\Projects\`.

## 2. Default Virtual Filesystem Structure

```
My Computer (root)
└── Local Disk (C:)
    ├── Users
    │   └── [Zaid or a generic visitor-facing username — DECISION REQUIRED]
    │       ├── Desktop        (mirrors DesktopIconConfig entries conceptually — see note below)
    │       ├── Documents
    │       │   ├── Resume            → app-link → resume-viewer
    │       │   └── Navigation guide.txt → file(text) → navigation-guide-viewer
    │       └── Downloads       (may be empty or contain a curated flavor file)
    ├── Projects
    │   ├── [ProjectRecord #1] → file(project-ref) → project-viewer, launchArgs:{projectId}
    │   ├── [ProjectRecord #2] → …
    │   └── …
    ├── Social
    │   ├── LinkedIn  → file(social-ref) → browser, launchArgs:{socialId:'linkedin'}
    │   └── GitHub    → file(social-ref) → browser, launchArgs:{socialId:'github'}
    ├── Games
    │   ├── Snake        → app-link → snake
    │   ├── Minesweeper  → app-link → minesweeper
    │   └── DOOM         → app-link → doom
    └── (optional future folders, e.g., "Skills", "Writing" — additive, data-driven)
```

**Note on Desktop mirroring:** The `Desktop` folder under `Users\[name]\` is a **conceptual/flavor** location; it does not need to programmatically stay in perfect sync with `DesktopIconConfig` for MVP (that would add sync complexity for a cosmetic detail). [DECISION REQUIRED: if full sync is desired later, `DesktopIconConfig` and this folder's `childIds` could both derive from one shared source list — tracked as a possible refactor, not required for MVP.]

## 3. Navigation Model

- **Single-pane, breadcrumb/address-bar style navigation** (classic XP File Explorer look: a toolbar with Back/Forward/Up buttons, an address bar showing the current path, and a content pane listing child items) — this is the recommended MVP approach over a tree-sidebar+pane split view, which is more complex to implement for marginal authenticity gain. [DECISION REQUIRED: confirm single-pane vs. tree+pane; recommend single-pane for MVP, tree sidebar as later polish.]
- Double-clicking a folder navigates the *current* window's view into that folder (does not necessarily open a new window — matches modern "browse in same window" convention more than legacy Windows' "each folder is a new window" convention; the latter is authentic-but-annoying and explicitly de-prioritized per PRD's "avoid unnecessary recreation of irrelevant OS functionality").
- Double-clicking a file (`FsFileNode`) calls `launchApp(node.openAppId, node.launchArgs)` — opening the appropriate viewer app in a **new** window (this is the correct behavior: opening a document from a file browser should open a document viewer, not navigate "into" it).
- Back/Forward buttons operate on a simple per-window navigation history stack (array + pointer), independent of browser history (does not manipulate the real URL/history API for v1 — [DECISION REQUIRED] if deep-linking via §TRD.md routing note is added later, this would integrate then).
- Up button navigates to `parentId` of current folder (disabled/no-op at root).

## 4. List/View Behavior

- Default view: icon grid (matching classic XP "Icons" or "Tiles" view) — each item shows icon + name, using the same icon-rendering component used by the Desktop (shared `<FsIcon>` component, not a duplicated implementation, per ARCHITECTURE.md principle #4).
- Selection behavior mirrors Desktop icon selection (§ UI_UX_SPEC.md §2): single click selects, double click/Enter opens.
- [DECISION REQUIRED / deferred]: a "Details" list view (name/type/size/date columns) is classic-authentic but not required for MVP; only add if time allows, purely additive.

## 5. Read-Only Guarantee (MVP)

- No file creation, deletion, renaming, or moving is supported through File Explorer's UI for MVP (PRD does not require it; SYSTEM_DESIGN.md §7 confirms filesystem is read-only for v1 except the Notepad-save exception, which is itself deferred per SYSTEM_DESIGN.md §8).
- Right-click context menus (Cut/Copy/Paste/Delete/Rename/Properties) are **not required for MVP**. If ever added, "Properties" showing metadata (e.g., a project's tech stack as "file properties") is a plausible, low-risk future enhancement that fits the data model without new fields.

## 6. Consistency with Desktop & Command Prompt

- File Explorer, Desktop icons, and Command Prompt's `dir`/`cd`/`cat`/`open` commands all read from the **single shared Virtual Filesystem Store** (ARCHITECTURE.md §3 ownership table). There is no separate "File Explorer's own copy" of filesystem data. A visitor who deletes nothing, since delete isn't supported, will always see identical structure whether browsing graphically or via terminal — this consistency is a testable acceptance criterion (see TEST_PLAN.md).

## 7. Acceptance Criteria

- Launching `file-explorer` with no args opens at root ("My Computer") showing the `Local Disk (C:)` entry.
- Navigating into `Local Disk (C:) → Projects` shows exactly the set of projects present in `ProjectRegistry`, with no hardcoded entries — verified by adding a test project record and confirming it appears without any component code change (extensibility acceptance test).
- Double-clicking a project file opens a `project-viewer` window with correct `projectId` launch arg.
- Back/Forward/Up buttons function correctly across at least 3 levels of navigation depth.
- Command Prompt's `dir` at a given `cwd` and File Explorer's view at the equivalent path show matching contents (cross-system consistency check).

## 8. Document Authority

FILE_EXPLORER_SPEC.md governs File Explorer's behavior and the canonical default filesystem structure. It must conform to DATA_MODEL.md §5's type shapes; it does not redefine them.
