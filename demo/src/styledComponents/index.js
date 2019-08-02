import React from 'react'
import ReactDom from 'react-dom'
import styled from 'styled-components'

export default {
  description: 'styled-components',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const SimpleComponent = () => {
      return (
        <div>
          styled-components
        </div>
      )
    }

    const StyledSimpleComponent = styled(SimpleComponent)`
      background-color: #ddd;
    `

    StyledSimpleComponent.whyDidYouRender = true

    const Main = () => (
      <StyledSimpleComponent/>
    )

    ReactDom.render(<Main/>, domElement)
  }
}
