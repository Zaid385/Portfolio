# UI_UX_SPEC.md — UX Behavior & XP Interaction Specification

**Status:** Source of truth for interaction/UX detail. Visual asset specifics are placeholders per ASSET_MANIFEST.md; this document governs *behavior*, not final pixel values.

---

## 1. Interaction Model Baseline

The product assumes the visitor has ordinary desktop-computing literacy (has used *some* windowed OS before). No onboarding tutorial is forced; `Navigation guide.txt` is the opt-in help path (FR-16), plus affordances should be self-evident via standard OS conventions (cursor changes, hover states, familiar icon shapes).

## 2. Icon Interaction

| Action | Result |
|---|---|
| Single click on desktop icon | Select (highlight state); deselect others |
| Double click on desktop icon | Launch associated app via `launchApp` |
| Click empty desktop area | Deselect all icons; close Start Menu if open |
| Keyboard: Tab to icon, Enter/Space | Launch (accessibility equivalent of double-click) |
| Right-click on icon | [DECISION REQUIRED — optional context menu, e.g., "Open", "Properties"; recommend defer to polish phase, not MVP-blocking] |
| Touch (tap) on small viewport | Single tap launches directly (double-click requirement is relaxed in adapted/touch mode — see §8) |

## 3. Window Behavior

- **Open:** New window appears with a subtle scale/fade-in (respecting reduced-motion), positioned per a cascade offset from the last-opened window of the same or different app (avoids exact overlap), clamped within viewport bounds.
- **Focus:** Clicking anywhere on a window (title bar or body) brings it to front (raises z-index) and marks it "active" (title bar uses the active-window style; other windows show inactive title bar style, matching classic XP two-tone active/inactive title bar convention).
- **Drag:** Mouse-down on title bar + move relocates the window; window may not be dragged fully off-screen (must keep a minimum draggable portion, e.g., the title bar, within viewport bounds at all times) so it's never unrecoverable.
- **Resize:** Cursor-edge/corner resize handles on resizable windows (not all apps are resizable — e.g., Minesweeper board size may be fixed; Command Prompt may be resizable only within row/column constraints — resizability is a per-app config flag).
- **Minimize:** Window animates toward its taskbar button (or a simplified fade/slide if reduced-motion) and is hidden; taskbar button remains, shown in "not focused" state.
- **Maximize/Restore:** Maximize expands the window to fill the desktop area (below the taskbar); restore returns to prior explicit bounds (remembered, not recomputed).
- **Close:** Removes the window instance; if the app defines an "unsaved changes" guard (e.g., Notepad), a confirmation dialog (see SYSTEM_DESIGN.md §14) intercepts close and only proceeds on confirmation.
- **Multiple windows:** No artificial cap for MVP, but see PERFORMANCE.md for any practical guardrails (e.g., a soft warning past N simultaneous windows is acceptable polish, not required).

## 4. Taskbar Interaction

- Clicking a taskbar button for an **unfocused, non-minimized** window → focuses it.
- Clicking a taskbar button for the **currently focused** window → minimizes it (standard toggle).
- Clicking a taskbar button for a **minimized** window → restores and focuses it.
- Start button click → toggles Start Menu; visually depresses while open (classic XP "pressed" button state).

## 5. Start Menu Interaction

- Opens anchored above the Start button, classic two-column XP layout (see SYSTEM_DESIGN.md §5).
- Closes on: outside click, Escape key, selecting any entry.
- Submenus (Games, Socials) open on hover (desktop) or tap (touch/adapted mode) as flyouts; must not open on accidental mouse-transit (small hover-intent delay recommended, e.g., ~150–250ms, to avoid flicker).

## 6. Command Prompt UX

(Full command/parser detail in COMMAND_PROMPT_SPEC.md; this section covers presentation.)
- Monospace font, black background, classic light-gray/green-on-black text option [DECISION REQUIRED: color scheme — classic cmd.exe is light-gray-on-black; recommend that for authenticity].
- ASCII art name banner renders once at launch, above the first prompt line.
- Prompt format mirrors XP's `C:\Users\Zaid>` style path, reflecting current virtual working directory.
- Input line supports: text entry, Enter to submit, Up/Down arrow for command history navigation, Tab for completion (of commands and, where sensible, filesystem paths), Ctrl+C-equivalent to cancel current input line (visual only, no real process to kill), Ctrl+L or `clear` command to clear scrollback.
- Scrollback is a simple append-only log, auto-scrolls to bottom on new output, but visitor may scroll up manually without being yanked back down mid-read (only re-snap on new input submission).

