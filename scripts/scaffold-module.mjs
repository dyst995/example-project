#!/usr/bin/env node
/**
 * Scaffolds a feature UI module (screens + hooks + barrel exports).
 *
 * Usage:
 *   node scripts/scaffold-module.mjs Profile
 *   npm run scaffold:module -- Profile
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFeatureName, renderTemplate } from './lib/names.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const templatesDir = path.join(__dirname, 'templates', 'module');

const featureArg = process.argv[2];
if (!featureArg) {
  console.error('Usage: node scripts/scaffold-module.mjs <FeatureName>');
  process.exit(1);
}

const names = parseFeatureName(featureArg);
const vars = {
  Feature: names.pascal,
  feature: names.camel,
};

const moduleDir = path.join(root, 'src/modules', names.pascal);
if (fs.existsSync(moduleDir)) {
  console.error(`Module already exists: src/modules/${names.pascal}`);
  process.exit(1);
}

const files = [
  ['Screen.tsx', `screens/${names.pascal}Screen.tsx`],
  ['useScreen.tsx', `hooks/use${names.pascal}Screen.tsx`],
  ['hooks.index.ts', 'hooks/index.ts'],
  ['screens.index.ts', 'screens/index.ts'],
  ['module.index.ts', 'index.ts'],
];

for (const [templateRel, destRel] of files) {
  const template = fs.readFileSync(path.join(templatesDir, templateRel), 'utf8');
  const dest = path.join(moduleDir, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, renderTemplate(template, vars));
  console.log(`created src/modules/${names.pascal}/${destRel}`);
}

console.log(`
Done. Next steps:
1. Register ${names.pascal}Screen in navigation (see skill: add-navigation-screen).
2. Connect hooks to store selectors or RTK Query hooks.
3. Add tests under modules/${names.pascal}/**.
`);
