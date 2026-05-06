import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { createTestStore, TestRootState } from '../store/testUtils';

type RenderWithProviderOptions = {
  preloadedState?: Partial<TestRootState>;
};

/**
 * Renders a component wrapped with Redux Provider and returns the test store.
 *
 * Useful for integration-style component tests that need real store behavior.
 */
export const renderWithProvider = (
  ui: React.ReactElement,
  options: RenderWithProviderOptions = {},
) => {
  const store = createTestStore(options.preloadedState);

  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store,
  };
};
