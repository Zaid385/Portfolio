# README.md — Windows XP Portfolio Simulation
## Project Overview & Implementation Entry Point

This repository's documentation package defines a portfolio website that functions as a simulated Windows XP desktop environment, inside which [YOUR NAME]'s professional portfolio (resume, projects, socials, skills) is presented as native OS content — files, folders, applications — rather than as a conventional web page.

**This README is the entry point.** It does not restate other documents' content; it tells you (a human contributor or an AI coding agent such as Antigravity CLI) which document to read for which question, and provides the cross-cutting synthesis (dependency graph, decision list, risks, Definition of Done) requested by the original project brief.

---

## 1. Document Index & Source-of-Truth Hierarchy

| # | Document | Answers |
|---|---|---|
| 1 | `PRD.md` | What must the product do? |
| 2 | `TRD.md` | What technology/tooling constraints apply? |
| 3 | `ARCHITECTURE.md` | How do systems fit together; who owns what state? |
| 4 | `SYSTEM_DESIGN.md` | How do systems behave internally, cross-system? |
| 5 | `UI_UX_SPEC.md` | How does the visitor experience interactions? |
| 6 | `DATA_MODEL.md` | What are the exact data shapes/types? |
| 7 | `ASSET_MANIFEST.md` | What visual/audio assets are needed (placeholders)? |
| 8 | `AUDIO_SPEC.md` | How does sound work? |
| 9 | `GAME_SPEC.md` | How do Snake/Minesweeper/DOOM work, and how is DOOM integrated? |
| 10 | `COMMAND_PROMPT_SPEC.md` | How does the virtual terminal work? |
| 11 | `FILE_EXPLORER_SPEC.md` | How does the virtual filesystem/My Computer work? |
| 12 | `WINDOW_MANAGER_SPEC.md` | How does window lifecycle work? (Most critical single doc.) |
| 13 | `SETTINGS_SPEC.md` | How do brightness/volume/toggles/persistence work? |
| 14 | `CONTENT_SCHEMA.md` | Where/how is real portfolio content authored? |
| 15 | `DEVELOPMENT_PHASES.md` | What gets built, in what order? (Primary execution guide.) |
| 16 | `TEST_PLAN.md` | How is correctness verified? |
| 17 | `SECURITY.md` | What security constraints apply? |
| 18 | `PERFORMANCE.md` | What performance budgets/strategy apply? |
| 19 | `CONTRIBUTING.md` | What conventions must every change follow? |
| 20 | `README.md` (this file) | Where do I start, and what's the big picture? |

**Authority order when documents conflict:** PRD → TRD → ARCHITECTURE → SYSTEM_DESIGN/dedicated specs → DEVELOPMENT_PHASES → TEST_PLAN, per CONTRIBUTING.md §1. In practice, this documentation set was authored to be internally consistent; a genuine conflict likely indicates a real ambiguity worth flagging rather than silently resolving.

---

## 2. Dependency Graph (Phases)

```
Phase 0 (Foundation)
   │
   ▼
Phase 1 (Boot) ──────────────┐
   │                         │
   ▼                         │
Phase 2 (Desktop) ◄──────────┘
   │
   ▼
Phase 3 (Window Manager)  ◄── the critical-path bottleneck; nearly everything depends on this
   │
   ├──────────────┬──────────────┐
   ▼              ▼              ▼
Phase 4        Phase 5        Phase 6
(Taskbar)      (Start Menu)   (App Registry finalization)
   │              │              │
   └──────┬───────┴──────────────┘
          ▼
   Phase 7 (Virtual Filesystem / My Computer)
          │
   ┌──────┼───────────────┬───────────────┐
   ▼      ▼               ▼               ▼
Phase 8  Phase 9        Phase 10        Phase 12
(Nav     (Notepad)      (Command        (Browser)
Guide)                  Prompt)             │
   │      │               │                 │
   └──────┴───────┬───────┘                 │
                   ▼                         │
        Phase 11 (Control Panel/Settings)    │
                   │                         │
   ┌───────────────┼─────────────────────────┘
   ▼               ▼
Phase 13        Phase 14 ◄── depends on Phase 12 (Browser)
(Resume)        (Socials)
   │               │
   └───────┬───────┘
           ▼
     Phase 15 (Projects)
           │
           ▼
     Phase 16 (Audio) ◄── depends on Phase 11 (Settings) for volume binding
           │
   ┌───────┼───────┬───────────┐
   ▼       ▼       ▼           │
Phase 17 Phase 18 Phase 19     │
(Snake)  (Mine-   (DOOM)       │
         sweeper)              │
   │       │       │           │
   └───────┴───────┴───────────┘
           ▼
     Phase 20 (Easter Eggs / BSOD) ◄── depends on Phase 7 (loosely) and Phase 16 (sound)
           ▼
     Phase 21 (Polish / A11y / Responsive) ◄── depends on ALL prior phases
           ▼
     Phase 22 (Performance) ◄── depends on ALL prior phases
           ▼
     Phase 23 (Production Testing & Deployment) ◄── depends on ALL prior phases
```

