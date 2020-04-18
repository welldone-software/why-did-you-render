import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from 'consts'

describe('hooks - useContext', () => {
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
    const MyContext = React.createContext('c')

    const ComponentWithContextHook = ({a, b}) => {
      const valueFromContext = React.useContext(MyContext)

      return (
        <div>hi! {a} {b} {valueFromContext}</div>
      )
    }
    ComponentWithContextHook.whyDidYouRender = true

    const OuterComponent = () => {
      const [currentState, setCurrentState] = React.useState('c')

      React.useLayoutEffect(() => {
        setCurrentState('c')
      }, [])

      return (
        <MyContext.Provider value={currentState}>
          <div>
            <ComponentWithContextHook a={1} b={2}/>
          </div>
        </MyContext.Provider>
      )
    }

    rtl.render(
      <OuterComponent/>
    )

    expect(updateInfos).toHaveLength(0)
  })

  test('deep equals - memoized', () => {
    const MyContext = React.createContext({c: 'c'})

    const ComponentWithContextHook = React.memo(({a, b}) => {
      const valueFromContext = React.useContext(MyContext)

      return (
        <div>hi! {a} {b} {valueFromContext.c}</div>
      )
    })
    ComponentWithContextHook.whyDidYouRender = true

    const OuterComponent = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      return (
        <MyContext.Provider value={currentState}>
          <div>
            <ComponentWithContextHook a={1} b={2}/>
          </div>
        </MyContext.Provider>
      )
    }

    rtl.render(
      <OuterComponent/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
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

  test('deep equals - not memoized', () => {
    const MyContext = React.createContext({c: 'c'})

    const ComponentWithContextHook = ({a, b}) => {
      const valueFromContext = React.useContext(MyContext)

      return (
        <div>hi! {a} {b} {valueFromContext.c}</div>
      )
    }
    ComponentWithContextHook.whyDidYouRender = true

    const OuterComponent = () => {
      const [currentState, setCurrentState] = React.useState({c: 'c'})

      React.useLayoutEffect(() => {
        setCurrentState({c: 'c'})
      }, [])

      return (
        <MyContext.Provider value={currentState}>
          <div>
            <ComponentWithContextHook a={1} b={2}/>
          </div>
        </MyContext.Provider>
      )
    }

    rtl.render(
      <OuterComponent/>
    )

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: false,
      propsDifferences: [],
      stateDifferences: false,
      ownerDifferences: false
    })
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
})
