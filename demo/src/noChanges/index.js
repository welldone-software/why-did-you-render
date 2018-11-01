/* eslint-disable no-console */
import React from 'react'
import {render} from 'react-dom'
import whyDidYouRender from '../whyDidYouRender'
import getStepLogger from '../getStepLogger'

export default function noChanges(domElement){
  const stepLogger = getStepLogger()

  whyDidYouRender(React)

  class ClassDemo extends React.Component{
    static whyDidYouRender = true

    componentDidMount(){
      stepLogger('forceUpdate', true)
      this.forceUpdate()
    }
    render(){
      return <div>State And Props The Same</div>
    }
  }

  stepLogger('First Render')
  render(<ClassDemo/>, domElement)
}
