#!/usr/bin/env node
/**
 * Scaffolds a new API-backed feature (domain + network + store RTK Query slice).
 *
 * Usage:
 *   node scripts/scaffold-api-feature.mjs Profile
 *   npm run scaffold:api-feature -- Profile
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFeatureName, renderTemplate } from './lib/names.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const templatesDir = path.join(__dirname, 'templates', 'api-feature');

const featureArg = process.argv[2];
if (!featureArg) {
  console.error('Usage: node scripts/scaffold-api-feature.mjs <FeatureName>');
  process.exit(1);
}

const names = parseFeatureName(featureArg);
const vars = {
  Feature: names.pascal,
  feature: names.camel,
  featureKebab: names.kebab,
  FEATURE: names.upper,
};

const files = [
  ['domain.model.ts.tpl', `src/domain/models/${names.camel}.ts`],
  ['network/routes.ts.tpl', `src/network/services/${names.camel}/routes.ts`],
  [
    'network/types.ts.tpl',
    `src/network/services/${names.camel}/types/${names.camel}.types.ts`,
  ],
  [
    'network/mapper.ts.tpl',
    `src/network/services/${names.camel}/mappers/${names.camel}.mapper.ts`,
  ],
  [
    'network/service.ts.tpl',
    `src/network/services/${names.camel}/${names.camel}.service.ts`,
  ],
  ['store/api.ts.tpl', `src/store/${names.camel}/${names.camel}.api.ts`],
  ['store/slice.ts.tpl', `src/store/${names.camel}/${names.camel}.slice.ts`],
  ['store/selector.ts.tpl', `src/store/${names.camel}/${names.camel}.selector.ts`],
  ['store/index.ts.tpl', `src/store/${names.camel}/index.ts`],
];

for (const [templateRel, destRel] of files) {
  const dest = path.join(root, destRel);
  if (fs.existsSync(dest)) {
    console.error(`Refusing to overwrite existing file: ${destRel}`);
    process.exit(1);
  }

  const templatePath = path.join(templatesDir, templateRel);
  const template = fs.readFileSync(templatePath, 'utf8');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, renderTemplate(template, vars));
  console.log(`created ${destRel}`);
}

patchDomainIndex(names);
patchStoreIndex(names);
patchStoreTypes(names);
patchTestUtils(names);
patchBaseApiTags(names);

console.log(`
Done. Next steps:
1. Edit routes/DTOs/mapper/service for the real API contract.
2. Wire ${names.pascal} UI in modules/ and navigation if needed.
3. Run: npm run validate:architecture && npm test
`);

function patchDomainIndex(names) {
  const indexPath = path.join(root, 'src/domain/models/index.ts');
  const exportLine = `export type { ${names.pascal} } from './${names.camel}';\n`;
  const content = fs.readFileSync(indexPath, 'utf8');
  if (content.includes(exportLine.trim())) {
    return;
  }
  fs.appendFileSync(indexPath, exportLine);
  console.log('updated src/domain/models/index.ts');
}

function patchStoreIndex(names) {
  const indexPath = path.join(root, 'src/store/index.ts');
  let content = fs.readFileSync(indexPath, 'utf8');
  const importReducer = `import ${names.camel}Reducer from './${names.camel}/${names.camel}.slice';\n`;
  const importApi = `import './${names.camel}/${names.camel}.api';\n`;

  if (!content.includes(importReducer)) {
    content = content.replace(
      "import passcodeReducer from './passcode/passcode.slice';",
      `import passcodeReducer from './passcode/passcode.slice';\n${importReducer}${importApi}`,
    );
  }

  const reducerLine = `    ${names.camel}: ${names.camel}Reducer,`;
  if (!content.includes(reducerLine)) {
    content = content.replace(
      '    passcode: passcodeReducer,',
      `    passcode: passcodeReducer,\n${reducerLine}`,
    );
  }

  fs.writeFileSync(indexPath, content);
  console.log('updated src/store/index.ts');
}

function patchStoreTypes(names) {
  const typesPath = path.join(root, 'src/store/storeTypes.ts');
  let content = fs.readFileSync(typesPath, 'utf8');
  const importLine = `import type { ${names.pascal}State } from './${names.camel}/${names.camel}.slice';\n`;

  if (!content.includes(importLine)) {
    content = content.replace(
      "import type passcodeReducer from './passcode/passcode.slice';",
      `import type passcodeReducer from './passcode/passcode.slice';\n${importLine}`,
    );
  }

  const stateLine = `  ${names.camel}: ${names.pascal}State;`;
  if (!content.includes(stateLine)) {
    content = content.replace(
      '  passcode: ReturnType<typeof passcodeReducer>;',
      `  passcode: ReturnType<typeof passcodeReducer>;\n${stateLine}`,
    );
  }

  fs.writeFileSync(typesPath, content);
  console.log('updated src/store/storeTypes.ts');
}

function patchTestUtils(names) {
  const testUtilsPath = path.join(root, 'src/store/testUtils.ts');
  let content = fs.readFileSync(testUtilsPath, 'utf8');
  const importReducer = `import ${names.camel}Reducer from './${names.camel}/${names.camel}.slice';\n`;
  const importApi = `import './${names.camel}/${names.camel}.api';\n`;

  if (!content.includes(importReducer)) {
    content = content.replace(
      "import passcodeReducer from './passcode/passcode.slice';",
      `import passcodeReducer from './passcode/passcode.slice';\n${importReducer}${importApi}`,
    );
  }

  const reducerLine = `  ${names.camel}: ${names.camel}Reducer,`;
  if (!content.includes(reducerLine)) {
    content = content.replace(
      '  passcode: passcodeReducer,',
      `  passcode: passcodeReducer,\n${reducerLine}`,
    );
  }

  fs.writeFileSync(testUtilsPath, content);
  console.log('updated src/store/testUtils.ts');
}

function patchBaseApiTags(names) {
  const baseApiPath = path.join(root, 'src/store/api/baseApi.ts');
  let content = fs.readFileSync(baseApiPath, 'utf8');
  const tag = `'${names.pascal}'`;

  if (content.includes(tag)) {
    return;
  }

  content = content.replace(
    "tagTypes: ['Auth']",
    `tagTypes: ['Auth', ${tag}]`,
  );
  fs.writeFileSync(baseApiPath, content);
  console.log('updated src/store/api/baseApi.ts tagTypes');
}