**Key bottleneck:** Phase 3 (Window Manager) is the load-bearing dependency for the entire rest of the project. It should receive the most implementation care and review rigor of any single phase.

**Parallelizable work (if multiple agents/contributors are available):** Once Phase 7 (Filesystem) is complete, Phases 8, 9, 10, and 12 have no dependencies on each other and can proceed in parallel. Once Phase 16 (Audio) is complete, Phases 17, 18, and 19 (the three games) can proceed in parallel — though see §4 below regarding de-risking DOOM earlier than strict dependency order requires.

---

## 3. Recommended Implementation Order

The numeric phase order in `DEVELOPMENT_PHASES.md` (0 → 23) **is** the recommended order for a single-threaded (one agent/contributor at a time) implementation, with one adjustment worth calling out explicitly:

> **Recommendation:** Run a short, throwaway technical spike for DOOM integration (GAME_SPEC.md §4) early — ideally right after Phase 6 (Application Registry) is stable — even though its "real" phase slot is 19. This is because DOOM is the single highest-uncertainty item in the entire roadmap (licensing verification, WASM port selection, browser-compatibility confirmation), and discovering a blocker early is far cheaper than discovering it after 18 other phases are built. The spike's findings should feed back into finalizing GAME_SPEC.md §4's `[DECISION REQUIRED]` items before Phase 19 formally begins; the spike itself is not a shippable phase and its throwaway code should not be merged as Phase 19's actual implementation unless it happens to already meet that phase's full Definition of Done.

Otherwise, proceed phase-by-phase in numeric order, respecting the dependency graph in §2.

---

## 4. Decisions That MUST Be Made Before Coding Begins

These are `[DECISION REQUIRED]` items whose resolution materially affects architecture or early phases, and should be settled before or during Phase 0–3, not deferred:

1. **Brightness implementation approach** — CSS `filter` vs. overlay-div (SYSTEM_DESIGN.md §6). Affects how DOOM's canvas is later composed with the effect (Phase 21 testing depends on this being settled early).
2. **react-rnd vs. hand-rolled drag/resize** (TRD.md §1, WINDOW_MANAGER_SPEC.md §7) — affects Phase 3's core implementation approach directly.
3. **Adapted/touch-mode breakpoint and general strategy confirmation** (UI_UX_SPEC.md §8) — while full implementation is Phase 21, the Window Manager (Phase 3) and Desktop (Phase 2) should be built with this strategy in mind from the start to avoid a late architectural retrofit.
4. **DOOM integration option confirmation** (Option A vs. B vs. C, GAME_SPEC.md §4.3) — should be resolved via the early spike recommended in §3 above, well before Phase 19's formal slot.
5. **Single-pane vs. tree+pane File Explorer navigation model** (FILE_EXPLORER_SPEC.md §3) — affects Phase 7's component structure.
6. **Font choice for the primary UI typeface** (ASSET_MANIFEST.md §13) — affects early CSS theme work (Phase 0/2) and is annoying to swap late once spacing/layout has been tuned around a specific font's metrics.

---

## 5. Decisions That Can Safely Be Deferred

These `[DECISION REQUIRED]`/`[TBD]` items can reasonably wait until their relevant phase, or later, without materially affecting earlier architecture:

