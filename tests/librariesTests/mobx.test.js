import React from 'react';

import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
 
import * as rtl from '@testing-library/react';

import whyDidYouRender from 'index';
import { diffTypes } from 'consts';

describe('mobx-react-lite', () => {
  const getInitialState = () => ({ nested: { value: '0' } });
  const getDifferentState1 = () => ({ nested: { value: '1' } });
  const getDifferentState2 = () => ({ nested: { value: '2' } });
  
  class TestStore {
    state = getInitialState();

    constructor() {
      makeAutoObservable(this);
    }

    setSameState() {
      // eslint-disable-next-line no-self-assign
      this.state = this.state;
    }

    setDifferentState1() {
      this.state = getDifferentState1();
    }

    setDifferentState2() {
      this.state = getDifferentState2();
    }

    setDeepEqualsState() {
      this.state = getInitialState();
    }
  }

  let testStore;
  let updateInfos;

  beforeEach(() => {
    testStore = new TestStore;
    updateInfos = [];
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
    });
  });

  afterEach(() => {
    if (React.__REVERT_WHY_DID_YOU_RENDER__) {
      React.__REVERT_WHY_DID_YOU_RENDER__();
    }
  });

  test('change to different state', () => {
    const SimpleComponent = ({ testStore }) => (
      <div>
        hi!
        <span data-testid="foo">{testStore.state.nested.value}</span>
        <button data-testid="set-different-state-1-button" onClick={() => testStore.setDifferentState1()}>
          set different state 1
        </button>
      </div>
    );

    const ObservedSimpleComponent = observer(SimpleComponent);

    ObservedSimpleComponent.whyDidYouRender = true;

    const Main = () => (
      <ObservedSimpleComponent testStore={testStore}/>
    );

    const { getByTestId } = rtl.render(<Main/>);

    expect(testStore.state.nested.value).toBe('0');

    rtl.fireEvent.click(getByTestId('set-different-state-1-button'));

    expect(testStore.state.nested.value).toBe('1');

    testStore.setDifferentState2();

    expect(testStore.state.nested.value).toBe('2');

    expect(updateInfos).toHaveLength(2);

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [
        expect.objectContaining({ diffType: diffTypes.different }),
      ],
      ownerDifferences: false,
    });

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [
        expect.objectContaining({ diffType: diffTypes.different }),
      ],
      ownerDifferences: false,
    });
  });

  test('change to same state', () => {
    const SimpleComponent = ({ testStore }) => (
      <div>
        hi!
        <span data-testid="foo">{testStore.state.nested.value}</span>
        <button data-testid="set-same-state" onClick={() => testStore.setSameState()}>
          set same state
        </button>
      </div>
    );

    const ObservedSimpleComponent = observer(SimpleComponent);

    ObservedSimpleComponent.whyDidYouRender = true;

    const Main = () => (
      <ObservedSimpleComponent testStore={testStore}/>
    );

    const { getByTestId, rerender } = rtl.render(<Main/>);

    expect(testStore.state.nested.value).toBe('0');

    rtl.fireEvent.click(getByTestId('set-same-state'));

    testStore.setSameState();

    rerender();

    expect(updateInfos).toHaveLength(0);
  });

  test('change to deepEquals state', () => {
    const SimpleComponent = ({ testStore }) => (
      <div>
        hi!
        <span data-testid="foo">{testStore.state.nested.value}</span>
        <button data-testid="set-deep-equals-state-button" onClick={() => testStore.setDifferentState1()}>
          set deep equals state
        </button>
      </div>
    );

    const ObservedSimpleComponent = observer(SimpleComponent);

    SimpleComponent.whyDidYouRender = true;

    const Main = () => (
      <ObservedSimpleComponent testStore={testStore}/>
    );

    const { getByTestId } = rtl.render(<Main/>);

    expect(testStore.state.nested.value).toBe('0');

    rtl.fireEvent.click(getByTestId('set-deep-equals-state-button'));

    testStore.setDeepEqualsState();

    expect(updateInfos).toHaveLength(2);

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [
        expect.objectContaining({ diffType: diffTypes.different }),
      ],
      ownerDifferences: false,
    });

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [
        expect.objectContaining({ diffType: diffTypes.deepEquals }),
      ],
      ownerDifferences: false,
    });
  });
});
