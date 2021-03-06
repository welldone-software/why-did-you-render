import React from 'react';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';

let updateInfos = [];
beforeEach(() => {
  updateInfos = [];
  whyDidYouRender(React, {
    include: [/.*/],
    logOnDifferentValues: true,
    notifier: updateInfo => updateInfos.push(updateInfo),
  });
});

afterEach(() => {
  React.__REVERT_WHY_DID_YOU_RENDER__();
});

test('hook value change', () => {
  const Foo = React.memo(function Foo(props) {
    return (
      <div>
        Foo {props.a.v}
      </div>
    );
  });

  const App = React.memo(function App() {
    const [text, setText] = React.useState('Click me');

    return (
      <div className="App">
        <button
          onClick={() => setText(state => state + '.')}
          data-testid="button"
        >
          {text}
        </button>
        <hr/>
        <Foo a={{ v: '1' }}/>
        <Foo a={{ v: '1' }}/>
      </div>
    );
  });

  const { getByTestId } = rtl.render(
    <App/>
  );

  const button = getByTestId('button');
  rtl.fireEvent.click(button);

  expect(updateInfos).toEqual([
    expect.objectContaining({ displayName: 'App' }),
    expect.objectContaining({ displayName: 'Foo' }),
    expect.objectContaining({ displayName: 'Foo' }),
  ]);
});

test('Non simple objects', () => {
  const Foo = React.memo(function Foo({ error }) {
    return (
      <div>
        <h1>{error.message}</h1>
        <p>{error.stack}</p>
      </div>
    );
  });

  const App = React.memo(function App() {
    const [text, setText] = React.useState('Click me');

    return (
      <div className="App">
        <button
          onClick={() => setText(state => state + '.')}
          data-testid="button"
        >
          {text}
        </button>
        <hr/>
        <Foo error={new Error('message')}/>
      </div>
    );
  });

  const { getByTestId } = rtl.render(
    <App/>
  );

  const button = getByTestId('button');
  rtl.fireEvent.click(button);

  expect(updateInfos[1].reason.propsDifferences[0]).toEqual(
    expect.objectContaining({ diffType: 'deepEquals', 'pathString': 'error' }),
  );
});
