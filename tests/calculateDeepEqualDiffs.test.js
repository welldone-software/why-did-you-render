import React from 'react';

import calculateDeepEqualDiffs from '~/calculateDeepEqualDiffs';
import { diffTypes } from '~/consts';

test('same', () => {
  const prevValue = { a: 'b' };
  const nextValue = prevValue;

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([]);
});

test('not deep equal', () => {
  const prevValue = { a: 'b' };
  const nextValue = { a: 'c' };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '.a',
      prevValue: 'b',
      nextValue: 'c',
      diffType: diffTypes.different,
    },
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('simple deep', () => {
  const prevValue = { a: 'b' };
  const nextValue = { a: 'b' };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('nested object deep equals', () => {
  const prevValue = { a: { b: 'c' } };
  const nextValue = { a: { b: 'c' } };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('nested array deep equals', () => {
  const prevValue = { a: { b: ['c'] } };
  const nextValue = { a: { b: ['c'] } };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('date', () => {
  const now = new Date();
  const now2 = new Date(now);

  const diffs = calculateDeepEqualDiffs(now, now2);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue: now,
      nextValue: now2,
      diffType: diffTypes.date,
    },
  ]);
});

test('nested date', () => {
  const now = new Date();
  const now2 = new Date(now);

  const prevValue = { a: { b: [now] } };
  const nextValue = { a: { b: [now2] } };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('regular expression', () => {
  const regEx = /c/i;
  const regEx2 = /c/i;

  const diffs = calculateDeepEqualDiffs(regEx, regEx2);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue: regEx,
      nextValue: regEx2,
      diffType: diffTypes.regex,
    },
  ]);
});

test('nested regular expression', () => {
  const regEx = /c/i;
  const regEx2 = /c/i;

  const prevValue = { a: { b: [regEx] } };
  const nextValue = { a: { b: [regEx2] } };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('dom elements', () => {
  const element = document.createElement('div');
  const element2 = document.createElement('div');

  const prevValue = { a: element };
  const nextValue = { a: element2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '.a',
      prevValue: prevValue.a,
      nextValue: nextValue.a,
      diffType: diffTypes.different,
    },
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('equal react elements', () => {
  const tooltip = <div>hi!</div>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('simple react elements', () => {
  const tooltip = <div>hi!</div>;
  const tooltip2 = <div>hi!</div>;

  const diffs = calculateDeepEqualDiffs(tooltip, tooltip2);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue: tooltip,
      nextValue: tooltip2,
      diffType: diffTypes.reactElement,
    },
  ]);
});

test('nested react elements', () => {
  const tooltip = <div>hi!</div>;
  const tooltip2 = <div>hi!</div>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('nested different react elements', () => {
  const tooltip = <div>hi!</div>;
  const tooltip2 = <div>hi 2 !</div>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '.a',
      prevValue: tooltip,
      nextValue: tooltip2,
      diffType: diffTypes.different,
    },
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('nested different react elements with several children', () => {
  const prevValue = <div><a>hi</a><a>hi111</a></div>;
  const nextValue = <div><a>hi</a><a>hi222</a></div>;

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('nested different react elements with several children with keys', () => {
  const prevValue = <div><a key="a">hi</a><a key="b">hi111</a></div>;
  const nextValue = <div><a key="a">hi</a><a key="b">hi222</a></div>;

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('react class component instance', () => {
  class MyComponent extends React.Component {
    render() {
      return <div>hi!</div>;
    }
  }

  const tooltip = <MyComponent/>;
  const tooltip2 = <MyComponent/>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('react class pure component instance', () => {
  class MyComponent extends React.PureComponent {
    render() {
      return <div>hi!</div>;
    }
  }

  const tooltip = <MyComponent/>;
  const tooltip2 = <MyComponent/>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('react functional component instance', () => {
  const MyFunctionalComponent = () => (
    <div>hi!</div>
  );

  const tooltip = <MyFunctionalComponent/>;
  const tooltip2 = <MyFunctionalComponent/>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('react memoized functional component instance', () => {
  const MyFunctionalComponent = React.memo(() => (
    <div>hi!</div>
  ));

  const tooltip = <MyFunctionalComponent a={1}/>;
  const tooltip2 = <MyFunctionalComponent a={1}/>;

  const prevValue = { a: tooltip };
  const nextValue = { a: tooltip2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('functions', () => {
  const fn = function something() {};
  const fn2 = function something() {};

  const prevValue = { fn };
  const nextValue = { fn: fn2 };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('inline functions', () => {
  const prevValue = { a: { fn: () => {} } };
  const nextValue = { a: { fn: () => {} } };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('sets', () => {
  const prevValue = {
    a: new Set(['a']),
    b: new Set(['a', 1]),
    c: new Set(['a', 1]),
    d: new Set([{ foo: 'bar' }]),
  };

  const nextValue = {
    a: new Set(['a']),
    b: new Set(['a', 2]),
    c: new Set(['a', 1, 'c']),
    d: new Set([{ foo: 'bar' }]),
  };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
  expect(diffs).toEqual([
    {
      pathString: '.d',
      prevValue: prevValue.d,
      nextValue: nextValue.d,
      diffType: diffTypes.deepEquals,
    },
    {
      pathString: '.c',
      prevValue: prevValue.c,
      nextValue: nextValue.c,
      diffType: diffTypes.different,
    },
    {
      pathString: '.b.values()[1]',
      prevValue: [...prevValue.b.values()][1],
      nextValue: [...nextValue.b.values()][1],
      diffType: diffTypes.different,
    },
    {
      pathString: '.b',
      prevValue: prevValue.b,
      nextValue: nextValue.b,
      diffType: diffTypes.different,
    },
    {
      pathString: '.a',
      prevValue: prevValue.a,
      nextValue: nextValue.a,
      diffType: diffTypes.deepEquals,
    },
    {
      pathString: '',
      prevValue: prevValue,
      nextValue: nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('maps', () => {
  const prevValue = {
    a: new Map([['a', 'b']]),
    b: new Map([['a', 'b'], [1, 2]]),
    c: new Map([['a', 'b'], [1, 2]]),
    d: new Map([[{ foo: 'bar' }, { bar: 'foo' }]]),
    e: new Map([['a', 'b']]),
  };

  const nextValue = {
    a: new Map([['a', 'b']]),
    b: new Map([['a', 'b'], [2, 2]]),
    c: new Map([['a', 'b'], [1, 2], ['c', 3]]),
    d: new Map([[{ foo: 'bar' }, { bar: 'foo' }]]),
    e: new Map([['a', 'e']]),
  };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
  expect(diffs).toEqual([
    {
      pathString: '.e.values()[0]',
      prevValue: [...prevValue.e.values()][0],
      nextValue: [...nextValue.e.values()][0],
      diffType: diffTypes.different,
    },
    {
      pathString: '.e',
      prevValue: prevValue.e,
      nextValue: nextValue.e,
      diffType: diffTypes.different,
    },
    {
      pathString: '.d',
      prevValue: prevValue.d,
      nextValue: nextValue.d,
      diffType: diffTypes.deepEquals,
    },
    {
      pathString: '.c',
      prevValue: prevValue.c,
      nextValue: nextValue.c,
      diffType: diffTypes.different,
    },
    {
      pathString: '.b.keys()[1]',
      prevValue: [...prevValue.b.keys()][1],
      nextValue: [...nextValue.b.keys()][1],
      diffType: diffTypes.different,
    },
    {
      pathString: '.b',
      prevValue: prevValue.b,
      nextValue: nextValue.b,
      diffType: diffTypes.different,
    },
    {
      pathString: '.a',
      prevValue: prevValue.a,
      nextValue: nextValue.a,
      diffType: diffTypes.deepEquals,
    },
    {
      pathString: '',
      prevValue: prevValue,
      nextValue: nextValue,
      diffType: diffTypes.different,
    },
  ]);
});

test('mix', () => {
  const prevValue = { a: { fn: () => {} }, b: [{ tooltip: <div>hi</div> }] };
  const nextValue = { a: { fn: () => {} }, b: [{ tooltip: <div>hi</div> }] };

  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);

  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});
describe('calculateDeepEqualDiffs - Errors', () => {
  test('Equal Native Errors', () => {
    const prevValue = new Error('message');
    const nextValue = new Error('message');
    const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
    expect(diffs).toEqual([
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals,
      },
    ]);
  });

  test('Different Native Errors', () => {
    const prevValue = new Error('message');
    const nextValue = new Error('Second message');
    const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
    expect(diffs).toEqual([
      {
        pathString: '.message',
        prevValue: 'message',
        nextValue: 'Second message',
        diffType: diffTypes.different,
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.different,
      },
    ]);
  });

  test('Equal Custom Errors', () => {
    class CustomError extends Error {
      constructor(message, code) {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
      }
    }

    const prevValue = new CustomError('message', 1001);
    const nextValue = new CustomError('message', 1001);
    const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
    expect(diffs).toEqual([
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.deepEquals,
      },
    ]);
  });

  test('Different Custom Errors', () => {
    class CustomError extends Error {
      constructor(message, code) {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
      }
    }

    const prevValue = new CustomError('message', 1001);
    const nextValue = new CustomError('message', 1002);
    const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
    expect(diffs).toEqual([
      {
        pathString: '.code',
        prevValue: 1001,
        nextValue: 1002,
        diffType: diffTypes.different,
      },
      {
        pathString: '',
        prevValue,
        nextValue,
        diffType: diffTypes.different,
      },
    ]);
  });
});


test('Equal class instances', () => {
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  const prevValue = new Person('Jon Snow');
  const nextValue = new Person('Jon Snow');
  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
  expect(diffs).toEqual([
    {
      pathString: '',
      prevValue,
      nextValue,
      diffType: diffTypes.deepEquals,
    },
  ]);
});

test('Different class instances', () => {
  class Person {
    constructor(name) {
      this.name = name;
    }
  }

  const prevValue = new Person('Jon Snow');
  const nextValue = new Person('Aria Stark');
  const diffs = calculateDeepEqualDiffs(prevValue, nextValue);
  expect(diffs).toEqual([
    {
      pathString: '.name',
      prevValue: 'Jon Snow',
      nextValue: 'Aria Stark',
      diffType: diffTypes.different,
    },
    {
      pathString: '',
      prevValue: {
        name: 'Jon Snow',
      },
      nextValue: {
        name: 'Aria Stark',
      },
      diffType: diffTypes.different,
    },
  ]);
});
