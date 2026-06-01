import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import type { ApiConfig } from './types';

export const AppURL = 'https://mci.dev.ol.ge/mci-back/resources/front/';

const REQUEST_TIMEOUT_MS = 30_000;

export const config: ApiConfig = {
  baseURL: AppURL,
  timeout: REQUEST_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
};

export const apiClient = axios.create(config);

type ApiClientRuntimeConfig = {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  refreshAccessToken: (refreshToken: string) => Promise<string | null>;
  onUnauthorized: () => void;
};

let runtimeConfig: ApiClientRuntimeConfig = {
  getAccessToken: () => null,
  getRefreshToken: () => null,
  refreshAccessToken: async () => null,
  onUnauthorized: () => {},
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string | null> | null = null;

/**
 * Injects runtime callbacks used by API interceptors.
 *
 * This keeps the network layer decoupled from the Redux store and prevents
 * circular imports between store initialization and service modules.
 */
export const setupApiClient = (configOverrides: Partial<ApiClientRuntimeConfig>) => {
  runtimeConfig = {
    ...runtimeConfig,
    ...configOverrides,
  };
};

apiClient.interceptors.request.use(
  requestConfig => {
    const token = runtimeConfig.getAccessToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    return requestConfig;
  },
  error => Promise.reject(error),
);

apiClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableRequestConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      const isRefreshRequest = originalRequest.url?.includes('auth/refresh');
      if (isRefreshRequest) {
        runtimeConfig.onUnauthorized();
        return Promise.reject(error);
      }

      const refreshToken = runtimeConfig.getRefreshToken();

      if (refreshToken) {
        if (!refreshPromise) {
          refreshPromise = runtimeConfig
            .refreshAccessToken(refreshToken)
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;
        if (accessToken) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      }

      runtimeConfig.onUnauthorized();
    }

    return Promise.reject(error);
  },
);
