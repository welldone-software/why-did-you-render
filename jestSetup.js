import '@testing-library/jest-dom/extend-expect';

import { errorOnConsoleOutput } from '@welldone-software/jest-console-handler';

class CustomUnexpectedConsoleOutputError extends Error {
  constructor(message, consoleMessages) {
    super(`${message}: ${JSON.stringify(consoleMessages, null, 2)}`);
    this.consoleMessages = consoleMessages;
  }
}

const onError = ({ consoleMessages }) => {
  const filteredConsoleMessages = consoleMessages?.filter((consoleMessage) => 
    !consoleMessage?.args[0]?.startsWith('Warning: ReactDOM.render is no longer supported in React 18'));

  if (filteredConsoleMessages.length > 0) {
    throw new CustomUnexpectedConsoleOutputError(
      'Unhandled console messages in test',
      filteredConsoleMessages
    );
  }
};

if (process.env.USE_REACT_16 === 'true' || process.env.USE_REACT_17 === 'true') {
  global.flushConsoleOutput = errorOnConsoleOutput();
} else {
  global.flushConsoleOutput = errorOnConsoleOutput({ onError });
}

const React = require('react');
if (process.env.USE_REACT_16 === 'true') {
  if (!React.version.startsWith('16')) {
    throw new Error(`Wrong React version. Expected ^16, got ${React.version}`);
  }
} else if (process.env.USE_REACT_17 === 'true') {
  if (!React.version.startsWith('17')) {
    throw new Error(`Wrong React version. Expected ^17, got ${React.version}`);
  }
} else {
  if (!React.version.startsWith('18')) {
    throw new Error(`Wrong React version. Expected ^18, got ${React.version}`);
  }
}
