import React from 'react'

import defaultNotifier from './defaultNotifier'
import getUpdateInfo from './getUpdateInfo'
import normalizeOptions from './normalizeOptions'

class TestComponent extends React.Component{
  static whyDidYouRender = true
  render(){
    return <div>hi!</div>
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
        changedObjectValues: 3
      },
      groupLogsCount: {
        title: 1,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 1
      },
      groupCollapsedLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0
      }
    }
  },
  onlyLogs: {
    description: 'Only logs',
    userOptions: {onlyLogs: true},
    expects: {
      logsCount: {
        title: 1,
        emptyValues: 1,
        changedObjects: 2,
        changedObjectValues: 4
      },
      groupLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0
      },
      groupCollapsedLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0
      }
    }
  },
  collapseGroups: {
    description: 'Group by component with collapse',
    userOptions: {collapseGroups: true},
    expects: {
      logsCount: {
        title: 0,
        emptyValues: 1,
        changedObjects: 2,
        changedObjectValues: 3
      },
      groupLogsCount: {
        title: 0,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 0
      },
      groupCollapsedLogsCount: {
        title: 1,
        emptyValues: 0,
        changedObjects: 0,
        changedObjectValues: 1
      }
    }
  }
}

function calculateNumberOfExpectedLogs(expectedLogTypes, expectedCounts){
  return expectedLogTypes.reduce((sum, type) => sum + expectedCounts[type], 0)
}

function expectLogTypes(expectedLogTypes, expects){
  const consoleOutputs = flushConsoleOutput()

  expect(consoleOutputs.filter(o => o.level === 'log'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.logsCount))

  expect(consoleOutputs.filter(o => o.level === 'group'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.groupLogsCount))

  expect(consoleOutputs.filter(o => o.level === 'groupCollapsed'))
    .toHaveLength(calculateNumberOfExpectedLogs(expectedLogTypes, expects.groupCollapsedLogsCount))
}

describe('defaultNotifier', () => {
  describe('For no differences', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: null,
          prevState: null,
          nextProps: null,
          nextState: null,
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'emptyValues'], expects)
      })
    })
  })

  describe('For different props eq by ref', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {a: 'aa'},
          prevState: null,
          nextProps: {a: 'aa'},
          nextState: null,
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjects'], expects)
      })
    })
  })

  describe('For equal state eq by ref', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: null,
          prevState: {a: 'aa'},
          nextProps: null,
          nextState: {a: 'aa'},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjects'], expects)
      })
    })
  })

  describe('For different state and props', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {a: 'aa'},
          prevState: {a: 'aa'},
          nextProps: {a: 'aa'},
          nextState: {a: 'aa'},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjects', 'changedObjects'], expects)
      })
    })
  })

  describe('For different hook', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevHook: {a: 'aa'},
          nextHook: {a: 'aa'},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues'], expects)
      })
    })
  })

  describe('For different deep equal props', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {a: {b: 'b'}},
          prevState: null,
          nextProps: {a: {b: 'b'}},
          nextState: null,
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues'], expects)
      })
    })
  })

  describe('For different deep equal state', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: null,
          prevState: {a: {b: 'b'}},
          nextProps: null,
          nextState: {a: {b: 'b'}},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues'], expects)
      })
    })
  })

  describe('For different deep equal state and props', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {a: {b: 'b'}},
          prevState: {a: {b: 'b'}},
          nextProps: {a: {b: 'b'}},
          nextState: {a: {b: 'b'}},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues', 'changedObjectValues'], expects)
      })
    })
  })

  describe('For different functions by the same name', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {fn: function something(){}},
          prevState: null,
          nextProps: {fn: function something(){}},
          nextState: null,
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues'], expects)
      })
    })
  })

  describe('Mix of changes', () => {
    Object.values(testInputAndExpects).forEach(({description, userOptions, expects}) => {
      test(description, () => {
        const updateInfo = getUpdateInfo({
          Component: TestComponent,
          prevProps: {fn: function something(){}},
          prevState: {a: {b: 'b'}},
          nextProps: {fn: function something(){}},
          nextState: {a: {b: 'b'}},
          options: normalizeOptions(userOptions)
        })

        defaultNotifier(updateInfo)

        expectLogTypes(['title', 'changedObjectValues', 'changedObjectValues'], expects)
      })
    })
  })

  describe('logOnDifferentProps option', () => {
    test('For different props', () => {
      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: {a: 'aaaa'},
        prevState: null,
        nextProps: {a: 'bbbb'},
        nextState: null,
        options: normalizeOptions({
          onlyLogs: true
        })
      })

      defaultNotifier(updateInfo)

      const consoleOutputs = flushConsoleOutput()
      expect(consoleOutputs).toHaveLength(0)
    })

    test('For different state', () => {
      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: null,
        prevState: {a: 'aaaa'},
        nextProps: null,
        nextState: {a: 'bbbb'},
        options: normalizeOptions({
          onlyLogs: true
        })
      })

      defaultNotifier(updateInfo)

      const consoleOutputs = flushConsoleOutput()
      expect(consoleOutputs).toHaveLength(0)
    })

    test('For different props with logOnDifferentValues', () => {
      const updateInfo = getUpdateInfo({
        Component: TestComponent,
        prevProps: {a: 'aaaa'},
        prevState: null,
        nextProps: {a: 'bbbb'},
        nextState: null,
        options: normalizeOptions({
          logOnDifferentValues: true,
          onlyLogs: true
        })
      })

      defaultNotifier(updateInfo)

      const consoleOutputs = flushConsoleOutput()
      expect(consoleOutputs).toHaveLength(
        calculateNumberOfExpectedLogs(
          ['title', 'changedObjectValues'],
          testInputAndExpects.onlyLogs.expects.logsCount
        )
      )
    })

    test('For different props with logOnDifferentValues for a specific component', () => {
      class OwnTestComponent extends React.Component{
        static whyDidYouRender = {logOnDifferentValues: true}
        render(){
          return <div>hi!</div>
        }
      }

      const updateInfo = getUpdateInfo({
        Component: OwnTestComponent,
        prevProps: {a: 'aaaa'},
        prevState: null,
        nextProps: {a: 'bbbb'},
        nextState: null,
        options: normalizeOptions({
          onlyLogs: true
        })
      })

      defaultNotifier(updateInfo)

      const consoleOutputs = flushConsoleOutput()
      expect(consoleOutputs).toHaveLength(
        calculateNumberOfExpectedLogs(
          ['title', 'changedObjectValues'],
          testInputAndExpects.onlyLogs.expects.logsCount
        )
      )
    })
  })
})
