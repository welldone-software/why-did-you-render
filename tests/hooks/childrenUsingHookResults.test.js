import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from '../../src/consts'

let updateInfos = []

// eslint-disable-next-line no-console
const someFn = () => console.log('hi!')

beforeEach(() => {
  updateInfos = []
  whyDidYouRender(React, {
    notifier: updateInfo => updateInfos.push(updateInfo)
  })
})

afterEach(() => {
  if(React.__REVERT_WHY_DID_YOU_RENDER__){
    React.__REVERT_WHY_DID_YOU_RENDER__()
  }
})

describe('children using hook results', () => {
  test('without dependencies', () => {
    const Child = () => <div>hi!</div>
    Child.whyDidYouRender = true

    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const fnUseCallback = React.useCallback(() => someFn(currentState.c))
      const fnUseMemo = React.useMemo(() => () => someFn(currentState.c))
      const fnRegular = () => someFn(currentState.c)

      return (
        <Child type="button" fnRegular={fnRegular} fnUseMemo={fnUseMemo} fnUseCallback={fnUseCallback}/>
      )
    }

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: false,
      stateDifferences: false,
      propsDifferences: [
        expect.objectContaining({
          pathString: 'fnRegular',
          diffType: 'function'
        }),
        expect.objectContaining({
          pathString: 'fnUseMemo',
          diffType: 'function'
        }),
        expect.objectContaining({
          pathString: 'fnUseCallback',
          diffType: 'function'
        })
      ],
      ownerDifferences: {
        hookDifferences: [
          {
            differences: [
              {
                diffType: 'deepEquals',
                nextValue: {c: 'c'},
                pathString: '',
                prevValue: {c: 'c'}
              }
            ],
            hookName: 'useState'
          }
        ],
        propsDifferences: false,
        stateDifferences: false
      }
    })
  })

  test('with different dependencies', () => {
    const Child = () => <div>hi!</div>
    Child.whyDidYouRender = true

    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'd'})
      }, [])

      const fnUseCallback = React.useCallback(() => someFn(currentState.c), [currentState])
      const fnUseMemo = React.useMemo(() => () => someFn(currentState.c), [currentState])
      const fnRegular = () => someFn(currentState.c)

      return (
        <Child type="button" fnRegular={fnRegular} fnUseMemo={fnUseMemo} fnUseCallback={fnUseCallback}/>
      )
    }

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: false,
      stateDifferences: false,
      propsDifferences: expect.arrayContaining([
        expect.objectContaining({
          pathString: 'fnRegular',
          diffType: diffTypes.function
        }),
        expect.objectContaining({
          pathString: 'fnUseMemo',
          diffType: diffTypes.different
        }),
        expect.objectContaining({
          pathString: 'fnUseCallback',
          diffType: diffTypes.different
        }),
        expect.objectContaining({
          pathString: 'fnUseMemo:parent-hook-useMemo-deps',
          diffType: diffTypes.different
        }),
        expect.objectContaining({
          pathString: 'fnUseCallback:parent-hook-useCallback-deps',
          diffType: diffTypes.different
        })
      ]),
      ownerDifferences: {
        hookDifferences: [
          {
            differences: [
              {
                diffType: diffTypes.different,
                pathString: '.c',
                prevValue: 'c',
                nextValue: 'd'
              },
              {
                diffType: diffTypes.different,
                pathString: '',
                prevValue: {c: 'c'},
                nextValue: {c: 'd'}
              }
            ],
            hookName: 'useState'
          }
        ],
        propsDifferences: false,
        stateDifferences: false
      }
    })
  })

  test('with deep Equals dependencies', () => {
    const Child = () => <div>hi!</div>
    Child.whyDidYouRender = true

    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const fnUseCallback = React.useCallback(() => someFn(currentState.c), [currentState])
      const fnUseMemo = React.useMemo(() => () => someFn(currentState.c), [currentState])
      const fnRegular = () => someFn(currentState.c)

      return (
        <Child type="button" fnRegular={fnRegular} fnUseMemo={fnUseMemo} fnUseCallback={fnUseCallback}/>
      )
    }

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: false,
      stateDifferences: false,
      propsDifferences: expect.arrayContaining([
        expect.objectContaining({
          pathString: 'fnRegular',
          diffType: diffTypes.function
        }),
        expect.objectContaining({
          pathString: 'fnUseMemo',
          diffType: diffTypes.function
        }),
        expect.objectContaining({
          pathString: 'fnUseCallback',
          diffType: diffTypes.function
        }),
        expect.objectContaining({
          pathString: 'fnUseMemo:parent-hook-useMemo-deps',
          diffType: diffTypes.deepEquals
        }),
        expect.objectContaining({
          pathString: 'fnUseCallback:parent-hook-useCallback-deps',
          diffType: diffTypes.deepEquals
        })
      ]),
      ownerDifferences: {
        hookDifferences: [
          {
            differences: [
              {
                diffType: diffTypes.deepEquals,
                pathString: '',
                prevValue: {c: 'c'},
                nextValue: {c: 'c'}
              }
            ],
            hookName: 'useState'
          }
        ],
        propsDifferences: false,
        stateDifferences: false
      }
    })
  })
})
