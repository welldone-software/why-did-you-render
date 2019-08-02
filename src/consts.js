export const diffTypes = {
  'different': 'different',
  'deepEquals': 'deepEquals',
  'date': 'date',
  'regex': 'regex',
  'reactElement': 'reactElement',
  'function': 'function'
}

// copied from packages/shared/ReactSymbols.js in https://github.com/facebook/react
const hasSymbol = typeof Symbol === 'function' && Symbol.for
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0
