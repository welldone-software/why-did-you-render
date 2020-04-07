import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'
import {diffTypes} from '../../src/consts'

describe('hooks - simple', () => {
  describe('hooks - track', () => {
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

    test('no whyDidYouRender=true', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      const {rerender} = rtl.render(
        <ComponentWithHooks a={1}/>
      )
      rerender(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(0)
    })

    test('simple hooks tracking', () => {
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
    })

    test('after removing WDYR', () => {
      React.__REVERT_WHY_DID_YOU_RENDER__()

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

      const {rerender} = rtl.render(
        <ComponentWithHooks a={1}/>
      )
      rerender(
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
        hookDifferences: false,
        ownerDifferences: false
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

      const {rerender} = rtl.render(
        <ComponentWithHooks a={1}/>
      )
      rerender(
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
        hookDifferences: false,
        ownerDifferences: false
      })
    })
  })

  describe('hooks - do not track', () => {
    let updateInfos = []

    beforeEach(() => {
      updateInfos = []
      whyDidYouRender(React, {
        notifier: updateInfo => updateInfos.push(updateInfo),
        trackHooks: false
      })
    })

    afterEach(() => {
      if(React.__REVERT_WHY_DID_YOU_RENDER__){
        React.__REVERT_WHY_DID_YOU_RENDER__()
      }
    })

    test('no whyDidYouRender=true', () => {
      const ComponentWithHooks = ({a}) => {
        const [currentState] = React.useState({b: 'b'})

        return (
          <div>hi! {a} {currentState.b}</div>
        )
      }

      const {rerender} = rtl.render(
        <ComponentWithHooks a={1}/>
      )
      rerender(
        <ComponentWithHooks a={2}/>
      )

      expect(updateInfos).toHaveLength(0)
    })

    test('with whyDidYouRender=true', () => {
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

      expect(updateInfos).toHaveLength(0)
    })

    test('after removing WDYR', () => {
      React.__REVERT_WHY_DID_YOU_RENDER__()

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

      expect(updateInfos).toHaveLength(0)
    })
  })
})
