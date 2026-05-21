import passcodeReducer, { clearPasscodeError } from '../passcode.slice';
import {
  activatePasscodeThunk,
  hydratePasscodeThunk,
  passcodeLoginThunk,
} from '../passcode.thunk';

describe('passcodeSlice', () => {
  it('returns initial state', () => {
    const state = passcodeReducer(undefined, { type: '@@INIT' });

    expect(state).toEqual({
      isEnabled: false,
      isHydrated: false,
      isActivating: false,
      isUnlocking: false,
      error: null,
    });
  });

  it('hydrates enabled flag', () => {
    const state = passcodeReducer(
      passcodeReducer(undefined, hydratePasscodeThunk.pending),
      hydratePasscodeThunk.fulfilled(true, '', undefined),
    );

    expect(state.isEnabled).toBe(true);
    expect(state.isHydrated).toBe(true);
  });

  it('marks passcode enabled after activation', () => {
    const state = passcodeReducer(
      passcodeReducer(undefined, activatePasscodeThunk.pending),
      activatePasscodeThunk.fulfilled(undefined, '', {
        passcode: '1234',
        confirmPasscode: '1234',
      }),
    );

    expect(state.isEnabled).toBe(true);
    expect(state.isActivating).toBe(false);
  });

  it('stores activation errors', () => {
    const state = passcodeReducer(
      passcodeReducer(undefined, activatePasscodeThunk.pending),
      activatePasscodeThunk.rejected(null, '', undefined, {
        message: 'Passcodes do not match',
      }),
    );

    expect(state.error).toBe('Passcodes do not match');
    expect(state.isActivating).toBe(false);
  });

  it('clears error', () => {
    const state = passcodeReducer(
      {
        isEnabled: false,
        isHydrated: true,
        isActivating: false,
        isUnlocking: false,
        error: 'Incorrect passcode',
      },
      clearPasscodeError(),
    );

    expect(state.error).toBeNull();
  });

  it('tracks unlock loading state', () => {
    const pending = passcodeReducer(undefined, passcodeLoginThunk.pending);
    const fulfilled = passcodeReducer(
      pending,
      passcodeLoginThunk.fulfilled('token', '', { passcode: '1234' }),
    );

    expect(pending.isUnlocking).toBe(true);
    expect(fulfilled.isUnlocking).toBe(false);
  });
});
