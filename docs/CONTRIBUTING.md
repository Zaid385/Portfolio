# CONTRIBUTING.md — Development Conventions

**Status:** Rules for any future developer or AI coding agent (including Antigravity CLI) working on this codebase. Compliance with this document is a prerequisite for any merged change.

---

## 1. Source of Truth Hierarchy (restated from README.md, critical enough to repeat here)

1. **PRD.md** — what the product must do. Wins on product-behavior disputes.
2. **TRD.md** — technology/tooling constraints. Wins on stack/tooling disputes.
3. **ARCHITECTURE.md** — system boundaries and ownership. Wins on "which system owns this state" disputes.
4. **SYSTEM_DESIGN.md** and the per-system `*_SPEC.md` files — internal behavior of a given system. The dedicated spec (e.g., WINDOW_MANAGER_SPEC.md) wins over SYSTEM_DESIGN.md's cross-system summary for that system's fine detail.
5. **DEVELOPMENT_PHASES.md** — what gets built, in what order.
6. **TEST_PLAN.md** — how correctness is verified.

If any two documents appear to conflict, resolve using this hierarchy and flag the lower-priority document for a correcting edit — do not silently implement one interpretation without noting the discrepancy (e.g., in the PR description).

## 2. Core Implementation Rules

- **No hardcoded content in components.** Any project/social/resume/desktop-icon/filesystem data must come from `src/content/` or `src/registries/` (CONTENT_SCHEMA.md §2), never inlined in a component file.
- **No duplicated application launch logic.** Every entry point (Desktop, Start Menu, File Explorer, Command Prompt) must call the shared `launchApp` (WINDOW_MANAGER_SPEC.md §2). Do not write a bespoke "open this app" code path anywhere else.
- **No per-app reimplementation of window chrome.** Drag/resize/minimize/maximize/close/focus behavior lives only in the Window Manager / `WindowFrame`. An app component receiving `AppComponentProps` never manages its own window position/size state.
- **No ad-hoc audio playback.** All sounds route through `audioManager.play(soundId)` (AUDIO_SPEC.md §1). No component constructs its own `Audio()`/`AudioContext`.
- **No raw asset path strings.** All asset references go through the central asset manifest/registry (ASSET_MANIFEST.md §1), keyed by the documented placeholder tokens until real assets are supplied.
- **No arbitrary code execution.** The Command Prompt parser must never `eval` input (SECURITY.md §1). This is tested and reviewed with zero tolerance.
- **External navigation safety.** All `window.open` calls for external URLs use the shared `openExternal` utility with `noopener,noreferrer` (SECURITY.md §1).
- **Respect the read-only filesystem guarantee** for v1 (FILE_EXPLORER_SPEC.md §5) — do not add mutating UI affordances (delete/rename/move) without an explicit spec update authorizing it first.

## 3. Adding New Things (the extensibility contract in practice)

| To add... | Touch only... |
|---|---|
| A new project | `src/content/projects.ts` (append a `ProjectRecord`); optionally `DesktopConfig`/`StartMenuConfig` if it should appear there directly |
| A new social link | `src/content/socials.ts` |
| A new desktop icon for an existing app | `src/registries/` desktop config array |
| A new Command Prompt command | `src/registries/command-registry.ts` (add a `CommandDefinition`) |
| A new sound event | Add a `SoundId` union member, an asset manifest token, and a `play()` call at the trigger site |
| A new application entirely | `AppDefinition` in the Application Registry + a new component under `src/apps/<name>/` conforming to the `AppComponentProps` contract (ARCHITECTURE.md §4) |
| A new easter egg | A new `RecycleBinEntry`, a hidden `CommandDefinition`, or a new discoverable trigger — per SYSTEM_DESIGN.md §13–14's extensibility notes, without modifying core Recycle Bin/Command Prompt/dialog logic |

If completing a task from the table above requires touching files outside the listed scope, treat that as a signal the architecture has a gap — flag it rather than silently working around it with a one-off hack.

## 4. Handling `[DECISION REQUIRED]` and `[TBD]` Markers

- These markers throughout the documentation set indicate an intentionally deferred decision, not an oversight.
- An implementing agent encountering one during a phase should: (a) make the most sensible, spec-consistent choice using the "Recommend:" guidance given alongside the marker where present, (b) implement it, and (c) update the relevant document to replace the marker with the resolved decision and a one-line rationale, so future phases/readers see a settled answer rather than a stale open question.
- Do not silently ignore a `[DECISION REQUIRED]` marker and implement without addressing it — even picking the stated recommendation must be recorded as a resolution, not left ambiguous.

## 5. Placeholder Content Discipline

- Bracketed placeholders (`[YOUR NAME]`, `[PROJECT NAME]`, `[ASSET: ...]`, etc.) must remain literally present and unmodified until real content/assets are supplied by the project owner. Do not invent plausible-sounding filler biographical or project content to "fill in" a placeholder — this was an explicit constraint from the original project brief and remains binding for any agent implementing from these documents.

## 6. Commit / PR Conventions

- One phase (or a clearly-scoped sub-piece of a large phase) per PR where practical, matching DEVELOPMENT_PHASES.md's boundaries — this keeps review tractable and matches the "usable after intermediate phases" principle.
- PR description should reference which phase(s) and which spec document(s) the change implements, and explicitly note any `[DECISION REQUIRED]` markers resolved in that PR.
- Every bug fix includes a regression test (TEST_PLAN.md §2.7).
- New assets added to the manifest must include their licensing status/source in the PR description (SECURITY.md §4).

## 7. Code Style

- TypeScript strict mode enabled project-wide.
- ESLint + Prettier enforced via CI; no merging with lint errors.
- Prefer small, focused components; a component exceeding roughly 200–300 lines is a signal to consider splitting it, though this is a guideline, not a hard gate.
- Zustand stores should expose a minimal, intentional public API (selectors + action functions) rather than raw mutable state access wherever practical.

## 8. Definition of Done (per-task, complements each phase's own DoD in DEVELOPMENT_PHASES.md)

A task/PR is done when: it satisfies its phase's stated acceptance criteria, it does not violate any rule in §2 of this document, relevant tests are added/passing, relevant documentation (`[DECISION REQUIRED]` markers, ASSET_MANIFEST.md entries) is updated, and CI is green.

## 9. Document Authority

CONTRIBUTING.md governs process and cross-cutting implementation conventions. It does not redefine product/technical/architectural decisions made elsewhere — it enforces adherence to them.
