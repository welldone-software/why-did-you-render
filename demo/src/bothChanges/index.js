/* eslint-disable no-console */
import React from 'react'
import {render} from 'react-dom'
import getStepLogger from '../getStepLogger'
import whyDidYouRender from '../whyDidYouRender'

export default function bothChanges(domElement){
  const stepLogger = getStepLogger()

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
  render(<ClassDemo a={{b: 'b'}}/>, domElement)

  stepLogger('Second Render', true)
  render(<ClassDemo a={{b: 'b'}}/>, domElement)
}
