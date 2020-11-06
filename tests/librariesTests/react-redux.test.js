import React from 'react'
import {createStore} from 'redux'
import * as Redux from 'react-redux'
import {connect, Provider} from 'react-redux'
import cloneDeep from 'lodash.clonedeep'
import * as rtl from '@testing-library/react'
import {diffTypes} from 'consts'

import whyDidYouRender from 'index'

describe('react-redux - simple', () => {
  const initialState = {a: {b: 'c'}}

  const rootReducer = (state, action) => {
    if(action.type === 'differentState'){
      return {a: {b: 'd'}}
    }

    if(action.type === 'deepEqlState'){
      return cloneDeep(state)
    }

    return state
  }

  let store
  let updateInfos

  beforeEach(() => {
    store = createStore(rootReducer, initialState)
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

  test('same state after dispatch', () => {
    const SimpleComponent = ({a}) => (
      <div data-testid="foo">{a.b}</div>
    )
    const ConnectedSimpleComponent = connect(
      state => ({a: state.a})
    )(SimpleComponent)

    SimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'sameState'})
    })

    expect(store.getState().a.b).toBe('c')

    expect(updateInfos).toHaveLength(0)
  })

  test('different state after dispatch', () => {
    const SimpleComponent = ({a}) => (
      <div data-testid="foo">{a.b}</div>
    )
    const ConnectedSimpleComponent = connect(
      state => ({a: state.a})
    )(SimpleComponent)

    SimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'differentState'})
    })

    expect(store.getState().a.b).toBe('d')

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [
        expect.objectContaining({diffType: diffTypes.different}),
        expect.objectContaining({diffType: diffTypes.different})
      ],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        hookDifferences: false,
        propsDifferences: false,
        stateDifferences: false
      }
    })
  })

  test('deep equals state after dispatch', () => {
    const SimpleComponent = ({a}) => (
      <div data-testid="foo">
        {a.b}
      </div>
    )
    const ConnectedSimpleComponent = connect(
      state => ({a: state.a})
    )(SimpleComponent)

    SimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'deepEqlState'})
    })

    expect(store.getState().a.b).toBe('c')

    expect(updateInfos).toHaveLength(1)
    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [
        expect.objectContaining({diffType: diffTypes.deepEquals})
      ],
      stateDifferences: false,
      hookDifferences: false,
      ownerDifferences: {
        hookDifferences: false,
        propsDifferences: false,
        stateDifferences: false
      }
    })
  })
})

describe('react-redux - hooks', () => {
  const initialState = {a: {b: 'c'}}

  const rootReducer = (state, action) => {
    if(action.type === 'differentState'){
      return {a: {b: 'd'}}
    }

    if(action.type === 'deepEqlState'){
      return cloneDeep(state)
    }

    return state
  }

  let store
  let updateInfos

  beforeEach(() => {
    store = createStore(rootReducer, initialState)
    updateInfos = []
    whyDidYouRender(React, {
      notifier: updateInfo => updateInfos.push(updateInfo),
      trackExtraHooks: [
        [Redux, 'useSelector']
      ]
    })
  })

  afterEach(() => {
    if(React.__REVERT_WHY_DID_YOU_RENDER__){
      React.__REVERT_WHY_DID_YOU_RENDER__()
    }
  })

  test('same state after dispatch', () => {
    const ConnectedSimpleComponent = () => {
      const a = Redux.useSelector(state => state)
      return (
        <div data-testid="foo">{a.b}</div>
      )
    }
    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'sameState'})
    })

    expect(store.getState().a.b).toBe('c')

    expect(updateInfos).toHaveLength(0)
  })

  test('different state after dispatch', () => {
    const ConnectedSimpleComponent = () => {
      const a = Redux.useSelector(state => state.a)
      return (
        <div data-testid="foo">{a.b}</div>
      )
    }

    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'differentState'})
    })

    expect(store.getState().a.b).toBe('d')

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[0]).toEqual(expect.objectContaining({
      hookName: 'useReducer' // react-redux inner hook
    }))
    expect(updateInfos[1]).toEqual(expect.objectContaining({
      hookName: 'useSelector',
      reason: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {diffType: diffTypes.different, pathString: '.b', prevValue: 'c', nextValue: 'd'},
          {diffType: diffTypes.different, pathString: '', prevValue: {b: 'c'}, nextValue: {b: 'd'}}
        ],
        ownerDifferences: false
      }
    }))
  })

  test('deep equals state after dispatch', () => {
    const ConnectedSimpleComponent = () => {
      const a = Redux.useSelector(state => state.a)
      return (
        <div data-testid="foo">
          {a.b}
        </div>
      )
    }
    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')

    rtl.act(() => {
      store.dispatch({type: 'deepEqlState'})
    })

    expect(store.getState().a.b).toBe('c')

    expect(updateInfos).toHaveLength(2)
    expect(updateInfos[0]).toEqual(expect.objectContaining({
      hookName: 'useReducer' // react-redux inner hook
    }))
    expect(updateInfos[1]).toEqual(expect.objectContaining({
      hookName: 'useSelector',
      reason: {
        propsDifferences: false,
        stateDifferences: false,
        hookDifferences: [
          {diffType: diffTypes.deepEquals, pathString: '', prevValue: {b: 'c'}, nextValue: {b: 'c'}}
        ],
        ownerDifferences: false
      }
    }))
  })
})
