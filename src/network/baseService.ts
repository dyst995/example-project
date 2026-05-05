import { apiClient } from './config';
import type { ApiResponse, HttpMethod } from './types';

export type RequestData = Record<string, unknown> | FormData;
export type RequestParams = Record<string, string | number | boolean>;
export type RequestHeaders = Record<string, string>;

export class BaseService {
  protected async request<T>(
    method: HttpMethod,
    url: string,
    data?: RequestData,
    params?: RequestParams,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
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
      const axiosError = error as {
        response?: {
          data?: { message?: string; errors?: Record<string, string[]> };
          status?: number;
        };
      };
      throw {
        message: axiosError.response?.data?.message || 'An error occurred',
        status: axiosError.response?.status || 500,
        errors: axiosError.response?.data?.errors,
      };
    }
  }

  protected get<T>(
    url: string,
    params?: RequestParams,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, params, headers);
  }

  protected post<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, undefined, headers);
  }

  protected put<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, undefined, headers);
  }

  protected delete<T>(
    url: string,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, undefined, headers);
  }

  protected patch<T>(
    url: string,
    data?: RequestData,
    headers?: RequestHeaders,
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, undefined, headers);
  }
}
