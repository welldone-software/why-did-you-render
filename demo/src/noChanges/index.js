import createStepLogger from '../createStepLogger'

export default {
  name: 'No Changes',
  fn({React, render, domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

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
}
