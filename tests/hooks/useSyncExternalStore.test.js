import React from 'react';
import * as rtl from '@testing-library/react';

import whyDidYouRender from '~';
import { diffTypes } from '~/consts';

const describeButSkipWithReact17AndBelow = process.env.USE_REACT_18
  ? describe
  : describe.skip;

describeButSkipWithReact17AndBelow('hooks - useSyncExternalStore', () => {
  let updateInfos = [];

  function createSimpleStore(initialState) {
    let state = initialState;
    const listeners = new Set();

    return {
      getState: () => state,
      setState: (newState) => {
        state = newState;
        listeners.forEach((listener) => listener());
      },
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
  }

  beforeEach(() => {
    updateInfos = [];

    whyDidYouRender(React, {
      notifier: (updateInfo) => updateInfos.push(updateInfo),
    });
  });

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  test('same value', () => {
    const store = createSimpleStore('c');

    const ComponentWithSyncExternalStore = ({ a, b }) => {
      const valueFromStore = React.useSyncExternalStore(
        store.subscribe,
        store.getState
      );

      return (
        <div>
          hi! {a} {b} {valueFromStore}
        </div>
      );
    };
    ComponentWithSyncExternalStore.whyDidYouRender = true;

    const OuterComponent = () => {
      React.useLayoutEffect(() => {
        store.setState('c');
      }, []);

      return (
        <div>
          <ComponentWithSyncExternalStore a={1} b={2} />
        </div>
      );
    };

    rtl.render(<OuterComponent />);

    expect(updateInfos).toHaveLength(0);
  });

  test('deep equals', () => {
    const store = createSimpleStore({ c: 'c' });

    const ComponentWithSyncExternalStore = ({ a, b }) => {
      const valueFromStore = React.useSyncExternalStore(
        store.subscribe,
        store.getState
      );

      return (
        <div>
          hi! {a} {b} {valueFromStore.c}
        </div>
      );
    };
    ComponentWithSyncExternalStore.whyDidYouRender = true;

    const OuterComponent = () => {
      React.useLayoutEffect(() => {
        store.setState({ c: 'c' });
      }, []);

      return (
        <div>
          <ComponentWithSyncExternalStore a={1} b={2} />
        </div>
      );
    };

    rtl.render(<OuterComponent />);

    expect(updateInfos).toHaveLength(1);
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [
        {
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: { c: 'c' },
          prevValue: { c: 'c' },
        },
      ],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false,
    });
  });
});
