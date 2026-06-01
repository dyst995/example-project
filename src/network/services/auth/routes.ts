/**
 * Auth API route segments (relative to `AppURL` in network/core/config.ts).
 *
 * `refresh` must match the backend contract. Update this constant if the server
 * exposes a different refresh path or method.
 */
export const AuthRoutes = {
  login: 'auth',
  refresh: 'auth/refresh',
};
