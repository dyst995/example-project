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
