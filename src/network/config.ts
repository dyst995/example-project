import axios from 'axios';
import { store } from '../store';
import { signOut } from '../store/slices/authSlice';

import type { ApiConfig } from './types';

export const AppURL = 'https://test.easypay.ge';

export const config: ApiConfig = {
  baseURL: `${AppURL}/api/v1`,
  timeout: 0,
  headers: { 'Content-Type': 'application/json' },
};

export const apiClient = axios.create(config);

apiClient.interceptors.request.use(
  requestConfig => {
    const token = store.getState().auth.token;
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
      store.dispatch(signOut());
    }
    return Promise.reject(error);
  },
);
