/* eslint-disable no-console */
import React from 'react'
import {render} from 'react-dom'
import whyDidYouRender from '../whyDidYouRender'
import getStepLogger from '../getStepLogger'

export default function stateChanges(domElement){
  const stepLogger = getStepLogger()

  whyDidYouRender(React)

  class ClassDemo extends React.PureComponent{
    static whyDidYouRender = true

    state = {
      stateKey: 'stateValue'
    }

    componentDidMount(){
      stepLogger('Set an existing state key with the same value', true)
      this.setState({stateKey: 'stateValue'}, () => {

        stepLogger('Add object entry')
        this.setState({objectKey: {a: 'a'}}, () => {

          stepLogger('Add a new object entry that equals by value', true)
          this.setState({objectKey: {a: 'a'}})
        })
      })
    }
    render(){
      return <div>State Changes</div>
    }
  }

  stepLogger('First Render')
  render(<ClassDemo a={1}/>, domElement)
}
