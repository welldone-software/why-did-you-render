import React from 'react';

import defaultNotifier from '~/defaultNotifier';
import getUpdateInfo from '~/getUpdateInfo';
import whyDidYouRender from '~';

class TestComponent extends React.Component {
  static whyDidYouRender = true
  render() {
    return <div>hi!</div>;
  }
}

const testInputAndExpects = {
  default: {
    description: 'Group by component (default options)',
    userOptions: undefined,
    expects: {
      logsCount: {
        title: 0,
        emptyValues: 1,
        changedObjects: 2,
        changedObjectValues: 3,
        changedObjectValuesDeepEquals: 4,
      },
      groupLogsCount: {
        title: 1,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 1,
        changedObjectValuesDeepEquals: 1,
      },
      groupCollapsedLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0,
        changedObjectValuesDeepEquals: 0,
      },
    },
  },
  onlyLogs: {
    description: 'Only logs',
    userOptions: { onlyLogs: true },
    expects: {
      logsCount: {
        title: 1,
        emptyValues: 1,
        changedObjects: 2,
        changedObjectValues: 4,
        changedObjectValuesDeepEquals: 5,
      },
      groupLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0,
        changedObjectValuesDeepEquals: 0,
      },
      groupCollapsedLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0,
        changedObjectValuesDeepEquals: 0,
      },
    },
  },
  collapseGroups: {
    description: 'Group by component with collapse',
    userOptions: { collapseGroups: true },
    expects: {
      logsCount: {
        title: 0,
        emptyValues: 1,
        changedObjects: 2,
        changedObjectValues: 3,
        changedObjectValuesDeepEquals: 4,
      },
      groupLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0,
        changedObjectValuesDeepEquals: 0,
      },
      groupCollapsedLogsCount: {
        title: 1,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 1,
        changedObjectValuesDeepEquals: 1,
      },
    },
  },
};

function calculateNumberOfExpectedLogs(expectedLogTypes, expectedCounts) {
  return expectedLogTypes.reduce((sum, type) => sum + expectedCounts[type], 0);
}

function expectLogTypes(expectedLogTypes, expects) {
  const consoleOutputs = flushConsoleOutput();

  expect(consoleOutputs.filter(o => o.level === 'log'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.logsCount));

  expect(consoleOutputs.filter(o => o.level === 'group'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.groupLogsCount));

  expect(consoleOutputs.filter(o => o.level === 'groupCollapsed'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.groupCollapsedLogsCount));
}

describe('For no differences', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: null,
        prevState: null,
        nextProps: null,
        nextState: null,
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'emptyValues'], expects);
    });
  });
});

describe('For different props eq by ref', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { a: 'aa' },
        prevState: null,
        nextProps: { a: 'aa' },
        nextState: null,
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjects'], expects);
    });
  });
});

describe('For equal state eq by ref', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: null,
        prevState: { a: 'aa' },
        nextProps: null,
        nextState: { a: 'aa' },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjects'], expects);
    });
  });
});

describe('For different state and props', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { a: 'aa' },
        prevState: { a: 'aa' },
        nextProps: { a: 'aa' },
        nextState: { a: 'aa' },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjects', 'changedObjects'], expects);
    });
  });
});

describe('For different hook', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevHook: { a: 'aa' },
        nextHook: { a: 'aa' },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValuesDeepEquals'], expects);
    });
  });
});

describe('For different deep equal props', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { a: { b: 'b' } },
        prevState: null,
        nextProps: { a: { b: 'b' } },
        nextState: null,
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValuesDeepEquals'], expects);
    });
  });
});

describe('For different deep equal state', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: null,
        prevState: { a: { b: 'b' } },
        nextProps: null,
        nextState: { a: { b: 'b' } },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValuesDeepEquals'], expects);
    });
  });
});

describe('For different deep equal state and props', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { a: { b: 'b' } },
        prevState: { a: { b: 'b' } },
        nextProps: { a: { b: 'b' } },
        nextState: { a: { b: 'b' } },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValuesDeepEquals', 'changedObjectValuesDeepEquals'], expects);
    });
  });
});

describe('For different functions by the same name', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { fn: function something() {} },
        prevState: null,
        nextProps: { fn: function something() {} },
        nextState: null,
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValues'], expects);
    });
  });
});

describe('Mix of changes', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  Object.values(testInputAndExpects).forEach(({ description, userOptions, expects }) => {
    test(description, () => {
      whyDidYouRender(React, userOptions);

      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: { fn: function something() {} },
        prevState: { a: { b: 'b' } },
        nextProps: { fn: function something() {} },
        nextState: { a: { b: 'b' } },
      });

      defaultNotifier(updateInfo);

      expectLogTypes(['title', 'changedObjectValues', 'changedObjectValuesDeepEquals'], expects);
    });
  });
});

describe('logOnDifferentProps option', () => {
  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__();
  });

  test('For different props', () => {
    whyDidYouRender(React, { onlyLogs: true });

    const updateInfo = getUpdateInfo({
      Component: TestComponent,
      prevProps: { a: 'aaaa' },
      prevState: null,
      nextProps: { a: 'bbbb' },
      nextState: null,
    });

    defaultNotifier(updateInfo);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toHaveLength(0);
  });

  test('For different state', () => {
    whyDidYouRender(React, { onlyLogs: true });

    const updateInfo = getUpdateInfo({
      Component: TestComponent,
      prevProps: null,
      prevState: { a: 'aaaa' },
      nextProps: null,
      nextState: { a: 'bbbb' },
    });

    defaultNotifier(updateInfo);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toHaveLength(0);
  });

  test('For different props with logOnDifferentValues', () => {
    whyDidYouRender(React, { logOnDifferentValues: true, onlyLogs: true });

    const updateInfo = getUpdateInfo({
      Component: TestComponent,
      prevProps: { a: 'aaaa' },
      prevState: null,
      nextProps: { a: 'bbbb' },
      nextState: null,
    });

    defaultNotifier(updateInfo);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toHaveLength(
      calculateNumberOfExpectedLogs(
        ['title', 'changedObjectValues'],
        testInputAndExpects.onlyLogs.expects.logsCount
      )
    );
  });

  test('For different props with logOnDifferentValues for a specific component', () => {
    whyDidYouRender(React, { onlyLogs: true });

    class OwnTestComponent extends React.Component {
      static whyDidYouRender = { logOnDifferentValues: true }
      render() {
        return <div>hi!</div>;
      }
    }

    const updateInfo = getUpdateInfo({
      Component: OwnTestComponent,
      prevProps: { a: 'aaaa' },
      prevState: null,
      nextProps: { a: 'bbbb' },
      nextState: null,
    });

    defaultNotifier(updateInfo);

    const consoleOutputs = flushConsoleOutput();
    expect(consoleOutputs).toHaveLength(
      calculateNumberOfExpectedLogs(
        ['title', 'changedObjectValues'],
        testInputAndExpects.onlyLogs.expects.logsCount
      )
    );
  });
});
