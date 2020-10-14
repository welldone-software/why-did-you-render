import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from 'consts'

describe('hooks - useState', () => {
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

  test('setState - same value', () => {
    const initialState = {b: 'b'}
    const ComponentWithHooks = () => {
      const [currentState, setCurrentState] = React.useState(initialState)

      React.useLayoutEffect(() => {
        setCurrentState(initialState)
      }, [])

      return (
        <div>hi! {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks/>
    )

    expect(updateInfos).toHaveLength(0)
  })

  test('setState of different values', () => {
    const ComponentWithHooks = () => {
      const [currentState, setCurrentState] = React.useState({b: 'b'})

      React.useLayoutEffect(() => {
        setCurrentState({b: 'c'})
      }, [])

      return (
        <div>hi! {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [
        {
          pathString: '.b',
          diffType: diffTypes.different,
          prevValue: 'b',
          nextValue: 'c'
        },
        {
          pathString: '',
          diffType: diffTypes.different,
          prevValue: {b: 'b'},
          nextValue: {b: 'c'}
        }
      ],
      ownerDifferences: false
    })
  })

  test('setState of deep equals values', () => {
    const ComponentWithHooks = ({a}) => {
      const [currentState, setCurrentState] = React.useState({b: 'b'})

      React.useLayoutEffect(() => {
        setCurrentState({b: 'b'})
      }, [])

      return (
        <div>hi! {a} {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: false,
      stateDifferences: false,
      hookDifferences: [{
        pathString: '',
        diffType: diffTypes.deepEquals,
        prevValue: {b: 'b'},
        nextValue: {b: 'b'}
      }],
      ownerDifferences: false
    })
  })
})

describe('track hooks', () => {
  let updateInfos = []

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

  test('same value', () => {
    const value = {b: 'b'}

    let effectCalled = false

    const ComponentWithHooks = ({a}) => {
      const [currentState, setCurrentState] = React.useState(value)

      React.useLayoutEffect(() => {
        effectCalled = true
        setCurrentState(value)
      }, [])

      return (
        <div>hi! {a} {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(0)
    expect(effectCalled).toBeTruthy()
  })

  test('different (falsy to truthy)', () => {
    const ComponentWithHooks = () => {
      const [currentResult, setCurrentState] = React.useState(false)
      const result = React.useMemo(() => currentResult, [currentResult])

      React.useLayoutEffect(() => {
        setCurrentState(true)
      }, [])

      return (
        <div>hi! {result}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = {
      logOnDifferentValues: true
    }

    rtl.render(
      <ComponentWithHooks/>
    )

    expect(updateInfos).toHaveLength(1)
  })

  test('deep equals', () => {
    const ComponentWithHooks = ({a}) => {
      const [currentState, setCurrentState] = React.useState({b: 'b'})

      React.useLayoutEffect(() => {
        setCurrentState({b: 'b'})
      }, [])

      return (
        <div>hi! {a} {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {b: 'b'},
        prevValue: {b: 'b'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('deep equals direct import', () => {
    const ComponentWithHooks = ({a}) => {
      const [currentState, setCurrentState] = React.useState({b: 'b'})

      React.useLayoutEffect(() => {
        setCurrentState({b: 'b'})
      }, [])

      return (
        <div>hi! {a} {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {b: 'b'},
        prevValue: {b: 'b'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('many deep equals direct import', () => {
    const ComponentWithHooks = ({a}) => {
      const [currentStateA, setCurrentStateA] = React.useState({a: 'a'})
      const [currentStateB, setCurrentStateB] = React.useState({b: 'b'})
      const [currentStateC, setCurrentStateC] = React.useState({c: 'c'})
      const [currentStateD, setCurrentStateD] = React.useState({d: 'd'})
      const [currentStateE, setCurrentStateE] = React.useState({e: 'e'})

      React.useLayoutEffect(() => {
        setCurrentStateA({a: 'a'})
        setCurrentStateB({b: 'b'})
        setCurrentStateC({c: 'c'})
        setCurrentStateD({d: 'd'})
        setCurrentStateE({e: 'e'})
      }, [])

      return (
        <div>hi! {a} {currentStateA.a} {currentStateB.b} {currentStateC.c} {currentStateD.d} {currentStateE.e}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(5)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {a: 'a'},
        prevValue: {a: 'a'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
    expect(updateInfos[1].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {b: 'b'},
        prevValue: {b: 'b'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
    expect(updateInfos[2].reason).toEqual({
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
    expect(updateInfos[3].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {d: 'd'},
        prevValue: {d: 'd'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
    expect(updateInfos[4].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {e: 'e'},
        prevValue: {e: 'e'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })

  test('deep equals functional use', () => {
    const ComponentWithHooks = ({a}) => {
      const [currentState, setCurrentState] = React.useState({b: 'b'})

      React.useLayoutEffect(() => {
        setCurrentState(() => ({b: 'b'}))
      }, [])

      return (
        <div>hi! {a} {currentState.b}</div>
      )
    }

    ComponentWithHooks.whyDidYouRender = true

    rtl.render(
      <ComponentWithHooks a={1}/>
    )

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      hookDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {b: 'b'},
        prevValue: {b: 'b'}
      }],
      propsDifferences: false,
      stateDifferences: false,
      ownerDifferences: false
    })
  })
})
