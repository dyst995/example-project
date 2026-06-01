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
    api/
      baseApi.ts
    auth/
      auth.api.ts
      auth.slice.ts
      auth.thunk.ts
      auth.selector.ts
      authSession.service.ts
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
- `api/`
  - shared RTK Query `baseApi` and `axiosBaseQuery`
- `<feature>/`
  - feature-scoped Redux files (`*.slice.ts`, `*.api.ts`, `*.thunk.ts`, selectors, `index.ts`)

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
- Feature module public export (`modules/<Feature>/index.ts`) should export screens only.
- Keep hooks/components/types internal to module folders and import them via local paths inside the feature.

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
- Export and use one singleton service instance per feature (for example `export const AuthService = new AuthServiceClass()`).
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

## State Management (Redux Toolkit + RTK Query)

Use Redux Toolkit slices for **client/session state** and **RTK Query** for **server state** (HTTP reads/writes).

Use `createAsyncThunk` only for flows that are not plain HTTP requests (for example hydration from local storage, passcode activation, orchestration across services).

### Recommended Store Feature Structure

```txt
src/store/
  index.ts
  hooks.ts
  api/
    baseApi.ts
  auth/
    auth.api.ts          # RTK Query endpoints (calls network services)
    auth.slice.ts        # sync state + matchers for API lifecycle
    auth.thunk.ts        # hydrate/signOut and other non-HTTP flows
    auth.selector.ts
    authSession.service.ts
    index.ts
  passcode/
    passcode.slice.ts
    passcode.thunk.ts
    passcode.selector.ts
    index.ts
```

### Store Rules

- Keep store code feature-first (`store/<feature>/...`), not globally mixed.
- Keep synchronous state transitions in `*.slice.ts`.
- Keep **HTTP API calls** in `*.api.ts` via `baseApi.injectEndpoints`, implemented with `queryFn` that delegates to `network/services/*` (do not duplicate axios calls in the store).
- Sync API results into slices with `extraReducers` + `authApi.endpoints.*.matchPending/Fulfilled/Rejected` (or equivalent), or `onQueryStarted` for side effects (secure storage).
- Keep **non-HTTP orchestration** in `*.thunk.ts` or small `*Session.service.ts` helpers under the feature folder.
- Keep feature selectors in `*.selector.ts` (one convention per repo).
- Modules use RTK Query hooks (`useLoginMutation`) or dispatch thunks/helpers; they must not import `network/services` or DTOs.
- Keep slice state minimal and UI-friendly (`isLoading`, `error`, domain models such as `AuthSession`).
- Export each feature from `store/<feature>/index.ts`.
- Do not put side effects (MMKV, Keychain) inside reducers; use `onQueryStarted`, thunks, or dedicated services.

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
- keys: `login`, `refresh`, `register`

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
  domain/models/
    session.ts
    loginCredentials.ts
  network/services/auth/
    routes.ts
    auth.service.ts
    types/login.types.ts
    mappers/auth.mapper.ts
  modules/Auth/
    screens/LoginScreen.tsx
    hooks/useLoginScreen.tsx
  store/
    api/baseApi.ts
    auth/
      auth.api.ts
      auth.slice.ts
      auth.thunk.ts
      authSession.service.ts
      index.ts
```

Login flow:

1. `useLoginScreen` calls `useLoginMutation`.
2. `auth.api` `queryFn` calls `AuthService.login` and maps DTO → `AuthSession`.
3. `auth.slice` matchers update session flags; `onQueryStarted` persists session/credentials.
4. `AuthHydrator` runs `hydrateSessionThunk` on app start.

## Practical Rules

### Do

- keep DTOs in `network/services/<feature>/types`
- keep domain models in `domain/models` (export from `domain/models/index.ts`)
- keep mappers in `network/services/<feature>/mappers`
- keep UI imports pointing to `domain` and `store`, not `network`
- keep HTTP in RTK Query `*.api.ts` delegating to services
- keep sync transitions and domain state in slices
- use `signOutThunk` (or equivalent) when logout must clear secure storage

### Do Not

- do not import DTOs or `network/**` from `modules/**` (enforced by ESLint)
- do not put endpoint strings in UI
- do not mix network contract types with domain types in one file
- do not call `AuthService` directly from modules
- do not duplicate API cache in Redux slices when RTK Query already owns server data
- do not perform storage side effects inside reducers

## Adding a New API-Backed Feature

1. Add domain model(s) under `domain/models/`.
2. Add `network/services/<feature>/` (routes, types, mapper, service).
3. Add `store/<feature>/<feature>.api.ts` via `baseApi.injectEndpoints` with `queryFn` → service.
4. Add `store/<feature>/<feature>.slice.ts` with matchers for API lifecycle.
5. Add module UI that uses generated hooks or dispatches thunks only.
6. Export `store/<feature>/index.ts`.

## When To Add More Abstraction

Add repository/use-case layers only when needed:

- many data sources (remote + cache/local DB)
- complex business flows
- hard-to-test side effects in UI hooks

Until then, `service + mapper + domain model` is usually enough.
