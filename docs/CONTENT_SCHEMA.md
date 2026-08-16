# CONTENT_SCHEMA.md — Portfolio Content Structure & Authoring Guide

**Status:** Source of truth for how a **content author** (not necessarily a systems engineer) populates the portfolio's real data, conforming to the types defined in DATA_MODEL.md. This document is the bridge between "raw personal facts" and the typed registries the app consumes.

---

## 1. Purpose

DATA_MODEL.md defines the *shape* of data. This document defines *where that data lives in the codebase*, *how it's organized for editing*, and *what content is required vs. optional* — so that adding a new project, social link, or resume bullet is a pure data-file edit, never a component code change (PRD's data-driven mandate).

## 2. Content File Organization (recommended)

```
src/content/
  resume.ts          # exports a single ResumeData object
  projects.ts         # exports ProjectRegistry (array of ProjectRecord)
  socials.ts           # exports SocialRegistry (array of SocialRecord)
  recycle-bin.ts       # exports RecycleBinContent (array of RecycleBinEntry)
  navigation-guide.ts  # exports the Navigation guide.txt body text (string or string[])
  ascii-banner.ts       # exports the Command Prompt ASCII-art name banner (string)
```

Each file is independently editable without touching `apps/*` component code — this is the concrete mechanism satisfying PRD's "do not hardcode project data into UI components."

## 3. Required vs. Optional Fields by Content Type

### 3.1 `ResumeData` (resume.ts)
**Required:** `name`, `title`, `summary`, `skills` (min 1), `experience` (may be empty array if not yet ready, but field must exist).
**Optional:** `education`, `documentAsset`.
**Placeholder convention:** until real content is supplied, all string fields use bracketed placeholders exactly as specified in PRD, e.g. `"[YOUR NAME]"`, `"[YOUR SUMMARY]"` — implementing agents must NOT invent plausible-sounding filler bio text; placeholders must remain literal and obvious.

### 3.2 `ProjectRecord[]` (projects.ts)
**Required per entry:** `id`, `name`, `shortDescription`, `longDescription`, `techStack` (may be empty array), `icon`.
**Optional per entry:** `repoUrl`, `deploymentUrl`, `screenshots`, `status`, `customWindowConfig`, `tags`.
**Minimum viable seed set for MVP testing/demo purposes:** at least 2–3 placeholder `ProjectRecord` entries (e.g., `[PROJECT NAME 1]`, `[PROJECT NAME 2]`) so File Explorer's Projects folder and the `projects` command are non-empty during development, without inventing real project facts — placeholders must be clearly marked as such, not presented as real content in any build meant for review.

### 3.3 `SocialRecord[]` (socials.ts)
**Required per entry:** `id`, `label`, `url`, `icon`, `embeddable`.
**Minimum seed set:** LinkedIn and GitHub entries at minimum, per PRD's explicit desktop icon list; both use `"[YOUR LINKEDIN URL]"` / `"[YOUR GITHUB URL]"` placeholders until supplied, and `embeddable: false` for both (both are known to block iframe embedding — see UI_UX_SPEC.md §10).

### 3.4 `RecycleBinContent` (recycle-bin.ts)
**Required per entry:** `id`, `name`, `icon`.
**Optional per entry:** `flavorText`, `originalPath`.
**Content note:** the example filenames in the PRD (`old_portfolio.exe`, `unfinished_idea.txt`, `bad_code.c`, `sleep_schedule.txt`) are explicitly examples, not mandates — final humorous content is a content-authoring decision left to [YOUR NAME], not fabricated by the implementing agent beyond these illustrative seeds unless instructed otherwise.

### 3.5 Navigation Guide (navigation-guide.txt content)
Must cover, at minimum, the topics enumerated in PRD: double-clicking icons, Start Menu usage, My Computer, opening applications, taskbar usage, playing games, using the Command Prompt, and a hint (not a spoiler) that easter eggs exist. Placeholder/draft body text is acceptable for MVP per PRD ("text itself can initially be placeholder content"), but must still be structurally complete (i.e., a stub for every required topic, not entirely blank).

### 3.6 Desktop Icon List & Start Menu Config
Not "content" in the personal-facts sense, but configuration data — still lives in `src/registries/` (ARCHITECTURE.md §7) rather than `content/`, since it's structural/UX config referencing content, not content itself. The initial desktop icon set matches PRD's explicit list (My Computer, Recycle Bin, Resume, Navigation guide.txt, LinkedIn, GitHub, Projects, Command Prompt, Notepad, Control Panel, DOOM, Minesweeper, Snake) as the seeded default, adjustable by editing this config array.

## 4. Content Author Workflow (for future edits, human or agent)

1. To add a new project: append a new `ProjectRecord` to `projects.ts` with a unique `id`; it automatically appears in File Explorer's Projects folder, the `projects` Command Prompt command, and (if desired) can be added to Desktop/Start Menu config for direct visibility — no other file requires editing.
2. To add a new social link: append to `socials.ts`; automatically appears in File Explorer's Social folder and the `socials` command; add to Desktop/Start Menu config if it should also appear there directly.
3. To adjust resume content: edit fields in `resume.ts` directly; both the Resume viewer app and the `whoami`/`about`/`skills` commands source from this single object.
4. To add a new easter egg file: append to `recycle-bin.ts`, or introduce a new hidden `FsNode`/hidden Command Prompt command per COMMAND_PROMPT_SPEC.md §5 — never requires modifying Recycle Bin or Command Prompt component logic itself.

## 5. Content Validation (recommended, not blocking for MVP)

- A lightweight runtime or build-time check (e.g., a simple TypeScript type-check plus an optional Zod schema validation layer) verifying required fields are present is recommended so a malformed content entry fails fast during development rather than silently rendering a broken card. [DECISION REQUIRED: adopt Zod or rely on TypeScript alone — TypeScript alone is likely sufficient for this project's scale; Zod adds a dependency whose value is marginal here given content is authored by the same team, not external users — recommend TypeScript-only for MVP, consistent with "avoid unnecessary dependencies."]

## 6. Document Authority

CONTENT_SCHEMA.md governs where and how real content is authored and organized. It must produce data strictly conforming to DATA_MODEL.md's types; it does not introduce new fields beyond what DATA_MODEL.md defines without a corresponding update to that document first.
