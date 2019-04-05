import React, {useState, useLayoutEffect} from 'react'
import TestRenderer from 'react-test-renderer'
import whyDidYouRender from './index'
import {diffTypes} from './consts'

describe('do not track hooks', () => {
  let updateInfos = []

  beforeEach(() => {
    updateInfos = []
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      trackHooks: false
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
    if(React.__REVERT_WHY_DID_YOU_RENDER__){
      React.__REVERT_WHY_DID_YOU_RENDER__()
    }
  })

  test('cancel tracking', () => {
    React.__REVERT_WHY_DID_YOU_RENDER__()

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

    test('track memoized component', () => {
      const ComponentWithHooks = React.memo(({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      })

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
          pathString: '',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
    })

    test('deep equals direct import', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState, setCurrentState] = useState({b: 'b'})

        useLayoutEffect(() => {
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
          pathString: '',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
    })

    test('many deep equals direct import', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentStateA, setCurrentStateA] = useState({a: 'a'})
        const [currentStateB, setCurrentStateB] = useState({b: 'b'})
        const [currentStateC, setCurrentStateC] = useState({c: 'c'})
        const [currentStateD, setCurrentStateD] = useState({d: 'd'})
        const [currentStateE, setCurrentStateE] = useState({e: 'e'})

        useLayoutEffect(() => {
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

      TestRenderer.create(
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
        stateDifferences: false
      })
      expect(updateInfos[1].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
      expect(updateInfos[2].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: {c: 'c'},
          prevValue: {c: 'c'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
      expect(updateInfos[3].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: {d: 'd'},
          prevValue: {d: 'd'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
      expect(updateInfos[4].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: {e: 'e'},
          prevValue: {e: 'e'}
        }],
        propsDifferences: false,
        stateDifferences: false
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

      TestRenderer.create(
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
          pathString: '',
          nextValue: {b: 'b'},
          prevValue: {b: 'b'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
      expect(effectCalled).toBeTruthy()
    })
  })

  describe('the useContext hook', () => {
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
        const [currentState, setCurrentState] = useState('c')

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

      TestRenderer.create(
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
        const [currentState, setCurrentState] = useState({c: 'c'})

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

      TestRenderer.create(
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
        stateDifferences: false
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
        const [currentState, setCurrentState] = useState({c: 'c'})

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

      TestRenderer.create(
        <OuterComponent/>
      )

      expect(updateInfos).toHaveLength(2)
      expect(updateInfos[0].reason).toEqual({
        hookDifferences: false,
        propsDifferences: [],
        stateDifferences: false
      })
      expect(updateInfos[1].reason).toEqual({
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          nextValue: {c: 'c'},
          prevValue: {c: 'c'}
        }],
        propsDifferences: false,
        stateDifferences: false
      })
    })
  })

  describe('the useMemo hook', () => {
    test('same value', () => {
      const ComponentWithHooks = ({a}) => {
        const memoState = React.useMemo(() => a)

        return (
          <div>hi! {a} {memoState}</div>
        )
      }
      ComponentWithHooks.whyDidYouRender = true

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(1)
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: [],
        stateDifferences: false,
        hookDifferences: false
      })
    })

    test('deep equals', () => {
      const ComponentWithHooks = ({a}) => {
        const memoState = React.useMemo(() => ({a}))

        return (
          <div>hi! {a} {memoState.a}</div>
        )
      }
      ComponentWithHooks.whyDidYouRender = true

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(2)
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: [],
        stateDifferences: false,
        hookDifferences: false
      })
      expect(updateInfos[1].reason).toEqual({
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [{
          diffType: diffTypes.deepEquals,
          pathString: '',
          prevValue: {a: 1},
          nextValue: {a: 1}
        }]
      })
    })

    test('deep equals nested', () => {
      const ComponentWithHooks = ({a}) => {
        const memoState = React.useMemo(() => ({
          c: {b: {a}}
        }))

        return (
          <div>hi! {a} {memoState.c.b.a}</div>
        )
      }
      ComponentWithHooks.whyDidYouRender = true

      const testRenderer = TestRenderer.create(
        <ComponentWithHooks a={1}/>
      )
      testRenderer.update(
        <ComponentWithHooks a={1}/>
      )

      expect(updateInfos).toHaveLength(2)
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: [],
        stateDifferences: false,
        hookDifferences: false
      })
      expect(updateInfos[1].reason).toEqual({
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {
            diffType: diffTypes.deepEquals,
            pathString: '.c.b',
            prevValue: {a: 1},
            nextValue: {a: 1}
          },
          {
            diffType: diffTypes.deepEquals,
            pathString: '.c',
            prevValue: {b: {a: 1}},
            nextValue: {b: {a: 1}}
          },
          {
            diffType: diffTypes.deepEquals,
            pathString: '',
            prevValue: {c: {b: {a: 1}}},
            nextValue: {c: {b: {a: 1}}}
          }
        ]
      })
    })
  })

})
