import createStepLogger from '../createStepLogger'

export default {
  name: 'Props And State Changes',
  fn({React, render, domElement, whyDidYouRender}){
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
    render(<ClassDemo a={{b: 'b'}}/>, domElement)

    stepLogger('Second Render', true)
    render(<ClassDemo a={{b: 'b'}}/>, domElement)
  }
}
