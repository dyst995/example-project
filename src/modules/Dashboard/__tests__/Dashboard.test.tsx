import { fireEvent } from '@testing-library/react-native';
import { Dashboard } from '../Dashboard';
import { renderWithProvider } from '../../../test/renderWithProvider';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));

const authenticatedState = {
  auth: {
    authenticated: true,
    session: {
      accessToken: 'token',
      refreshToken: 'refresh',
    },
    isLoading: false,
    error: null,
    isHydrated: true,
  },
  passcode: {
    isEnabled: false,
    isHydrated: true,
    isActivating: false,
    isUnlocking: false,
    error: null,
  },
};

describe('Dashboard', () => {
  it('renders activity count from store', () => {
    const { getByTestId } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        ...authenticatedState,
        dashboard: { activityCount: 3 },
      },
    });

    expect(getByTestId('dashboard-activity-count').props.children).toBe(3);
  });

  it('increments activity count when Add activity is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: authenticatedState,
    });

    fireEvent.press(getByTestId('dashboard-increment-button'));
    fireEvent.press(getByTestId('dashboard-increment-button'));

    expect(store.getState().dashboard.activityCount).toBe(2);
    expect(getByTestId('dashboard-activity-count').props.children).toBe(2);
  });

  it('resets activity count when Reset is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        ...authenticatedState,
        dashboard: { activityCount: 5 },
      },
    });

    fireEvent.press(getByTestId('dashboard-reset-button'));

    expect(store.getState().dashboard.activityCount).toBe(0);
    expect(getByTestId('dashboard-activity-count').props.children).toBe(0);
  });

  it('dispatches signOut when Log out is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: authenticatedState,
    });

    fireEvent.press(getByTestId('dashboard-logout-button'));

    expect(store.getState().auth.authenticated).toBe(false);
    expect(store.getState().auth.session).toBeNull();
  });

  it('shows passcode setup when passcode is disabled', () => {
    const { getByTestId } = renderWithProvider(<Dashboard />, {
      preloadedState: authenticatedState,
    });

    expect(getByTestId('dashboard-passcode-status').props.children).toBe(
      'Not set up',
    );
    expect(getByTestId('dashboard-passcode-setup-button')).toBeVisible();
  });

  it('hides passcode setup when passcode is enabled', () => {
    const { getByTestId, queryByTestId } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        ...authenticatedState,
        passcode: {
          ...authenticatedState.passcode,
          isEnabled: true,
        },
      },
    });

    expect(getByTestId('dashboard-passcode-status').props.children).toBe(
      'Enabled',
    );
    expect(queryByTestId('dashboard-passcode-setup-button')).toBeNull();
  });
});
