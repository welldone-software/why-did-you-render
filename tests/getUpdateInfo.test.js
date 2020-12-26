import React from 'react';

import { diffTypes } from 'consts';
import getUpdateInfo from 'getUpdateInfo';
import getDisplayName from 'getDisplayName';
import whyDidYouRender from '../src';

class TestComponent extends React.Component {
  render() {
    return <div>hi!</div>;
  }
}

describe('getUpdateInfo', () => {
  beforeEach(() => {
    whyDidYouRender(React);
  });

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  test('Empty props and state', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: {},
      prevState: null,
      nextProps: {},
      nextState: null,
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Same props', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: 1 },
      prevState: null,
      nextProps: { a: 1 },
      nextState: null,
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Same state', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: {},
      prevState: { a: 1 },
      nextProps: {},
      nextState: { a: 1 },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: [],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Same props and state', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { b: 1 },
      prevState: { a: 1 },
      nextProps: { b: 1 },
      nextState: { a: 1 },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: [],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props change', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: 1 },
      prevState: null,
      nextProps: { a: 2 },
      nextState: null,
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.different,
            prevValue: input.prevProps.a,
            nextValue: input.nextProps.a,
          },
        ],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('State change', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: {},
      prevState: { a: 1 },
      nextProps: {},
      nextState: { a: 2 },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.different,
            prevValue: input.prevState.a,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props and state change', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { b: 1 },
      prevState: { a: 1 },
      nextProps: { b: 2 },
      nextState: { a: 2 },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'b',
            diffType: diffTypes.different,
            prevValue: input.prevProps.b,
            nextValue: input.nextProps.b,
          },
        ],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.different,
            prevValue: input.prevState.a,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props change by ref', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: { b: 'b' } },
      prevState: null,
      nextProps: { a: { b: 'b' } },
      nextState: null,
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevProps.a,
            nextValue: input.nextProps.a,
          },
        ],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('State changed by ref', () => {


    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: {},
      prevState: { a: { b: 'b' } },
      nextProps: {},
      nextState: { a: { b: 'b' } },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevState.a,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props and state different by ref', () => {


    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { b: { c: 'c' } },
      prevState: { a: { d: 'd' } },
      nextProps: { b: { c: 'c' } },
      nextState: { a: { d: 'd' } },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'b',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevProps.b,
            nextValue: input.nextProps.b,
          },
        ],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevState.a,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props change by function', () => {
  const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: () => {} },
      prevState: null,
      nextProps: { a: () => {} },
      nextState: null,
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.function,
            prevValue: input.prevProps.a,
            nextValue: input.nextProps.a,
          },
        ],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('State changed by function ref', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: {},
      prevState: { a: () => {} },
      nextProps: {},
      nextState: { a: () => {} },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.function,
            prevValue: input.prevState.a,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Props and state different by function', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: () => {} },
      prevState: { b: () => {} },
      nextProps: { a: () => {} },
      nextState: { b: () => {} },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.function,
            prevValue: input.prevProps.a,
            nextValue: input.nextProps.a,
          },
        ],
        stateDifferences: [
          {
            pathString: 'b',
            diffType: diffTypes.function,
            prevValue: input.prevState.b,
            nextValue: input.nextState.b,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('Mix of differences', () => {
    const input = {
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps: { a: () => {}, b: '123', c: { d: 'e' }, f: 3 },
      prevState: null,
      nextProps: { a: () => {}, b: '12345', c: { d: 'e' }, f: 3 },
      nextState: { a: 4 },
    };

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.function,
            prevValue: input.prevProps.a,
            nextValue: input.nextProps.a,
          },
          {
            pathString: 'b',
            diffType: diffTypes.different,
            prevValue: input.prevProps.b,
            nextValue: input.nextProps.b,
          },
          {
            pathString: 'c',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevProps.c,
            nextValue: input.nextProps.c,
          },
        ],
        stateDifferences: [
          {
            pathString: 'a',
            diffType: diffTypes.different,
            prevValue: undefined,
            nextValue: input.nextState.a,
          },
        ],
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });

  test('deep equals and same object', () => {
    const sameProp = { a: { b: 'c' } };

    const prevProps = { className: 'aa', style: { width: '100%' }, sameProp };
    const nextProps = { className: 'aa', style: { width: '100%' }, sameProp };

    const input = getUpdateInfo({
      Component: TestComponent,
      displayName: getDisplayName(TestComponent),
      prevProps,
      prevState: null,
      nextProps,
      nextState: null,
    });

    const updateInfo = getUpdateInfo(input);

    expect(updateInfo).toEqual({
      ...input,
      displayName: 'TestComponent',
      reason: {
        propsDifferences: [
          {
            pathString: 'style',
            diffType: diffTypes.deepEquals,
            prevValue: input.prevProps.style,
            nextValue: input.nextProps.style,
          },
        ],
        stateDifferences: false,
        hookDifferences: false,
        ownerDifferences: false,
      },
    });
  });
});
