/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from '../index'
import {diffTypes} from '../consts'

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

  test('forward ref', () => {
    const content = 'My component!!!'

    const MyComponent = React.forwardRef((props, ref) => {
      return <div ref={ref}>{content}</div>
    })

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

  test('forward ref a memo component', () => {
    /* turns out this is not supported by react at this point. */

    //   const content = 'My component!!!'
    //
    //   const MyComponent = React.forwardRef(React.memo((props, ref) => {
    //     return <div ref={ref}>{content}</div>
    //   }, () => true))
    //
    //   MyComponent.whyDidYouRender = true
    //
    //   let componentContentFromRef = null
    //   let timesRefWasCalled = 0
    //
    //   const handleRef = ref => {
    //     if(!ref){
    //       return
    //     }
    //     timesRefWasCalled++
    //     componentContentFromRef = ref.innerHTML
    //   }
    //
    //   const {rerender} = rtl.render(
    //     <MyComponent a={[]} ref={handleRef}/>
    //   )
    //
    //   rerender(
    //     <MyComponent a={[]} ref={handleRef}/>
    //   )
    //
    //   expect(componentContentFromRef).toBe(content)
    //   expect(timesRefWasCalled).toBe(1)
    //
    //   expect(updateInfos).toHaveLength(1)
    //   expect(updateInfos[0].reason).toEqual({
    //     propsDifferences: [
    //       {
    //         pathString: 'a',
    //         diffType: diffTypes.deepEquals,
    //         prevValue: [],
    //         nextValue: []
    //       }
    //     ],
    //     stateDifferences: false,
    //     hookDifferences: false
    //   })
  })
})
