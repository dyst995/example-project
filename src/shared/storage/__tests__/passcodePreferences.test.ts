import { passcodePreferences } from '../passcodePreferences';

describe('passcodePreferences', () => {
  it('is disabled by default', () => {
    expect(passcodePreferences.isEnabled()).toBe(false);
  });

  it('persists enabled flag', () => {
    passcodePreferences.setEnabled(true);
    expect(passcodePreferences.isEnabled()).toBe(true);

    passcodePreferences.setEnabled(false);
    expect(passcodePreferences.isEnabled()).toBe(false);
  });
});
