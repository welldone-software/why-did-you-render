module.exports = {
  'cacheDirectory': '.cache/jest-cache',
  'modulePaths': [
    '<rootDir>/src'
  ],
  'setupFilesAfterEnv': [
    '<rootDir>/jestSetup.js'
  ],
  'moduleNameMapper': {
    '^@welldone-software/why-did-you-render$': '<rootDir>/src/whyDidYouRender.js'
  }
}
