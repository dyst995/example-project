---
name: structure-review
description: Reviews code organization against this project's architecture guide. Use when asked for architecture review, structure checks, folder conventions, layering validation, or periodic project structure audits.
---

# Structure Review

Use this skill to review whether code follows the project architecture in `docs/project-structure-guide.md`.
Use `Service Structure Standard` in that guide as the source of truth for network service layout checks.

## Runtime Compatibility

This skill is tool-agnostic and should work in any local coding agent.

- Do not assume Cursor-only APIs or IDE metadata are available.
- Use whatever local file search/read/diff capabilities the host agent provides.
- If `docs/project-structure-guide.md` is missing, fail with a clear message.

## Quick Start

1. Read `docs/project-structure-guide.md`.
2. Inspect changed files and nearby feature structure (or full tree when no diff is available).
3. Report only actionable findings, ordered by severity.
4. Suggest minimal refactors that preserve behavior.

## Review Scope

Validate these layer boundaries:

- `network`: transport concerns (routes, DTOs, service calls, mappers)
- `domain`: business models and domain logic
- `modules`: feature UI/hooks
- `store`: Redux slices and RTK Query APIs
- `shared`: reusable hooks, contexts, and shared utilities

Validate module internal structure:

- required: `modules/<Feature>/screens` for screen containers
- required: `modules/<Feature>/hooks` for feature behavior hooks
- optional: `modules/<Feature>/components` for feature UI pieces
- optional: `modules/<Feature>/types` for view/form-local types
- optional: `modules/<Feature>/utils` for feature-local helpers

Validate navigation internal structure:

- required folders: `navigation/navigators`, `navigation/types`, `navigation/enums`, `navigation/utils`
- route param list contracts live in `navigation/types`
- route/screen name enums live in `navigation/enums`

## Checklist

- [ ] Functionality used by only one module stays inside that module.
- [ ] Functionality moved to `shared` is reused by multiple modules.
- [ ] Shared components live under `src/shared/components`, not under top-level `src/components`.
- [ ] Shared utilities live under `src/shared/utils`, not under top-level `src/utils`.
- [ ] Module has required feature folders (`screens`, `hooks`) for new/structured features.
- [ ] Optional folders (`components`, `types`, `utils`) are present only when needed and should not be treated as required.
- [ ] If module view/form types exist, keep them in module `types/`, not in network DTO files.
- [ ] UI/modules do not import DTOs directly.
- [ ] Domain models are not mixed with transport DTOs.
- [ ] Routes/endpoints are not defined in UI/store files.
- [ ] Network responses are mapped before app-wide use when shapes differ.
- [ ] Navigation has required folders (`navigators`, `types`, `enums`, `utils`).
- [ ] Route param list types are centralized under `navigation/types`.
- [ ] Route/screen enums are centralized under `navigation/enums`.
- [ ] Navigation files do not contain endpoint, DTO, or service logic.
- [ ] RTK Query handles server cache; slices are used for client state.
- [ ] Redux typed hooks stay in `store/hooks.ts`.
- [ ] Global reusable hooks are in `shared/hooks`; feature hooks stay in feature modules.
- [ ] Global cross-cutting contexts are in `shared/contexts`; feature-only contexts remain local.

## Output Format

Return results in this format:

```md
## Findings

- [severity] issue description
  - evidence: `path/to/file`
  - recommendation: concise fix

## Healthy Patterns

- short notes on what already follows the guide

## Suggested Next Steps

- 1 to 3 highest-impact refactors
```

Use severities: `critical`, `major`, `minor`, `nit`.

If no findings exist, return:

```md
## Findings

- no structural violations found

## Healthy Patterns

- concise notes on conventions currently followed

## Suggested Next Steps

- optional improvements or test/consistency checks
```

## Review Behavior

- Prefer concrete, file-based findings over generic advice.
- Do not propose broad rewrites when a localized fix is enough.
- If no issues are found, state that clearly and list remaining risks or test gaps.
