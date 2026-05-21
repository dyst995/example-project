import { device, element, by, expect, waitFor } from 'detox';
import { loginAsDemoUser } from '../helpers/login';

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
    await element(by.id('passcode-setup-input')).typeText(DEMO_PASSCODE);
    await element(by.id('passcode-setup-confirm-input')).typeText(DEMO_PASSCODE);
    await device.pressBack();
    await element(by.id('passcode-setup-submit-button')).tap();

    await waitFor(element(by.id('dashboard-passcode-status')))
      .toHaveText('Enabled')
      .withTimeout(10000);

    await element(by.id('dashboard-logout-button')).tap();

    await waitFor(element(by.id('passcode-login-input')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('login-username-input'))).not.toExist();

    await element(by.id('passcode-login-input')).typeText(DEMO_PASSCODE);
    await device.pressBack();
    await element(by.id('passcode-login-submit-button')).tap();

    await waitFor(element(by.text('Dashboard')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
