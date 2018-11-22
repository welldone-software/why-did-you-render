import React from 'react'
import ReactDom from 'react-dom'

import createStepLogger from '../createStepLogger'

export default {
  name: 'Props Changes',
  fn({domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    whyDidYouRender(React)

    const ClassDemo = () => (
      <div>Props Changes</div>
    )

    ClassDemo.whyDidYouRender = true

    stepLogger('First render')
    ReactDom.render(<ClassDemo a={1} />, domElement)

    stepLogger('Same props', true)
    ReactDom.render(<ClassDemo a={1} />, domElement)

    stepLogger('Other props')
    ReactDom.render(<ClassDemo a={{b: 'b'}} />, domElement)

    stepLogger('Different by ref, equals by value', true)
    ReactDom.render(<ClassDemo a={{b: 'b'}} />, domElement)

    stepLogger('Other nested props')
    ReactDom.render(<ClassDemo a={{b: {c: {d: 'd'}}}} />, domElement)

    stepLogger('Deep equal nested props', true)
    ReactDom.render(<ClassDemo a={{b: {c: {d: 'd'}}}} />, domElement)
  }
}
