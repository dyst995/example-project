import { BaseService } from '../baseService';
import { apiClient } from '../config';

jest.mock('../config', () => ({
  apiClient: {
    request: jest.fn(),
  },
}));

class TestService extends BaseService {
  public callGet<T>(url: string) {
    return this.get<T>(url);
  }
  public callPost<T>(url: string, data?: Record<string, unknown>) {
    return this.post<T>(url, data);
  }
  public callPut<T>(url: string, data?: Record<string, unknown>) {
    return this.put<T>(url, data);
  }
  public callDelete<T>(url: string) {
    return this.delete<T>(url);
  }
  public callPatch<T>(url: string, data?: Record<string, unknown>) {
    return this.patch<T>(url, data);
  }
}

describe('BaseService', () => {
  const service = new TestService();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns normalized success response', async () => {
    (apiClient.request as jest.Mock).mockReturnValue({
      data: { id: 1, message: 'ok' },
      status: 200,
    });

    const res = await service.callGet<{ id: number; message: string }>('/me');

    expect(apiClient.request).toHaveBeenCalledWith({
      method: 'GET',
      url: '/me',
      data: undefined,
      params: undefined,
      headers: undefined,
    });

    expect(res).toEqual({
      data: { id: 1, message: 'ok' },
      status: 200,
      message: 'ok',
      headers: undefined,
    });
  });

  it('calls POST with data', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({
      data: { ok: true },
      status: 201,
    });

    await service.callPost('/login', { username: 'niko' });

    expect(apiClient.request).toHaveBeenCalledWith({
      method: 'POST',
      url: '/login',
      data: { username: 'niko' },
      params: undefined,
      headers: undefined,
    });
  });

  it('calls PUT with data', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({
      data: { ok: true },
      status: 200,
    });

    await service.callPut('/profile', { fullName: 'Niko' });

    expect(apiClient.request).toHaveBeenCalledWith({
      method: 'PUT',
      url: '/profile',
      data: { fullName: 'Niko' },
      params: undefined,
      headers: undefined,
    });
  });

  it('calls DELETE without body', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({
      data: { ok: true },
      status: 200,
    });

    await service.callDelete('/sessions/1');

    expect(apiClient.request).toHaveBeenCalledWith({
      method: 'DELETE',
      url: '/sessions/1',
      data: undefined,
      params: undefined,
      headers: undefined,
    });
  });

  it('calls PATCH with data', async () => {
    (apiClient.request as jest.Mock).mockResolvedValue({
      data: { ok: true },
      status: 200,
    });

    await service.callPatch('/users/1', { active: false });

    expect(apiClient.request).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/users/1',
      data: { active: false },
      params: undefined,
      headers: undefined,
    });
  });

  it('throws normalized error response', async () => {
    (apiClient.request as jest.Mock).mockRejectedValue({
      response: {
        status: 422,
        data: {
          message: 'Validation failed',
          errors: { email: ['invalid'] },
        },
      },
    });
    await expect(service.callGet('/me')).rejects.toEqual({
      message: 'Validation failed',
      status: 422,
      errors: { email: ['invalid'] },
    });
  });

  it('falls back to default error values', async () => {
    (apiClient.request as jest.Mock).mockRejectedValue({});
    await expect(service.callGet('/me')).rejects.toEqual({
      message: 'An error occurred',
      status: 500,
      errors: undefined,
    });
  });
});
