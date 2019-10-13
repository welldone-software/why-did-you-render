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

test('Do not track not tracked component (default)', () => {
  const isShouldTrack = shouldTrack(NotTrackedTestComponent, getDisplayName(NotTrackedTestComponent), {})
  expect(isShouldTrack).toBe(false)
})

test('Track tracked component', () => {
  const isShouldTrack = shouldTrack(TrackedTestComponent, getDisplayName(TrackedTestComponent), {})
  expect(isShouldTrack).toBe(true)
})

test('Track included not tracked components', () => {
  const isShouldTrack = shouldTrack(NotTrackedTestComponent, getDisplayName(NotTrackedTestComponent), {
    include: [/TestComponent/]
  })
  expect(isShouldTrack).toBe(true)
})

test('Do not track not included not tracked components', () => {
  const isShouldTrack = shouldTrack(NotTrackedTestComponent, getDisplayName(NotTrackedTestComponent), {
    include: [/0/]
  })
  expect(isShouldTrack).toBe(false)
})

test('Do not track excluded tracked components', () => {
  const isShouldTrack = shouldTrack(TrackedTestComponent, getDisplayName(NotTrackedTestComponent), {
    exclude: [/TrackedTestComponent/]
  })
  expect(isShouldTrack).toBe(false)
})
