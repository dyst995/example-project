import { device, element, by, expect, waitFor } from 'detox';

describe('Login flow', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows login screen controls', async () => {
    await expect(element(by.id('login-username-input'))).toBeVisible();
    await expect(element(by.id('login-password-input'))).toBeVisible();
    await expect(element(by.id('login-submit-button'))).toBeVisible();
  });

  it('logs in and navigates to Dashboard', async () => {
    await element(by.id('login-username-input')).typeText('01130052215');
    await element(by.id('login-password-input')).typeText('asdASD123!@#');

    await device.pressBack();
    await element(by.id('login-submit-button')).tap();

    await waitFor(element(by.text('Dashboard')))
      .toBeVisible()
      .withTimeout(15000);
  });
});
