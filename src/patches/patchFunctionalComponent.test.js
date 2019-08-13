/* eslint-disable no-console */
import React from 'react'
import * as rtl from '@testing-library/react'
import whyDidYouRender from '../index'
import {diffTypes} from '../consts'

const FunctionalTestComponent = () => (
  <div>hi!</div>
)
FunctionalTestComponent.whyDidYouRender = true

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

test('simple inline component', () => {
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
