import '@testing-library/jest-dom/extend-expect'

import {errorOnConsoleOutput} from '@welldone-software/jest-console-handler'

global.flushConsoleOutput = errorOnConsoleOutput()

if(process.env.USE_REACT_16 === 'true'){
  jest.mock('react', () => {
    return jest.requireActual('react-16')
  })

  jest.mock('react-dom', () => {
    return jest.requireActual('react-dom-16')
  })

  jest.mock('react-dom/test-utils', () => {
    return jest.requireActual('react-dom-16/test-utils')
  })

  jest.mock('react-is', () => {
    return jest.requireActual('react-is-16')
  })
}

const React = require('react')
if(process.env.USE_REACT_16 === 'true'){
  if(!React.version.startsWith('16')){
    throw new Error(`Wrong React version. Expected ^16, got ${React.version}`)
  }
}else{
  if(!React.version.startsWith('17')){
    throw new Error(`Wrong React version. Expected ^17, got ${React.version}`)
  }
}
