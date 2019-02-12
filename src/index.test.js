/* eslint-disable no-console */
import React from 'react'
import TestRenderer from 'react-test-renderer'
import createReactClass from 'create-react-class'
import whyDidYouRender from './index'
import {diffTypes} from './consts'

const FunctionalTestComponent = () => (
  <div>hi!</div>
)
FunctionalTestComponent.whyDidYouRender = true

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

  test('Empty props and state', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent/>
    )
    testRenderer.update(
      <TestComponent/>
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })
    expect(updateInfos).toHaveLength(1)
  })

  test('Same props', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent a={1}/>
    )
    testRenderer.update(
      <TestComponent a={1}/>
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })
    expect(updateInfos).toHaveLength(1)
  })

  test('Same state', () => {
    const StateTestComponent = createStateTestComponent({a: 1}, {a: 1})
    TestRenderer.create(
      <StateTestComponent/>
    )

    return Promise.resolve()
      .then(() => {
        expect(updateInfos[0].reason).toEqual({
          propsDifferences: false,
          stateDifferences: []
        })
        expect(updateInfos).toHaveLength(1)
      })
  })

  test('Props change', () => {
    const testRenderer = TestRenderer.create(
      <TestComponent a={1}/>
    )
    testRenderer.update(
      <TestComponent a={2}/>
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(1)
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

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(1)
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

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
    expect(innerComponentDidUpdateCalled).toBe(true)
    expect(updateInfos).toHaveLength(1)
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

    expect(updateInfos[0].reason).toEqual({
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

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(2)
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
    expect(updateInfos).toHaveLength(0)
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

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
    expect(updateInfos).toHaveLength(1)
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

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [{
        pathString: 'a',
        diffType: diffTypes.different,
        prevValue: 1,
        nextValue: 2
      }],
      stateDifferences: false
    })
    expect(updateInfos).toHaveLength(1)
    expect(innerComponentDidUpdateCalled).toBe(true)
  })

  test('Element created with "createFactory"', () => {
    const TestComponentElementCreator = React.createFactory(TestComponent)

    const testRenderer = TestRenderer.create(
      TestComponentElementCreator({a: 1})
    )
    testRenderer.update(
      TestComponentElementCreator({a: 1})
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(1)
  })

  test('Element created with "cloneElement"', () => {
    const testElement = <TestComponent a={1}/>
    const testElement2 = React.cloneElement(testElement)

    const testRenderer = TestRenderer.create(testElement)
    testRenderer.update(testElement2)

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(1)
  })

  test('Several class components', () => {
    const testRenderer = TestRenderer.create(
      <>
        <TestComponent/>
        <TestComponent a={{a: 'a'}}/>
        <TestComponent/>
      </>
    )

    testRenderer.update(
      <>
        <TestComponent/>
        <TestComponent a={{a: 'a'}}/>
        <TestComponent/>
      </>
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: 'a',
        nextValue: {a: 'a'},
        prevValue: {a: 'a'}
      }],
      stateDifferences: false
    })

    expect(updateInfos[2].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(3)
  })

  test('Several functional components', () => {
    const testRenderer = TestRenderer.create(
      <>
        <FunctionalTestComponent/>
        <FunctionalTestComponent a={{a: 'a'}}/>
        <FunctionalTestComponent/>
      </>
    )

    testRenderer.update(
      <>
        <FunctionalTestComponent/>
        <FunctionalTestComponent a={{a: 'a'}}/>
        <FunctionalTestComponent/>
      </>
    )

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: 'a',
        nextValue: {a: 'a'},
        prevValue: {a: 'a'}
      }],
      stateDifferences: false
    })

    expect(updateInfos[2].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false
    })

    expect(updateInfos).toHaveLength(3)
  })
})
