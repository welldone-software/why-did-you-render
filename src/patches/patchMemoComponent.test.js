/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from '../index'
import {diffTypes} from '../consts'

const ReactMemoTestComponent = React.memo(() => (
  <div>hi!</div>
))
ReactMemoTestComponent.whyDidYouRender = true
ReactMemoTestComponent.dispalyName = 'ReactMemoTestComponent'

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

test('Component memoized with React.memo', () => {
  const {rerender} = rtl.render(
    <ReactMemoTestComponent a={1}/>
  )
  rerender(
    <ReactMemoTestComponent a={2}/>
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

test('Component memoized with React.memo - no change', () => {
  const {rerender} = rtl.render(
    <ReactMemoTestComponent a={1}/>
  )
  rerender(
    <ReactMemoTestComponent a={1}/>
  )

  expect(updateInfos).toHaveLength(0)
})

test('Strict mode- memoized functional component with no props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <ReactMemoTestComponent {...props}/>
        </div>
      </React.StrictMode>
    )
  }
  const {rerender} = rtl.render(
    <Main a={1}/>
  )

  rerender(
    <Main a={1}/>
  )

  expect(updateInfos).toHaveLength(0)
})

test('Strict mode- memoized functional component with props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <ReactMemoTestComponent {...props}/>
        </div>
      </React.StrictMode>
    )
  }
  const {rerender} = rtl.render(
    <Main a={1} b={[]}/>
  )

  rerender(
    <Main a={1} b={[]}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      diffType: diffTypes.deepEquals,
      prevValue: [],
      nextValue: [],
      pathString: 'b'
    }],
    stateDifferences: false,
    hookDifferences: false
  })
})

test('memo a forward ref component', () => {
  const content = 'My component!!!'

  const MyComponent = React.memo(React.forwardRef((props, ref) => {
    return <div ref={ref}>{content}</div>
  }))

  MyComponent.whyDidYouRender = true

  let componentContentFromRef = null
  let timesRefWasCalled = 0

  const handleRef = ref => {
    if(!ref){
      return
    }
    timesRefWasCalled++
    componentContentFromRef = ref.innerHTML
  }

  const {rerender} = rtl.render(
    <MyComponent a={[]} ref={handleRef}/>
  )

  rerender(
    <MyComponent a={[]} ref={handleRef}/>
  )

  expect(componentContentFromRef).toBe(content)
  expect(timesRefWasCalled).toBe(1)

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: []
      }
    ],
    stateDifferences: false,
    hookDifferences: false
  })
})

test('memo a class component', () => {
  class ClassComponent extends React.Component{
    render(){
      return <div>hi!</div>
    }
  }

  const MyComponent = React.memo(ClassComponent)

  MyComponent.whyDidYouRender = true

  const {rerender} = rtl.render(
    <MyComponent a={[]}/>
  )

  rerender(
    <MyComponent a={[]}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: []
      }
    ],
    stateDifferences: false,
    hookDifferences: false
  })
})

test('memo a pure class component', () => {
  class ClassComponent extends React.PureComponent{
    render(){
      return <div>hi!</div>
    }
  }

  const MyComponent = React.memo(ClassComponent)

  MyComponent.whyDidYouRender = true

  const {rerender} = rtl.render(
    <MyComponent a={[]}/>
  )

  rerender(
    <MyComponent a={[]}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [
      {
        pathString: 'a',
        diffType: diffTypes.deepEquals,
        prevValue: [],
        nextValue: []
      }
    ],
    stateDifferences: false,
    hookDifferences: false
  })
  global.flushConsoleOutput()
})
