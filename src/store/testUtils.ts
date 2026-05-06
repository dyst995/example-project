// Here are practical examples of where `src/store/testUtils.ts` is useful.

// ## 1) Component test with Redux Provider

// ```tsx
// import React from 'react';
// import { Provider } from 'react-redux';
// import { render } from '@testing-library/react-native';
// import { createTestStore } from '@/store/testUtils';
// import { ProfileHeader } from '../ProfileHeader';

// it('shows profile full name from store', () => {
//   const store = createTestStore({
//     profile: { fullName: 'Niko Beroshvili' },
//   });

//   const { getByText } = render(
//     <Provider store={store}>
//       <ProfileHeader />
//     </Provider>,
//   );

//   expect(getByText('Niko Beroshvili')).toBeTruthy();
// });
// ```

// ## 2) Integration test across slices

// ```ts
// import { createTestStore } from '@/store/testUtils';
// import { signIn, signOut } from '@/store/slices/authSlice';
// import { setFullName } from '@/store/slices/profileSlice';

// it('handles auth and profile updates together', () => {
//   const store = createTestStore();

//   store.dispatch(signIn('token-123'));
//   store.dispatch(setFullName('Niko Beroshvili'));

//   expect(store.getState().auth.authenticated).toBe(true);
//   expect(store.getState().profile.fullName).toBe('Niko Beroshvili');

//   store.dispatch(signOut());
//   expect(store.getState().auth.authenticated).toBe(false);
// });
// ```

// ## 3) Selector test with preloaded state

// ```ts
// import { createTestStore } from '@/store/testUtils';

// const selectIsAuthenticated = (state: any) => state.auth.authenticated;

// it('returns auth flag from preloaded state', () => {
//   const store = createTestStore({
//     auth: { authenticated: true, token: 'abc' },
//   });

//   expect(selectIsAuthenticated(store.getState())).toBe(true);
// });
// ```

// ---

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';

const rootReducer = combineReducers({
  auth: authReducer,
});

export type TestRootState = ReturnType<typeof rootReducer>;

export const createTestStore = (preloadedState?: Partial<TestRootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });
