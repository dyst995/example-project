import { apiClient } from '../core';
import { normalizeApiError } from '../utils/normalizeApiError';
import type { ApiError, ApiResult, HttpMethod } from './types';

export type RequestData = object | FormData;
export type RequestParams = Record<string, string | number | boolean>;
export type RequestHeaders = Record<string, string>;

export class BaseService {
  protected async request<T>(
    method: HttpMethod,
    url: string,
    data?: RequestData,
    params?: RequestParams,
    headers?: RequestHeaders,
  ): ApiResult<T> {
    try {
      const response = await apiClient.request({
        method,
        url,
        data,
        params,
        headers,
      });

      return {
        data: response.data,
        status: response.status,
        message: response.data?.message,
        headers,
      };
    } catch (error: unknown) {
      const apiError: ApiError = normalizeApiError(error);
      throw apiError;
    }
  }

  protected get<T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
  ): ApiResult<T> {
    return this.request<T>('GET', url, undefined, params, headers);
  }

  protected post<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): ApiResult<T> {
    return this.request<T>('POST', url, data, undefined, headers);
  }

  protected put<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): ApiResult<T> {
    return this.request<T>('PUT', url, data, undefined, headers);
  }

  protected delete<T>(url: string, headers?: RequestHeaders): ApiResult<T> {
    return this.request<T>('DELETE', url, undefined, undefined, headers);
  }

  protected patch<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): ApiResult<T> {
    return this.request<T>('PATCH', url, data, undefined, headers);
  }
}
