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

if(process.env.USE_REACT_16 === 'true'){
  module.exports.cacheDirectory = '.cache/jest-cache-react-16'
  module.exports.moduleNameMapper = {
    ...module.exports.moduleNameMapper,
    '^react-is((\\/.*)?)$': 'react-is-16$1',
    '^react-dom((\\/.*)?)$': 'react-dom-16$1',
    '^react((\\/.*)?)$': 'react-16$1'
  }
}
