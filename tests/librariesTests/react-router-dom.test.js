import React from 'react';
import { createStore } from 'redux';
import {
  BrowserRouter as Router6,
  useLocation as useLocation6,
  Routes as Routes6,
  Route as Route6,
} from 'react-router-dom';
import { BrowserRouter as Router5, withRouter as withRouter5 } from 'react-router-dom-5';
import { connect, Provider } from 'react-redux';
import { cloneDeep } from 'lodash';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import { diffTypes, REACT_VERSION } from '~/consts';

const CONSOLE_OUTPUT = { level: 'log', args: ['location is: /'] };

const REACT_18_DEPRECATION_WARNING = {
  level: 'error',
  args: ['Warning: ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it\'s running React 17. Learn more: https://reactjs.org/link/switch-to-createroot']
};

const CONSOLE_OUTPUTS_SIMPLE = REACT_VERSION >= 18
  ? [
    REACT_18_DEPRECATION_WARNING,
    CONSOLE_OUTPUT,
    REACT_18_DEPRECATION_WARNING,
    CONSOLE_OUTPUT
  ]
  : [CONSOLE_OUTPUT, CONSOLE_OUTPUT];

const CONSOLE_OUTPUTS_REDUX = REACT_VERSION >= 18
  ? [
    REACT_18_DEPRECATION_WARNING,
    CONSOLE_OUTPUT,
    CONSOLE_OUTPUT
  ]
  : [CONSOLE_OUTPUT, CONSOLE_OUTPUT];

let updateInfos = [];
beforeEach(() => {
  updateInfos = [];
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo),
    trackAllPureComponents: true,
  });
});

afterEach(() => {
  React.__REVERT_WHY_DID_YOU_RENDER__();
});

describe('react-router-dom-5', () => {
  test('simple', () => {
    const InnerComp = withRouter5(() => {
      return <div>hi!</div>;
    });

    InnerComp.whyDidYouRender = true;

    const Comp = () => (
      <Router5>
        <InnerComp/>
      </Router5>
    );

    const { rerender } = rtl.render(<Comp/>);

    rerender(<Comp/>);

    expect(updateInfos).toHaveLength(1);
  });

  test('with redux', () => {
    const initialState = { a: { b: 'c' } };

    const rootReducer = (state, action) => {
      if (action.type === 'differentState') {
        return { a: { b: 'd' } };
      }

      if (action.type === 'deepEqlState') {
        return cloneDeep(state);
      }

      return state;
    };

    const store = createStore(rootReducer, initialState);

    const InnerFn = ({ a, setDeepEqlState }) => {
      React.useLayoutEffect(() => {
        setDeepEqlState();
      }, []);

      return <div>hi! {a.b}</div>;
    };

    InnerFn.whyDidYouRender = true;

    const InnerComp = withRouter5(
      connect(
        state => ({ a: state.a }),
        { setDeepEqlState: () => ({ type: 'deepEqlState' }) }
      )(InnerFn)
    );

    const Comp = () => (
      <Provider store={store}>
        <Router5>
          <InnerComp/>
        </Router5>
      </Provider>
    );

    rtl.render(<Comp/>);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [
        expect.objectContaining({ diffType: diffTypes.deepEquals }),
      ],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: false,
      },
    });
  });
});

describe('react-router-dom-6', () => {
  test('simple', () => {
    const InnerComp = () => {
      const location = useLocation6();

      // eslint-disable-next-line no-console
      console.log(`location is: ${location.pathname}`);

      return (
        <div>hi!</div>
      );
    };

    InnerComp.whyDidYouRender = true;

    const Comp = () => (
      <Router6>
        <Routes6>
          <Route6 exact path="/" element={<InnerComp/>}/>
        </Routes6>
      </Router6>
    );

    const { rerender } = rtl.render(<Comp/>);

    rerender(<Comp/>);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toEqual(CONSOLE_OUTPUTS_SIMPLE);

    expect(updateInfos).toHaveLength(3);
  });

  test('with redux', () => {
    const initialState = { a: { b: 'c' } };

    const rootReducer = (state, action) => {
      if (action.type === 'differentState') {
        return { a: { b: 'd' } };
      }

      if (action.type === 'deepEqlState') {
        return cloneDeep(state);
      }

      return state;
    };

    const store = createStore(rootReducer, initialState);

    const InnerFn = ({ a, setDeepEqlState }) => {
      const location = useLocation6();

      // eslint-disable-next-line no-console
      console.log(`location is: ${location.pathname}`);

      React.useLayoutEffect(() => {
        setDeepEqlState();
      }, []);

      return <div>hi! {a.b}</div>;
    };

    InnerFn.whyDidYouRender = true;

    const InnerComp = (
      connect(
        state => ({ a: state.a }),
        { setDeepEqlState: () => ({ type: 'deepEqlState' }) }
      )(InnerFn)
    );

    const Comp = () => (
      <Provider store={store}>
        <Router6>
          <Routes6>
            <Route6 exact path="/" element={<InnerComp/>}/>
          </Routes6>
        </Router6>
      </Provider>
    );

    rtl.render(<Comp/>);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toEqual(CONSOLE_OUTPUTS_REDUX);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [
        expect.objectContaining({ diffType: diffTypes.deepEquals }),
      ],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: false,
      },
    });
  });
});
