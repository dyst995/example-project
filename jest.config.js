module.exports = {
  preset: '@react-native/jest-preset',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@reduxjs/toolkit|redux|immer|react-redux)/)',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/e2e/'],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
};
