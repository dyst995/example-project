#!/usr/bin/env node
/**
 * Merges example-project template into a React Native CLI app.
 *
 * Run from the NEW app root:
 *   node /path/to/example-project/scripts/bootstrap-into-app.mjs
 *   node /path/to/example-project/scripts/bootstrap-into-app.mjs --template /path/to/example-project
 *
 * Or: TEMPLATE=/path/to/example-project npm run bootstrap:app
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const templateFlagIndex = args.indexOf('--template');
const templateFromFlag =
  templateFlagIndex >= 0 ? args[templateFlagIndex + 1] : undefined;

const templateRoot = path.resolve(
  process.env.TEMPLATE ?? templateFromFlag ?? path.join(__dirname, '..'),
);
const targetRoot = process.cwd();

const copyDirs = [
  'src/domain',
  'src/network',
  'src/store',
  'src/modules',
  'src/navigation',
  'src/shared',
  'src/test',
  'scripts',
  'jest',
  '.cursor',
  'docs',
];

const copyFiles = ['AGENTS.md', 'App.tsx'];

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`skip missing: ${src}`);
    return;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

console.log(`Template: ${templateRoot}`);
console.log(`Target:   ${targetRoot}\n`);

if (!fs.existsSync(path.join(templateRoot, 'src', 'store', 'index.ts'))) {
  console.error('Template path does not look like example-project (missing src/store/index.ts).');
  process.exit(1);
}

if (!fs.existsSync(path.join(targetRoot, 'package.json'))) {
  console.error('Target is not a project root (no package.json). cd into your new RN app first.');
  process.exit(1);
}

for (const rel of copyDirs) {
  const src = path.join(templateRoot, rel);
  const dest = path.join(targetRoot, rel);
  copyRecursive(src, dest);
  console.log(`copied ${rel}/`);
}

for (const rel of copyFiles) {
  const src = path.join(templateRoot, rel);
  const dest = path.join(targetRoot, rel);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`copied ${rel}`);
  }
}

mergePackageJson(templateRoot, targetRoot);
mergeEslint(templateRoot, targetRoot);
mergeJestConfig(templateRoot, targetRoot);
printNextSteps(templateRoot, targetRoot);

function mergePackageJson(templateRoot, targetRoot) {
  const templatePkg = JSON.parse(
    fs.readFileSync(path.join(templateRoot, 'package.json'), 'utf8'),
  );
  const targetPkgPath = path.join(targetRoot, 'package.json');
  const targetPkg = JSON.parse(fs.readFileSync(targetPkgPath, 'utf8'));

  const scriptKeys = [
    'scaffold:api-feature',
    'scaffold:module',
    'validate:architecture',
    'bootstrap:app',
  ];

  targetPkg.scripts = targetPkg.scripts ?? {};
  for (const key of scriptKeys) {
    if (templatePkg.scripts?.[key]) {
      targetPkg.scripts[key] = templatePkg.scripts[key].replace(
        'example-project',
        '.',
      );
      if (key === 'bootstrap:app') {
        targetPkg.scripts[key] = 'node scripts/bootstrap-into-app.mjs';
      }
    }
  }

  fs.writeFileSync(targetPkgPath, `${JSON.stringify(targetPkg, null, 2)}\n`);
  console.log('merged package.json scripts');

  const depKeys = [
    '@react-navigation/native',
    '@react-navigation/native-stack',
    '@reduxjs/toolkit',
    'axios',
    'react-native-keychain',
    'react-native-mmkv',
    'react-native-nitro-modules',
    'react-native-safe-area-context',
    'react-native-screens',
    'react-redux',
  ];
  const devDepKeys = ['@testing-library/react-native'];

  const missingDeps = depKeys.filter(name => !targetPkg.dependencies?.[name]);
  const missingDevDeps = devDepKeys.filter(name => !targetPkg.devDependencies?.[name]);

  const installParts = [];
  if (missingDeps.length > 0) {
    installParts.push(
      ...missingDeps.map(name => {
        const version = templatePkg.dependencies[name];
        return version ? `${name}@${version}` : name;
      }),
    );
  }
  if (missingDevDeps.length > 0) {
    installParts.push(
      ...missingDevDeps.map(name => {
        const version = templatePkg.devDependencies[name];
        return version ? `${name}@${version}` : name;
      }),
    );
  }

  globalThis.__installCommand =
    installParts.length > 0 ? `npm install ${installParts.join(' ')}` : null;
}

function mergeEslint(templateRoot, targetRoot) {
  const templateEslint = path.join(templateRoot, '.eslintrc.js');
  const targetEslint = path.join(targetRoot, '.eslintrc.js');

  if (!fs.existsSync(templateEslint)) {
    return;
  }

  if (!fs.existsSync(targetEslint)) {
    fs.copyFileSync(templateEslint, targetEslint);
    console.log('copied .eslintrc.js');
    return;
  }

  const templateContent = fs.readFileSync(templateEslint, 'utf8');
  if (templateContent.includes('no-restricted-imports')) {
    fs.copyFileSync(templateEslint, targetEslint);
    console.log('replaced .eslintrc.js with template (layer boundaries)');
  }
}

function mergeJestConfig(templateRoot, targetRoot) {
  const templateJest = path.join(templateRoot, 'jest.config.js');
  const targetJest = path.join(targetRoot, 'jest.config.js');

  if (!fs.existsSync(templateJest)) {
    return;
  }

  fs.copyFileSync(templateJest, targetJest);
  console.log('replaced jest.config.js (setupFilesAfterEnv + transformIgnorePatterns)');
}

function printNextSteps(_templateRoot, _targetRoot) {
  console.log(`
Bootstrap complete.

Next steps:
  1. Install dependencies:`);
  if (globalThis.__installCommand) {
    console.log(`     ${globalThis.__installCommand}`);
  } else {
    console.log('     (all template deps already present)');
  }
  console.log(`  2. iOS: cd ios && pod install && cd ..
  3. Set AppURL in src/network/core/config.ts
  4. npm run validate:architecture
  5. npm test
  6. npm run ios  # or android

Docs: docs/bootstrap-new-app.md, AGENTS.md
`);
}
