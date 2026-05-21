import { fireEvent } from '@testing-library/react-native';
import { Dashboard } from '../Dashboard';
import { renderWithProvider } from '../../../test/renderWithProvider';

describe('Dashboard', () => {
  it('renders activity count from store', () => {
    const { getByTestId } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        auth: {
          authenticated: true,
          token: 'token',
          isLoading: false,
          error: null,
        },
        dashboard: { activityCount: 3 },
      },
    });

    expect(getByTestId('dashboard-activity-count').props.children).toBe(3);
  });

  it('increments activity count when Add activity is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        auth: {
          authenticated: true,
          token: 'token',
          isLoading: false,
          error: null,
        },
      },
    });

    fireEvent.press(getByTestId('dashboard-increment-button'));
    fireEvent.press(getByTestId('dashboard-increment-button'));

    expect(store.getState().dashboard.activityCount).toBe(2);
    expect(getByTestId('dashboard-activity-count').props.children).toBe(2);
  });

  it('resets activity count when Reset is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        auth: {
          authenticated: true,
          token: 'token',
          isLoading: false,
          error: null,
        },
        dashboard: { activityCount: 5 },
      },
    });

    fireEvent.press(getByTestId('dashboard-reset-button'));

    expect(store.getState().dashboard.activityCount).toBe(0);
    expect(getByTestId('dashboard-activity-count').props.children).toBe(0);
  });

  it('dispatches signOut when Log out is pressed', () => {
    const { getByTestId, store } = renderWithProvider(<Dashboard />, {
      preloadedState: {
        auth: {
          authenticated: true,
          token: 'token',
          isLoading: false,
          error: null,
        },
      },
    });

    fireEvent.press(getByTestId('dashboard-logout-button'));

    expect(store.getState().auth.authenticated).toBe(false);
    expect(store.getState().auth.token).toBeNull();
  });
});
