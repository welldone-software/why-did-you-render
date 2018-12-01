import React from 'react'
import ReactHotLoader from 'react-hot-loader'

let Menu = ({children}) => (
  <div>
    <h1>whyDidYouRender Demos</h1>
    <h3>
      <span style={{backgroundColor: '#dad'}}>&nbsp;Open the console&nbsp;</span>
      &nbsp;and click on one of the demos
    </h3>
    <ul>
      {children}
    </ul>
  </div>
)

Menu = ReactHotLoader.hot(module)(Menu)

export default Menu
