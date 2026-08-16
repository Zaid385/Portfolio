# PRD.md — Product Requirements Document
## Windows XP Portfolio Simulation

**Status:** Source of truth for WHAT the product must do.
**Does not define:** technology choices (see TRD.md), internal system architecture (see ARCHITECTURE.md / SYSTEM_DESIGN.md), or implementation order (see DEVELOPMENT_PHASES.md).

---

## 1. Vision

> A portfolio presented as if it were a personal Windows XP computer.

The product is **not** a portfolio website with decorative XP styling. It is a **simulated operating system** — boot sequence, desktop, window manager, taskbar, Start Menu, virtual filesystem, terminal, control panel, and installed applications — inside which the visitor discovers [YOUR NAME]'s professional portfolio (projects, resume, socials, skills) as if browsing a real, personal computer that happens to belong to a developer.

Windows XP is the **interaction language**. The portfolio content is the **payload**.

## 2. Goals

1. Deliver an unmistakably XP-authentic desktop OS experience (boot, desktop, windows, taskbar, Start Menu) that a visitor can navigate without instruction, using only prior real-world computer literacy.
2. Present all portfolio content (about, resume, projects, socials, skills) as native "citizens" of that OS — files, folders, applications — never as a bolted-on modal or separate page.
3. Provide genuinely playable, non-decorative games (Snake, Minesweeper, DOOM) as installed applications.
4. Support extending the OS with new applications, files, and projects via data/config, without rewriting core systems.
5. Maintain fast load times and smooth interaction despite visual and audio richness.
6. Be usable, understandable, and reasonably enjoyable on both desktop and constrained (touch/mobile) environments, with an explicitly documented degraded/adapted experience where full desktop-window interaction is impractical.

## 3. Non-Goals

- Recreating the entirety of Windows XP or its full application suite.
- Emulating a real OS kernel, real filesystem persistence to disk, or real networking.
- Providing a pixel-perfect Windows XP clone at the expense of usability, performance, or accessibility.
- Building DOOM's engine from scratch (see GAME_SPEC.md for the integration strategy).
- Real search-engine integration inside the simulated Browser beyond what browser security realistically allows (see UI_UX_SPEC.md / SYSTEM_DESIGN.md for fallback behavior).

## 4. Target Audience

- Recruiters, hiring managers, and technical interviewers evaluating [YOUR NAME] as a candidate.
- Fellow developers/engineers browsing for inspiration or curiosity (e.g., shared on LinkedIn/GitHub/Hacker News-style audiences).
- Casual visitors who may not immediately understand it's a portfolio — the OS framing must not obscure the professional payload; every meaningful path through the site must surface the same substantive content a conventional portfolio would (resume, projects, contact/socials, skills).

## 5. Core User Journeys

### 5.1 First-time visitor, primary path
1. Visitor lands on the site → sees BIOS/POST-style stage → XP loading screen → (optional) login/welcome → desktop appears with Bliss wallpaper.
2. Visitor sees desktop icons and a taskbar with a Start button.
3. Visitor double-clicks an icon (e.g., "Resume", "Projects") and a window opens.
4. Visitor can open multiple apps, move/minimize/maximize/close windows, and switch between them via the taskbar.
5. Visitor discovers Start Menu as an alternate/equivalent launch path to the same content.
6. Visitor leaves having seen: who [YOUR NAME] is, what they've built, their skills, and how to contact/follow them — all without leaving the OS metaphor.

### 5.2 Recruiter in a hurry
- Must be able to reach resume, contact links, and a project list within 2–3 interactions from desktop load, without needing to "figure out" the metaphor. Navigation guide.txt and clearly labeled, familiar-looking icons (Resume, LinkedIn, GitHub, Projects) satisfy this without requiring a tutorial.

