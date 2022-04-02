import '@testing-library/jest-dom/extend-expect';

import { errorOnConsoleOutput } from '@welldone-software/jest-console-handler';

global.flushConsoleOutput = errorOnConsoleOutput({ filterEntries: ({ args }) => {
  return !args[0]?.startsWith?.('Warning: ReactDOM.render is no longer supported in React 18');
} });

const React = require('react');
if (process.env.USE_REACT_16 === 'true') {
  if (!React.version.startsWith('16')) {
    throw new Error(`Wrong React version. Expected ^16, got ${React.version}`);
  }
} else if (process.env.USE_REACT_17 === 'true') {
  if (!React.version.startsWith('17')) {
    throw new Error(`Wrong React version. Expected ^17, got ${React.version}`);
  }
} else if (process.env.USE_REACT_18 === 'true') {
  if (!React.version.startsWith('18')) {
    throw new Error(`Wrong React version. Expected ^18, got ${React.version}`);
  }
} else {
  throw new Error(`Unexpected React version. see: ${React.version}`);
}