- Whether free-drag desktop icon repositioning is supported (SYSTEM_DESIGN.md §2) — additive, doesn't affect core rendering approach.
- Right-click context menus for icons/files (UI_UX_SPEC.md §2, FILE_EXPLORER_SPEC.md §5) — purely additive polish.
- Optional welcome/login boot stage inclusion (SYSTEM_DESIGN.md §1.1) — additive stage, doesn't affect the boot gate's core mechanics.
- Minesweeper difficulty selector (GAME_SPEC.md §3.1) — additive once the core game exists.
- Cross-session high-score persistence for games (GAME_SPEC.md §1) — additive, reuses the existing Settings persistence pattern trivially.
- Full path-based tab completion in Command Prompt (COMMAND_PROMPT_SPEC.md §8) — command-name-only completion is a complete, shippable MVP.
- Alt+Tab window cycling (WINDOW_MANAGER_SPEC.md §9) — nice-to-have, non-blocking.
- Exact CSP policy string (SECURITY.md §2) — finalized once all real external domains are known, appropriately deferred to Phase 23.
- Client-side routing/deep-linking (TRD.md §1.1) — a genuine post-MVP enhancement.
- BSOD final trigger mechanism specifics and whether it's repeatable (SYSTEM_DESIGN.md §13, DEVELOPMENT_PHASES.md Phase 20) — needs deciding by Phase 20, not earlier.

---

## 6. Risks & Mitigation Strategies

| Risk | Impact | Mitigation |
|---|---|---|
| **DOOM integration proves more time-consuming or legally ambiguous than expected** | Could delay or force cutting the most attention-grabbing feature | Early spike (§3); strict adherence to shareware-WAD-only licensing path (GAME_SPEC.md §4.2); Option C (link-out) as a documented, lower-quality fallback if Option A genuinely fails, better than shipping nothing. |
| **XP-authentic visual/audio assets are unavailable or infringing if sourced carelessly** | Legal exposure, or a project that looks/sounds "off-brand" without real assets | ASSET_MANIFEST.md's placeholder discipline (never guess/fabricate asset paths); explicit recreation-not-copying guidance throughout; SECURITY.md §4/§5 checklist before production. |
| **Window Manager complexity becomes a bottleneck or accrues bugs that cascade into every dependent app** | Since nearly all phases depend on Phase 3, defects here are maximally expensive | Disproportionate testing investment in WINDOW_MANAGER_SPEC.md's documented edge cases (§10); treat Phase 3 as the highest-scrutiny code review of the project. |
| **Free-form windowing doesn't translate to mobile/touch, alienating a meaningful share of visitors (e.g., recruiters browsing on a phone)** | Poor mobile experience undermines PRD §2 Goal 6 | Adapted Mode is a first-class, explicitly designed and tested mode (UI_UX_SPEC.md §8), not an afterthought; treated as a required decision before Phase 3 per §4 above, not deferred until Phase 21. |
| **The OS metaphor obscures the actual professional payload for a time-constrained recruiter** | Undermines the core business purpose of a portfolio site | PRD §5.2's explicit "recruiter in a hurry" journey requirement; Navigation Guide + familiar, clearly-labeled icons (Resume, LinkedIn, GitHub) ensure a fast path exists without requiring the visitor to "get" the joke first. |
| **Scope creep from easter-egg ideation** | Could balloon timeline on low-value novelty content | SYSTEM_DESIGN.md/GAME_SPEC.md's explicit "do not over-design these now" guidance; easter eggs are architecturally additive (extensible by design) and can be layered in incrementally post-MVP without blocking core phases. |
| **Audio autoplay restrictions cause a broken-feeling silent boot** | First impression feels incomplete/buggy | AUDIO_SPEC.md §3's explicit gesture-gated queuing strategy, designed in from the start rather than discovered as a bug late. |
| **Performance degrades as more windows/apps/content accumulate over the phased build** | Slow, janky feel undermines the "polished, authentic OS" goal | PERFORMANCE.md's budgets and Phase 22's dedicated pass; code-splitting discipline enforced from Phase 6 onward (lazy-loading pattern established early, not retrofitted). |

---

## 7. Definition of Done — Overall Project

