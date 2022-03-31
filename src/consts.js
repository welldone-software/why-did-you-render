import React from 'react';

export const diffTypes = {
  'different': 'different',
  'deepEquals': 'deepEquals',
  'date': 'date',
  'regex': 'regex',
  'reactElement': 'reactElement',
  'function': 'function',
  'same': 'same',
};

export const diffTypesDescriptions = {
  [diffTypes.different]: 'different objects',
  [diffTypes.deepEquals]: 'different objects that are equal by value',
  [diffTypes.date]: 'different date objects with the same value',
  [diffTypes.regex]: 'different regular expressions with the same value',
  [diffTypes.reactElement]: 'different React elements (remember that the <jsx/> syntax always produces a *NEW* immutable React element so a component that receives <jsx/> as props always re-renders)',
  [diffTypes.function]: 'different functions with the same name',
  [diffTypes.same]: 'same objects by ref (===)',
};

// copied from packages/shared/ReactSymbols.js in https://github.com/facebook/react
const hasSymbol = typeof Symbol === 'function' && Symbol.for;
export const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
export const REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
export const REACT_VERSION = Number(React.version.split('.')[0]) || 0;
export const REACT_STRICT_MODE = REACT_VERSION >= 18 ? 0b1000 : 0b0001;
