export default {
  cacheDirectory: '.cache/jest-cache',
  setupFiles: ['./jest.polyfills.js'],
  setupFilesAfterEnv: [
    '<rootDir>/jestSetup.js',
  ],
  moduleNameMapper: {
    '~(.*)$': '<rootDir>/src$1',
    '^@welldone-software/why-did-you-render$': '<rootDir>/src/whyDidYouRender.js',
  },
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};
