# COMMAND_PROMPT_SPEC.md — Virtual Shell Specification

**Status:** Source of truth for the Command Prompt application's command system, parser, state, and filesystem interaction. This is a **simulated, sandboxed shell** — it must never execute real operating-system commands (TRD.md §2 point 1, hard constraint).

---

## 1. Application Overview

- Registered in the Application Registry as `command-prompt`, `singleInstance: false` (a visitor may reasonably open more than one, matching real cmd.exe behavior), default window sized to a classic terminal aspect ratio, resizable.
- On mount: renders the ASCII-art name banner (see §7), then the first prompt line.
- Current working directory (`cwd`) state is **per-window-instance**, initialized to a default path (e.g., `C:\Users\Zaid`), not shared globally across multiple open Command Prompt windows (matches real-world multi-terminal behavior; each instance is independent).

## 2. Command Registry Architecture

```ts
interface CommandContext {
  cwd: string;                         // current virtual path for this instance
  setCwd: (path: string) => void;
  fs: VirtualFilesystem;               // read access to the shared Virtual Filesystem Store (DATA_MODEL.md §5)
  history: string[];                   // this instance's command history
  print: (line: string | string[]) => void;   // append output to this instance's scrollback
  clearScreen: () => void;
  launchApp: (appId: string, args?: LaunchArgs) => void;  // allows commands like a hypothetical `open resume` to trigger real app launches
}

interface CommandResult {
  output?: string | string[];          // lines to print; parser appends automatically if returned instead of using ctx.print directly
  error?: string;                      // if present, rendered in an error style
}

interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;                 // one-line, shown in `help` listing
  usage?: string;                      // e.g. "cd <path>"
  execute: (args: string[], ctx: CommandContext) => CommandResult | void;
}

type CommandRegistry = Record<string, CommandDefinition>;  // keyed by primary name; aliases resolved via a lookup map at parse time
```

**Extensibility rule:** Adding a new command requires only adding a new `CommandDefinition` to the registry array/object — the parser, input handling, and history system are entirely command-agnostic (NFR-3 compliance).

## 3. Parser Behavior

- Input line is split on whitespace, respecting simple quoted-string grouping for arguments containing spaces (e.g., `cd "My Documents"`) — a minimal shell-lexing behavior, not a full shell grammar (no piping, redirection, or chaining operators for MVP; `[DECISION REQUIRED — deferred, likely never necessary for this product's purpose]`).
- First token = command name, resolved case-insensitively against the registry (including aliases).
- Unknown command → a defined error message (see §6), not a silent no-op or crash.
- Empty input (Enter with no text) → simply prints a new empty prompt line, matching real shell behavior.

## 4. MVP Command Set

