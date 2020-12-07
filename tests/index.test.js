import React from 'react'
import ReactDOMServer from 'react-dom/server'
import * as rtl from '@testing-library/react'
import whyDidYouRender from 'index'

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

test('dont swallow errors', () => {
  const BrokenComponent = React.memo(null)
  BrokenComponent.whyDidYouRender = true

  const mountBrokenComponent = () => {
    rtl.render(
      <BrokenComponent/>
    )
  }

  expect(mountBrokenComponent).toThrow('Cannot read property \'propTypes\' of null')

  expect(global.flushConsoleOutput()).toEqual([
    {
      // console.error('Warning: memo: The first argument must be a component. Instead received: %s', 'null')
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('Warning: memo: The first argument must be a component')
      ])
    },
    {
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('propTypes')
      ])
    },
    {
      level: 'error',
      args: expect.arrayContaining([
        expect.stringContaining('Consider adding an error boundary')
      ])
    }
  ])
})

test('render to static markup', () => {
  class MyComponent extends React.Component{
    static whyDidYouRender = true
    render(){
      return (
        <div>
          hi!
        </div>
      )
    }
  }
  const string = ReactDOMServer.renderToStaticMarkup(<MyComponent/>)
  expect(string).toBe('<div>hi!</div>')
})

describe('React.children', () => {
  test('count', () => {
    let countOfChildren = null

    const ExampleChildComponent = () => <div>hi :D</div>
    ExampleChildComponent.whyDidYouRender = true

    const ExampleComponent = ({children}) => {
      countOfChildren = React.Children.count(children)
      return (
        <div>
          {children}
        </div>
      )
    }

    ExampleComponent.whyDidYouRender = true

    rtl.render(
      <ExampleComponent>
        <ExampleChildComponent>child_1</ExampleChildComponent>
        <ExampleChildComponent>child_2</ExampleChildComponent>
        <ExampleChildComponent>child_3</ExampleChildComponent>
      </ExampleComponent>
    )

    expect(countOfChildren).toBe(3)
  })

  test('children types', () => {
    let childrenTypes = null
    const ExampleChildComponent = () => <div>hi :D</div>

    ExampleChildComponent.whyDidYouRender = true

    const ExampleComponent = ({children}) => {
      childrenTypes = React.Children.map(children, child => {
        return child.type
      })
      return (
        <div>
          {children}
        </div>
      )
    }

    ExampleComponent.whyDidYouRender = true

    rtl.render(
      <ExampleComponent>
        <ExampleChildComponent>child_1</ExampleChildComponent>
        <ExampleChildComponent>child_2</ExampleChildComponent>
        <ExampleChildComponent>child_3</ExampleChildComponent>
      </ExampleComponent>
    )

    expect(childrenTypes).toEqual([
      ExampleChildComponent,
      ExampleChildComponent,
      ExampleChildComponent
    ])
  })
})
