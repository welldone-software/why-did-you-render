import React from 'react'
import ReactDom from 'react-dom'

import createStepLogger from '../createStepLogger'

export default {
  description: 'Log Owner Reasons',
  fn({domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    whyDidYouRender(React, {logOwnerReasons: true})

    const Child = () => null
    Child.whyDidYouRender = true

    const Owner = () => <Child />

    class ClassOwner extends React.Component{
      state = {a: 1}
      componentDidMount(){
        this.setState({a: 2})
      }

      render(){
        return <Child />
      }
    }

    function HooksOwner(){
      /* eslint-disable no-unused-vars */
      const [a, setA] = React.useState(1)
      const [b, setB] = React.useState(1)
      /* eslint-enable */
      React.useEffect(() => {
        setA(2)
        setB(2)
      }, [])

      return <Child />
    }

    stepLogger('First render')
    ReactDom.render(<Owner a={1} />, domElement)

    stepLogger('Owner props change', true)
    ReactDom.render(<Owner a={2} />, domElement)

    stepLogger('Owner state change', true)
    ReactDom.render(<ClassOwner />, domElement)

    stepLogger('Owner hooks changes', true)
    ReactDom.render(<HooksOwner />, domElement)
  }
}
