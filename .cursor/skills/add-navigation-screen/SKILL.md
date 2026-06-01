---
name: add-navigation-screen
description: Registers a new screen in React Navigation (enum, param types, navigator). Use when adding a route, screen to Auth or Main stack, or wiring a scaffolded module into navigation.
---

# Add Navigation Screen

## Checklist

1. **Screen enum** — `src/navigation/enums/<navigator>-navigator-screens.enum.ts`
   - Add `FEATURE = 'Feature'` (match route name string).

2. **Param list** — `src/navigation/types/<navigator>-navigator-params.type.ts`
   - Add screen key and params (`undefined` if none).

3. **Navigator** — `src/navigation/navigators/<Navigator>.tsx`
   - Import screen from `modules/<Feature>` (screens barrel only).
   - Add `<Stack.Screen name={...} component={...} />`.

4. **Navigate from UI** — `navigation.navigate(MainNavigatorScreens.FEATURE)` with typed params.

## Which navigator?

| Flow | Navigator | Enum file |
|------|-----------|-----------|
| Login, passcode setup/login (unauthenticated) | `AuthNavigator` | `auth-navigator-screens.enum.ts` |
| App after login | `MainNavigator` | `main-navigator-screens.enum.ts` |

`RootNavigation.tsx` only switches Auth vs Main — do not register feature screens there.

## Rules

- Navigators compose screens only — no API, DTO, or axios.
- Param list types must be passed to `createNativeStackNavigator<ParamList>()`.
- Re-export types/enums from `navigation/types/index.ts` and `navigation/enums/index.ts` if those barrels exist.

## Golden reference

- `PasscodeSetupScreen` in `MainNavigator.tsx`
- `LoginScreen` in `AuthNavigator.tsx`
