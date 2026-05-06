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
    index.ts
    hooks.ts
    auth/
      auth.slice.ts
      auth.thunk.ts
      auth.selectors.ts
      index.ts
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
  - feature API modules and related transport files
  - see `Service Structure Standard` below for exact file layout

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
- if functionality is only used by one module, keep it inside that module

### `store`

Contains global application state and async state orchestration.

- `index.ts`
  - configure Redux store and register feature reducers
- `hooks.ts`
  - typed hooks (`useAppDispatch`, `useAppSelector`)
- `<feature>/`
  - feature-scoped Redux files (`*.slice.ts`, `*.thunk.ts`, selectors, exports)

### `shared`

Contains reusable app-wide utilities and UI primitives.

- `components/` for reusable shared UI components
- `hooks/` for generic reusable hooks (for example `useDebounce`, `useKeyboard`)
- `contexts/` for global cross-cutting contexts (for example theme, localization)
- `utils/` for shared cross-module utility helpers
- shared components, constants, helpers used across multiple modules
- only move functionality to `shared` when it is reused across modules
- do not create top-level `src/utils`; shared utilities must be under `src/shared/utils`
- do not create top-level `src/components`; shared components must be under `src/shared/components`

## Context and Custom Hooks Placement

- Keep functionality in its owning module when it is not shared.
- Move functionality to `shared` only when multiple modules reuse it.
- Put app-wide reusable hooks in `shared/hooks`.
- Put Redux typed hooks (`useAppDispatch`, `useAppSelector`) in `store/hooks.ts`.
- Put feature-specific hooks (for example `useLoginScreen`) inside feature modules.
- Put global cross-cutting contexts in `shared/contexts`.
- Put feature-only contexts inside that feature module.
- Avoid introducing Context for data already managed well by Redux/RTK Query.

## Module Structure Standard

Use feature-first module structure as the default.

```txt
src/modules/
  Auth/
    screens/
      LoginScreen.tsx
    hooks/
      useLoginScreen.ts
    components/
      LoginForm.tsx
    types/
      login.types.ts
    utils/
      login.utils.ts
    context/           (optional, feature-only context)
    __tests__/
```

Rules:

- Keep module-only functionality inside that module.
- Move functionality to `shared` only when reused by multiple modules.
- Keep hooks in `hooks/`, presentational pieces in `components/`, and screen containers in `screens/`.
- Keep module view/form types in module `types/`, not in network DTO files.
- Module code may use domain models and store/query hooks, but should not define endpoints or DTO contracts.

## Service Structure Standard

Use feature-first structure under `network/services`.

```txt
src/network/services/
  auth/
    auth.service.ts
    routes.ts
    types/
      login.types.ts
      user.types.ts
    mappers/
      auth.mapper.ts
    __tests__/
      auth.service.test.ts
```

Rules:

- Keep one service class per feature as the main API entrypoint (`auth.service.ts`).
- Keep endpoint path constants in `routes.ts` only.
- Keep request/response DTOs in `types/` (`*RequestDto`, `*ResponseDto`).
- Keep DTO-to-domain transformations in `mappers/`; do not map in UI.
- Keep API call details (HTTP method, params, headers) inside service layer.
- Keep service methods focused by use case (`login`, `refreshToken`, `logout`).
- Keep service internals using `BaseService` and core response wrappers for consistency.

## Navigation Structure Standard

Keep app navigation contracts and navigator composition under `src/navigation`.

```txt
src/navigation/
  navigators/
    AuthNavigator.tsx
    MainNavigator.tsx
  types/
    auth-navigator-params.type.ts
    main-navigator-params.type.ts
    index.ts
  enums/
    auth-navigator-screens.enum.ts
    main-navigator-screens.enum.ts
    index.ts
  RootNavigation.tsx
  index.ts
```

Rules:

- `navigation` must contain `navigators`, `types`, and `enums` folders.
- Keep route param list types centralized in `navigation/types`.
- Keep route/screen name enums centralized in `navigation/enums`.
- Keep root/app flow composition in `navigation/navigators`.
- Feature modules own screen implementations; navigators only compose screens.
- Do not place endpoint, DTO, or service logic in navigation files.

Folder responsibilities:

- `navigators/`: navigator components only (screen tree wiring and navigator options).
- `types/`: route param list contracts only.
- `enums/`: route/screen name constants only.

Navigator responsibilities:

- `RootNavigation.tsx` must switch between auth flow and main flow only.
- `AuthNavigator.tsx` must register auth-related screens and use auth param list type.
- `MainNavigator.tsx` must register authorized/app screens and use main param list type.

## State Management (Redux Slice + Thunk)

Use Redux Toolkit slices for state and `createAsyncThunk` for async feature flows.

### Recommended Store Feature Structure

```txt
src/store/
  index.ts
  hooks.ts
  auth/
    auth.slice.ts
    auth.thunk.ts
    auth.selectors.ts
    index.ts
```

### Store Rules

- Keep store code feature-first (`store/<feature>/...`), not globally mixed.
- Keep synchronous state transitions in `*.slice.ts`.
- Keep async API orchestration in `*.thunk.ts`.
- Keep feature selectors in feature folder (`*.selectors.ts`).
- Thunks may call `network/services/*`; modules should dispatch thunks instead of calling services directly.
- Keep slice state minimal and UI-friendly (`isLoading`, `error`, session/token flags).

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
  store/
    auth/
      auth.slice.ts
      auth.thunk.ts
```

## Practical Rules

### Do

- keep DTOs in `network/services/<feature>/types`
- keep domain models in `domain/models`
- keep mappers near feature service
- keep UI imports pointing to `domain`, not `network`
- keep server cache in RTK Query instead of regular slices

### Do Not

- do not import DTOs directly in screens/hooks
- do not put endpoint strings in UI/store
- do not mix network contract types with domain types in one file
- do not duplicate API cache in Redux slices without a strong reason

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
