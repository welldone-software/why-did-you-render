import React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as rtl from '@testing-library/react';
import _ from 'lodash';
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

  expect(mountBrokenComponent).toThrow(/(Cannot read property 'propTypes' of null|Cannot read properties of null \(reading 'propTypes'\))/);

  global.flushConsoleOutput()
    .map(output => ({
      ...output,
      args: output.args.map(a => _.isError(a) ? JSON.stringify(a.message) : a)
    }))
    .forEach(output => {
      expect(output).toEqual({
        level: 'error',
        args: expect.arrayContaining([
          expect.stringMatching(/(memo: The first argument must be a component|propTypes|error boundary)/),
        ]),
      });
    });
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
