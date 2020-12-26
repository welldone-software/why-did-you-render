import React from 'react';
import * as rtl from '@testing-library/react';
import whyDidYouRender from 'index';
import { diffTypes } from 'consts';

const ReactMemoTestComponent = React.memo(() => (
  <div>hi!</div>
));
ReactMemoTestComponent.whyDidYouRender = true;
ReactMemoTestComponent.dispalyName = 'ReactMemoTestComponent';

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

test('Memoize text component', () => {
  const obj = { a: [] };

  const Svg = React.memo('svg');
  Svg.whyDidYouRender = true;

  const { rerender } = rtl.render(
    <Svg arr={obj}/>
  );
  rerender(
    <Svg arr={obj}/>
  );

  expect(updateInfos).toHaveLength(0);
});

test('Component memoized with React.memo - no change', () => {
  const obj = { a: [] };

  const { rerender } = rtl.render(
    <ReactMemoTestComponent arr={obj}/>
  );
  rerender(
    <ReactMemoTestComponent arr={obj}/>
  );

  expect(updateInfos).toHaveLength(0);
});

test('Component memoized with React.memo - different prop values', () => {
  const { rerender } = rtl.render(
    <ReactMemoTestComponent a={1}/>
  );
  rerender(
    <ReactMemoTestComponent a={2}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.different,
      prevValue: 1,
      nextValue: 2,
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('Component memoized with React.memo - deep equal prop values', () => {
  const { rerender } = rtl.render(
    <ReactMemoTestComponent a={[]}/>
  );
  rerender(
    <ReactMemoTestComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('React.memo Component memoized with another React.memo - deep equal prop values', () => {
  const ReactSecondMemoComponent = React.memo(ReactMemoTestComponent);
  ReactSecondMemoComponent.whyDidYouRender = true;

  const { rerender } = rtl.render(
    <ReactSecondMemoComponent a={[]}/>
  );
  rerender(
    <ReactSecondMemoComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      pathString: 'a',
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('memo a forward ref component', () => {
  const content = 'My component!!!';

  const MyComponent = React.memo(React.forwardRef((props, ref) => {
    return <div ref={ref}>{content}</div>;
  }));

  MyComponent.whyDidYouRender = true;

  let componentContentFromRef = null;
  let timesRefWasCalled = 0;

  const handleRef = ref => {
    if (!ref) {
      return;
    }
    timesRefWasCalled++;
    componentContentFromRef = ref.innerHTML;
  };

  const { rerender } = rtl.render(
    <MyComponent a={[]} ref={handleRef}/>
  );

  rerender(
    <MyComponent a={[]} ref={handleRef}/>
  );

  expect(componentContentFromRef).toBe(content);
  expect(timesRefWasCalled).toBe(1);

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: [],
      },
    ],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('memo a class component', () => {
  class ClassComponent extends React.Component {
    render() {
      return <div>hi!</div>;
    }
  }

  const MyComponent = React.memo(ClassComponent);

  MyComponent.whyDidYouRender = true;

  const { rerender } = rtl.render(
    <MyComponent a={[]}/>
  );

  rerender(
    <MyComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: [],
      },
    ],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
});

test('memo a pure class component', () => {
  class ClassComponent extends React.PureComponent {
    render() {
      return <div>hi!</div>;
    }
  }

  const MyComponent = React.memo(ClassComponent);

  MyComponent.whyDidYouRender = true;

  const { rerender } = rtl.render(
    <MyComponent a={[]}/>
  );

  rerender(
    <MyComponent a={[]}/>
  );

  expect(updateInfos).toHaveLength(1);
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: [],
      },
    ],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false,
  });
  global.flushConsoleOutput();
});
