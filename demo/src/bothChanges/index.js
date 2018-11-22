import React from 'react'
import ReactDom from 'react-dom'

import createStepLogger from '../createStepLogger'

export default {
  name: 'Props And State Changes',
  fn({domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    whyDidYouRender(React)

    class ClassDemo extends React.Component{
      static whyDidYouRender = true

      state = {
        c: {d: 'd'}
      }

      static getDerivedStateFromProps(){
        return {
          c: {d: 'd'}
        }
      }

      render(){
        return <div>State And Props Changes</div>
      }
    }

    stepLogger('First Render')
    ReactDom.render(<ClassDemo a={{b: 'b'}}/>, domElement)

    stepLogger('Second Render', true)
    ReactDom.render(<ClassDemo a={{b: 'b'}}/>, domElement)
  }
}
