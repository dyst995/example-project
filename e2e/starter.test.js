const { device, element, by, expect } = require('detox');

describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have welcome screen', async () => {
    const welcomeText = element(by.text('Welcome'));
    await expect(welcomeText).toBeVisible();
  });
});
