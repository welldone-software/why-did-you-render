import React from 'react';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import { diffTypes, REACT_VERSION } from '~/consts';

const RENDER_AMOUNT = REACT_VERSION >= 18 ? 2 : 1;

describe('hooks - useReducer', () => {
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

  test('same value', () => {
    const initialState = { b: 'b' };

    function reducer() {
      return initialState;
    }

    let numOfRenders = 0;
    const ComponentWithHooks = () => {
      numOfRenders++;
      const [state, dispatch] = React.useReducer(reducer, initialState);

      React.useLayoutEffect(() => {
        dispatch({ type: 'something' });
      }, []);

      return (
        <div>hi! {state.b}</div>
      );
    };

    ComponentWithHooks.whyDidYouRender = true;

    rtl.render(
      <ComponentWithHooks/>
    );

    expect(numOfRenders).toBe(RENDER_AMOUNT);
    expect(updateInfos).toHaveLength(0);
  });

  test('different value', () => {
    const initialState = { b: 'b' };

    function reducer() {
      return { a: 'a' };
    }

    const ComponentWithHooks = ({ a }) => {
      const [state, dispatch] = React.useReducer(reducer, initialState);

      React.useLayoutEffect(() => {
        dispatch({ type: 'something' });
      }, []);

      return (
        <div data-testid="test">hi! {a} {state.b}</div>
      );
    };

    ComponentWithHooks.whyDidYouRender = true;

    rtl.render(
      <ComponentWithHooks a={1}/>
    );

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        pathString: '',
        diffType: diffTypes.different,
        prevValue: { b: 'b' },
        nextValue: { a: 'a' },
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false,
    });
  });

  test('deep equals', () => {
    const initialState = { b: 'b' };

    function reducer() {
      return { b: 'b' };
    }

    const ComponentWithHooks = ({ a }) => {
      const [state, dispatch] = React.useReducer(reducer, initialState);

      React.useLayoutEffect(() => {
        dispatch({ type: 'something' });
      }, []);

      return (
        <div>hi! {a} {state.b}</div>
      );
    };

    ComponentWithHooks.whyDidYouRender = true;

    rtl.render(
      <ComponentWithHooks a={1}/>
    );

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: { b: 'b' },
        prevValue: { b: 'b' },
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false,
    });
  });
});