## 7. Control Panel UX

- Icon-grid "applet" layout resembling classic Control Panel's Category or Classic view [DECISION REQUIRED: pick one visual convention; recommend Classic (icon grid) view for direct clickability, matching PRD's simplicity emphasis].
- Sliders (brightness, volume) are draggable and keyboard-adjustable (arrow keys when focused), update live (not requiring an "Apply" button) matching PRD FR-22's "apply immediately."
- Toggle switches for booleans (sound effects, animations) use a clearly labeled classic-style checkbox or toggle, not an ambiguous icon-only control.

## 8. Responsive / Touch Strategy

Full free-form multi-window dragging is a desktop-oriented interaction model. On small/touch viewports (breakpoint [DECISION REQUIRED: e.g., <768px]), the shell switches to an **Adapted Mode**:
- Windows open **maximized by default** (fill available viewport below taskbar) rather than floating — dragging/resizing is disabled or simplified.
- Taskbar remains, but window-switching becomes closer to a simple "back to desktop / switch app" pattern (still uses the same underlying window manager state — only the *presentation* changes, no separate mobile code path for state).
- Start Menu becomes a full-screen or bottom-sheet style overlay rather than an anchored flyout, but sources the same data.
- This mode must be explicitly designed and tested, not left as an emergent/broken side effect of squeezing desktop layout into a small viewport. See TEST_PLAN.md.

## 9. Accessibility Requirements

- All interactive elements (icons, taskbar buttons, window controls, Start Menu entries, Control Panel controls) must be reachable via keyboard (Tab order) and have visible focus states.
- Window title bars' minimize/maximize/close buttons must have accessible labels (not icon-only with no `aria-label`).
- Modal/dialog components must trap focus while open and restore focus to the invoking element on close.
- `prefers-reduced-motion: reduce` must disable/shorten: window open/close animation, minimize-to-taskbar animation, boot sequence flourish animations (boot *duration* as a loading gate may remain, but decorative motion within it should reduce), Start Menu flyout transitions.
- Color contrast for text (including inside XP-styled chrome) must meet WCAG AA where it doesn't conflict with strict period-authenticity; where a genuine conflict exists, legibility wins [this is a standing principle, not case-by-case DECISION REQUIRED].
- Command Prompt and Notepad text areas must be screen-reader-navigable as standard text content, not custom canvas-rendered text.

## 10. Browser App Fallback UX (detail, complements SYSTEM_DESIGN.md §9)

When a target is non-embeddable:
- Address bar still updates to reflect the "navigated to" URL (authenticity).
- Content area shows a styled, in-universe error page — suggested copy pattern: a light parody of a classic browser error ("This page cannot be displayed inside [Browser App Name]") plus a clearly labeled button: "Open in New Tab ↗" which performs a real `window.open(url, '_blank', 'noopener,noreferrer')`.
- This is not a "failure" state visually — it should feel like an intentional, in-universe safety rail, not a broken app, preserving product tone per PRD §2 Goal 1.

## 11. Tone & Copy Guidelines

- All in-universe copy (error dialogs, BSOD text, fake system messages, Navigation Guide) should be warm/wry rather than sarcastic-to-the-point-of-unclear; a recruiter must never be confused about whether the site is broken vs. intentionally playful. When in doubt, favor clarity over cleverness in any *functional* messaging (e.g., the Browser fallback message above); reserve pure whimsy for clearly optional/discoverable easter-egg content (Recycle Bin flavor files, BSOD, hidden commands).

## 12. Document Authority

UI_UX_SPEC.md governs interaction behavior and accessibility requirements. It must not contradict PRD.md's functional requirements or ARCHITECTURE.md's system ownership; it elaborates *how the visitor experiences* systems defined elsewhere.
