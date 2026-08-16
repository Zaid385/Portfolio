# SECURITY.md — Security Considerations

**Status:** Source of truth for security requirements. This is a fully client-side application with no backend/auth in v1 (PRD §10), but it has several non-trivial surfaces requiring explicit treatment: a simulated terminal, user text input (Notepad), external links, and (for DOOM) a third-party WASM engine.

---

## 1. Threat Surfaces

| Surface | Risk | Mitigation |
|---|---|---|
| Command Prompt virtual shell | A visitor could attempt to inject script-like input expecting code execution | Parser (COMMAND_PROMPT_SPEC.md §2–3) never uses `eval`/`Function(...)`/`new Function` on any input; all input is tokenized and matched against a closed command registry. This is a hard architectural rule (TRD.md §2 point 1), verified by an explicit regression test (TEST_PLAN.md §2.3). |
| Notepad text input | XSS if content were ever rendered as HTML | Notepad content is treated strictly as plain text (native `<textarea>` value or a plain-text `contenteditable`, never `dangerouslySetInnerHTML` or equivalent). No Notepad content is ever persisted server-side or shared with other visitors (no multi-user surface exists in v1), limiting blast radius even further. |
| External links (Socials, Projects, Browser fallback) | Reverse tabnabbing via `window.open` without `noopener` | Every programmatic `window.open` call across the codebase (Browser app, Social entries, Project links, Command Prompt `open`) MUST use `noopener,noreferrer`. Recommend a single shared utility function (e.g., `openExternal(url: string)`) used everywhere instead of ad-hoc `window.open` calls at each site, to make this rule mechanically enforceable rather than relying on every author remembering it. |
| Browser app iframe embedding | Embedding untrusted third-party content without sandboxing | Any iframe used for portfolio-controlled or verified-embeddable content must include an appropriate `sandbox` attribute scoped to only the permissions actually needed (e.g., `allow-scripts allow-same-origin` only if genuinely required, never a blanket unsandboxed iframe). Non-embeddable sites are never force-embedded (SYSTEM_DESIGN.md §9). |
| DOOM WASM engine (third-party code) | Running third-party compiled code in-browser | WebAssembly runs inside the browser's own sandbox (no elevated privileges beyond normal JS); still, the specific WASM port chosen should be from a reputable, actively-maintained open-source project, and its bundle should be reviewed at integration time (Phase 19) for anything suspicious (e.g., unexpected network calls it shouldn't need) before shipping. |
| `localStorage` persistence (Settings) | Low risk — no sensitive data stored | Settings data is non-sensitive preference data only. Standard JSON parse safety (try/catch, per SETTINGS_SPEC.md §3) prevents a malformed/tampered value from crashing the app. |
| Dependency supply chain | Third-party npm packages (react-rnd if used, game/audio libs, DOOM WASM bundle) | Standard practice: lockfile committed, `npm audit`/equivalent run in CI, dependencies kept minimal per TRD.md/PRD's "avoid unnecessary dependencies" principle — fewer dependencies is itself a security posture, not just a performance one. |

## 2. Content Security Policy (Recommended)

A CSP header (configured at the Vercel deployment level, e.g., via `vercel.json` headers config) is recommended to constrain script sources, restrict `frame-src` to the specific verified-embeddable domains used by the Browser app (SYSTEM_DESIGN.md §9), and disallow inline script execution where feasible. [DECISION REQUIRED: exact CSP policy string, finalized once all real external domains (embeddable sites, if any) are known — tracked for Phase 23 production hardening.]

## 3. No Server-Side Attack Surface (v1)

Because there is no backend in v1, classic server-side concerns (SQL injection, auth bypass, session hijacking, server secret exposure) do not apply. If a backend is ever introduced post-v1 (e.g., for a contact form), this document must be revisited and expanded before that feature ships — flagged here explicitly so it isn't forgotten.

## 4. Licensing as a Security-Adjacent Concern

While not a "security" issue in the technical sense, IP/licensing compliance (no copyrighted XP assets, no unlicensed DOOM WAD — see ASSET_MANIFEST.md, GAME_SPEC.md §4.2) is treated with equal rigor in this project's review process, since shipping infringing content is a real operational risk to the site's owner. Every new asset addition should be checked against ASSET_MANIFEST.md's licensing notes before merge (CONTRIBUTING.md).

## 5. Production Hardening Checklist (executed at Phase 23)

- [ ] No `eval`/`Function(...)` usage anywhere in the codebase (grep-verified in CI as an extra safety net beyond code review).
- [ ] All `window.open` calls route through the shared `openExternal` utility with `noopener,noreferrer`.
- [ ] All iframes have appropriate `sandbox` attributes.
- [ ] CSP header configured and verified against all actual runtime external requests.
- [ ] `npm audit` (or equivalent) run with no unresolved high/critical vulnerabilities.
- [ ] No dev-only debug affordances (e.g., a hypothetical debug panel) present in the production build.
- [ ] DOOM WASM bundle sourced from a verified, reputable project and reviewed at integration time.
- [ ] No copyrighted commercial WAD or XP original assets bundled (ASSET_MANIFEST.md cross-check).

## 6. Document Authority

SECURITY.md governs all security-related constraints across the project. TRD.md's hard technical constraints (§2) and this document must remain consistent; where COMMAND_PROMPT_SPEC.md or GAME_SPEC.md discuss security-adjacent detail specific to their subsystem, this document is the higher-level aggregation point and final authority on cross-cutting security policy.
