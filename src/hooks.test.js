import React from 'react/cjs/react.development'
import TestRenderer from 'react-test-renderer'
import whyDidYouRender from './index'
import {diffTypes} from './consts'

describe('no track hooks setting', () => {
  let updateInfos = []

  beforeEach(() => {
    updateInfos = []
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      trackHooks: {}
    })
  })

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__()
  })

  describe('simple component with hooks', () => {
    test('do no track component', () => {
      React.__REVERT_WHY_DID_YOU_RENDER__()
      whyDidYouRender(React, {
        notifier: updateInfo => updateInfos.push(updateInfo)
      })

      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(0)
    })

    test('track component', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      ComponentWithHooks.whyDidYouRender = true

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(1)
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        stateDifferences: false,
        hookDifferences: false
      })
    })

    test('setState of deep equals values', () => {
      let effectCalled = false

      const ComponentWithHooks = ({a}) => {
        const [currentState, setCurrentState] = React.useState({b: 'b'})

        React.useLayoutEffect(() => {
          effectCalled = true
          setCurrentState({b: 'b'})
        }, [])

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      ComponentWithHooks.whyDidYouRender = true

      TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(0)
      expect(effectCalled).toBeTruthy()
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
    React.__REVERT_WHY_DID_YOU_RENDER__()
  })

  describe('simple component with hooks', () => {
    test('do no track component', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(0)
    })

    test('track component', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      ComponentWithHooks.whyDidYouRender = true

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(1)
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: [{
          pathString: 'a',
          diffType: diffTypes.different,
          prevValue: 1,
          nextValue: 2
        }],
        stateDifferences: false,
        hookDifferences: false
      })
    })
  })

  describe('the useState hook', () => {
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

      TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(0)
      expect(effectCalled).toBeTruthy()
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

      TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(1)
      expect(updateInfos[0].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '0',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
    })
  })

  describe('the useReducer hook', () => {
    test('same value', () => {
      const initialState = {b: 'b'}

      function reducer(){
        return initialState
      }

      let effectCalled = false
      const ComponentWithHooks = ({a}) => {
        const [state, dispatch] = React.useReducer(reducer, initialState)

        React.useLayoutEffect(() => {
          effectCalled = true
          dispatch({type: 'something'})
        }, [])

        return (
          <div>hi! {a} {state.b}</div>
        )
      }

      ComponentWithHooks.whyDidYouRender = true

      TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(0)
      expect(effectCalled).toBeTruthy()
    })

    test('deep equals', () => {
      const initialState = {b: 'b'}

      function reducer(){
        return {b: 'b'}
      }

      let effectCalled = false
      const ComponentWithHooks = ({a}) => {
        const [state, dispatch] = React.useReducer(reducer, initialState)

        React.useLayoutEffect(() => {
          effectCalled = true
          dispatch({type: 'something'})
        }, [])

        return (
          <div>hi! {a} {state.b}</div>
        )
      }

      ComponentWithHooks.whyDidYouRender = true

      TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(1)
      expect(updateInfos[0].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '0',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
      expect(effectCalled).toBeTruthy()
    })
  })
})
