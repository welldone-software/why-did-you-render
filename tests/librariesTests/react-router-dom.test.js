import React from 'react';
import { createStore } from 'redux';
import { BrowserRouter as Router, withRouter } from 'react-router-dom';
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
    const InnerComp = withRouter(() => {
      return <div>hi!</div>;
    });

    InnerComp.whyDidYouRender = true;

    const Comp = () => (
      <Router>
        <InnerComp/>
      </Router>
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

    const InnerComp = withRouter(
      connect(
        state => ({ a: state.a }),
        { setDeepEqlState: () => ({ type: 'deepEqlState' }) }
      )(InnerFn)
    );

    const Comp = () => (
      <Provider store={store}>
        <Router>
          <InnerComp/>
        </Router>
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
