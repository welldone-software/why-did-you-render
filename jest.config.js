module.exports = {
  'cacheDirectory': '.cache/jest-cache',
  'setupFilesAfterEnv': [
    '<rootDir>/jestSetup.js',
  ],
  'moduleNameMapper': {
    '~(.*)$': '<rootDir>/src$1',
    '^@welldone-software/why-did-you-render$': '<rootDir>/src/whyDidYouRender.js',
  },
  'testEnvironment': 'jsdom',
};

if (process.env.USE_REACT_16 === 'true') {
  module.exports.cacheDirectory = '.cache/jest-cache-react-16';
  module.exports.moduleNameMapper = {
    ...module.exports.moduleNameMapper,
    '^react-is((\\/.*)?)$': 'react-is-16$1',
    '^react-dom((\\/.*)?)$': 'react-dom-16$1',
    '^react((\\/.*)?)$': 'react-16$1',
  };
} else if (process.env.USE_REACT_17 === 'true') {
  module.exports.cacheDirectory = '.cache/jest-cache-react-17';
  module.exports.moduleNameMapper = {
    ...module.exports.moduleNameMapper,
    '^react-is((\\/.*)?)$': 'react-is-17$1',
    '^react-dom((\\/.*)?)$': 'react-dom-17$1',
    '^react((\\/.*)?)$': 'react-17$1',
  };
} else if (process.env.USE_REACT_18 === 'true') {
  module.exports.cacheDirectory = '.cache/jest-cache-react-18';
}
