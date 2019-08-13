import React from 'react'
import * as rtl from '@testing-library/react'
import {checkIfInsideAStrictModeTree} from './utils'

describe('checkIfInsideAStrictModeTree', () => {
  test('class component', () => {
    let isStrictMode
    class TestComponent extends React.Component{
      static whyDidYouRender = true
      render(){
        isStrictMode = checkIfInsideAStrictModeTree(this)
        return <div>hi!</div>
      }
    }

    rtl.render(
      <div>
        <TestComponent/>
      </div>
    )

    expect(isStrictMode).toBe(false)

    rtl.render(
      <React.StrictMode>
        <>
          <div>
            <TestComponent/>
          </div>
          <div>
            hiiiiiiiii
          </div>
        </>
      </React.StrictMode>
    )

    expect(isStrictMode).toBe(true)
  })

  test('pure class component', () => {
    let isStrictMode
    class TestComponent extends React.PureComponent{
      static whyDidYouRender = true
      render(){
        isStrictMode = checkIfInsideAStrictModeTree(this)
        return <div>hi!</div>
      }
    }

    rtl.render(
      <div>
        <TestComponent/>
      </div>
    )

    expect(isStrictMode).toBe(false)

    rtl.render(
      <React.StrictMode>
        <>
          <div>
            <TestComponent/>
          </div>
          <div>
            hiiiiiiiii
          </div>
        </>
      </React.StrictMode>
    )

    expect(isStrictMode).toBe(true)
  })
})
