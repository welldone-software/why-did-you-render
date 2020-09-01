/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from 'consts'

describe('hooks - useMemo', () => {
  let updateInfos = []

  beforeEach(() => {
    updateInfos = []
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo)
    })
  })

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__()
  })

  test('same value', () => {
    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const value = React.useMemo(() => currentState.c, [currentState])

      return (
        <div>hi! {value}</div>
      )
    }
    ComponentWithMemoHook.whyDidYouRender = true

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(1)
  })

  test('deep equals', () => {
    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const value = React.useMemo(() => ({c: currentState.c}), [currentState])

      return (
        <div>hi! {value.c}</div>
      )
    }
    ComponentWithMemoHook.whyDidYouRender = true

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[1].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {c: 'c'},
        prevValue: {c: 'c'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('function without dependencies', () => {
    const createLogger = string => () => console.log(string)
    let prevValue
    let nextValue
    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const handleClick = React.useMemo(() => createLogger(currentState.c))
      prevValue = nextValue
      nextValue = handleClick

      return (
        <button type="button" onClick={handleClick}>hi!</button>
      )
    }
    ComponentWithMemoHook.whyDidYouRender = true

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[1].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.function,
        pathString: '',
        nextValue,
        prevValue
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('function with dependencies', () => {
    const createLogger = string => () => console.log(string)
    let prevValue
    let nextValue
    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'd'})
      }, [])

      const handleClick = React.useMemo(() => createLogger(currentState.c), [currentState.c])
      prevValue = nextValue
      nextValue = handleClick

      return (
        <button type="button" onClick={handleClick}>hi!</button>
      )
    }
    ComponentWithMemoHook.whyDidYouRender = true

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[1].reason).toEqual({
      hookDifferences: [
        {
          diffType: diffTypes.different,
          pathString: ':dependencies[0]',
          nextValue: 'd',
          prevValue: 'c'
        },
        {
          diffType: diffTypes.different,
          pathString: ':dependencies',
          nextValue: ['d'],
          prevValue: ['c']
        },
        {
          diffType: diffTypes.different,
          pathString: '',
          nextValue,
          prevValue
        }
      ],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('function with deep equal dependencies', () => {
    const createLogger = string => () => console.log(string)
    let prevValue
    let nextValue
    const ComponentWithMemoHook = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      const handleClick = React.useMemo(() => createLogger(currentState.c), [currentState])
      prevValue = nextValue
      nextValue = handleClick

      return (
        <button type="button" onClick={handleClick}>hi!</button>
      )
    }
    ComponentWithMemoHook.whyDidYouRender = true

    rtl.render(
      <ComponentWithMemoHook/>
    )

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[1].reason).toEqual({
      hookDifferences: [
        {
          diffType: diffTypes.deepEquals,
          pathString: ':dependencies',
          nextValue: [{c: 'c'}],
          prevValue: [{c: 'c'}]
        },
        {
          diffType: diffTypes.function,
          pathString: '',
          nextValue,
          prevValue
        }
      ],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })
})
