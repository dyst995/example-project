export const createQueryString = <T extends Record<string, unknown>>(
  params: T,
): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join('&');
};
