module.exports = {
  root: true,
  extends: '@react-native',
  overrides: [
    {
      files: ['src/modules/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/network/**'],
                message:
                  'Modules must not import the network layer. Use store hooks, domain models, or shared utilities instead.',
              },
            ],
          },
        ],
      },
    },
    {
      files: ['src/domain/**/*.{ts,tsx}'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['**/network/**', '**/store/**', '**/modules/**'],
                message:
                  'Domain layer must not depend on network, store, or UI modules.',
              },
            ],
          },
        ],
      },
    },
  ],
};
