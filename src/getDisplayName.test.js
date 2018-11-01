import React from 'react'
import getDisplayName from './getDisplayName'

describe('getDisplayName', () => {
  test('For a component', () => {
    class TestComponent extends React.Component{
      render(){
        return <div>hi!</div>
      }
    }
    const displayName = getDisplayName(TestComponent)
    expect(displayName).toBe('TestComponent')
  })

  test('For inline functions', () => {
    const InlineComponent = () => (
      <div>hi!</div>
    )
    InlineComponent.displayName = 'InlineComponentCustomName'
    const displayName = getDisplayName(InlineComponent)
    expect(displayName).toBe('InlineComponentCustomName')
  })

  test('For inline functions with no name', () => {
    const InlineComponent = () => (
      <div>hi!</div>
    )
    const displayName = getDisplayName(InlineComponent)
    expect(displayName).toBe('InlineComponent')
  })
})
