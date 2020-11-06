module.exports = {
  ...require('../jest.config'),
  rootDir: '..',
  cacheDirectory: '.cache/jest-cache-react-16',
  moduleDirectories: [
    '<rootDir>/test-react-16/node_modules',
    'node_modules'
  ]
}