- [ ] All 23 phases in `DEVELOPMENT_PHASES.md` meet their individual Definition of Done.
- [ ] All functional requirements in `PRD.md` §6 are implemented and verified.
- [ ] All non-functional requirements in `PRD.md` §7 are met (verified via `TEST_PLAN.md` and `PERFORMANCE.md`).
- [ ] `TEST_PLAN.md`'s full test suite passes (unit, component, E2E, accessibility, cross-browser, performance).
- [ ] `SECURITY.md` §5 production hardening checklist is fully checked off.
- [ ] `ASSET_MANIFEST.md` audit: every token is either resolved to a real, licensed/recreated asset, or explicitly tracked as an intentionally-deferred follow-up (none silently missing/broken in production).
- [ ] No component violates any rule in `CONTRIBUTING.md` §2 (verified via code review across the full codebase, not just recent changes).
- [ ] All `[DECISION REQUIRED]`/`[TBD]` markers across the documentation set have been resolved and the markers replaced with recorded decisions (`CONTRIBUTING.md` §4).
- [ ] Production deployment on Vercel is live, stable, and passes a full manual smoke test of every user journey in `PRD.md` §5.
- [ ] The site is usable and legible on both desktop and a representative small/touch device.
- [ ] A recruiter-style "find the resume and contact info fast" walkthrough succeeds within the target time described in `PRD.md` §5.2 without guidance.

---

## 8. Instructions for Antigravity CLI

If you are an AI coding agent (Antigravity CLI or otherwise) implementing this project from this documentation package, follow this process:

1. **Read in this order before writing any code:** `README.md` (this file) → `PRD.md` → `TRD.md` → `ARCHITECTURE.md`. This gives you the full "what/why/how-it-fits-together" picture before touching any phase-specific detail.
2. **Work phase-by-phase, in the order specified in `DEVELOPMENT_PHASES.md`**, respecting the dependency graph in §2 above and the single early-spike exception noted in §3 (DOOM). Do not skip ahead to a later phase whose dependencies aren't yet satisfied, even if it seems more interesting or easier — the phases are ordered deliberately.
3. **Before starting a phase, read its full entry in `DEVELOPMENT_PHASES.md`**, plus every dedicated spec document it references (e.g., before Phase 3, read `WINDOW_MANAGER_SPEC.md` in full; before Phase 10, read `COMMAND_PROMPT_SPEC.md` in full). Do not implement from memory of an earlier skim — re-read the authoritative spec immediately before implementing it.
4. **Treat every `[DECISION REQUIRED]` or `[DECISION REQUIRED]`-adjacent "recommend X" note as requiring an explicit resolution**, per `CONTRIBUTING.md` §4 — pick the documented recommendation unless you have a clearly better, spec-consistent reason not to, implement it, and update the source document to reflect the resolved decision so the marker doesn't linger as stale ambiguity for a later phase or reader.
5. **Never invent portfolio content.** Every instance of `[YOUR NAME]`, `[PROJECT NAME]`, `[YOUR LINKEDIN URL]`, `[ASSET: ...]`, etc. must remain a literal, visible placeholder in the implementation until the project owner supplies real content — this is a hard constraint from the original brief, not a suggestion (`CONTRIBUTING.md` §5).
6. **Do not implement code outside the current phase's stated scope.** Each phase explicitly lists what must NOT be implemented yet — respect this even if it would be trivial to add "while you're in there." Scope discipline is what makes the phased structure valuable for review.
7. **After completing a phase, verify it against that phase's Acceptance Criteria and Definition of Done exactly as written** before considering it complete or moving to the next phase. Run the relevant tests from `TEST_PLAN.md`.
8. **If you discover a genuine contradiction between two documents**, resolve it using the authority hierarchy in §1/`CONTRIBUTING.md` §1, and note the resolution (ideally as a doc correction in the same change) rather than silently picking an interpretation without a trace.
9. **If you discover a requirement that is technically infeasible as written** (e.g., a genuine browser limitation not anticipated here), stop and flag it clearly rather than silently reinterpreting the requirement into something easier — this documentation set explicitly prefers a flagged blocker over a silently-diminished feature.
10. **At the end of implementation, run the full "Definition of Done — Overall Project" checklist in §7** before considering the project complete.

This documentation package is intended to be sufficient for you to implement this project without needing to guess about system responsibilities, component boundaries, state ownership, data ownership, dependencies, APIs, application lifecycle, file structure, naming, or acceptance criteria. If you find yourself genuinely guessing at any point, that is a signal the documentation has a gap — treat it the same as a technical-infeasibility blocker: flag it rather than silently filling it in.
