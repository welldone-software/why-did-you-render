import React from 'react';
import { legacy_createStore as createStore } from 'redux';
import {
  BrowserRouter as Router6,
  useLocation as useLocation6,
  Routes as Routes6,
  Route as Route6,
} from 'react-router-dom';
import { connect, Provider } from 'react-redux';
import { cloneDeep } from 'lodash';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import { diffTypes } from '~/consts';

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

describe('react-router-dom', () => {
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
          <Route6 exact path="/" element={<InnerComp a={[]}/>}/>
        </Routes6>
      </Router6>
    );

    const { rerender } = rtl.render(<Comp/>);

    rerender(<Comp/>);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toEqual([
      expect.objectContaining({ args: ['location is: /'] }),
      expect.objectContaining({ args: ['location is: /'] }),
    ]);

    expect(updateInfos).toEqual([
      expect.objectContaining({
        reason: {
          hookDifferences: false,
          stateDifferences: false,
          propsDifferences: [{
            diffType: 'deepEquals',
            nextValue: [],
            pathString: 'a',
            prevValue: []
          }],
          ownerDifferences: {
            hookDifferences: false,
            propsDifferences: [],
            stateDifferences: false
          }
        }
      })
    ]);
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
    expect(consoleOutputs).toEqual([
      expect.objectContaining({ args: ['location is: /'] }),
      expect.objectContaining({ args: ['location is: /'] }),
    ]);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: 'a',
        prevValue: { b: 'c' },
        nextValue: { b: 'c' },
      }],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: expect.anything(),
    });
  });
});
