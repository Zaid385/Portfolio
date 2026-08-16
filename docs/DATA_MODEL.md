# DATA_MODEL.md — Data Structures & Registries

**Status:** Source of truth for shape of data used across the system. TypeScript-flavored pseudo-interfaces — exact syntax is for the implementing agent to finalize per project conventions, but field names, types, and relationships defined here must be preserved.

---

## 1. Application Registry

```ts
interface AppDefinition {
  id: string;                       // unique, kebab-case, e.g. "notepad", "project-viewer"
  title: string;                    // default window/taskbar/start-menu title
  icon: AssetRef;                   // see ASSET_MANIFEST.md
  component: ComponentRef;          // React component implementing the app body
  singleInstance: boolean;
  defaultWindow: {
    width: number;
    height: number;
    x?: number;                     // if omitted, Window Manager computes cascade position
    y?: number;
    resizable: boolean;
    maximizable: boolean;
    minWidth?: number;
    minHeight?: number;
  };
  category?: 'system' | 'portfolio' | 'game' | 'utility';  // used for Start Menu grouping/filtering
}

type ApplicationRegistry = Record<string, AppDefinition>;
```

Launch-time payload (not part of the static registry, passed at call time):
```ts
interface LaunchArgs {
  [key: string]: unknown;           // per-app typed payload, e.g. { projectId: string } for project-viewer
}

launchApp(appId: string, args?: LaunchArgs): WindowId;
```

## 2. Window Instance Model

```ts
interface WindowInstance {
  windowId: string;                 // unique per open instance
  appId: string;                    // references AppDefinition.id
  title: string;                    // may be overridden by the app at runtime (e.g., Notepad shows filename)
  icon: AssetRef;
  launchArgs?: LaunchArgs;
  position: { x: number; y: number };
  size: { width: number; height: number };
  restoreBounds?: { x: number; y: number; width: number; height: number }; // for maximize/restore
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  isFocused: boolean;
  isResizable: boolean;
  isMaximizable: boolean;
}
```

Owned exclusively by the Window Manager store per ARCHITECTURE.md §3.

## 3. Desktop Icon Configuration

```ts
interface DesktopIconConfig {
  id: string;                       // unique icon id (may differ from appId if multiple icons could map to same app in theory)
  label: string;                    // display text under icon
  icon: AssetRef;
  appId: string;                    // references AppDefinition.id
  launchArgs?: LaunchArgs;
  order: number;                    // grid position ordering
}

type DesktopConfig = DesktopIconConfig[];
```

## 4. Start Menu Configuration

```ts
interface StartMenuEntry {
  id: string;
  label: string;
  icon: AssetRef;
  appId?: string;                   // leaf entry — omitted if this is a submenu parent
  launchArgs?: LaunchArgs;
  children?: StartMenuEntry[];      // submenu (e.g., "Games", "Socials")
  column: 'left' | 'right';
  order: number;
}

type StartMenuConfig = StartMenuEntry[];
```

## 5. Virtual Filesystem Model

```ts
type FsNodeType = 'folder' | 'file' | 'app-link';

interface FsNodeBase {
  id: string;                       // unique node id
  name: string;                     // display name, e.g. "Audioflow", "Resume.pdf"
  type: FsNodeType;
  parentId: string | null;          // null = root ("My Computer" or drive root)
}

interface FsFolderNode extends FsNodeBase {
  type: 'folder';
  childIds: string[];
}

interface FsFileNode extends FsNodeBase {
  type: 'file';
  fileKind: 'text' | 'document' | 'image' | 'project-ref' | 'social-ref';
  contentRef?: string;              // e.g., reference into content/projects.ts, or raw text for simple files
  openAppId: string;                // which app opens this on double-click, e.g. "navigation-guide-viewer", "notepad", "project-viewer"
  launchArgs?: LaunchArgs;          // e.g. { projectId: 'audioflow' } — this is how a filesystem file "is" a project
}

interface FsAppLinkNode extends FsNodeBase {
  type: 'app-link';                 // a filesystem entry that just launches an app (e.g., a shortcut)
  appId: string;
  launchArgs?: LaunchArgs;
}

type FsNode = FsFolderNode | FsFileNode | FsAppLinkNode;

interface VirtualFilesystem {
  nodesById: Record<string, FsNode>;
  rootId: string;
}
```

