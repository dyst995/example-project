import { element, by } from 'detox';

export const enterPasscodePin = async (testIdPrefix, passcode) => {
  for (const digit of passcode) {
    await element(by.id(`${testIdPrefix}-pin-key-${digit}`)).tap();
  }
};
