import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';

let updateInfos = [];
beforeEach(() => {
  updateInfos = [];
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo),
  });
});

afterEach(() => {
  React.__REVERT_WHY_DID_YOU_RENDER__();
});

test('dont swallow errors', () => {
  const BrokenComponent = React.memo(null);
  BrokenComponent.whyDidYouRender = true;

  const mountBrokenComponent = () => {
    rtl.render(
      <BrokenComponent/>
    );
  };

  expect(mountBrokenComponent).toThrow('Cannot read property \'propTypes\' of null');

  expect(global.flushConsoleOutput()).toEqual(expect.arrayContaining([
    {
      // console.error('Warning: memo: The first argument must be a component. Instead received: %s', 'null')
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('Warning: memo: The first argument must be a component'),
      ]),
    },
    {
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('propTypes'),
      ]),
    },
    {
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('Consider adding an error boundary'),
      ]),
    },
  ]));
});

test('render to static markup', () => {
  class MyComponent extends React.Component {
    static whyDidYouRender = true;
    render() {
      return (
        <div>
          hi!
        </div>
      );
    }
  }
  const string = ReactDOMServer.renderToStaticMarkup(<MyComponent/>);
  expect(string).toBe('<div>hi!</div>');
});
