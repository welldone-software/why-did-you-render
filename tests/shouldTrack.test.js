import React from 'react'

import shouldTrack from 'shouldTrack'
import getDisplayName from 'getDisplayName'

class TrackedTestComponent extends React.Component{
  static whyDidYouRender = true
  render(){
    return <div>hi!</div>
  }
}

class NotTrackedTestComponent extends React.Component{
  render(){
    return <div>hi!</div>
  }
}

class ExcludedTestComponent extends React.Component{
  static whyDidYouRender = false
  render(){
    return <div>hi!</div>
  }
}

class PureComponent extends React.PureComponent{
  render(){
    return <div>hi!</div>
  }
}

const MemoComponent = React.memo(() => (
  <div>hi!</div>
))
MemoComponent.displayName = 'MemoComponent'

test('Do not track not tracked component (default)', () => {
  const isShouldTrack = shouldTrack({React, Component: NotTrackedTestComponent, displayName: getDisplayName(NotTrackedTestComponent), options: {}})
  expect(isShouldTrack).toBe(false)
})

test('Track tracked component', () => {
  const isShouldTrack = shouldTrack({React, Component: TrackedTestComponent, displayName: getDisplayName(TrackedTestComponent), options: {}})
  expect(isShouldTrack).toBe(true)
})

test('Track included not tracked components', () => {
  const isShouldTrack = shouldTrack({React, Component: NotTrackedTestComponent, displayName: getDisplayName(NotTrackedTestComponent), options: {
    include: [/TestComponent/]
  }})
  expect(isShouldTrack).toBe(true)
})

test('Dont track components with whyDidYouRender=false', () => {
  const isShouldTrack = shouldTrack({React, Component: ExcludedTestComponent, displayName: getDisplayName(ExcludedTestComponent), options: {
    include: [/ExcludedTestComponent/]
  }})
  expect(isShouldTrack).toBe(false)
})

test('Do not track not included not tracked components', () => {
  const isShouldTrack = shouldTrack({React, Component: NotTrackedTestComponent, displayName: getDisplayName(NotTrackedTestComponent), options: {
    include: [/0/]
  }})
  expect(isShouldTrack).toBe(false)
})

test('Do not track excluded tracked components', () => {
  const isShouldTrack = shouldTrack({React, Component: TrackedTestComponent, displayName: getDisplayName(NotTrackedTestComponent), options: {
    exclude: [/TrackedTestComponent/]
  }})
  expect(isShouldTrack).toBe(false)
})

test('Pure component', () => {
  const isShouldTrack = shouldTrack({React, Component: PureComponent, displayName: getDisplayName(PureComponent), options: {
    trackAllPureComponents: true
  }})
  expect(isShouldTrack).toBe(true)
})

test('Memo component', () => {
  const isShouldTrack = shouldTrack({React, Component: MemoComponent, displayName: getDisplayName(MemoComponent), options: {
      trackAllPureComponents: true
    }})
  expect(isShouldTrack).toBe(true)
})

test('Pure component excluded', () => {
  const isShouldTrack = shouldTrack({React, Component: PureComponent, displayName: getDisplayName(PureComponent), options: {
    trackAllPureComponents: true,
    exclude: [/PureComponent/]
  }})
  expect(isShouldTrack).toBe(false)
})

test('Memo component excluded', () => {
  const isShouldTrack = shouldTrack({React, Component: MemoComponent, displayName: getDisplayName(MemoComponent), options: {
    trackAllPureComponents: true,
    exclude: [/MemoComponent/]
  }})
  expect(isShouldTrack).toBe(false)
})
