import axios from 'axios';

import type { ApiConfig } from './types';

export const AppURL = 'https://mci.dev.ol.ge/mci-back/resources/front/';

export const config: ApiConfig = {
  baseURL: AppURL,
  timeout: 0,
  headers: { 'Content-Type': 'application/json' },
};

export const apiClient = axios.create(config);

type ApiClientRuntimeConfig = {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
};

let runtimeConfig: ApiClientRuntimeConfig = {
  getAccessToken: () => null,
  onUnauthorized: () => {},
};

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
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      runtimeConfig.onUnauthorized();
    }
    return Promise.reject(error);
  },
);
