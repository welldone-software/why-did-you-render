/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import createReactClass from 'create-react-class'
import whyDidYouRender from './index'
import {diffTypes} from './consts'

const FunctionalTestComponent = () => (
  <div>hi!</div>
)
FunctionalTestComponent.whyDidYouRender = true

const ReactMemoTestComponent = React.memo(() => (
  <div>hi!</div>
))
ReactMemoTestComponent.whyDidYouRender = true
ReactMemoTestComponent.dispalyName = 'ReactMemoTestComponent'

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
		jest.spyOn(global.console, 'log').mockImplementation(() => jest.fn())
		jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())
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
      hookDifferences: false
    })
  })

  test('dont swallow errors', () => {
		const BrokenComponent = React.memo(null)
    BrokenComponent.whyDidYouRender = true

		const mountBrokenComponent = () => {
      rtl.render(
        <BrokenComponent/>
      )
    }

    expect(mountBrokenComponent).toThrow('Cannot read property \'propTypes\' of null')
		expect(console.error).toHaveBeenCalled()
		expect(console.log).toHaveBeenCalled()
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
      hookDifferences: false
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
          hookDifferences: false
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
      hookDifferences: false
    })
  })

  test('Inline component', () => {
    const InlineComponent = () => (
      <div>hi!</div>
    )
    InlineComponent.whyDidYouRender = true

    const {rerender} = rtl.render(
      <InlineComponent a={1}/>
    )
    rerender(
      <InlineComponent a={2}/>
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
    })

    expect(updateInfos).toHaveLength(2)
  })

  it('With implemented "componentDidUpdate()" with a snapshot - not tracked', () => {
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

  it('With implemented "componentDidUpdate()" with a snapshot', () => {
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
    })

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: 'a',
        nextValue: {a: 'a'},
        prevValue: {a: 'a'}
      }],
      stateDifferences: false,
      hookDifferences: false
    })

    expect(updateInfos[2].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false
    })
  })

  test('Several functional components', () => {
    const {rerender} = rtl.render(
      <>
        <FunctionalTestComponent/>
        <FunctionalTestComponent a={{a: 'a'}}/>
        <FunctionalTestComponent/>
      </>
    )

    rerender(
      <>
        <FunctionalTestComponent/>
        <FunctionalTestComponent a={{a: 'a'}}/>
        <FunctionalTestComponent/>
      </>
    )

    expect(updateInfos).toHaveLength(3)

    expect(updateInfos[0].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false
    })

    expect(updateInfos[1].reason).toEqual({
      propsDifferences: [{
        diffType: diffTypes.deepEquals,
        pathString: 'a',
        nextValue: {a: 'a'},
        prevValue: {a: 'a'}
      }],
      stateDifferences: false,
      hookDifferences: false
    })

    expect(updateInfos[2].reason).toEqual({
      propsDifferences: [],
      stateDifferences: false,
      hookDifferences: false
    })
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
      hookDifferences: false
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
      hookDifferences: false
    })
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
      hookDifferences: false
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
      hookDifferences: false
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
      hookDifferences: false
    })
  })
})
