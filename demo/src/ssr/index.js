import React from 'react'
import ReactDom from 'react-dom'
import ReactDomServer from 'react-dom/server'

import createStepLogger from '../createStepLogger'

export default {
  name: 'Server Side (hydrate)',
  fn({domElement, whyDidYouRender}){
    const stepLogger = createStepLogger()

    const HydratedComponent = ({text}) => (
      <div>{text}</div>
    )

    HydratedComponent.whyDidYouRender = true

    domElement.innerHTML = ReactDomServer.renderToString(<HydratedComponent text="HI :D"/>)

    whyDidYouRender(React)

    stepLogger('hydrate')
    ReactDom.hydrate(<HydratedComponent text="HI :D"/>, domElement)

    stepLogger('render with same props', true)
    ReactDom.render(<HydratedComponent text="HI :D"/>, domElement)
  }
}
