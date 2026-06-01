#!/usr/bin/env node
/**
 * Lightweight architecture checks aligned with docs/project-structure-guide.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src = path.join(root, 'src');

const errors = [];
const warnings = [];

assertExists('docs/project-structure-guide.md');
assertExists('.eslintrc.js');
assertExists('src/store/api/baseApi.ts');

checkModulesDoNotImportNetwork();
checkStoreFeaturesHaveBarrels();
checkDomainModelsIndex();

if (errors.length > 0) {
  console.error('Architecture validation failed:\n');
  errors.forEach(message => console.error(`  ✗ ${message}`));
  process.exit(1);
}

if (warnings.length > 0) {
  console.warn('Architecture warnings:\n');
  warnings.forEach(message => console.warn(`  ! ${message}`));
}

console.log('Architecture validation passed.');

function assertExists(relPath) {
  if (!fs.existsSync(path.join(root, relPath))) {
    errors.push(`Missing required file: ${relPath}`);
  }
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(full);
    }
  }

  return files;
}

function checkModulesDoNotImportNetwork() {
  const moduleFiles = walk(path.join(src, 'modules'));
  const pattern = /from\s+['"][^'"]*network\//;

  for (const file of moduleFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (pattern.test(content)) {
      errors.push(
        `Module imports network layer: ${path.relative(root, file)}`,
      );
    }
  }
}

function checkStoreFeaturesHaveBarrels() {
  const storeDir = path.join(src, 'store');
  const entries = fs.readdirSync(storeDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'api' || entry.name === '__tests__') {
      continue;
    }

    const featureDir = path.join(storeDir, entry.name);
    const hasSlice = fs
      .readdirSync(featureDir)
      .some(name => name.endsWith('.slice.ts'));

    if (!hasSlice) {
      continue;
    }

    const indexPath = path.join(featureDir, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      warnings.push(`Store feature missing index.ts: store/${entry.name}/`);
    }
  }
}

function checkDomainModelsIndex() {
  const modelsDir = path.join(src, 'domain', 'models');
  if (!fs.existsSync(modelsDir)) {
    return;
  }

  const modelFiles = fs
    .readdirSync(modelsDir)
    .filter(name => name.endsWith('.ts') && name !== 'index.ts');

  const indexContent = fs.existsSync(path.join(modelsDir, 'index.ts'))
    ? fs.readFileSync(path.join(modelsDir, 'index.ts'), 'utf8')
    : '';

  for (const file of modelFiles) {
    const modelName = file.replace('.ts', '');
    if (!indexContent.includes(`'./${modelName}'`) && !indexContent.includes(`"./${modelName}"`)) {
      warnings.push(`domain/models/${file} is not exported from domain/models/index.ts`);
    }
  }
}
