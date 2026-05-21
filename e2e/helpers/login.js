import { device, element, by } from 'detox';

export const loginAsDemoUser = async () => {
  await element(by.id('login-username-input')).typeText('01130052215');
  await element(by.id('login-password-input')).typeText('asdASD123!@#');
  await device.pressBack();
  await element(by.id('login-submit-button')).tap();
};