### 5.3 Curious explorer
- Opens Command Prompt and types `help`, `whoami`, `projects`.
- Opens My Computer, browses `C:\Projects\`.
- Opens Recycle Bin, finds easter-egg files.
- Plays Snake/Minesweeper/DOOM.
- Possibly triggers the Blue Screen easter egg.

### 5.4 Returning visitor
- Settings (brightness, volume, animations) persist across sessions via browser storage (see SETTINGS_SPEC.md).
- Boot sequence still plays (it doubles as the app's loading screen) but may be shortened on repeat visits [DECISION REQUIRED — see open decisions in README.md].

## 6. Functional Requirements

### 6.1 Boot Experience
- FR-1: The site MUST show a boot sequence before the desktop is usable.
- FR-2: The boot sequence MUST double as the real asset/data loading stage — it is not purely decorative and its minimum/maximum duration must reconcile with actual load time (see SYSTEM_DESIGN.md).
- FR-3: Boot sequence MUST NOT hard-block on network failure indefinitely; a timeout/fallback path is required.

### 6.2 Desktop
- FR-4: Desktop MUST render configurable icons from a data-driven registry, not hardcoded markup.
- FR-5: Icons MUST support double-click (desktop) and equivalent (keyboard/touch) activation to open their associated application.
- FR-6: Desktop MUST use the XP Bliss wallpaper by default (asset placeholder).

### 6.3 Window System
- FR-7: Every application MUST open inside a movable, resizable (where applicable), minimizable, maximizable, closable XP-style window.
- FR-8: Multiple windows MUST be open simultaneously with correct focus and z-index behavior.
- FR-9: Minimized windows MUST be representable and restorable from the taskbar.
- FR-10: Window management logic MUST be implemented once, generically, and reused by all applications (no per-app reimplementation).

### 6.4 Taskbar
- FR-11: Taskbar MUST show a Start button, one entry per open application, system tray indicators (Wi-Fi, Bluetooth, battery — simulated), volume, brightness, and a live clock.
- FR-12: Clicking a taskbar app entry MUST focus/restore that window; clicking again MUST minimize it (standard XP taskbar toggle behavior).

### 6.5 Start Menu
- FR-13: Start Menu MUST open/close via the Start button and MUST list the same applications/content available on the desktop, launched through the same underlying application system (no duplicated logic).

### 6.6 My Computer / File Explorer
- FR-14: A virtual filesystem MUST exist, browsable via a File-Explorer-style application, structured to logically house portfolio content (Projects, Documents, Social, etc.).
- FR-15: The filesystem MUST be data-driven and extensible without modifying File Explorer's core logic.

### 6.7 Navigation Guide
- FR-16: A file literally named `Navigation guide.txt` MUST exist on the desktop, opening in a Notepad-style read-only viewer, explaining how to use the simulated OS.

### 6.8 Notepad
- FR-17: A general-purpose Notepad application MUST exist, distinct from the Navigation Guide viewer, supporting typing, editing, selection, cut/copy/paste, and (MVP-scoped) basic document handling. Exact MVP boundary is defined in SYSTEM_DESIGN.md.

### 6.9 Command Prompt
- FR-18: A Command Prompt application MUST exist, displaying ASCII-art of [YOUR NAME]'s name on launch, followed by an interactive virtual shell.
- FR-19: The virtual shell MUST NOT execute real OS commands. All commands operate on simulated/portfolio state only.
- FR-20: The command set MUST be extensible via a command registry (see COMMAND_PROMPT_SPEC.md).

### 6.10 Control Panel
- FR-21: A Control Panel application MUST expose OS-level and portfolio-specific settings (brightness, volume, sound effects, animations, visual effects).
- FR-22: Settings changes MUST apply immediately and MUST persist per SETTINGS_SPEC.md.

### 6.11 Browser
- FR-23: A simulated browser application MUST exist with address bar, navigation controls, and content area.
- FR-24: The browser MUST gracefully handle non-embeddable external sites (CSP/X-Frame-Options) with a defined fallback UX rather than a broken/blank iframe (see UI_UX_SPEC.md §Browser Fallback).

### 6.12 Projects & Socials
- FR-25: Projects MUST be defined in a data-driven registry (see DATA_MODEL.md / CONTENT_SCHEMA.md) and rendered as files/icons/apps without hardcoding into UI components.
- FR-26: Social links (LinkedIn, GitHub, etc.) MUST be represented as OS objects (icons/files) and open via the Browser app or an equivalent OS-consistent affordance.

### 6.13 Games
- FR-27: Snake, Minesweeper, and DOOM MUST be genuinely playable, installed, window-manager-integrated applications, launchable from desktop and Start Menu.
- FR-28: Game state handling (pause on minimize, etc.) MUST be defined per-game in GAME_SPEC.md.

### 6.14 Audio
- FR-29: A centralized audio manager MUST govern all system sounds; no component may play audio independently of it.
- FR-30: Volume control (taskbar and Control Panel) MUST affect this centralized system globally.

### 6.15 Easter Eggs / Blue Screen
- FR-31: A Blue-Screen-of-Death easter egg MUST be triggerable via a hidden/humorous interaction, MUST simulate a crash/reboot, and MUST NOT cause real data loss or an unrecoverable state.
- FR-32: The architecture MUST allow additional easter eggs to be added later without modifying core systems.

## 7. Non-Functional Requirements

- NFR-1 (Performance): Initial meaningful paint of the boot sequence should occur quickly even on constrained connections; heavy assets (DOOM, game sprites) must be lazy-loaded on first use, not on initial page load. See PERFORMANCE.md.
- NFR-2 (Accessibility): Keyboard navigation, focus management, and `prefers-reduced-motion` support are first-class, not deferred. See UI_UX_SPEC.md and TEST_PLAN.md.
- NFR-3 (Extensibility): Adding a new project, desktop icon, command, or setting must be achievable primarily through data/config changes, not core-system rewrites.
- NFR-4 (Security): No component may execute arbitrary code from user input beyond the confines of the sandboxed virtual command shell / Notepad text buffer. See SECURITY.md.
- NFR-5 (Resilience): A failure in one application (e.g., DOOM's engine failing to load) must not crash the whole OS shell.
- NFR-6 (Cross-browser): Must function correctly on evergreen Chrome, Firefox, Safari, Edge. Full drag/resize windowing is desktop-first; a documented adapted mode covers small/touch viewports (see UI_UX_SPEC.md).

## 8. Success Metrics (qualitative, portfolio context)

- A recruiter can find resume + contact within ~30 seconds without guidance.
- A technical reviewer recognizes clear separation of concerns (window manager vs. application logic vs. content data) if they inspect the codebase.
- The experience is memorable and distinct from a templated portfolio, without sacrificing legibility of the underlying professional content.

## 9. Constraints

- No copyrighted Windows XP binary assets, video, or unlicensed sound recordings may be assumed available; all such assets are represented as explicit placeholders (see ASSET_MANIFEST.md).
- DOOM must respect licensing (see GAME_SPEC.md) — no assumption of bundling copyrighted WAD files.
- All external embedding must respect target-site security headers; no workarounds that violate browser security models (e.g., no server-side proxy-and-rewrite of arbitrary third-party sites) [DECISION REQUIRED if a proxy approach is ever considered].

## 10. Out of Scope for v1

- Multiplayer/networked features of any kind.
- Real user accounts, authentication, or persisted server-side data (all persistence is client-side/browser storage).
- A CMS or admin UI for editing content (content is edited via data files in the repo).
- Mobile-native apps.

## 11. Document Authority

This PRD defines *what*. Where any other document appears to conflict with this PRD on product behavior, this PRD wins unless the conflict is a technical infeasibility explicitly called out in TRD.md, in which case TRD.md's constraint wins and this PRD must be treated as needing an update (flag as [DECISION REQUIRED]).
