import React from 'react'
import ReactDom from 'react-dom'

export default {
  description: 'Child of Pure Component',
  fn({domElement, whyDidYouRender}){
    whyDidYouRender(React)

    const SomeChild = () => (
      <div>Child!</div>
    )

    class PureFather extends React.PureComponent{
      static whyDidYouRender = true
      render(){
        return (
          <div>
            {this.props.children}
          </div>
        )
      }
    }

    class Main extends React.Component{
      state = {clicksCount: 0}
      render(){
        return (
          <div>
            <button onClick={() => this.setState({clicksCount: this.state.clicksCount + 1})}>
              clicks: {this.state.clicksCount}
            </button>
            <PureFather>
              <SomeChild/>
            </PureFather>
          </div>
        )
      }
    }

    ReactDom.render(<Main/>, domElement)
  }
}
