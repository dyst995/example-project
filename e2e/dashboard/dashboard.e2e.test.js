import { device, element, by, expect, waitFor } from 'detox';
import { loginAsDemoUser } from '../helpers/login';

describe('Dashboard', () => {
  beforeAll(async () => {
    await device.launchApp({ newInstance: true });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    await loginAsDemoUser();
    await waitFor(element(by.id('dashboard-activity-count')))
      .toBeVisible()
      .withTimeout(15000);
  });

  it('shows initial activity count', async () => {
    await expect(element(by.id('dashboard-activity-count'))).toHaveText('0');
  });

  it('increments and resets activity count', async () => {
    await element(by.id('dashboard-increment-button')).tap();
    await element(by.id('dashboard-increment-button')).tap();
    await expect(element(by.id('dashboard-activity-count'))).toHaveText('2');

    await element(by.id('dashboard-reset-button')).tap();
    await expect(element(by.id('dashboard-activity-count'))).toHaveText('0');
  });

  it('logs out and returns to login screen', async () => {
    await element(by.id('dashboard-logout-button')).tap();

    await waitFor(element(by.id('login-submit-button')))
      .toBeVisible()
      .withTimeout(10000);
    await expect(element(by.id('login-username-input'))).toBeVisible();
  });
});
