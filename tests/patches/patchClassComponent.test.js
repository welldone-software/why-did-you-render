import React from 'react'
import * as rtl from '@testing-library/react'
import createReactClass from 'create-react-class'
import whyDidYouRender from 'index'
import {diffTypes} from 'consts'

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
  const {rerender} = rtl.render(
    <TestComponent/>
  )
  rerender(
    <TestComponent/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Same props', () => {
  const {rerender} = rtl.render(
    <TestComponent a={1}/>
  )
  rerender(
    <TestComponent a={1}/>
  )

  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
  expect(updateInfos).toHaveLength(1)
})

test('Same state', () => {
  const StateTestComponent = createStateTestComponent({a: 1}, {a: 1})
  rtl.render(
    <StateTestComponent/>
  )

  return Promise.resolve()
    .then(() => {
      expect(updateInfos[0].reason).toEqual({
        propsDifferences: false,
        stateDifferences: [],
        hookDifferences: false,
        ownerDifferences: false
      })
      expect(updateInfos).toHaveLength(1)
    })
})

test('Props change', () => {
  const {rerender} = rtl.render(
    <TestComponent a={1}/>
  )
  rerender(
    <TestComponent a={2}/>
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

  const {rerender} = rtl.render(
    <OwnTestComponent a={1}/>
  )
  rerender(
    <OwnTestComponent a={2}/>
  )

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
  expect(innerComponentDidUpdateCalled).toBe(true)
  expect(updateInfos).toHaveLength(1)
})

test('With render as an arrow function', () => {
  class OwnTestComponent extends React.Component{
    static whyDidYouRender = true
    componentDidMount(){
      this.setState({c: 'c'})
    }
    render = () => {
      return <div>hi!</div>
    }
  }

  const {rerender} = rtl.render(
    <OwnTestComponent a={1}/>
  )

  expect(updateInfos[0].reason).toEqual({
    propsDifferences: false,
    stateDifferences: [{
      diffType: diffTypes.different,
      nextValue: 'c',
      pathString: 'c',
      prevValue: undefined
    }],
    hookDifferences: false,
    ownerDifferences: false
  })

  rerender(
    <OwnTestComponent a={2}/>
  )

  expect(updateInfos[1].reason).toEqual({
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

  expect(updateInfos).toHaveLength(2)
})

test('With render as a binded function', () => {
  class OwnTestComponent extends React.Component{
    static whyDidYouRender = true
    constructor(props, context){
      super(props, context)
      this.render = this.render.bind(this)
    }
    componentDidMount(){
      this.setState({c: 'c'})
    }
    render(){
      return <div>hi!</div>
    }
  }

  const {rerender} = rtl.render(
    <OwnTestComponent a={1}/>
  )

  expect(updateInfos[0].reason).toEqual({
    propsDifferences: false,
    stateDifferences: [{
      diffType: diffTypes.different,
      nextValue: 'c',
      pathString: 'c',
      prevValue: undefined
    }],
    hookDifferences: false,
    ownerDifferences: false
  })

  rerender(
    <OwnTestComponent a={2}/>
  )

  expect(updateInfos[1].reason).toEqual({
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

  expect(updateInfos).toHaveLength(2)
})

test('With implemented "componentDidUpdate()" with a snapshot - not tracked', () => {
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

  const {rerender} = rtl.render(
    <OwnTestComponent a={1}/>
  )
  rerender(
    <OwnTestComponent a={1}/>
  )

  expect(resolve).toBe(true)
  expect(updateInfos).toHaveLength(0)
})

test('With implemented "componentDidUpdate()" with a snapshot', () => {
  let resolve = false
  class OwnTestComponent extends React.Component{
    static whyDidYouRender = true
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

  const {rerender} = rtl.render(
    <OwnTestComponent a={1}/>
  )
  rerender(
    <OwnTestComponent a={1}/>
  )

  expect(resolve).toBe(true)
  expect(updateInfos).toHaveLength(1)
})

test('Component created with "createReactClass"', () => {
  const CreateReactClassComponent = createReactClass({
    displayName: 'Foo',
    render(){
      return <div>hi!</div>
    }
  })

  CreateReactClassComponent.whyDidYouRender = true

  const {rerender} = rtl.render(
    <CreateReactClassComponent a={1}/>
  )
  rerender(
    <CreateReactClassComponent a={2}/>
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

  const {rerender} = rtl.render(
    <CreateReactClassComponent a={1}/>
  )
  rerender(
    <CreateReactClassComponent a={2}/>
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
  expect(innerComponentDidUpdateCalled).toBe(true)
})

test('Element created with "createFactory"', () => {
  const TestComponentElementCreator = React.createFactory(TestComponent)

  const {rerender} = rtl.render(
    TestComponentElementCreator({a: 1})
  )
  rerender(
    TestComponentElementCreator({a: 1})
  )

  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })

  expect(updateInfos).toHaveLength(1)
})

test('Element created with "cloneElement"', () => {
  const testElement = <TestComponent a={1}/>
  const testElement2 = React.cloneElement(testElement)

  const {rerender} = rtl.render(testElement)
  rerender(testElement2)

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Several class components', () => {
  const {rerender} = rtl.render(
    <>
      <TestComponent/>
      <TestComponent a={{a: 'a'}}/>
      <TestComponent/>
    </>
  )

  rerender(
    <>
      <TestComponent/>
      <TestComponent a={{a: 'a'}}/>
      <TestComponent/>
    </>
  )

  expect(updateInfos).toHaveLength(3)

  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })

  expect(updateInfos[1].reason).toEqual({
    propsDifferences: [{
      diffType: diffTypes.deepEquals,
      pathString: 'a',
      nextValue: {a: 'a'},
      prevValue: {a: 'a'}
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })

  expect(updateInfos[2].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})
