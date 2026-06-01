import { createApi } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn } from '@reduxjs/toolkit/query';

import { apiClient } from '../../network/core/config';
import type { ApiError } from '../../network/core/types';
import { normalizeApiError } from '../../network/utils/normalizeApiError';

export type AxiosBaseQueryArgs = {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  params?: Record<string, string | number | boolean>;
};

export const axiosBaseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  ApiError
> = async ({ url, method = 'GET', data, params }) => {
  try {
    const response = await apiClient.request({
      url,
      method,
      data,
      params,
    });

    return { data: response.data };
  } catch (error) {
    return { error: normalizeApiError(error) };
  }
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Auth'],
  endpoints: () => ({}),
});
