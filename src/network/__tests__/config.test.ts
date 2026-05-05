const mockDispatch = jest.fn();
const mockGetState = jest.fn();

const mockRequestUse = jest.fn();
const mockResponseUse = jest.fn();

jest.mock('../../store', () => ({
  store: {
    dispatch: mockDispatch,
    getState: mockGetState,
  },
}));

jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({
      interceptors: {
        request: { use: mockRequestUse },
        response: { use: mockResponseUse },
      },
    })),
  },
}));

describe('network config interceptors', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('adds Authorization header when token exists', async () => {
    mockGetState.mockReturnValue({ auth: { token: 'abc-token' } });
    require('../config');

    const onRequest = mockRequestUse.mock.calls[0][0];
    const cfg = { headers: {} as Record<string, string> };
    const result = onRequest(cfg);
    expect(result.headers.Authorization).toBe('Bearer abc-token');
  });

  it('dispatches signOut on 401 response', async () => {
    require('../config');

    const onRejected = mockResponseUse.mock.calls[0][1];
    const error = { response: { status: 401 } };
    await expect(onRejected(error)).rejects.toBe(error);
    expect(mockDispatch).toHaveBeenCalled();
  });
});