**Consistency rule (per SYSTEM_DESIGN.md §7 decision):** a Desktop icon representing a "file" (e.g., Resume) and its counterpart under `C:\Documents\` must reference the same `appId` + `launchArgs` pair (ideally the same conceptual entry duplicated as two `DesktopIconConfig`/`FsNode` records pointing at identical launch semantics) so behavior is identical regardless of entry point.

## 6. Recycle Bin Entries

```ts
interface RecycleBinEntry {
  id: string;
  name: string;                     // e.g. "old_portfolio.exe"
  icon: AssetRef;
  flavorText?: string;              // shown if the entry is "opened" — a joke message, not a real file open
  originalPath?: string;            // flavor only, e.g. "C:\Users\Zaid\Desktop\"
}

type RecycleBinContent = RecycleBinEntry[];
```

## 7. Project Data Model

```ts
interface ProjectRecord {
  id: string;                       // e.g. "audioflow"
  name: string;                     // "[PROJECT NAME]"
  shortDescription: string;         // "[PROJECT DESCRIPTION]" — for icon tooltip/list view
  longDescription: string;          // full description for viewer window
  techStack: string[];              // ["React", "Node.js", ...]
  repoUrl?: string;                 // "[PROJECT REPOSITORY URL]"
  deploymentUrl?: string;           // "[PROJECT DEPLOYMENT URL]"
  screenshots: AssetRef[];          // ["[ASSET: PROJECT_SCREENSHOT_<NAME>_1]", ...]
  icon: AssetRef;                   // "[ASSET: PROJECT_ICON_<NAME>]"
  status?: 'deployed' | 'in-progress' | 'archived';
  customWindowConfig?: Partial<AppDefinition['defaultWindow']>;  // optional per-project override
  tags?: string[];                  // for potential filtering/search inside File Explorer or Command Prompt `projects` command
}

type ProjectRegistry = ProjectRecord[];
```

Rendering rule: the `ProjectViewer` app component is generic — it takes a `projectId` launch arg and renders whatever `ProjectRecord` fields are present. No component may hardcode a specific project's name/description/links (PRD FR-25).

## 8. Social Link Model

```ts
interface SocialRecord {
  id: string;                       // "linkedin", "github"
  label: string;                    // "LinkedIn", "GitHub"
  url: string;                      // "[YOUR LINKEDIN URL]", "[YOUR GITHUB URL]"
  icon: AssetRef;
  embeddable: boolean;              // drives Browser app fallback behavior, see UI_UX_SPEC.md §10
}

type SocialRegistry = SocialRecord[];
```

## 9. Resume / About Data Model

```ts
interface ResumeData {
  name: string;                     // "[YOUR NAME]"
  title: string;                    // "[YOUR PROFESSIONAL TITLE]"
  summary: string;                  // "[YOUR SUMMARY]"
  skills: string[];
  experience: Array<{
    role: string;
    organization: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    program: string;
    period: string;
  }>;
  documentAsset?: AssetRef;         // "[ASSET: RESUME_PDF]" if a downloadable PDF is also offered
}
```

## 10. Settings Model

See SETTINGS_SPEC.md for full detail; shape referenced here for completeness:

```ts
interface SettingsState {
  brightness: number;      // 0–100
  volume: number;          // 0–100
  soundEffectsEnabled: boolean;
  animationsEnabled: boolean;
  crtEffectEnabled?: boolean;   // optional/stretch
  schemaVersion: number;        // for localStorage migration safety
}
```

## 11. Command Registry Model

See COMMAND_PROMPT_SPEC.md for full detail; shape referenced here:

```ts
interface CommandDefinition {
  name: string;                 // "help", "whoami"
  aliases?: string[];
  description: string;          // shown in `help`
  usage?: string;                // "cd <path>"
  execute: (args: string[], ctx: CommandContext) => CommandResult;
}
```

## 12. Asset Reference Type

```ts
type AssetRef = string;   // placeholder token, e.g. "[ASSET: XP_MY_COMPUTER_ICON]" during documentation/design phase;
                           // resolves to a real imported asset path once assets are supplied (see ASSET_MANIFEST.md)
```

## 13. Document Authority

DATA_MODEL.md governs field-level shape of all cross-system data. CONTENT_SCHEMA.md governs how *content authors* (not engineers) populate these structures with real portfolio content. Where they overlap, DATA_MODEL.md's types are authoritative; CONTENT_SCHEMA.md must produce data conforming to these types.
