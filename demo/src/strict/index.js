import React from 'react'
import ReactDom from 'react-dom'

import createStepLogger from '../createStepLogger'

export default {
  description: 'Strict mode',
  fn({domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    whyDidYouRender(React)

    const ClassDemo = () => (
      <div>Props Changes</div>
    )
    ClassDemo.whyDidYouRender = true

    const Main = props => (
      <React.StrictMode>
        <ClassDemo {...props}/>
      </React.StrictMode>
    )

    stepLogger('First render')
    ReactDom.render(<Main a={1} />, domElement)

    stepLogger('Same props', true)
    ReactDom.render(<Main a={1} />, domElement)

    stepLogger('Other props')
    ReactDom.render(<Main a={{b: 'b'}} />, domElement)

    stepLogger('Different by ref, equals by value', true)
    ReactDom.render(<Main a={{b: 'b'}} />, domElement)

    stepLogger('Other nested props')
    ReactDom.render(<Main a={{b: {c: {d: 'd'}}}} />, domElement)

    stepLogger('Deep equal nested props', true)
    ReactDom.render(<Main a={{b: {c: {d: 'd'}}}} />, domElement)
  }
}
