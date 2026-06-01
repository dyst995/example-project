# Bootstrap a new React Native CLI app from this template

Two ways to start. **Option A** is fastest if you want this architecture out of the box. **Option B** keeps the default CLI `App.tsx` tree and merges the template in.

---

## Option A — Clone this repo (simplest)

```bash
git clone <this-repo-url> MyNewApp
cd MyNewApp
rm -rf .git && git init   # optional: fresh history
npm install
cd ios && pod install && cd ..   # macOS only
npm run validate:architecture
npm test
```

Rename app in `app.json` / `package.json` / native projects as needed. You already have `domain`, `shared`, `network`, `store`, `modules`, skills, and scripts.

---

## Option B — Fresh CLI app + bootstrap script

### 1. Create the app

```bash
npx @react-native-community/cli@latest init MyNewApp --pm npm
cd MyNewApp
```

Use the same React Native major version as this template when possible (see `package.json` here).

### 2. Run bootstrap from the new app folder

```bash
TEMPLATE=/absolute/path/to/example-project npm run bootstrap:app
```

Or without adding the script yet:

```bash
node /absolute/path/to/example-project/scripts/bootstrap-into-app.mjs \
  --template /absolute/path/to/example-project
```

The script copies:

| Copied | Purpose |
|--------|---------|
| `src/domain`, `network`, `store`, `modules`, `navigation`, `shared`, `test` | Layered app code (includes auth/passcode/dashboard as examples) |
| `scripts/`, `jest/setup.js` | Scaffolds + test mocks |
| `.cursor/skills`, `.cursor/rules` | Agent skills + architecture rule |
| `docs/`, `AGENTS.md` | Docs |
| `App.tsx` | Provider + navigation + hydrators |

It also merges `package.json` **scripts** and prints an **`npm install`** line for dependencies you still need.

### 3. Install dependencies

Run the `npm install ...` command printed by the bootstrap script (RTK, axios, navigation, keychain, mmkv, testing-library, etc.).

```bash
cd ios && pod install && cd ..
```

### 4. Configure environment

1. Set API base URL in `src/network/core/config.ts` (`AppURL`).
2. Confirm `AuthRoutes.refresh` matches your backend.
3. Adjust app name / bundle IDs in native projects.

### 5. Verify

```bash
npm run validate:architecture
npm run lint
npm test
npm run ios   # or android
```

### 6. Strip or keep example features

| Keep as reference | Remove when not needed |
|-------------------|-------------------------|
| `store/auth`, `modules/Auth` | — |
| `store/passcode`, `modules/Passcode` | Optional for apps without passcode |
| `store/dashboard`, `modules/Dashboard` | Replace with your home screen |

Use agent skill **use-as-template** or delete folders and run `validate:architecture`.

---

## After bootstrap: adding your first real feature

```bash
npm run scaffold:api-feature -- Orders
npm run scaffold:module -- Orders
```

In Cursor:

```text
Read AGENTS.md. Use add-navigation-screen to register Orders on MainNavigator.
```

---

## Using the agent on the new project

1. Open the new app folder in Cursor.
2. Ensure `.cursor/skills/` and `.cursor/rules/` were copied.
3. Start chats with:

```text
Read AGENTS.md and docs/project-structure-guide.md before making changes.
```

For each feature, name the skill: `scaffold-api-feature`, `scaffold-module`, etc.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Metro can't resolve `@reduxjs/toolkit` | Run the bootstrap `npm install` line |
| MMKV / Keychain native errors | `pod install`, rebuild app |
| ESLint merge overwrote custom config | Re-merge only the `overrides` block from template `.eslintrc.js` |
| Duplicate `src` from CLI | Bootstrap replaces `App.tsx`; remove old `src` screens if CLI created unused files |

---

## What bootstrap does *not* do

- Change Android/iOS app name or icons (do in Xcode / Gradle)
- Set up CI, Detox, or Fastlane (copy from this repo manually if needed)
- Generate OpenAPI clients

See [skills-and-automation.md](./skills-and-automation.md) for day-to-day feature workflow.
