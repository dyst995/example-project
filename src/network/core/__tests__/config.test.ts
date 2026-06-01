const mockDispatch = jest.fn();

const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: mockRequestUse },
        response: { use: mockResponseUse },
      },
      request: jest.fn(),
    })),
  },
}));

describe('network config interceptors', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('adds Authorization header when token exists', async () => {
    const { setupApiClient } = require('../config');
    setupApiClient({
      getAccessToken: () => 'abc-token',
    });

    const onRequest = mockRequestUse.mock.calls[0][0];
    const cfg = { headers: {} as Record<string, string> };
    const result = onRequest(cfg);
    expect(result.headers.Authorization).toBe('Bearer abc-token');
  });

  it('dispatches signOut on 401 when refresh is unavailable', async () => {
    const { setupApiClient } = require('../config');
    setupApiClient({
      getRefreshToken: () => null,
      onUnauthorized: mockDispatch,
    });

    const onRejected = mockResponseUse.mock.calls[0][1];
    const error = { response: { status: 401 }, config: { url: '/auth', headers: {} } };
    await expect(onRejected(error)).rejects.toBe(error);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('does not sign out on 403 responses', async () => {
    const { setupApiClient } = require('../config');
    setupApiClient({
      onUnauthorized: mockDispatch,
    });

    const onRejected = mockResponseUse.mock.calls[0][1];
    const error = { response: { status: 403 }, config: { url: '/auth', headers: {} } };
    await expect(onRejected(error)).rejects.toBe(error);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('request interceptor passes through request errors', async () => {
    require('../config');
    const onRequestError = mockRequestUse.mock.calls[0][1];

    const requestError = new Error('request failed');
    await expect(onRequestError(requestError)).rejects.toBe(requestError);
  });

  it('response interceptor returns response unchanged', () => {
    require('../config');
    const onResponseSuccess = mockResponseUse.mock.calls[0][0];

    const response = { data: { ok: true }, status: 200 };
    expect(onResponseSuccess(response)).toBe(response);
  });
});
