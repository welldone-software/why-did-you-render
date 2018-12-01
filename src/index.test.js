/* eslint-disable no-console */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import createReactClass from 'create-react-class'
import whyDidYouRender from './index'
import {diffTypes} from './consts'

class TestComponent extends React.Component{
  static whyDidYouRender = true
  render(){
    return <div>hi!</div>
  }
}

const createStateTestComponent = (initialState, newState) => {
  return class StateTestComponent extends React.Component{
    static whyDidYouRender = true
    state = initialState
    componentDidMount(){
      this.setState(newState)
    }
    render(){
      return <div>hi!</div>
    }
  }
}

describe('index', () => {
  let updateInfo
  beforeEach(() => {
    updateInfo = null
    whyDidYouRender(React, {
      notifier: _updateInfo => updateInfo = _updateInfo
    })
  })

  afterEach(() => {
    React.__REVERT_WHY_DID_YOU_RENDER__()
  })

  test('Empty props and state', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent/>
    )
    testRenderer.update(
      <TestComponent/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })
  })

  test('Same props', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent a={1}/>
    )
    testRenderer.update(
      <TestComponent a={1}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })
  })

  test('Same state', () => {
    const StateTestComponent = createStateTestComponent({a: 1}, {a: 1})
    TestRenderer.create(
      <StateTestComponent/>
    )

    return Promise.resolve()
      .then(() => {
        expect(updateInfo.reason).toEqual({
          propsDifferences: false,
          stateDifferences: []
        })
      })
  })

  test('Props change', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent a={1}/>
    )
    testRenderer.update(
      <TestComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
  })

  test('Inline component', () => {
    const InlineComponent = () => (
      <div>hi!</div>
    )
    InlineComponent.whyDidYouRender = true

    const testRenderer = TestRenderer.create(
      <InlineComponent a={1}/>
    )
    testRenderer.update(
      <InlineComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
  })

  test('With implemented "componentDidUpdate()"', () => {
    let innerComponentDidUpdateCalled = false
    class OwnTestComponent extends React.Component{
      static whyDidYouRender = true
      componentDidUpdate(){
        innerComponentDidUpdateCalled = true
      }
      render(){
        return <div>hi!</div>
      }
    }

    const testRenderer = TestRenderer.create(
      <OwnTestComponent a={1}/>
    )
    testRenderer.update(
      <OwnTestComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
    expect(innerComponentDidUpdateCalled).toBe(true)
  })

  test('With render as a binded function', () => {
    class OwnTestComponent extends React.Component{
      static whyDidYouRender = true
      componentDidMount(){
        this.setState({c: 'c'})
      }
      render = () => {
        return <div>hi!</div>
      }
    }

    const testRenderer = TestRenderer.create(
      <OwnTestComponent a={1}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: false,
      stateDifferences: [{
        diffType: diffTypes.different,
        nextValue: 'c',
        pathString: 'c',
        prevValue: undefined
      }]
    })

    testRenderer.update(
      <OwnTestComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
  })

  it('With implemented "componentDidUpdate()" with a snapshot', () => {
    let resolve = false
    class OwnTestComponent extends React.Component{
      getSnapshotBeforeUpdate(){
        return true
      }
      componentDidUpdate(prevProps, prevState, snapshot){
        resolve = snapshot
      }
      render(){
        return <div>hi!</div>
      }
    }

    const testRenderer = TestRenderer.create(
      <OwnTestComponent a={1}/>
    )
    testRenderer.update(
      <OwnTestComponent a={1}/>
    )

    expect(resolve).toBe(true)
  })

  test('Component created with "createReactClass"', () => {
    const CreateReactClassComponent = createReactClass({
      displayName: 'Foo',
      render(){
        return <div>hi!</div>
      }
    })

    CreateReactClassComponent.whyDidYouRender = true

    const testRenderer = TestRenderer.create(
      <CreateReactClassComponent a={1}/>
    )
    testRenderer.update(
      <CreateReactClassComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
  })

  test('Component created with "createReactClass" with implemented "componentDidUpdate()"', () => {
    let innerComponentDidUpdateCalled = false
    const CreateReactClassComponent = createReactClass({
      displayName: 'Foo',
      componentDidUpdate(){
        innerComponentDidUpdateCalled = true
      },
      render(){
        return <div>hi!</div>
      }
    })

    CreateReactClassComponent.whyDidYouRender = true

    const testRenderer = TestRenderer.create(
      <CreateReactClassComponent a={1}/>
    )
    testRenderer.update(
      <CreateReactClassComponent a={2}/>
    )

    expect(updateInfo.reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
    expect(innerComponentDidUpdateCalled).toBe(true)
  })
})
