import createStepLogger from '../createStepLogger'

export default {
  name: 'Props Changes',
  fn({React, render, domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    whyDidYouRender(React)

    const ClassDemo = () => (
      <div>Props Changes</div>
    )

    ClassDemo.whyDidYouRender = true

    stepLogger('First render')
    render(<ClassDemo a={1} />, domElement)

    stepLogger('Same props', true)
    render(<ClassDemo a={1} />, domElement)

    stepLogger('Other props')
    render(<ClassDemo a={{b: 'b'}} />, domElement)

    stepLogger('Different by ref, equals by value', true)
    render(<ClassDemo a={{b: 'b'}} />, domElement)

    stepLogger('Other nested props')
    render(<ClassDemo a={{b: {c: {d: 'd'}}}} />, domElement)

    stepLogger('Deep equal nested props', true)
    render(<ClassDemo a={{b: {c: {d: 'd'}}}} />, domElement)
  }
}
