/**
 * @param {string} input
 */
export function parseFeatureName(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Feature name is required.');
  }

  if (!/^[A-Za-z][A-Za-z0-9]*$/.test(trimmed)) {
    throw new Error('Feature name must be alphanumeric and start with a letter.');
  }

  const pascal = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  const camel = pascal.charAt(0).toLowerCase() + pascal.slice(1);
  const kebab = pascal.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const upper = pascal.toUpperCase();

  return { pascal, camel, kebab, upper };
}

/**
 * @param {string} template
 * @param {Record<string, string>} vars
 */
export function renderTemplate(template, vars) {
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
    template,
  );
}
