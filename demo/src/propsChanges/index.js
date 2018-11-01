/* eslint-disable no-console */
import React from 'react'
import {render} from 'react-dom'
import whyDidYouRender from '../whyDidYouRender'
import getStepLogger from '../getStepLogger'

export default function propsChanges(domElement){
  const stepLogger = getStepLogger()

  whyDidYouRender(React, {
    collapseGroups: true
  })

  class ClassDemo extends React.Component{
    static whyDidYouRender = true

    render(){
      return <div>Props Changes</div>
    }
  }

  stepLogger('First render')
  render(<ClassDemo a={1} />, domElement)

  stepLogger('Same props', true)
  render(<ClassDemo a={1} />, domElement)

  stepLogger('Other props')
  render(<ClassDemo a={{b: 'b'}} />, domElement)

  stepLogger('Different by ref, equals by value', true)
  render(<ClassDemo a={{b: 'b'}} />, domElement)

  stepLogger('Other props')
  render(<ClassDemo tooltip={<div>hi!</div>} list={[]} />, domElement)

  stepLogger('Re-created react element', true)
  render(<ClassDemo tooltip={<div>hi!</div>} list={[]} />, domElement)

  stepLogger('different props')
  render(<ClassDemo a={1} nestedFn={{fn: function something(){}}} />, domElement)

  stepLogger('Re-created function', true)
  render(<ClassDemo a={1} nestedFn={{fn: function something(){}}} />, domElement)
}