| Command | Aliases | Behavior |
|---|---|---|
| `help` | `?` | Lists all registered commands with their one-line descriptions, generated dynamically from the registry (never hardcoded prose) |
| `about` | | Prints a short bio blurb sourced from `ResumeData.summary` (DATA_MODEL.md §9) — not duplicated content, single source of truth |
| `whoami` | | Prints `ResumeData.name` + `ResumeData.title` |
| `skills` | | Lists `ResumeData.skills` |
| `projects` | | Lists all `ProjectRegistry` entries (name + short description); optionally `projects <id>` prints one project's long description — [DECISION REQUIRED: whether to support the argument form for MVP; recommend yes, trivial given shared data] |
| `socials` | | Lists all `SocialRegistry` entries with their URLs |
| `games` | | Lists available games and how to launch them (e.g., "Type `open snake` or find it on the Desktop") |
| `open <appId or path>` | `start` | Attempts to resolve the argument first against known app shortcuts (e.g., `open resume`, `open notepad`), then against the virtual filesystem (e.g., `open projects` if it resolves to a folder → equivalent to `cd`; if it resolves to a file → launches that file's `openAppId`) |
| `cd <path>` | | Changes `cwd` within the Virtual Filesystem Store; supports `..`, `.`, absolute (`C:\...`) and relative paths; errors clearly if path doesn't exist or isn't a folder |
| `dir` | `ls` | Lists contents of `cwd` (folders and files), styled loosely like classic `dir` output (name, type) — exact column formatting is a polish detail, not a functional requirement |
| `pwd` | | Prints `cwd` |
| `cat <file>` | `type` | Prints a text file's content if `fileKind === 'text'`; for non-text file kinds (e.g., `project-ref`), prints a short descriptive line and suggests `open <file>` instead |
| `echo <text>` | | Prints the given text back |
| `clear` | `cls` | Clears this instance's scrollback |
| `date` | | Prints the visitor's current local date/time (real `Date`, flavor command) |
| `history` | | Prints this instance's command history list |

This set is illustrative and extensible per PRD; the table above is the **agreed MVP baseline** — additional commands (easter eggs, e.g., a hidden `sudo`, `matrix`, `coffee` joke command) are additive per §5.

## 5. Easter-Egg Command Extensibility

Hidden/joke commands (not listed in `help` output, or listed with a deliberately vague description) are simply additional `CommandDefinition` entries with a flag such as `hidden?: boolean` excluded from the `help` listing but otherwise fully functional. This satisfies PRD's "architecture should allow them to be added later without changing core systems." No specific joke commands are mandated by this document — content ideation is deferred, consistent with "do not over-design these now."

## 6. Error Handling

| Scenario | Behavior |
|---|---|
| Unknown command | `'<cmd>' is not recognized as an internal or external command. Type 'help' for a list of available commands.` (styled error line, XP/cmd.exe-flavored phrasing) |
| Invalid path (`cd`) | `The system cannot find the path specified.` |
| Missing required argument | Print the command's `usage` string with a short "missing argument" note |
| Attempting a filesystem-mutating operation not supported (e.g., a hypothetical `del`/`rm` if ever added but not implemented) | Explicit "not supported in this environment" message rather than silently failing |

All error output is inline text within the scrollback (not a separate dialog), consistent with real terminal UX and UI_UX_SPEC.md's preference for inline clarity in functional messaging.

## 7. ASCII Art Banner

- Rendered once, at the top of a fresh Command Prompt window's scrollback, before the first prompt line.
- Content: `[YOUR NAME]` rendered in ASCII-art block-letter style (exact art is a content/asset concern, not an engineering one — the banner string itself is a static content constant, e.g., `content/ascii-banner.ts`, editable independent of parser logic).
- Must render legibly in the chosen monospace font at the default window width; if the window is resized narrower than the art's fixed width, standard horizontal scroll/overflow handling applies (no dynamic re-wrapping of ASCII art, which would break it) — [DECISION REQUIRED: whether to enforce a minimum window width for Command Prompt so the banner is never truncated; recommend yes, via `defaultWindow.minWidth`].

## 8. Input & History UX (cross-ref UI_UX_SPEC.md §6)

- `CommandContext.history` grows on each submitted (non-empty) command.
- Up/Down arrow cycles through history without mutating it (standard shell convention — editing a recalled history entry doesn't alter the stored history unless resubmitted).
- Tab completion: matches partial input against command names (and, if the current token appears to be a path argument, against child names of the relevant filesystem folder) — completes unambiguous matches, or lists candidates on a second Tab press if ambiguous (classic shell double-tab convention). [DECISION REQUIRED: implement full path-completion for MVP vs. command-name-only completion for MVP with path-completion deferred; recommend command-name-only for MVP given effort/value trade-off, path completion as a fast-follow.]

## 9. Security Constraints (restated, hard rule)

- No command implementation may call `eval`, `Function(...)`, or otherwise execute visitor-supplied strings as code.
- No command may perform real network requests to arbitrary visitor-specified hosts (a `curl`-like command is explicitly **not** part of this system; if ever considered, it would require strict allow-listing and is out of scope for v1).
- `open <url>`-style behavior for real external links (e.g., resolving to a `SocialRecord`) must use `window.open(url, '_blank', 'noopener,noreferrer')` — never navigate the current tab away from the portfolio without explicit, obvious visitor intent.

## 10. Document Authority

COMMAND_PROMPT_SPEC.md governs the virtual shell exhaustively. It reads from but does not redefine the Virtual Filesystem (FILE_EXPLORER_SPEC.md/DATA_MODEL.md §5) or Content Data Layer (DATA_MODEL.md §7–9) schemas.
