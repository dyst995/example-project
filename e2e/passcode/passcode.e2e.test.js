import { device, element, by, expect, waitFor } from 'detox';
import { loginAsDemoUser } from '../helpers/login';
import { enterPasscodePin } from '../helpers/passcode';

const DEMO_PASSCODE = '2468';

describe('Passcode flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('activates passcode and unlocks with passcode after logout', async () => {
    await loginAsDemoUser();
    await waitFor(element(by.id('dashboard-passcode-status')))
      .toBeVisible()
      .withTimeout(15000);
    await expect(element(by.id('dashboard-passcode-status'))).toHaveText(
      'Not set up',
    );

    await element(by.id('dashboard-passcode-setup-button')).tap();
    await waitFor(element(by.id('passcode-setup-pin-dots')))
      .toBeVisible()
      .withTimeout(5000);

    await enterPasscodePin('passcode-setup', DEMO_PASSCODE);
    await waitFor(element(by.text('Confirm passcode')))
      .toBeVisible()
      .withTimeout(5000);
    await enterPasscodePin('passcode-setup', DEMO_PASSCODE);

    await waitFor(element(by.id('dashboard-passcode-status')))
      .toHaveText('Enabled')
      .withTimeout(10000);

    await element(by.id('dashboard-logout-button')).tap();

    await waitFor(element(by.id('passcode-login-pin-dots')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('login-username-input'))).not.toExist();

    await enterPasscodePin('passcode-login', DEMO_PASSCODE);

    await waitFor(element(by.text('Dashboard')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
