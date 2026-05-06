import { useAppDispatch, useAppSelector } from '../store/hooks';

jest.mock('../store/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));

export const mockedUseAppDispatch = useAppDispatch as jest.MockedFunction<
  typeof useAppDispatch
>;
export const mockedUseAppSelector = useAppSelector as jest.MockedFunction<
  typeof useAppSelector
>;

/**
 * Applies default mocked return values for Redux store hooks in hook/unit tests.
 *
 * Returns the dispatch mock so tests can assert dispatched actions.
 */
export const setupStoreHooksMock = (options?: {
  dispatch?: jest.Mock;
  selectorState?: unknown;
}) => {
  const dispatch = options?.dispatch ?? jest.fn();
  const selectorState = options?.selectorState ?? {};

  mockedUseAppDispatch.mockReturnValue(dispatch);
  mockedUseAppSelector.mockReturnValue(selectorState as any);

  return { dispatch };
};
