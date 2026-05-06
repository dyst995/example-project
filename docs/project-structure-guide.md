# Project Structure Guide

This project uses a layered structure to keep API contracts, domain logic, and UI concerns separated.

## Goals

- Keep backend contract changes isolated.
- Prevent UI from depending on network/transport details.
- Make features easy to scale (`auth`, `profile`, `payments`, etc.).
- Keep naming predictable and consistent.

## Recommended Top-Level Structure

```txt
src/
  domain/
    models/
    types/
    usecases/        (optional)
  network/
    core/
      config.ts
      baseService.ts
      types/
    services/
      auth/
        routes.ts
        auth.service.ts
        types/
        mappers/
      profile/
      ...
  modules/
    Auth/
    Profile/
    ...
  store/
  shared/
docs/
```

## Layer Responsibilities

### `network`

Contains transport-layer code (HTTP, endpoints, DTOs).

- `core/`
  - axios client config/interceptors
  - base service class
  - common API response/error types
- `services/<feature>/`
  - `routes.ts` (endpoint paths)
  - `*.service.ts` (API calls)
  - `types/*.types.ts` (DTOs)
  - `mappers/*.mapper.ts` (DTO to domain)

### `domain`

Contains business concepts used by app logic and UI.

- models/entities/value objects (for example `User`, `AuthSession`)
- domain enums (for example `CustomerCategory`)
- pure business rules/helpers
- optional use-case orchestration

### `modules`

Feature UI layer (screens/hooks/components) for presentation behavior.

- should depend on domain types, not DTOs
- should not know endpoint paths or axios details

## Naming Conventions

### DTOs (network contract)

Use `Dto` suffix:

- `LoginRequestDto`
- `LoginResponseDto`
- `UserDto`

### Domain Models

Do not use `Dto` suffix:

- `User`
- `AuthSession`

### Routes

Use feature-wide route object, not endpoint-specific object:

- `AuthRoutes` (or `AUTH_ROUTES`)
- keys: `login`, `register`, `refreshToken`

### Enums

Keep enums close to usage; extract only when shared widely.

- local enum in model file if single-use
- move to shared enums file when reused across many files

## Mapping Rule

Always map transport objects before exposing to UI/store.

Flow:

1. API returns DTO.
2. Mapper converts DTO to domain model.
3. UI/store receives domain model.

Benefits:

- backend field changes are localized
- UI remains stable and readable
- domain shape stays consistent

## Auth Feature Example

```txt
src/
  domain/
    models/
      user.ts
      session.ts
  network/
    services/
      auth/
        routes.ts
        auth.service.ts
        types/
          login.types.ts
        mappers/
          auth.mapper.ts
  modules/
    Auth/
      LoginScreen.tsx
      useLoginScreen.ts
```

## Practical Rules

### Do

- keep DTOs in `network/services/<feature>/types`
- keep domain models in `domain/models`
- keep mappers near feature service
- keep UI imports pointing to `domain`, not `network`

### Do Not

- do not import DTOs directly in screens/hooks
- do not put endpoint strings in UI/store
- do not mix network contract types with domain types in one file

## Migration Plan (Incremental)

1. Keep current network core as-is.
2. Move app-facing models to `domain/models`.
3. Keep request/response DTOs in `network/services/<feature>/types`.
4. Add mapper functions for transformed responses.
5. Update UI imports to domain models.
6. Expand per feature without refactoring everything at once.

## When To Add More Abstraction

Add repository/use-case layers only when needed:

- many data sources (remote + cache/local DB)
- complex business flows
- hard-to-test side effects in UI hooks

Until then, `service + mapper + domain model` is usually enough.
