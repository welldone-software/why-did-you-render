import whyDidYouRender from '../src'
import React from 'react'
import * as rtl from '@testing-library/react'
import {diffTypes} from '../src/consts'

class TestComponent extends React.Component{
  static whyDidYouRender = true
  render(){
    return <div>hi!</div>
  }
}

class PureTestComponent extends React.PureComponent{
  static whyDidYouRender = true
  render(){
    return <div>hi!</div>
  }
}

const FunctionalTestComponent = () => (
  <div>hi!</div>
)
FunctionalTestComponent.whyDidYouRender = true
FunctionalTestComponent.dispalyName = 'FunctionalTestComponent'

const FunctionalTestComponentWithHooks = () => {
  const [state, setState] = React.useState({count: 0})
  React.useLayoutEffect(() => {
    setState({count: 0})
  }, [])
  return (
    <div>hi! {state.count}</div>
  )
}
FunctionalTestComponentWithHooks.whyDidYouRender = true
FunctionalTestComponentWithHooks.dispalyName = 'FunctionalTestComponentWithHooks'

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

test('Strict mode- class component no props change', () => {
  const {rerender} = rtl.render(
    <React.StrictMode>
      <div>
        <TestComponent a={1}/>
      </div>
    </React.StrictMode>
  )

  rerender(
    <React.StrictMode>
      <div>
        <TestComponent a={1}/>
      </div>
    </React.StrictMode>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Strict mode- class component props change', () => {
  const {rerender} = rtl.render(
    <React.StrictMode>
      <div>
        <TestComponent a={[]}/>
      </div>
    </React.StrictMode>
  )

  rerender(
    <React.StrictMode>
      <div>
        <TestComponent a={[]}/>
      </div>
    </React.StrictMode>
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
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Strict mode- pure class component no props change', () => {
  const {rerender} = rtl.render(
    <React.StrictMode>
      <div>
        <PureTestComponent a={1}/>
      </div>
    </React.StrictMode>
  )

  rerender(
    <React.StrictMode>
      <div>
        <PureTestComponent a={1}/>
      </div>
    </React.StrictMode>
  )

  expect(updateInfos).toHaveLength(0)
})

test('Strict mode- pure class component props change', () => {
  const {rerender} = rtl.render(
    <React.StrictMode>
      <div>
        <PureTestComponent a={[]}/>
      </div>
    </React.StrictMode>
  )

  rerender(
    <React.StrictMode>
      <div>
        <PureTestComponent a={[]}/>
      </div>
    </React.StrictMode>
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
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Strict mode- functional component no props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <FunctionalTestComponent {...props}/>
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

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Strict mode- functional component with props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <FunctionalTestComponent {...props}/>
        </div>
      </React.StrictMode>
    )
  }
  const {rerender} = rtl.render(
    <Main a={[]}/>
  )

  rerender(
    <Main a={[]}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: [{
      diffType: diffTypes.deepEquals,
      pathString: 'a',
      prevValue: [],
      nextValue: []
    }],
    stateDifferences: false,
    hookDifferences: false,
    ownerDifferences: false
  })
})

test('Strict mode- functional component with hooks no props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <FunctionalTestComponentWithHooks {...props}/>
        </div>
      </React.StrictMode>
    )
  }

  rtl.render(
    <Main a={1}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: false,
    stateDifferences: false,
    hookDifferences: [
      {
        diffType: diffTypes.deepEquals,
        pathString: '',
        nextValue: {count: 0},
        prevValue: {count: 0}
      }
    ],
    ownerDifferences: false
  })
})

test('Strict mode- functional component with hooks with props change', () => {
  const Main = props => {
    return (
      <React.StrictMode>
        <div>
          <FunctionalTestComponentWithHooks {...props}/>
        </div>
      </React.StrictMode>
    )
  }

  rtl.render(
    <Main a={[]}/>
  )

  expect(updateInfos).toHaveLength(1)
  expect(updateInfos[0].reason).toEqual({
    propsDifferences: false,
    stateDifferences: false,
    hookDifferences: [{
      diffType: diffTypes.deepEquals,
      pathString: '',
      nextValue: {count: 0},
      prevValue: {count: 0}
    }],
    ownerDifferences: false
  })
})
