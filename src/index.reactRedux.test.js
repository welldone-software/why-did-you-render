/* eslint-disable */

// import React from 'react'
import React from 'react'
import {createStore} from 'redux'
import {connect, Provider} from 'react-redux'
import {cloneDeep} from 'lodash'
import * as rtl from 'react-testing-library'
import 'jest-dom/extend-expect'

import whyDidYouRender from './index'

describe('react-redux', () => {
  const initialState = {a: {b: 'c'}}

  const rootReducer = (state, action) => {
    if(action.type === 'otherObj'){
      return {a: {b: 'd'}}
    }

    if(action.type === 'deepEqlObj'){
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

  test('no connected component', () => {
    store.dispatch({type: 'whatever'})
    expect(store.getState()).toBe(initialState)
    expect(store.getState().a.b).toBe('c')

    store.dispatch({type: 'deepEqlObj'})
    expect(store.getState()).not.toBe(initialState)
    expect(store.getState()).toEqual(initialState)
    expect(store.getState().a.b).toBe('c')

    store.dispatch({type: 'otherObj'})
    expect(store.getState()).not.toBe(initialState)
    expect(store.getState()).not.toEqual(initialState)
    expect(store.getState().a.b).toBe('d')
  })

  test('simple connect', () => {
    const SimpleComponent = ({a}) => (
      <div>{`{a.b.c} is: ${a.b.c}`}</div>
    )

    const ConnectedSimpleComponent = connect(
      state => ({a: state.a})
    )(SimpleComponent)
    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    rtl.render(<Main/>)

    expect(updateInfos).toHaveLength(0)
  })

  test('same state after dispatch', () => {
    const SimpleComponent = ({b}) => (
      <div data-testid="foo">{b}</div>
    )

    const ConnectedSimpleComponent = connect(
      state => ({b: state.a.b})
    )(SimpleComponent)
    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    const tester = rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')
    expect(tester.getByTestId('foo')).toHaveTextContent('c')

    store.dispatch({type: 'sameObj'})

    expect(store.getState().a.b).toBe('c')
    expect(tester.getByTestId('foo')).toHaveTextContent('c')

    expect(updateInfos).toHaveLength(0)
  })

  test.skip('deep equals state after dispatch', () => {
    const SimpleComponent = ({a}) => (
      <div data-testid="foo">{a.b}</div>
    )

    const ConnectedSimpleComponent = connect(
      state => ({a: state.a})
    )(SimpleComponent)
    ConnectedSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <Provider store={store}>
        <ConnectedSimpleComponent/>
      </Provider>
    )

    const tester = rtl.render(<Main/>)

    expect(store.getState().a.b).toBe('c')
    expect(tester.getByTestId('foo')).toHaveTextContent('c')

    store.dispatch({type: 'deepEqlObj'})

    expect(store.getState().a.b).toBe('c')
    expect(tester.getByTestId('foo')).toHaveTextContent('c')

    // TODO: what do we even expect?
    expect(updateInfos).toHaveLength(1)
  })
})
